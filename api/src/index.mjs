/**
 * ================================================================
 *  🚨 DO NOT MODIFY THIS FILE 🚨
 * ================================================================
 *
 * This is the main application entry point.
 * It is intentionally minimal and structured to ensure:
 *
 *  - All middleware is registered in the correct order
 *  - All routes are properly mounted
 *  - Swagger detects every endpoint
 *  - The application starts consistently in all environments
 *
 * Any application logic, middleware, or route changes
 * MUST be implemented in their respective modules.
 *
 * This file should remain unchanged.
 * ================================================================
 */

import "dotenv/config"; // Loads environment variables from .env
import express from "express"; // Express web framework
import cors from "cors"; // Cross-Origin Resource Sharing middleware
import bodyParser from "body-parser"; // JSON body parsing
import rootRouter from "#routers"; // Main router aggregator
import swaggerSetup from "#configs/swagger.js"; // Swagger documentation setup
import middlewares from "#middlewares"; // Global middleware array

// ------------------------------------------------------------------
// Application Initialization
// ------------------------------------------------------------------

const app = express();

// Enable CORS for all incoming requests
app.use(cors());

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// ------------------------------------------------------------------
// Register Global Middlewares
// ------------------------------------------------------------------
// Middlewares are applied in sequence before route handlers.
// This allows centralized handling (e.g. logging, error formatting, etc.)
for (const middleware of middlewares) {
  app.use(middleware);
}

// ------------------------------------------------------------------
// Register Application Routes
// ------------------------------------------------------------------
// All API routes are mounted through the root router.
app.use("/", rootRouter);

// ------------------------------------------------------------------
// Register Error Handling Middleware
// ------------------------------------------------------------------
// Error handlers must be registered after routes to catch errors properly.
import errorHandler from "#middlewares/errorHandler.js";
app.use(errorHandler);

// ------------------------------------------------------------------
// Swagger Setup
// ------------------------------------------------------------------
// IMPORTANT:
// This MUST be called after routes are registered.
// Swagger scans the app and detects all available endpoints,
// regardless of whether they are documented or not.
swaggerSetup(app);

// ------------------------------------------------------------------
// Start Server
// ------------------------------------------------------------------

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.info(
    `${process.env.APP_NAME || "Backend-Mid-Specialism"} app started on port ${port}`,
  );
});
