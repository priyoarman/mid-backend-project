/**
 * Global error handling middleware
 *
 * This middleware should be registered last in the middleware stack
 * to catch any errors that occur in route handlers or other middleware.
 */
export default function errorHandler(err, req, res) {
  // Log the error for debugging
  console.error(err);

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  // Standardized error format
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
}
