const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  let getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    }, 2000)
  })

  getBooks.then((response) => {
    return res.status(200).json(response);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let getBookByIsbn = new Promise((resolve, reject) => {
    setTimeout(() => {
      const isbn = req.params.isbn;
      const bookFiltered = books[isbn]
      resolve(bookFiltered)
    }, 2000)
  })

  getBookByIsbn.then((response) => {
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({ message: "Book doesn't exists" });
    }
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let getBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      const author = req.params.author;
      const booksFiltered = [];

      for (const [key, value] of Object.entries(books)) {
        if (value.author == author) {
          booksFiltered.push(value);
        }
      }
      resolve(booksFiltered)
    }, 2000)
  })

  getBooksByAuthor.then((response) => {
    if (response.length > 0) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({ message: "No Books Found" });
    }
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let getBooksByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      const title = req.params.title;
      const booksFiltered = [];

      for (const [key, value] of Object.entries(books)) {
        if (value.title == title) {
          booksFiltered.push(value);
        }
      }
      resolve(booksFiltered)
    }, 2000)
  })

  getBooksByTitle.then((response) => {
    if (response.length > 0) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({ message: "No Books Found" });
    }
  })

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const bookFiltered = books[isbn]

  if (bookFiltered) {
    return res.status(200).json(bookFiltered.reviews);
  } else {
    return res.status(404).json({ message: "Book doesn't exists" });
  }
});

module.exports.general = public_users;
