const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    studyHoursPerDay: Number,
    pomodoroDuration: Number,
    breakDuration: {
        short: Number,
        long: Number
    },
}, {timestamps: true});

const preferencedb = new mongoose.model("preferences", preferencesSchema);

module.exports = preferencedb;