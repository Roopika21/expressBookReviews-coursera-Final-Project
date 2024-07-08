const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//valid username
const isValid = (username)=>{ //returns boolean
let filtered_users = users.filter((user)=> user.username === user);
    if(filtered_users){
        return true;
    }
    return false;
}

//authenticate username and password
const authenticatedUser = (username,password)=>{ //returns boolean
if(isValid(username)){
        let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
        if(filtered_users){
            return true;
        }
        return false;
       
    }
    return false;
    

}

//register new user
regd_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if(username&&password){
        const present = users.filter((user)=> user.username === username)
        if(present.length===0){
            users.push({"username":req.body.username,"password":req.body.password});
            return res.status(201).json({message:"New user created successfully"})
        }
        else{
          return res.status(400).json({message:"User already exists"})
        }
    }
    else if(!username && !password){
      return res.status(400).json({message:"Check username and Password!"})
    }
    else if(!username || !password){
      return res.status(400).json({message:"Check username and password"})
    }
  
   
  });

//only registered users can login
regd_users.post("/login", (req,res) => {
  let user = req.body.username;
    let pass = req.body.password;
    if(!authenticatedUser(user,pass)){
        return res.status(403).json({message:"User not authenticated"})
    }

    let accessToken = jwt.sign({
        data: user
    },'access',{expiresIn:60*60})
    req.session.authorization = {
        accessToken
    }
    res.send("User logged in Successfully")
 
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 let userd = req.session.username;
  let ISBN = req.params.isbn;
  let details = req.query.review;
  let rev = {user:userd,review:details}
  books[ISBN].reviews = rev;
  return res.status(201).json({message:"New review added successfully!"})
  
});

//delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let ISBN = req.params.isbn;
    books[ISBN].reviews = {}
    return res.status(200).json({messsage:"Review has been deleted!"})

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
