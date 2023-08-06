const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = "my secret key";
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records
    return users.filter(u => u.username === username && u.password === password).length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password || !authenticatedUser(username, password)) {
      return res.status(404).json({message: "Invalid username or password"});
  }
  let accessToken = jwt.sign({data: password}, secretKey, { expiresIn: 60 * 60 });

  req.session.authorization = { accessToken, username };
  return res.status(200).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  let review = req.body.review;
  books[isbn].reviews[username] = review;
  return res.status(300).json({message: `The reviews for the book with ISBN ${isbn} updated`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretKey = secretKey;
