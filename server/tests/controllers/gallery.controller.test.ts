import type { NextFunction, Request, Response } from "express";

import {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../../src/controllers/gallery.controller";

import { galleryService } from "../../src/services/gallery.service";

jest.mock("../../src/services/gallery.service");

const mockedService = galleryService as jest.Mocked<typeof galleryService>;

describe("Gallery Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

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

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe("getGallery", () => {
    test("should return all gallery items with 200", async () => {
      mockedService.list.mockResolvedValue([item]);

      await getGallery(
        req as Request,
        res as Response,
        next,
      );

      expect(mockedService.list).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [item],
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("should pass service errors to next", async () => {
      const error = new Error("Database error");

      mockedService.list.mockRejectedValue(error);

      await getGallery(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getGalleryItem", () => {
    test("should return one gallery item with 200", async () => {
      req.params = { id: "1" };

      mockedService.get.mockResolvedValue(item);

      await getGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(mockedService.get).toHaveBeenCalledWith(1);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: item,
      });
    });

    test("should pass service errors to next", async () => {
      req.params = { id: "999" };

      const error = new Error("Gallery item not found");

      mockedService.get.mockRejectedValue(error);

      await getGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createGalleryItem", () => {
    test("should create an item and return 201", async () => {
      req.body = {
        title: "Mountain",
        description: "A beautiful mountain",
      };

      const file = {
        filename: "mountain.jpg",
      } as Express.Multer.File;

      req.file = file;

      mockedService.create.mockResolvedValue(item);

      await createGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(mockedService.create).toHaveBeenCalledWith(
        req.body,
        file,
      );

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: item,
      });
    });

    test("should pass service errors to next", async () => {
      const error = new Error("Image is required");

      mockedService.create.mockRejectedValue(error);

      await createGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateGalleryItem", () => {
    test("should update an item and return 200", async () => {
      req.params = { id: "1" };

      req.body = {
        title: "Updated Mountain",
        description: "Updated description",
      };

      const file = {
        filename: "updated.jpg",
      } as Express.Multer.File;

      req.file = file;

      const updatedItem = {
        ...item,
        title: "Updated Mountain",
        image_url: "/uploads/updated.jpg",
      };

      mockedService.update.mockResolvedValue(updatedItem);

      await updateGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(mockedService.update).toHaveBeenCalledWith(
        1,
        req.body,
        file,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedItem,
      });
    });

    test("should pass service errors to next", async () => {
      req.params = { id: "999" };

      const error = new Error("Gallery item not found");

      mockedService.update.mockRejectedValue(error);

      await updateGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteGalleryItem", () => {
    test("should delete an item and return its ID", async () => {
      req.params = { id: "1" };

      mockedService.delete.mockResolvedValue(item);

      await deleteGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(mockedService.delete).toHaveBeenCalledWith(1);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: 1,
        },
      });
    });

    test("should pass service errors to next", async () => {
      req.params = { id: "999" };

      const error = new Error("Gallery item not found");

      mockedService.delete.mockRejectedValue(error);

      await deleteGalleryItem(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});