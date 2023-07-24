module.exports = {
  // This is the configuration for your development environment
  development: {
    // This is the database client that knex will use, in this case SQLite3
    client: "sqlite3",

    // This is the connection configuration to connect to your SQLite3 database
    connection: {
      // This is the file where your SQLite3 database is stored
      filename: "./db/dev.sqlite3",
    },

    // By setting useNullAsDefault to true, we're telling SQLite to use NULL values when a value is not available
    useNullAsDefault: true,

    // These are the settings for your database migrations
    migrations: {
      // This is the directory where your migration files are stored
      directory: "./db/migrations",
    },

    // These are the settings for your database seeds
    seeds: {
      // This is the directory where your seed files are stored
      directory: "./db/seeds",
    },
  },

  // This is the configuration for your production environment
  production: {
    // This is the database client that knex will use, in this case PostgreSQL (pg)
    client: "pg",

    // This is the connection configuration for your PostgreSQL database
    // process.env.DATABASE_URL is an environment variable that points to your PostgreSQL database
    connection: process.env.DATABASE_URL,

    // These are the settings for your database migrations
    migrations: {
      // This is the directory where your migration files are stored
      directory: "./db/migrations",
    },

    // These are the settings for your database seeds
    seeds: {
      // This is the directory where your seed files are stored
      directory: "./db/seeds",
    },
  },
};
