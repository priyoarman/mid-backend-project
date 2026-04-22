export async function up(knex) {
  // Create cart table
  await knex.schema.createTable("cart", (t) => {
    t.increments("id").primary();
    t.integer("user_id").unsigned().nullable(); // null for unauthenticated
    t.string("session_id").nullable(); // UUID for unauthenticated users
    t.decimal("total_price", 10, 2).notNullable().defaultTo(0);
    t.timestamps(true, true);

    // Foreign key to user
    t.foreign("user_id").references("id").inTable("user").onDelete("CASCADE");

    // Unique constraint: one cart per user (when user_id is not null)
    // For session_id uniqueness, it's naturally unique per session
    t.unique(["user_id"], { where: knex.raw("user_id IS NOT NULL") });
  });

  // Create cart_item table
  await knex.schema.createTable("cart_item", (t) => {
    t.increments("id").primary();
    t.integer("cart_id").unsigned().notNullable();
    t.integer("event_id").unsigned().notNullable();
    t.integer("quantity").notNullable().defaultTo(1);
    t.decimal("unit_price", 10, 2).notNullable(); // Price snapshot
    t.timestamps(true, true);

    // Foreign keys
    t.foreign("cart_id").references("id").inTable("cart").onDelete("CASCADE");
    t.foreign("event_id")
      .references("id")
      .inTable("event")
      .onDelete("RESTRICT");

    // Prevent duplicate items in same cart
    t.unique(["cart_id", "event_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("cart_item");
  await knex.schema.dropTableIfExists("cart");
}
