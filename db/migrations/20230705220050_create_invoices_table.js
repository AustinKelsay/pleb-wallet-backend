exports.up = function (knex) {
  // Begin creating a new table named "invoices"
  return knex.schema.createTable("invoices", function (table) {
    // Creates a primary key column which will auto-increment its value for each new record
    table.increments();

    // Creates a string column named "payment_request" that can be at the most 100 characters, cannot be null, and must be unique across all records.
    table.string("payment_request", 1000).notNullable().unique();

    // Creates an integer column named "value" that cannot be null
    table.integer("value").notNullable();

    // Creates a string column named "memo" for additional notes or comments
    table.string("memo");

    // Creates an integer column named "fees"
    table.integer("fees");

    // Creates a boolean column named "send" that cannot be null
    table.boolean("send").notNullable();

    // Creates a boolean column named "settled" that cannot be null
    table.boolean("settled").notNullable();

    // Creates a timestamp column named "settle_date" with a default value of 0
    table.timestamp("settle_date").defaultTo(null);

    // Creates a timestamp column named "created_at" that defaults to the current time
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Creates an integer column named "user_id" that cannot be null
    table.integer("user_id").unsigned().notNullable();

    // This sets up a foreign key constraint, where "user_id" in the "invoices" table references the "id" column in the "users" table
    table.foreign("user_id").references("id").inTable("users");
  });
};

exports.down = function (knex) {
  // This function will drop the "invoices" table, undoing the effects of the `up` function
  // This is useful for resetting the database to its prior state if something goes wrong
  return knex.schema.dropTableIfExists("invoices");
};
