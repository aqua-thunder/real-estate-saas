const mongoose = require('mongoose')

const user_Schema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    role: {
        type: String,
        enum: [
            "SUPER_ADMIN",
            "OWNER",
            "MANAGER",
            "TENANT",
            "TECHNICIAN",
        ],
        default: "TENANT",
    },
    isActive: {
        type: Boolean,
    }
})

const User = new mongoose.model("User", user_Schema)
module.exports = User