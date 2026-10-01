const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const moodModel = mongoose.model('moods', moodSchema);
module.exports = moodModel;
