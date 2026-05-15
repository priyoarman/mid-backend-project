import db from "../configs/database.js";

export const Order = {
  // Create order from cart (transactional)
  async createFromCart(userId, cartId) {
    return db.transaction(async (trx) => {
      // Get cart items within transaction
      const cartItems = await trx("cart_item").where("cart_id", cartId);
      if (cartItems.length === 0) throw new Error("Cart is empty");

      // Calculate total
      const total = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0,
      );

      // Create order
      const [orderId] = await trx("customer_order").insert({
        user_id: userId,
        total_amount: total,
        status: "confirmed",
      });

      // Copy items to order_item
      for (const item of cartItems) {
        await trx("order_item").insert({
          customer_order_id: orderId,
          event_id: item.event_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        });
      }

      // Clear cart items
      await trx("cart_item").where("cart_id", cartId).delete();

      // Reset cart total
      await trx("cart").where("id", cartId).update("total_price", 0);

      // Return the order row from the same transaction connection
      return trx("customer_order").where("id", orderId).first();
    });
  },

  // Get order with items
  async getWithItems(orderId) {
    const order = await db("customer_order").where("id", orderId).first();
    const items = await db("order_item")
      .where("customer_order_id", orderId)
      .join("event", "order_item.event_id", "event.id")
      .select("order_item.*", "event.title");

    return { ...order, items };
  },

  // Get all orders by user
  async getByUserId(userId) {
    return db("customer_order")
      .where("user_id", userId)
      .orderBy("created_at", "desc");
  },

  // Get by ID
  async getById(id) {
    return db("customer_order").where("id", id).first();
  },

  // Update status
  async updateStatus(orderId, status) {
    return db("customer_order").where("id", orderId).update("status", status);
  },
};
