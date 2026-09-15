/**
 * Environment configuration
 *
 * Responsibility: validates environment variables once and exposes typed values.
 * Architecture: infrastructure/configuration used by the database and Express app.
 * MongoDB/Mongoose comparison: this is where you would normally read MONGODB_URI
 * before calling mongoose.connect(...). Here DATABASE_URL points to PostgreSQL.
 */
import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required. Add it to server/.env.`);
  return value;
}

const portValue = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(portValue) || portValue <= 0) {
  throw new Error("PORT must be a positive integer.");
}

export const env = {
  port: portValue,
  databaseUrl: required("DATABASE_URL"),
  clientOrigin: process.env.CLIENT_ORIGIN?.trim() || "http://localhost:5173",
};
