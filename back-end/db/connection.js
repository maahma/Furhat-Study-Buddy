import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
let DB = process.env.DATABASE;

if (!DB) {
    console.error("MongoDB connection string is missing. Please check your .env file.");
}

if (process.env.NODE_ENV === "testing") {
    DB = process.env.MONGO_URI_TEST;
}

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log("Connected to the MongoDB database")).catch((err) => console.log("Error connecting to the MongoDB database: ", err))
