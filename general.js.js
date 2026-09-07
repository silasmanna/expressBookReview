const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Username and password required." });
});

// Task 1 & Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks
    .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
    .catch((err) => res.status(500).json({ message: "Error retrieving books" }));
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 3 & Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let booksByAuthor = [];
    
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor.push({
          isbn: key,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    });

    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found by this author");
    }
  });

  getBooksByAuthor
    .then((result) => res.status(200).json({ booksbyauthor: result }))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 4 & Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let booksByTitle = [];

    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle.push({
          isbn: key,
          author: books[key].author,
          reviews: books[key].reviews
        });
      }
    });

    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle
    .then((result) => res.status(200).json({ booksbytitle: result }))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;