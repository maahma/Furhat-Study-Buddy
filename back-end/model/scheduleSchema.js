const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    preferences: { type: mongoose.Schema.Types.ObjectId, ref: 'Preferences', required: true }, // Reference to the Preferences
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], // Array of class IDs
    deadlines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deadlines' }] // Array of deadline IDs
});

const Schedule = mongoose.model('schedule', scheduleSchema);

module.exports = Schedule;