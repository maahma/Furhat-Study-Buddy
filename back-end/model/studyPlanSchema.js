const mongoose = require('mongoose');

console.log("INSIDE STUDYPLANSCHEMA!!!!!!!")

const sessionSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    task: { type: String, required: true }
});
  
const generatedScheduleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    sessions: [sessionSchema]
});

const studyPlanSchema = mongoose.model('studyPlan', generatedScheduleSchema);

module.exports = studyPlanSchema;