/**
 * Tiny migration runner
 *
 * Responsibility: executes the SQL migration files explicitly via `npm run db:migrate`.
 * Architecture: deployment/setup concern, deliberately separate from app startup.
 * MongoDB/Mongoose comparison: Mongoose can create collections/indexes from schemas;
 * in PostgreSQL we keep schema changes as visible, repeatable SQL migration files.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "./connection";

async function migrate(): Promise<void> {
  const migrationsDirectory = path.resolve(process.cwd(), "src/database/migrations");
  const files = (await fs.readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationsDirectory, file), "utf8");
    await pool.query(sql);
    console.log(`Applied migration: ${file}`);
  }
}

migrate()
  .then(async () => {
    await pool.end();
    console.log("Database migrations complete.");
  })
  .catch(async (error: unknown) => {
    console.error("Migration failed:", error);
    await pool.end();
    process.exitCode = 1;
  });
