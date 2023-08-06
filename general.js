const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function isUserExists(username) {
    return users.filter(u => u.username === username).length > 0;
}

function findBookBy(field, value) {
    let result = undefined;
    for (let isbn in books) {
        let book = books[isbn];
        if (book[field] === value) {
            result = book;
        }
    }
    return result;
}

public_users.post("/register", (req,res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    let status = 200;
    let message = "User successfully registred. Now you can login";
    if (username && password) {
        if (!isUserExists(username)) {
            users.push({username: username, password: password});
        } else {
            status = 404;
            message = `User ${username} is exist`;
        }
    } else {
        status = 400;
        message = 'Invalid username or password';
    }
    return res.status(status).json({message: message});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let result = findBookBy("author", author);
  if (result) {
    return res.json(result);
  } else {
      return res.status(404).json({message: `Author ${author} not found!`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let result = findBookBy("title", title);
  if (result) {
    return res.json(result);
  } else {
      return res.status(404).json({message: `Title ${author} not found!`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
