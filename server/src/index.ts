/**
 * Backend entry point
 *
 * Responsibility: verifies infrastructure and starts listening for HTTP requests.
 * Architecture: startup only; routes, business logic, and SQL live in their own layers.
 * MongoDB/Mongoose comparison: this is where a Mongo app might await mongoose.connect().
 * With pg we test the pool, while table creation remains an explicit migration command.
 */
import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./database/connection";
import { ensureUploadsDirectory } from "./utils/file.utils";

async function start(): Promise<void> {
  await ensureUploadsDirectory();
  await pool.query("SELECT 1");

  app.listen(env.port, () => {
    console.log(`Gallery API running at http://localhost:${env.port}`);
  });
}

start().catch(async (error: unknown) => {
  console.error("Server failed to start:", error);
  await pool.end();
  process.exitCode = 1;
});
