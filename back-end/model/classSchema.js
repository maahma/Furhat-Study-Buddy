const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },

    starttime: {
        type: String,
        required: true
    },

    endtime: {
        type: String,
        required: true
    },

    repeat: {
        type: Boolean,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});

const classdb = new mongoose.model("classes", classSchema);

module.exports = classdb;