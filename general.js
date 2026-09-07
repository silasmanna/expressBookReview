const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Task 6: Register User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user." });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using Async/Await & Axios
const getAllBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Get book details based on ISBN using Axios Promise
const getBookByISBN = (isbn) => {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => console.error("Error fetching book by ISBN:", error));
};

// Task 3: Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push({
        isbn: key,
        author: books[key].author,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 12: Get book details based on Author using Axios Promise
const getBooksByAuthor = (author) => {
  return axios.get(`http://localhost:5000/author/${author}`)
    .then(response => response.data)
    .catch(error => console.error("Error fetching books by Author:", error));
};

// Task 4: Get book details based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push({
        isbn: key,
        author: books[key].author,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 13: Get book details based on Title using Axios Promise
const getBooksByTitle = (title) => {
  return axios.get(`http://localhost:5000/title/${title}`)
    .then(response => response.data)
    .catch(error => console.error("Error fetching books by Title:", error));
};

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
