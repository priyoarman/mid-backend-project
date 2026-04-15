/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.schema.alterTable("event", (t) => {
        t.integer("user_id").unsigned().references("id").inTable("user").onDelete("CASCADE");
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.alterTable("event", (t) => {
        t.dropForeign("user_id");
        t.dropColumn("user_id");
    });
}