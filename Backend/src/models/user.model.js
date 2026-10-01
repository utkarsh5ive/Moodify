const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        unique: [true, "username must be unique"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email must be unique"]
    },
    password:{
        type: String,
        required: [true, "password is required"],
        select: false
    },
    preferences: {
        happy: { type: String, default: '' },
        sad: { type: String, default: '' },
        angry: { type: String, default: '' },
        surprised: { type: String, default: '' },
        neutral: { type: String, default: '' }
    }

})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel

