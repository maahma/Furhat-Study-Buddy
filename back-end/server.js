require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/connection");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

app.use(cors({
    origin: "http://localhost:3001/",
    methods:"GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());

// SETUP SESSION
app.use(session({
    secret: "furhatapp1234567890",
    resave: false,
    saveUninitialized: true
}))

// app.get("/", (req, res) => {
//     res.status(200).json("Start server")
// });

app.listen(process.env.PORT, () => {
    console.log("Connected to MongoDB and listening on port", process.env.PORT)
})