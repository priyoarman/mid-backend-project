export async function seed(knex) {
  // Clear existing data in reverse order of dependencies
  await knex("order_item").del();
  await knex("customer_order").del();
  await knex("cart_item").del();
  await knex("cart").del();

  // Create test carts - insert returns ID in SQLite
  const cart1 = await knex("cart").insert({
    user_id: 1,
    session_id: null,
    total_price: 0,
  });
  const cart1Id = Array.isArray(cart1) ? cart1[0] : cart1;

  const cart2 = await knex("cart").insert({
    user_id: null,
    session_id: "guest-session-12345",
    total_price: 0,
  });
  const cart2Id = Array.isArray(cart2) ? cart2[0] : cart2;

  // Add items to user's cart
  await knex("cart_item").insert([
    {
      cart_id: cart1Id,
      event_id: 1,
      quantity: 2,
      unit_price: 49.99,
    },
    {
      cart_id: cart1Id,
      event_id: 2,
      quantity: 1,
      unit_price: 99.99,
    },
  ]);

  // Add items to guest cart
  await knex("cart_item").insert([
    {
      cart_id: cart2Id,
      event_id: 1,
      quantity: 1,
      unit_price: 49.99,
    },
  ]);

  // Update cart totals
  const userCartTotal = 2 * 49.99 + 1 * 99.99; // 199.97
  const guestCartTotal = 1 * 49.99; // 49.99

  await knex("cart").where("id", cart1Id).update("total_price", userCartTotal);
  await knex("cart").where("id", cart2Id).update("total_price", guestCartTotal);

  // Create sample orders for user
  const order1 = await knex("customer_order").insert({
    user_id: 1,
    total_amount: 149.97,
    status: "completed",
  });
  const order1Id = Array.isArray(order1) ? order1[0] : order1;

  const order2 = await knex("customer_order").insert({
    user_id: 1,
    total_amount: 49.99,
    status: "confirmed",
  });
  const order2Id = Array.isArray(order2) ? order2[0] : order2;

  // Add items to orders (snapshots)
  await knex("order_item").insert([
    {
      customer_order_id: order1Id,
      event_id: 1,
      quantity: 3,
      unit_price: 49.99,
    },
    {
      customer_order_id: order2Id,
      event_id: 2,
      quantity: 1,
      unit_price: 49.99,
    },
  ]);
}
