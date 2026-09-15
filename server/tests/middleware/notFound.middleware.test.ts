import { Request, Response, NextFunction } from "express";
import { notFoundMiddleware } from "../../src/middleware/notFound.middleware";

describe("notFoundMiddleware", () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 404 for an unknown route", () => {
    const req = {
      method: "GET",
      originalUrl: "/api/does-not-exist",
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    notFoundMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Route not found: GET /api/does-not-exist",
    });
  });

  test("should include the request method and URL", () => {
    const req = {
      method: "POST",
      originalUrl: "/api/test",
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    notFoundMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Route not found: POST /api/test",
    });
  });
});