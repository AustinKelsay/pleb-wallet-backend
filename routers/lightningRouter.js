const router = require("express").Router();
const authenticate = require("../routers/middleware/authenticate");
const authenticateAdmin = require("../routers/middleware/authenticateAdmin");
const Invoice = require("../db/models/invoice.js");

const {
  getBalance,
  createInvoice,
  getChannelBalance,
  payInvoice,
} = require("../lnd.js");

// GET the onchain balance
router.get("/balance", (req, res) => {
  getBalance()
    .then((balance) => {
      res.status(200).json(balance);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET the lightning wallet balance
router.get("/channelbalance", (req, res) => {
  getChannelBalance()
    .then((channelBalance) => {
      res.status(200).json(channelBalance);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET all invoices from the database
router.get("/invoices", (req, res) => {
  // Call the 'findAll' method from our Invoice model. This method retrieves all invoice records from the database.
  Invoice.findAll()
    .then((invoices) => {
      // If the promise resolves (i.e., the operation was successful), we send back a response with a status of 200 (OK)
      // and the list of invoices retrieved from the database.
      res.status(200).json(invoices);
    })
    .catch((err) => {
      // If the promise is rejected (i.e., the operation fails), we send back a response with a status of 500 (Internal Server Error)
      // and the error that occurred. This might be due to a database issue, a network issue, etc.
      res.status(500).json(err);
    });
});

// POST required info to create an invoice
router.post("/invoice", authenticate, (req, res) => {
  // The 'authenticate' middleware function is called before the main handler.
  // This function checks if the user making the request is authenticated.

  // Extract 'value', 'memo', and 'user_id' properties from the body of the incoming request.
  const { value, memo, user_id } = req.body;

  // Call the 'createInvoice' function, passing the extracted properties as an object.
  // This function creates a new invoice record in the database.
  createInvoice({ value, memo, user_id })
    .then((invoice) => {
      // If the promise resolves (i.e., the operation was successful), we send back a response with a status of 200 (OK)
      // and the invoice object retrieved from the database.
      res.status(200).json(invoice);
    })
    .catch((err) => {
      // If the promise is rejected (i.e., the operation fails), we send back a response with a status of 500 (Internal Server Error)
      // and the error that occurred. This could be due to a database issue, a network issue, etc.
      res.status(500).json(err);
    });
});

router.post("/pay", authenticateAdmin, async (req, res) => {
  // Extract the 'payment_request' property from the request body.
  const { payment_request, user_id } = req.body;

  // Use the 'payInvoice' function to attempt to pay the invoice. This function is asynchronous, so we use 'await' to pause execution until it completes.
  const pay = await payInvoice({ payment_request });

  // If there was an error making the payment, we send back a response with a status of 500 (Internal Server Error) and the error message.
  if (pay.payment_error) {
    res.status(500).json(pay.payment_error);
  }

  // format date into timestamp
  const settleDate = new Date().toISOString();

  // If the payment was successful (indicated by the existence of 'pay.payment_route'), we create a new 'payment' record in the database.
  if (pay?.payment_route) {
    const payment = await Invoice.create({
      // The payment details include the original payment request, a flag indicating it was sent, the total amount, any fees, and the settlement details.
      payment_request: payment_request,
      send: true,
      value: pay.payment_route.total_amt,
      fees: pay.payment_route.total_fees,
      settled: true,
      settle_date: settleDate,
      user_id: user_id,
    });

    // After creating the new payment record, we send a response with a status of 200 (OK) and the details of the new payment record.
    res.status(200).json(payment);
  }
});

// export our router so we can initiate it in index.js
module.exports = router;
