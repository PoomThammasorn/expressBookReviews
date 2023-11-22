const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const isUserPresent = users.some((obj) =>
    Object.values(obj).includes(username)
  );
  return isUserPresent;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 }
    );

    console.log("Access Token:", accessToken);

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!isbn || !review) {
    return res.status(404).json({ message: "Error adding review" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "No book with ISBN " + isbn });
  }

  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }
  books[isbn].reviews[username] = review;
  return res.status(200).send("Review successfully added/modified");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has posted a review for this ISBN
  if (!books[isbn].reviews[username]) {
    return res
      .status(404)
      .json({ message: "Review not found for the specified user and ISBN" });
  }

  // Delete the review for the specified user and ISBN
  delete books[isbn].reviews[username];

  return res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
