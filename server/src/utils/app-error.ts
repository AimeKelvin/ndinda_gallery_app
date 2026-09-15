/**
 * Application error
 *
 * Responsibility: carries an HTTP status alongside a safe client-facing message.
 * Architecture: services throw it; centralized error middleware translates it to HTTP.
 * MongoDB/Mongoose comparison: similar to converting validation/not-found errors into
 * consistent API responses instead of handling them independently in every controller.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
