import { authenticateToken } from "./auth.js";

const middlewares = [
  authenticateToken,
  // Add other middlewares here if needed
];

export default middlewares;
