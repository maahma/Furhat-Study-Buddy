const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    notes: {
        type: String,
        required: true
    }
}, {timestamps: true});

const notesdb = new mongoose.model("notes", notesSchema);

module.exports = notesdb;