import db from "#configs/database.js";
import bcrypt from "bcrypt";

const TABLE = "user";

function baseQuery(trx = db) {
    return trx(TABLE);
}

export async function listUsers() {
    const qb = baseQuery().select("*");
    return qb;
}

export async function findUserById(id, { trx } = {}) {
    const row = await baseQuery(trx).where({ id }).first();
    return row ?? null;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email, { trx } = {}) {
    const row = await baseQuery(trx).where({ email }).first();
    return row ?? null;
}

/**
 * Create a new user with hashed password
 */
export async function createUser(email, password, name, { trx } = {}) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [id] = await baseQuery(trx).insert({
        email,
        password_hash: passwordHash,
        name,
    });
    
    return findUserById(id, { trx });
}

/**
 * Verify password for a user
 */
export async function verifyPassword(user, password) {
    if (!user || !user.password_hash) {
        return false;
    }
    return bcrypt.compare(password, user.password_hash);
}

/**
 * Get user without sensitive fields
 */
export function sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, ...safeUser } = user; // eslint-disable-line no-unused-vars
    return safeUser;
}