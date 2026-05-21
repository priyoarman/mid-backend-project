import "dotenv/config";

export default {
  development: {
    client: process.env.DB_CLIENT ?? "sqlite3",
    connection: {
      filename: process.env.DB_SQLITE_FILENAME ?? "./src/database.sqlite3",
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
    useNullAsDefault: process.env.DB_USE_NULL_AS_DEFAULT === "true",
  },
};