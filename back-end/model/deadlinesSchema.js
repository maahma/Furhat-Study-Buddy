import mongoose from 'mongoose';

const deadlineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});

const Deadlines = new mongoose.model("deadlines", deadlineSchema);

export default Deadlines;