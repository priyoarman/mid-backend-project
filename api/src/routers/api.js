import express from "express";
import eventsRouter from "#routers/events.js";
import authRouter from "#routers/auth.js";
import cartRouter from "#routers/cart.js";
import orderRouter from "#routers/order.js";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

apiRouter.use("/events", eventsRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", orderRouter);

export default apiRouter;
