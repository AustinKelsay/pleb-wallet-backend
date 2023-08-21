const knex = require("knex");

const config = require("../knexfile");

const dotenv = require("dotenv");

dotenv.config();

const env = process.env.NODE_ENV || "development";

const db = knex(config[env]);

module.exports = db;
