const mongoose = require("mongoose")

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    priceMonthly: {
        type: Number,
        required: true
    },

    priceYearly: {
        type: Number,
        required: true
    },

    propertyLimit: {
        type: Number,
        required: true
    },

    unitLimit: {
        type: Number,
        required: true
    },

    managerLimit: {
        type: Number,
        required: true
    },

    storageLimitMB: {
        type: Number,
        default: 500
    },

    trialDays: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model("Plan", planSchema);