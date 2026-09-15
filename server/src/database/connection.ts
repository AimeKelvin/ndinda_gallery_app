/**
 * PostgreSQL connection pool
 *
 * Responsibility: owns the shared `pg` Pool used by repositories.
 * Architecture: repository -> pool -> PostgreSQL.
 * MongoDB/Mongoose comparison: `new Pool(...)` fills the same infrastructure role
 * as `mongoose.connect(MONGODB_URI)`, but SQL operations are sent explicitly.
 *
 * A connection is one network session to PostgreSQL. A pool keeps a small reusable
 * group of connections so every HTTP request does not open a brand-new session.
 */
import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({ connectionString: env.databaseUrl });

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});
