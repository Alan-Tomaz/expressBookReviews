const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/', async function (req, res) {
  //Write your code here
  try {

    let getBooks = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books) {
          resolve(books)
        } else {
          reject({ message: "No Books Found" })
        }
      }, 2000)
    })

    let response = await getBooks;
    return res.status(200).json(response);

  } catch (error) {
    return res.status(404).json(error);

  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;

    if (!isbn) {
      return res.status(404).json({ message: "Please provide an ISBN" });
    }

    let getBookByIsbn = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!books) {
          reject({ message: "No Books Found" })
          return;
        }

        const bookFiltered = books[isbn]


        if (bookFiltered) {
          resolve(bookFiltered)
        } else {
          reject({ message: "Book doesn't exists" })
        }
      }, 2000)
    })

    let response = await getBookByIsbn;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json(error);
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;

    if (!author) {
      return res.status(404).json({ message: "Please provide an author name" });
    }


    let getBooksByAuthor = new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksFiltered = [];

        if (!books) {
          reject({ message: "No Books Found" })
          return;
        }
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

    let response = await getBooksByAuthor;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json(error);
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {

    const title = req.params.title;

    if (!title) {
      return res.status(404).json({ message: "Please provide a title" });
    }


    let getBooksByTitle = new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksFiltered = [];

        if (!books) {
          reject({ message: "No Books Found" })
          return;
        }
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
    let response = await getBooksByTitle;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json(error);
  }
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
