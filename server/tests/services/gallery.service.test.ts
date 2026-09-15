import { galleryService } from "../../src/services/gallery.service";
import * as repository from "../../src/repositories/gallery.repository";
import * as fileUtils from "../../src/utils/file.utils";

jest.mock("../../src/repositories/gallery.repository");
jest.mock("../../src/utils/file.utils");

const mockedRepository = repository as jest.Mocked<typeof repository>;
const mockedFileUtils = fileUtils as jest.Mocked<typeof fileUtils>;

describe("Gallery Service", () => {
  const galleryItem = {
    id: 1,
    title: "Mountain",
    description: "A beautiful mountain",
    image_url: "/uploads/mountain.jpg",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const file = {
    filename: "mountain.jpg",
    path: "/uploads/mountain.jpg",
  } as Express.Multer.File;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedFileUtils.toPublicImagePath.mockImplementation(
      (filename) => `/uploads/${filename}`,
    );

    mockedFileUtils.filePathFromImageUrl.mockImplementation(
      (imageUrl) => `/project${imageUrl}`,
    );

    mockedFileUtils.safeDeleteFile.mockResolvedValue(undefined);
  });

  describe("list", () => {
    test("should return all gallery items", async () => {
      mockedRepository.findAll.mockResolvedValue([galleryItem]);

      const result = await galleryService.list();

      expect(result).toEqual([galleryItem]);
      expect(mockedRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("get", () => {
    test("should return a gallery item", async () => {
      mockedRepository.findById.mockResolvedValue(galleryItem);

      const result = await galleryService.get(1);

      expect(result).toEqual(galleryItem);
      expect(mockedRepository.findById).toHaveBeenCalledWith(1);
    });

    test("should throw 404 when the item does not exist", async () => {
      mockedRepository.findById.mockResolvedValue(null);

      await expect(galleryService.get(999)).rejects.toThrow(
        "Gallery item not found",
      );

      expect(mockedRepository.findById).toHaveBeenCalledWith(999);
    });

    test("should throw 400 for an invalid ID", async () => {
      await expect(galleryService.get(0)).rejects.toThrow(
        "Invalid gallery item ID",
      );

      expect(mockedRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    test("should throw 400 when no image is provided", async () => {
      await expect(
        galleryService.create(
          {
            title: "Mountain",
            description: "A beautiful mountain",
          },
          undefined,
        ),
      ).rejects.toThrow("An image is required");

      expect(mockedRepository.create).not.toHaveBeenCalled();
    });

    test("should create a gallery item", async () => {
      mockedRepository.create.mockResolvedValue(galleryItem);

      const result = await galleryService.create(
        {
          title: " Mountain ",
          description: " A beautiful mountain ",
        },
        file,
      );

      expect(result).toEqual(galleryItem);

      expect(mockedRepository.create).toHaveBeenCalledWith({
        title: "Mountain",
        description: "A beautiful mountain",
        image_url: "/uploads/mountain.jpg",
      });
    });

    test("should throw 400 when title is missing", async () => {
      await expect(
        galleryService.create(
          {
            title: "",
            description: "Description",
          },
          file,
        ),
      ).rejects.toThrow("Title is required");

      expect(mockedRepository.create).not.toHaveBeenCalled();
      expect(mockedFileUtils.safeDeleteFile).toHaveBeenCalledWith(file.path);
    });

    test("should throw 400 when title is too long", async () => {
      const longTitle = "a".repeat(256);

      await expect(
        galleryService.create(
          {
            title: longTitle,
            description: "Description",
          },
          file,
        ),
      ).rejects.toThrow(
        "Title must be 255 characters or fewer",
      );

      expect(mockedRepository.create).not.toHaveBeenCalled();
      expect(mockedFileUtils.safeDeleteFile).toHaveBeenCalledWith(file.path);
    });

    test("should throw 400 when description is too long", async () => {
      const longDescription = "a".repeat(5001);

      await expect(
        galleryService.create(
          {
            title: "Mountain",
            description: longDescription,
          },
          file,
        ),
      ).rejects.toThrow(
        "Description must be 5000 characters or fewer",
      );

      expect(mockedRepository.create).not.toHaveBeenCalled();
      expect(mockedFileUtils.safeDeleteFile).toHaveBeenCalledWith(file.path);
    });

    test("should delete the uploaded file when repository creation fails", async () => {
      mockedRepository.create.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        galleryService.create(
          {
            title: "Mountain",
            description: "A beautiful mountain",
          },
          file,
        ),
      ).rejects.toThrow("Database error");

      expect(mockedFileUtils.safeDeleteFile).toHaveBeenCalledWith(file.path);
    });
  });

  describe("update", () => {
    test("should update an item without changing its image", async () => {
      mockedRepository.findById.mockResolvedValue(galleryItem);

      const updatedItem = {
        ...galleryItem,
        title: "Updated Mountain",
      };

      mockedRepository.update.mockResolvedValue(updatedItem);

      const result = await galleryService.update(
        1,
        {
          title: "Updated Mountain",
          description: "Updated description",
        },
        undefined,
      );

      expect(result).toEqual(updatedItem);

      expect(mockedRepository.update).toHaveBeenCalledWith(1, {
        title: "Updated Mountain",
        description: "Updated description",
        image_url: galleryItem.image_url,
      });

      expect(mockedFileUtils.safeDeleteFile).not.toHaveBeenCalled();
    });

    test("should throw 404 when updating a missing item", async () => {
      mockedRepository.findById.mockResolvedValue(null);

      await expect(
        galleryService.update(
          999,
          {
            title: "Updated",
            description: "Updated description",
          },
          undefined,
        ),
      ).rejects.toThrow("Gallery item not found");

      expect(mockedRepository.update).not.toHaveBeenCalled();
    });

    test("should update the image when a new file is provided", async () => {
      mockedRepository.findById.mockResolvedValue(galleryItem);

      const newFile = {
        filename: "new-mountain.jpg",
        path: "/uploads/new-mountain.jpg",
      } as Express.Multer.File;

      const updatedItem = {
        ...galleryItem,
        image_url: "/uploads/new-mountain.jpg",
      };

      mockedRepository.update.mockResolvedValue(updatedItem);

      const result = await galleryService.update(
        1,
        {
          title: "Mountain",
          description: "Updated mountain",
        },
        newFile,
      );

      expect(result).toEqual(updatedItem);

      expect(mockedRepository.update).toHaveBeenCalledWith(1, {
        title: "Mountain",
        description: "Updated mountain",
        image_url: "/uploads/new-mountain.jpg",
      });

      expect(
        mockedFileUtils.filePathFromImageUrl,
      ).toHaveBeenCalledWith(galleryItem.image_url);

      expect(
        mockedFileUtils.safeDeleteFile,
      ).toHaveBeenCalledWith("/project/uploads/mountain.jpg");
    });

    test("should delete the new file when update fails", async () => {
      mockedRepository.findById.mockResolvedValue(galleryItem);

      const newFile = {
        filename: "new-mountain.jpg",
        path: "/uploads/new-mountain.jpg",
      } as Express.Multer.File;

      mockedRepository.update.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        galleryService.update(
          1,
          {
            title: "Mountain",
            description: "Updated",
          },
          newFile,
        ),
      ).rejects.toThrow("Database error");

      expect(mockedFileUtils.safeDeleteFile).toHaveBeenCalledWith(
        newFile.path,
      );
    });
  });

  describe("delete", () => {
    test("should delete a gallery item and its image", async () => {
      mockedRepository.remove.mockResolvedValue(galleryItem);

      const result = await galleryService.delete(1);

      expect(result).toEqual(galleryItem);

      expect(mockedRepository.remove).toHaveBeenCalledWith(1);

      expect(
        mockedFileUtils.filePathFromImageUrl,
      ).toHaveBeenCalledWith(galleryItem.image_url);

      expect(mockedFileUtils.safeDeleteFile).toHaveBeenCalled();
    });

    test("should throw 404 when deleting a missing item", async () => {
      mockedRepository.remove.mockResolvedValue(null);

      await expect(
        galleryService.delete(999),
      ).rejects.toThrow("Gallery item not found");

      expect(mockedFileUtils.safeDeleteFile).not.toHaveBeenCalled();
    });

    test("should throw 400 for an invalid ID", async () => {
      await expect(
        galleryService.delete(0),
      ).rejects.toThrow("Invalid gallery item ID");

      expect(mockedRepository.remove).not.toHaveBeenCalled();
    });
  });
});