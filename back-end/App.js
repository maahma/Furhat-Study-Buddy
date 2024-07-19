require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const PORT = 6005;
require("./db/connection")

app.use(cors({
    origin: "http://localhost:3001/",
    methods:"GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json("Start server")
});

app.listen(process.env.PORT, () => {
    console.log("Connected to MongoDB and listening on port", process.env.PORT)
})