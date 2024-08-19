const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    answerText: String,
}, { _id: false });

const questionSchema = new mongoose.Schema({
    questionText: String,
    answer: answerSchema
}, { _id: false });

const quizSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    notes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notes',
        required: true
    },

    questions: [questionSchema],
}, {timestamps: true});

const quizdb = new mongoose.model("quiz", quizSchema);
const notesdb = require("./notesSchema");

module.exports = { quizdb, notesdb }