const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const auth_users = require('./router/auth_users.js');
const genl_routes = require('./router/general.js').general;

const app = express();
const secretKey = auth_users.secretKey;

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

function checkUser(req) {
    if (!req.session.authorization) {
        return null;
    }
    let token = req.session.authorization.accessToken;
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    let user = checkUser(req);
    if (user == null) {
        req.statusCode(403).json({message: "Invalid user"});
        return;
    }
    req.user = user;
    next();
});
 
const PORT =5000;

app.use("/customer", auth_users.authenticated);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
