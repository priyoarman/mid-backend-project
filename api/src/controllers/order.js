import { Order } from "#models/order.js";

/**
 * GET /api/orders
 * Get all orders for the authenticated user
 */
export async function getOrders(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: "Authentication required",
          status: 401,
        },
      });
    }

    const orders = await Order.getByUserId(req.user.userId);

    // Get orders with items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderWithItems = await Order.getWithItems(order.id);
        return orderWithItems;
      })
    );

    res.status(200).json({
      data: {
        orders: ordersWithItems,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/{orderId}
 * Get a specific order by ID
 */
export async function getOrderById(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: "Authentication required",
          status: 401,
        },
      });
    }

    const { orderId } = req.params;

    // Validation
    if (!orderId || isNaN(orderId)) {
      return res.status(400).json({
        error: {
          message: "Valid order ID is required",
          status: 400,
        },
      });
    }

    const order = await Order.getById(parseInt(orderId));
    if (!order) {
      return res.status(404).json({
        error: {
          message: "Order not found",
          status: 404,
        },
      });
    }

    // Check ownership
    if (order.user_id !== req.user.userId) {
      return res.status(403).json({
        error: {
          message: "Forbidden - Cannot access another user's order",
          status: 403,
        },
      });
    }

    // Get order with items
    const orderWithItems = await Order.getWithItems(order.id);

    res.status(200).json({
      data: {
        order: orderWithItems,
      },
    });
  } catch (error) {
    next(error);
  }
}