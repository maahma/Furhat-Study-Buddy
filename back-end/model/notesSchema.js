import mongoose from 'mongoose';

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

const Notes = new mongoose.model("notes", notesSchema);

export default Notes;