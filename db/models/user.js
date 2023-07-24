// First, we require our configured instance of knex from the dbConfig.js file.
const db = require("../dbConfig");

// We then export an object with several methods, each representing a different database operation
module.exports = {
  // The findAll method retrieves all records from the 'users' table
  findAll: () => {
    return db("users");
  },
  // The findByUsername method retrieves the first record in the 'users' table where the username matches the provided username
  findByUsername: (username) => {
    return db("users").where({ username }).first();
  },
  // The create method inserts a new record (the 'user' object) into the 'users' table and returns the newly created user
  create: (user) => {
    return db("users").insert(user).returning("*");
  },
  // The update method finds a user in the 'users' table with the matching id and updates their record with the new data contained in the 'user' object. It then returns the updated user
  update: (id, user) => {
    return db("users").where({ id }).update(user, "*");
  },
  // The delete method finds a user in the 'users' table with the matching id and removes their record from the table
  delete: (id) => {
    return db("users").where({ id }).del();
  },
};
