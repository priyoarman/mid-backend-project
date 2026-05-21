import express from "express";
import eventsRouter from "#routers/events.js";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

apiRouter.use("/events", eventsRouter);

export default apiRouter;