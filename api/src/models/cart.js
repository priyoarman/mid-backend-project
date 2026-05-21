import db from "../configs/database.js";

export const Cart = {
    // Get cart by user_id (authenticated users)
    async getByUserId(userId) {
        return db("cart").where("user_id", userId).first();
    },

    // Get cart by session_id (unauthenticated users)
    async getBySessionId(sessionId) {
        return db("cart").where("session_id", sessionId).first();
    },

    // Create new cart
    async create(userId = null, sessionId = null) {
        const [id] = await db("cart").insert({
            user_id: userId,
            session_id: sessionId,
            total_price: 0,
        });
        return this.getById(id);
    },

    // Get cart with all items
    async getWithItems(cartId) {
        return db("cart")
            .where("cart.id", cartId)
            .leftJoin("cart_item", "cart.id", "cart_item.cart_id")
            .leftJoin("event", "cart_item.event_id", "event.id")
            .select(
                "cart.id",
                "cart.user_id",
                "cart.session_id",
                "cart.total_price",
                db.raw("json_group_array(json_object('id', cart_item.id, 'event_id', event.id, 'title', event.title, 'quantity', cart_item.quantity, 'unit_price', cart_item.unit_price)) as items")
            )
            .groupBy("cart.id")
            .first();
    },

    // Calculate and update cart total
    async updateTotal(cartId) {
        const result = await db("cart_item")
            .where("cart_id", cartId)
            .sum({ total: db.raw("quantity * unit_price") })
            .first();

        const total = result?.total || 0;
        await db("cart").where("id", cartId).update("total_price", total);
        return total;
    },

    // Add item to cart
    async addItem(cartId, eventId, quantity = 1) {
        const event = await db("event").where("id", eventId).first();
        if (!event) throw new Error("Event not found");

        const existing = await db("cart_item")
            .where("cart_id", cartId)
            .where("event_id", eventId)
            .first();

        if (existing) {
            // Update quantity
            await db("cart_item")
                .where("id", existing.id)
                .update("quantity", existing.quantity + quantity);
        } else {
            // Insert new
            await db("cart_item").insert({
                cart_id: cartId,
                event_id: eventId,
                quantity,
                unit_price: event.price,
            });
        }

        await this.updateTotal(cartId);
    },

    // Remove item from cart
    async removeItem(cartItemId) {
        const item = await db("cart_item").where("id", cartItemId).first();
        if (!item) throw new Error("Cart item not found");

        await db("cart_item").where("id", cartItemId).delete();
        await this.updateTotal(item.cart_id);
    },

    // Clear entire cart
    async clear(cartId) {
        await db("cart_item").where("cart_id", cartId).delete();
        await db("cart").where("id", cartId).update("total_price", 0);
    },

    // Get by ID helper
    async getById(id) {
        return db("cart").where("id", id).first();
    },
};