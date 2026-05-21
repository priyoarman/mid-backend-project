import express from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  checkoutCart,
} from "#controllers/cart.js";

const cartRouter = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get current cart (authenticated or guest)
 *     description: Returns the cart for the authenticated user or session-based cart for guests
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         user_id:
 *                           type: integer
 *                           nullable: true
 *                         session_id:
 *                           type: string
 *                           nullable: true
 *                         total_price:
 *                           type: number
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               event_id:
 *                                 type: integer
 *                               title:
 *                                 type: string
 *                               quantity:
 *                                 type: integer
 *                               unit_price:
 *                                 type: number
 *                               total_price:
 *                                 type: number
 */
cartRouter.get("/", getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add item to cart
 *     description: Add an event to the cart. Supports both authenticated and guest users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - quantity
 *             properties:
 *               eventId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Event not found
 */
cartRouter.post("/items", addItemToCart);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update cart item quantity or remove it
 *     description: Update the quantity of a cart item (line ID). Pass quantity 0 to remove the item.
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item line ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *                 description: New quantity. Use 0 to remove the item.
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden - Cannot modify another user's cart
 *       404:
 *         description: Cart item not found
 */
cartRouter.put("/items/:itemId", updateCartItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove cart item
 *     description: Remove a specific item from the cart by its line ID.
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item line ID
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden - Cannot modify another user's cart
 *       404:
 *         description: Cart item not found
 */
cartRouter.delete("/items/:itemId", deleteCartItem);

/**
 * @swagger
 * /api/cart/checkout:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Checkout cart and create order
 *     description: Convert the current cart into an order. This operation is transactional - if it fails, no changes are made. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                                 type: integer
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
 *         description: Cart is empty
 *       401:
 *         description: Authentication required
 */
cartRouter.post("/checkout", checkoutCart);

export default cartRouter;
