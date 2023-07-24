const jwt = require("jsonwebtoken");
const User = require("../../db/models/user");

module.exports = (req, res, next) => {
  // Extracting the token from the request header
  const token = req.headers.authorization;

  // Setting up the JWT secret for token verification
  const secret = process.env.JWT_SECRET || "Satoshi Nakamoto";
  // Setting the admin key for admin verification
  const key = process.env.ADMIN_KEY || "1234";

  // If token is present, attempt to verify it using the JWT module
  if (token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      // If token is not verified, return 401 error
      if (err || !decodedToken) {
        res.status(401).json({ message: "Error with your verification" });
      } else {
        // If token is verified, find the user using their username from the database
        const user = await User.findByUsername(decodedToken.username);

        console.log("user", user);

        // Extracting admin key from user object if it exists
        const adminKey = user?.adminKey?.toString() ?? "";
        // Checking if extracted admin key matches with the one in env variables
        if (adminKey !== key) {
          // If admin key does not match, return 401 error
          res.status(401).json({ message: "Must be an admin" });
        } else {
          // If admin key matches, let the endpoint continue executing
          next();
        }
      }
    });
  } else {
    // If no token is present, return 401 error
    res.status(401).json({ message: "No token!" });
  }
};
