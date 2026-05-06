import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    createUser,
    verifyPassword,
    sanitizeUser,
    findUserById,
} from "#models/users.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-me";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

/**
 * POST /api/auth/signup
 * Register a new user
 */
export async function signup(req, res, next) {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                error: {
                    message: "Email, password, and name are required",
                    status: 400,
                },
            });
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                error: {
                    message: "User with this email already exists",
                    status: 409,
                },
            });
        }

        // Create new user
        const user = await createUser(email, password, name);
        const safeUser = sanitizeUser(user);

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        res.status(201).json({
            data: {
                user: safeUser,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: {
                    message: "Email and password are required",
                    status: 400,
                },
            });
        }

        // Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                error: {
                    message: "Invalid email or password",
                    status: 401,
                },
            });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(user, password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: {
                    message: "Invalid email or password",
                    status: 401,
                },
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        const safeUser = sanitizeUser(user);

        res.status(200).json({
            data: {
                user: safeUser,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
export async function getCurrentUser(req, res, next) {
    try {
        // User should be attached to req by authentication middleware
        if (!req.user) {
            return res.status(401).json({
                error: {
                    message: "Unauthorized",
                    status: 401,
                },
            });
        }

        const user = await findUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                error: {
                    message: "User not found",
                    status: 404,
                },
            });
        }

        const safeUser = sanitizeUser(user);

        res.status(200).json({
            data: {
                user: safeUser,
            },
        });
    } catch (error) {
        next(error);
    }
}
