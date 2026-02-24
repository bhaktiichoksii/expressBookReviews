const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Register User
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!users.some(u => u.username === username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login."});
    }
    return res.status(404).json({message: "User already exists!"});
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  })
  .then(book => res.send(JSON.stringify(book, null, 4)))
  .catch(err => res.status(404).send(err));
});
  
// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const filtered = Object.values(books).filter(b => b.author === author);
  res.send(JSON.stringify(filtered, null, 4));
});

// Task 13: Get book details based on Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const filtered = Object.values(books).filter(b => b.title === title);
  res.send(JSON.stringify(filtered, null, 4));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;