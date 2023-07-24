const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/models/user");
const authenticate = require("./middleware/authenticate.js");
const authenticateAdmin = require("./middleware/authenticateAdmin.js");

// GET all users
// Before processing the request, we apply the 'authenticateAdmin' middleware to protect the ability to see all users
router.get("/", authenticateAdmin, (req, res) => {
  // Call the 'findAll' method from our User model. This method retrieves all user records from the database.
  User.findAll()
    .then((users) => {
      // If the promise resolves (i.e., the operation was successful), we send back a response with a status of 200 (OK)
      // and the list of users retrieved from the database.
      res.status(200).json(users);
    })
    .catch((err) => {
      // If the promise is rejected (i.e., the operation fails), we send back a response with a status of 500 (Internal Server Error)
      // and the error that occurred. This might be due to a database issue, a network issue, etc.
      res.status(500).json(err);
    });
});

// GET user by their username
// Using 'authenticate' middleware to verify the client's authentication token.
router.get("/user", authenticate, async (req, res) => {
  // Get the JWT (JSON Web Token) from the 'authorization' header of the request.
  const token = req.headers.authorization;
  // Retrieve the secret key for JWT verification from environment variables.
  const secret = process.env.JWT_SECRET;

  // Use the 'verify' method from the 'jsonwebtoken' library to decode the token.
  jwt.verify(token, secret, (err, decodedToken) => {
    // If an error occurred during token decoding (perhaps because the token is invalid or the secret is incorrect),
    // respond with a status of 401 (Unauthorized) and a message about the error.
    if (err) {
      res.status(401).json({ message: "Error decoding token", Error: err });
    }

    // If the token was successfully decoded, find a user with a username that matches the username in the decoded token.
    User.findByUsername(decodedToken.username)
      .then((user) => {
        // If the promise resolves (i.e., the user was found), respond with a status of 200 (OK) and the user's data.
        res.status(200).json(user);
      })
      .catch((err) => {
        // If the promise is rejected (i.e., an error occurred), respond with a status of 500 (Internal Server Error) and the error.
        res.status(500).json(err);
      });
  });
});

// POST a user to register
router.post("/register", (req, res) => {
  // We are using the bcrypt library to hash the password provided in the request body.
  // This enhances security by ensuring that the plain text password isn't stored directly in the database.
  // The '14' here is the cost factor that determines the complexity of the hashing process.
  const hash = bcrypt.hashSync(req.body.password, 14);

  // We then replace the plain text password in the request body with the hashed password.
  req.body.password = hash;

  // The updated request body (which now includes the hashed password) is passed to the 'add' method from our User model.
  // This method will create a new user record in the database.
  User.create(req.body)
    .then((user) => {
      // If the promise resolves (i.e., the operation was successful), we send back a response with a status of 200 (OK) and the newly created user.
      res.status(201).json({ data: user });
    })
    .catch((err) => {
      // If the promise is rejected (i.e., the operation fails), we send back a response with a status of 500 (Internal Server Error) and the error that occurred.
      res.status(500).json({ error: err });
    });
});

// POST a user to login
router.post("/login", (req, res) => {
  // Extract the 'username' and 'password' fields from the request body. These are provided by the client when they make the request.
  const { username, password } = req.body;

  // Call the 'findByUsername' method from our User model. This method retrieves the first user record from the database that matches the provided username.
  User.findByUsername(username)
    .then((user) => {
      // Check if a user was found and if the provided password, when hashed, matches the hashed password stored in the database.
      if (user && bcrypt.compareSync(password, user.password)) {
        // If both conditions are met, the login is successful. We then generate a token for the user. This token will be used for subsequent authenticated requests.
        const token = generateToken(user);
        // Respond with a status of 200 (OK), a welcome message, the generated token, and user information.
        res
          .status(200)
          .json({ message: `Welcome ${user.username}!`, token, user });
      } else {
        // If the user wasn't found or the password doesn't match, respond with a status of 401 (Unauthorized) and a message indicating the credentials were invalid.
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      // If an error occurs during the process, log the error and respond with a status of 500 (Internal Server Error) and the error.
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// PUT a user to update them
// The 'authenticateAdmin' middleware function is used to ensure that only the admin is authorized to update the user.
router.put("/:id", authenticateAdmin, (req, res) => {
  // Call the 'update' method from our User model with the provided id and body of the request.
  // The 'update' method will update the user record in the database that matches the provided id with the data in the request body.
  User.update(req.params.id, req.body)
    .then((user) => {
      // If the promise resolves (i.e., the operation was successful), we send back a response with a status of 200 (OK)
      // and the updated user record from the database.
      res.status(200).json(user);
    })
    .catch((err) => {
      // If the promise is rejected (i.e., the operation fails), we send back a response with a status of 500 (Internal Server Error)
      // and the error that occurred. This might be due to a database issue, a network issue, etc.
      res.status(500).json(err);
    });
});

// DELETE a user
router.delete("/:id", authenticateAdmin, (req, res) => {
  // Before running the delete operation, the `authenticateAdmin` middleware function is run.
  // This function checks whether the user making the request has the appropriate admin privileges.

  // Then we call the 'delete' method from our User model, passing in the user id extracted from the route parameters.
  User.delete(req.params.id)
    .then((user) => {
      // If the promise resolves (i.e., the operation was successful), we send back a response with a status of 200 (OK)
      // and the user that was deleted from the database.
      res.status(200).json(user);
    })
    .catch((err) => {
      // If the promise is rejected (i.e., the operation fails), we send back a response with a status of 500 (Internal Server Error)
      // and the error that occurred. This might be due to a database issue, a network issue, etc.
      res.status(500).json(err);
    });
});

// Function to generate a JSON Web Token (JWT) for a given user
function generateToken(user) {
  // Define the payload to be included in the token, containing user data
  const payload = {
    id: user.id,
    username: user.username,
    admin: user.admin,
  };

  // Get the JWT secret from an environment variable, or use a default value
  const secret = process.env.JWT_SECRET || "Satoshi Nakamoto";

  // Define the options for the JWT, including the token expiration time
  const options = {
    expiresIn: "1d",
  };

  // Generate and return the JWT using the payload, secret, and options
  return jwt.sign(payload, secret, options);
}

// export our router so we can initiate it in index.js
module.exports = router;
