import { pool } from "../../src/database/connection";

import {
  findAll,
  findById,
  create,
  update,
  remove,
} from "../../src/repositories/gallery.repository";

jest.mock("../../src/database/connection");

const mockQuery = pool.query as jest.Mock;

describe("Gallery Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("findAll should return all gallery items", async () => {
    const items = [
      {
        id: 1,
        title: "Mountain",
        description: "A beautiful mountain",
        image_url: "/uploads/mountain.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    mockQuery.mockResolvedValueOnce({
      rows: items,
    });

    const result = await findAll();

    expect(result).toEqual(items);
  });

  test("findById should return a gallery item", async () => {
    const item = {
      id: 1,
      title: "Mountain",
      description: "A beautiful mountain",
      image_url: "/uploads/mountain.jpg",
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockQuery.mockResolvedValueOnce({
      rows: [item],
    });

    const result = await findById(1);

    expect(result).toEqual(item);
  });

  test("findById should return null when item does not exist", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [],
    });

    const result = await findById(999);

    expect(result).toBeNull();
  });

  test("create should create and return a gallery item", async () => {
    const item = {
      id: 1,
      title: "Mountain",
      description: "A beautiful mountain",
      image_url: "/uploads/mountain.jpg",
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockQuery.mockResolvedValueOnce({
      rows: [item],
    });

    const result = await create({
      title: "Mountain",
      description: "A beautiful mountain",
      image_url: "/uploads/mountain.jpg",
    });

    expect(result).toEqual(item);
  });

  test("update should update and return a gallery item", async () => {
    const item = {
      id: 1,
      title: "Updated Mountain",
      description: "Updated description",
      image_url: "/uploads/updated.jpg",
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockQuery.mockResolvedValueOnce({
      rows: [item],
    });

    const result = await update(1, {
      title: "Updated Mountain",
      description: "Updated description",
      image_url: "/uploads/updated.jpg",
    });

    expect(result).toEqual(item);
  });

  test("update should return null when item does not exist", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [],
    });

    const result = await update(999, {
      title: "Missing",
      description: "Missing item",
      image_url: "/uploads/missing.jpg",
    });

    expect(result).toBeNull();
  });

  test("remove should delete and return a gallery item", async () => {
    const item = {
      id: 1,
      title: "Mountain",
      description: "A beautiful mountain",
      image_url: "/uploads/mountain.jpg",
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockQuery.mockResolvedValueOnce({
      rows: [item],
    });

    const result = await remove(1);

    expect(result).toEqual(item);
  });

  test("remove should return null when item does not exist", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [],
    });

    const result = await remove(999);

    expect(result).toBeNull();
  });
});