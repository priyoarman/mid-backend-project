/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.schema.createTable("user", (t) => {
        t.increments("id").primary();
        t.string("email").notNullable().unique();
        t.string("password_hash").notNullable();
        t.string("name").notNullable();
        t.timestamps(true, true);
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("user");
}