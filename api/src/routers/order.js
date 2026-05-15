import express from "express";
import { getOrders, getOrderById } from "#controllers/order.js";

const orderRouter = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get user's orders
 *     description: Retrieve all orders for the authenticated user, including order items
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           total_amount:
 *                             type: number
 *                           status:
 *                             type: string
 *                             enum: [pending, confirmed, completed, cancelled]
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 customer_order_id:
 *                                   type: integer
 *                                 event_id:
 *                                   type: integer
 *                                 title:
 *                                   type: string
 *                                 quantity:
 *                                   type: integer
 *                                 unit_price:
 *                                   type: number
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Authentication required
 */
orderRouter.get("/", getOrders);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get specific order
 *     description: Retrieve a specific order by ID for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         user_id:
 *                           type: integer
 *                         total_amount:
 *                           type: number
 *                         status:
 *                           type: string
 *                           enum: [pending, confirmed, completed, cancelled]
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               customer_order_id:
 *                               type: integer
 *                               event_id:
 *                                 type: integer
 *                               title:
 *                                 type: string
 *                               quantity:
 *                                 type: integer
 *                               unit_price:
 *                                 type: number
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Cannot access another user's order
 *       404:
 *         description: Order not found
 */
orderRouter.get("/:orderId", getOrderById);

export default orderRouter;
