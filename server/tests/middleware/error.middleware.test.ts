import { Request, Response } from "express";
import multer from "multer";
import { errorMiddleware } from "../../src/middleware/error.middleware";
import { AppError } from "../../src/utils/app-error";

describe("errorMiddleware", () => {
  const req = {} as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should handle AppError", () => {
    const error = new AppError(400, "Title is required");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Title is required",
    });
  });

  test("should handle Multer file size errors", () => {
    const error = new multer.MulterError("LIMIT_FILE_SIZE");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Image must be 8 MB or smaller",
    });
  });

  test("should handle other Multer errors", () => {
    const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Could not process uploaded image",
    });
  });

  test("should handle invalid image type errors", () => {
    const error = new Error("Only JPEG, PNG, and WebP images are allowed");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Only JPEG, PNG, and WebP images are allowed",
    });
  });

  test("should handle unknown errors with 500", () => {
    const error = new Error("Something went very wrong");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});