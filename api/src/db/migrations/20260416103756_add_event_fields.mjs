export async function up(knex) {
    await knex.schema.alterTable("event", (t) => {
        t.date("date").notNullable().defaultTo("2026-01-01");
        t.time("time").notNullable().defaultTo("12:00:00");
        t.string("venue").notNullable().defaultTo("TBD");
        t.integer("capacity").notNullable().defaultTo(100);
    });
}

export async function down(knex) {
    await knex.schema.alterTable("event", (t) => {
        t.dropColumn("date");
        t.dropColumn("time");
        t.dropColumn("venue");
        t.dropColumn("capacity");
    });
}