import request from "supertest";
import { app } from "../../src/app";
import { galleryService } from "../../src/services/gallery.service";

jest.mock("../../src/services/gallery.service");

const mockedService = galleryService as jest.Mocked<typeof galleryService>;

describe("Gallery API", () => {
  const item = {
    id: 1,
    title: "Mountain",
    description: "A beautiful mountain",
    image_url: "/uploads/mountain.jpg",
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/health", () => {
    test("should return API health status", async () => {
      const response = await request(app)
        .get("/api/health");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          status: "ok",
        },
      });
    });
  });

  describe("GET /api/gallery", () => {
    test("should return all gallery items", async () => {
      mockedService.list.mockResolvedValue([item]);

      const response = await request(app)
        .get("/api/gallery");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: [
          {
            ...item,
            created_at: item.created_at.toISOString(),
            updated_at: item.updated_at.toISOString(),
          },
        ],
      });

      expect(mockedService.list).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/gallery/:id", () => {
    test("should return one gallery item", async () => {
      mockedService.get.mockResolvedValue(item);

      const response = await request(app)
        .get("/api/gallery/1");

      expect(response.status).toBe(200);

      expect(response.body.data.id).toBe(1);
      expect(response.body.data.title).toBe("Mountain");

      expect(mockedService.get).toHaveBeenCalledWith(1);
    });
  });

  describe("POST /api/gallery", () => {
    test("should create a gallery item with an uploaded image", async () => {
      mockedService.create.mockResolvedValue(item);

      const response = await request(app)
        .post("/api/gallery")
        .field("title", "Mountain")
        .field("description", "A beautiful mountain")
        .attach(
          "image",
          Buffer.from("fake image"),
          "mountain.jpg",
        );

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);

      expect(mockedService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /api/gallery/:id", () => {
    test("should update a gallery item", async () => {
      const updatedItem = {
        ...item,
        title: "Updated Mountain",
      };

      mockedService.update.mockResolvedValue(updatedItem);

      const response = await request(app)
        .put("/api/gallery/1")
        .field("title", "Updated Mountain")
        .field("description", "Updated description");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Updated Mountain");

      expect(mockedService.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: "Updated Mountain",
          description: "Updated description",
        }),
        undefined,
      );
    });
  });

  describe("DELETE /api/gallery/:id", () => {
    test("should delete a gallery item", async () => {
      mockedService.delete.mockResolvedValue(item);

      const response = await request(app)
        .delete("/api/gallery/1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          id: 1,
        },
      });

      expect(mockedService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe("404 routes", () => {
    test("should return 404 for an unknown route", async () => {
      const response = await request(app)
        .get("/api/does-not-exist");

      expect(response.status).toBe(404);
    });
  });
});