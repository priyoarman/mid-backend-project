import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-me";

/**
 * Authentication middleware
 *
 * Extracts JWT from Authorization header and validates it
 * If token is valid, attaches user info to req.user
 * If token is invalid or missing, continues without user info
 * (allows guest access to non-protected endpoints)
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    // No token provided - allow guest access
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Invalid token - allow guest access
      return next();
    }

    // Valid token - attach user to request
    req.user = user;
    next();
  });
}

/**
 * Protected route middleware
 *
 * Ensures that a valid JWT is provided
 * Must be used AFTER authenticateToken middleware
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: {
        message: "Unauthorized - Authentication required",
        status: 401,
      },
    });
  }

  next();
}
