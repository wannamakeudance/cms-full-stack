/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main",
    partialsDir: __dirname + "/views/partials"
}));
app.set("view engine", "handlebars");

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// Use the auth token middleware
app.use(require("./middleware/auth-middleware.js"));

// Use the toaster middleware
app.use(require("./middleware/toaster-middleware.js"));

// Setup routes
app.use(require("./routes/API.js"));
app.use(require("./routes/artilce-list-router.js"));
app.use(require("./routes/account-router"));
app.use(require("./routes/profile-router"));
app.use(require("./routes/article-router"));
app.use(require('./routes/notification-router'));

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});





