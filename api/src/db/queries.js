import db from "../configs/database.js";

// Paginated item listing with sorting
export async function getEventsPaginated(
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "asc",
) {
  const offset = (page - 1) * limit;

  const items = await db("event")
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db("event").count("id as count");

  return {
    items,
    total: count,
    page,
    pageSize: limit,
    totalPages: Math.ceil(count / limit),
  };
}

// Cart subtotal calculation
export async function getCartSubtotal(cartId) {
  const [result] = await db("cart_item")
    .where("cart_id", cartId)
    .sum({ subtotal: db.raw("quantity * unit_price") });

  return result?.subtotal || 0;
}

// Order totals snapshot (verify snapshot was correctly saved)
export async function getOrderTotalsBreakdown(orderId) {
  const order = await db("customer_order").where("id", orderId).first();

  const items = await db("order_item")
    .where("customer_order_id", orderId)
    .select(
      "event_id",
      db.raw("SUM(quantity) as quantity"),
      db.raw("AVG(unit_price) as unit_price"),
    )
    .groupBy("event_id");

  const itemTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  return {
    order_id: orderId,
    item_total: itemTotal,
    order_total: order.total_amount,
    items,
  };
}
