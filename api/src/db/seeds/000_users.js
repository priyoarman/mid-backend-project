/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("user").del();

    await knex("user")
        .insert([
            {
                id: 1,
                name: "Test User",
                email: "test@example.com",
            },
        ]);
}