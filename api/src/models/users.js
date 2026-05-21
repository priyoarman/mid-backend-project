import db from "#configs/database.js";

const TABLE = "user";

function baseQuery(trx = db) {
    return trx(TABLE);
}

export async function listUsers(filters = {}, options = {}) {
    const qb = baseQuery().select("*");
    return qb;
}

export async function findUserById(id, { trx } = {}) {
    const row = await baseQuery(trx).where({ id }).first();
    return row ?? null;
}