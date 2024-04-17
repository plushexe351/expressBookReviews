const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Promise callback to get book list
const getBookList = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (error) {
      reject(error);
    }
  });
};

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBookList()
    .then((bookList) => {
      res.json(bookList);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookList()
    .then((bookList) => {
      if (bookList.hasOwnProperty(isbn)) {
        res.json(bookList[isbn]);
      } else {
        res.status(404).json({ message: `Book not found with ISBN - ${isbn}` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getBookList()
    .then((bookList) => {
      const filteredBooks = Object.values(bookList).filter(book => book.author === author);
      res.json(filteredBooks);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getBookList()
    .then((bookList) => {
      const filteredBooks = Object.values(bookList).filter(book => book.title === title);
      res.json(filteredBooks);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.json(books[isbn].reviews);
});

module.exports.general = public_users;
