/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("user").del();
    await knex("user").insert([
        {
            id: 1,
            email: "test@user.com",
            password_hash: "$2b$10$exampleHashedPassword",
            name: "Test User",
        },
    ]);
}