export async function up(knex) {
  // Create customer_order table (avoid "order" keyword)
  await knex.schema.createTable("customer_order", (t) => {
    t.increments("id").primary();
    t.integer("user_id").unsigned().notNullable();
    t.decimal("total_amount", 10, 2).notNullable();
    t.enum("status", ["pending", "confirmed", "completed", "cancelled"])
      .notNullable()
      .defaultTo("pending");
    t.timestamps(true, true);

    // Foreign key
    t.foreign("user_id").references("id").inTable("user").onDelete("RESTRICT");
  });

  // Create order_item table
  await knex.schema.createTable("order_item", (t) => {
    t.increments("id").primary();
    t.integer("customer_order_id").unsigned().notNullable();
    t.integer("event_id").unsigned().notNullable();
    t.integer("quantity").notNullable();
    t.decimal("unit_price", 10, 2).notNullable(); // Price snapshot
    t.timestamps(true, true);

    // Foreign keys
    t.foreign("customer_order_id")
      .references("id")
      .inTable("customer_order")
      .onDelete("CASCADE");
    t.foreign("event_id")
      .references("id")
      .inTable("event")
      .onDelete("RESTRICT");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("order_item");
  await knex.schema.dropTableIfExists("customer_order");
}
