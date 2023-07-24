// First, we require our configured instance of knex from the dbConfig.js file.
const db = require("../dbConfig");

// We then export an object with several methods, each representing a different database operation
module.exports = {
  // The findAll method retrieves all records from the 'invoices' table
  findAll: () => {
    return db("invoices");
  },
  // The findOne method retrieves the first record in the 'invoices' table where the payment_request matches the provided payment_request
  findOne: (payment_request) => {
    return db("invoices").where({ payment_request }).first();
  },
  // The create method inserts a new record (the 'invoice' object) into the 'invoices' table and returns the newly created invoice
  create: (invoice) => {
    return db("invoices").insert(invoice).returning("*");
  },
  // The update method finds an invoice in the 'invoices' table with the matching payment_request and updates their record with the new data contained in the 'invoice' object. It then returns the updated invoice
  update: (payment_request, invoice) => {
    return db("invoices")
      .where({ payment_request })
      .update(invoice)
      .returning("*");
  },
  // The delete method finds an invoice in the 'invoices' table with the matching id and removes their record from the table
  delete: (id) => {
    return db("invoices").where({ id }).del();
  },
};
