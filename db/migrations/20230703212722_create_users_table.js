exports.up = function (knex) {
  // Begins the creation of a new table named "users"
  return knex.schema.createTable("users", function (table) {
    // Creates a primary key column which auto increments its value for each new record
    table.increments();

    // Creates a string column named "username" that cannot be null and must be unique across all records
    // The second argument, 128, sets the maximum length of this string column
    table.string("username", 128).notNullable().unique();

    // Creates a string column named "password" that cannot be null
    // The second argument, 128, sets the maximum length of this string column
    table.string("password", 128).notNullable();

    // Creates an integer column named "adminKey" that defaults to 1 if no other value is provided
    table.string("adminKey").defaultTo(null);
  });
};

exports.down = function (knex) {
  // This function will drop the "users" table if it exists, effectively undoing the operations of the `up` function
  // This is particularly useful for when you need to roll back the database to its previous state if something goes wrong
  return knex.schema.dropTableIfExists("users");
};
