/**
 * Local upload file utilities
 *
 * Responsibility: computes safe upload paths and removes local files defensively.
 * Architecture: service/middleware use this infrastructure helper; DB code never does.
 * MongoDB/Mongoose comparison: file lifecycle is independent of either database. The
 * database stores only a string path, much like a Mongoose document might store a URL.
 */
import fs from "node:fs/promises";
import path from "node:path";

export const uploadsDirectory = path.resolve(process.cwd(), "uploads");

export async function ensureUploadsDirectory(): Promise<void> {
  await fs.mkdir(uploadsDirectory, { recursive: true });
}

export function toPublicImagePath(filename: string): string {
  return `/uploads/${filename}`;
}

export async function safeDeleteFile(filePath: string | undefined): Promise<void> {
  if (!filePath) return;
  const resolved = path.resolve(filePath);
  const relative = path.relative(uploadsDirectory, resolved);

  // Prevent accidental deletion outside server/uploads even if a bad path reaches us.
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;

  try {
    await fs.unlink(resolved);
  } catch (error: unknown) {
    const code = error instanceof Error && "code" in error
      ? (error as NodeJS.ErrnoException).code
      : undefined;
    if (code !== "ENOENT") console.error("Could not delete upload:", error);
  }
}

export function filePathFromImageUrl(imageUrl: string): string | undefined {
  try {
    const pathname = imageUrl.startsWith("http") ? new URL(imageUrl).pathname : imageUrl;
    const filename = path.basename(pathname);
    if (!filename) return undefined;
    return path.join(uploadsDirectory, filename);
  } catch {
    return undefined;
  }
}
