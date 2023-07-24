const jwt = require("jsonwebtoken");

// Exporting a middleware function that takes the arguments req, res, and next
module.exports = (req, res, next) => {
  // Extracting the token from the Authorization header of the request
  const token = req.headers.authorization;
  // Extracting the secret used to sign the JWT from an environment variable or using a default value
  const secret = process.env.JWT_SECRET || "Satoshi Nakamoto";
  // Checking if a token was provided in the request header
  if (token) {
    // Verifying the token using the provided secret
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        // If the token is not verified, return a status code of 401 and an error message
        res.status(401).json({ message: "Not Allowed", Error: err });
      } else {
        // If the token is verified, execute the next middleware or endpoint logic
        next();
      }
    });
  } else {
    // If no token was provided, return a status code of 401 and a message
    res.status(401).json({ message: "No token!" });
  }
};
