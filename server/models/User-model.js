const mongoose = require('mongoose')

const user_Schema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
    },
    phone: {
        required: false,
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
        default: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    lastLoginAt: {
        type: Date,
    },

})

const User = new mongoose.model("User", user_Schema)
module.exports = User