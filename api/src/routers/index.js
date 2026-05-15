import express from "express";
import apiRouter from "#routers/api.js";
import { HttpError } from "#utils/httpError.js";

const rootRouter = express.Router();

rootRouter.use("/api", apiRouter);

// Catch unknown routes and forward to the error handler.
rootRouter.use((req, res, next) => {
  next(new HttpError(404, "Not Found"));
});

export default rootRouter;
