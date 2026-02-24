const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username,password) => users.some(u => u.username === username && u.password === password);

// Task 8: Login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("Customer successfully logged in");
  }
  return res.status(208).json({message: "Invalid Login"});
});

// Task 9: Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  books[isbn].reviews[username] = review;
  res.status(200).send("The review has been added/updated.");
});

// Task 10: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  delete books[isbn].reviews[username];
  res.status(200).send("Review deleted.");
});

module.exports.authenticated = regd_users;
module.exports.users = users;