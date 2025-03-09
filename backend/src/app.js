// Manage middleware and routes

var express = require('express');
var cors = require('cors');
var routes = require('./routes/index.js');
const session = require("express-session");
const passport = require("./auth/steamAuth");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

// Set up ejs
app.set("view engine", "ejs");

// Session middleware
app.use(
    session({
      secret: "tinul hensem", // Change this to a strong secret key
      resave: false,
      saveUninitialized: true,
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes); // All API routes start with /api
app.use("/auth", authRoutes); // Steam auth routes
app.use("/profile", profileRoutes);

module.exports = app;