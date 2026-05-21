import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import apiRouter from "#routers/api.js";
import { HttpError } from "#utils/httpError.js";

const rootRouter = express.Router();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Mid-Project API",
      version: "1.0.0",
      description: "API documentation for the HackYourFuture mid-project",
    },
    servers: [
      {
        url: "/",
      },
    ],
  },
  apis: ["./src/routers/*.js"], // Path to the API docs (relative to api folder)
};

const specs = swaggerJsdoc(swaggerOptions);

rootRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
rootRouter.use("/api", apiRouter);

// Catch unknown routes and forward to the error handler.
rootRouter.use((req, res, next) => {
  next(new HttpError(404, "Not Found"));
});

export default rootRouter;
