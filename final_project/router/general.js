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
      if (books) {
        resolve(books)
      } else {
        reject({ message: "No Books Found" })
      }
    }, 2000)
  })

  getBooks.then((response) => {
    return res.status(200).json(response);
  })
    .catch((error) => {
      return res.status(404).json(error);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let getBookByIsbn = new Promise((resolve, reject) => {
    setTimeout(() => {
      const isbn = req.params.isbn;
      const bookFiltered = books[isbn]
      if (bookFiltered.length > 0) {
        resolve(bookFiltered)
      } else {
        reject({ message: "Book doesn't exists" })
      }
    }, 2000)
  })

  getBookByIsbn.then((response) => {
    return res.status(200).json(response);
  }).catch((error) => {
    return res.status(404).json(error);
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
      if (booksFiltered.length > 0) {
        resolve(booksFiltered)
      } else {
        reject({ message: "No Books Found" })
      }
    }, 2000)
  })

  getBooksByAuthor.then((response) => {
    return res.status(200).json(response);
  }).catch((error) => {
    return res.status(404).json(error);
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
      if (booksFiltered.length > 0) {
        resolve(booksFiltered)
      } else {
        reject({ message: "No Books Found" })
      }
    }, 2000)
  })

  getBooksByTitle.then((response) => {
    return res.status(200).json(response);
  }).catch((error) => {
    return res.status(404).json(error);
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
