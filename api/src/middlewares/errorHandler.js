/**
 * Global error handling middleware
 *
 * This middleware should be registered last in the middleware stack
 * to catch any errors that occur in route handlers or other middleware.
 */
export default function errorHandler(err, req, res, next) {
  // Log all errors for debugging and monitoring
  console.error(err);

  const statusCode = Number(err.statusCode || err.status || 500);
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
}
