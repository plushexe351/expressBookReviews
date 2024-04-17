const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let isUserAuthenticated = false;

  users.forEach(user => {
    if (user.username === username && user.password === password) {
      isUserAuthenticated = true;
    }
  })

  return isUserAuthenticated;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password not provided" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User logged in successfully", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!review) {
    res.status(400).json({ message: "Review not provided" })
  }

  if (books[isbn].reviews[username]) {
    books[isbn].review[username] = review;
    res.status(200).json({ message: "Review modified successfully" });
  }
  else {
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review created successfully" });
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.status(202).json({ message: "Review deleted successfully" })
  } else {
    res.status(404).json({ message: "This user has not posted a review" })
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
