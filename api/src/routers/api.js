import express from "express";
import eventsRouter from "#routers/events.js";

const apiRouter = express.Router();

apiRouter.use("/events", eventsRouter);

apiRouter.get("/", (req, res) => {
  res.json({ message: "This is the API root" });
});

export default apiRouter;