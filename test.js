const router = require("express").Router();

// GET all users
// Before processing the request, we apply the 'authenticateAdmin' middleware to protect the ability to see all users
router.get("/", (req, res) => {
  // Call the 'findAll' method from our User model. This method retrieves all user records from the database.
  res.status(200).json({ message: "Hello!" });
});

module.exports = router;
