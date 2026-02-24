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
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).send("Error retrieving books");
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject({status: 404, message: "Book not found"});
  });

  getBookByISBN
    .then(book => res.send(JSON.stringify(book, null, 4)))
    .catch(err => res.status(err.status).send(err.message));
});
  
// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve) => {
    const filtered = Object.values(books).filter(b => b.author === author);
    resolve(filtered);
  });

  getBooksByAuthor.then(result => res.send(JSON.stringify(result, null, 4)));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve) => {
    const filtered = Object.values(books).filter(b => b.title === title);
    resolve(filtered);
  });

  getBooksByTitle.then(result => res.send(JSON.stringify(result, null, 4)));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;