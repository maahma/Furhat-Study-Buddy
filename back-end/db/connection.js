const mongoose = require("mongoose");
const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log("Connected to the MongoDB database")).catch((err) => console.log("Error connecting to the MongoDB database: ", err))