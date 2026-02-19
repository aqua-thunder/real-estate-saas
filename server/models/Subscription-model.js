const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },

    billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
        default: "monthly"
    },

    startDate: {
        type: Date,
        required: true
    },

    expiryDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["active", "expired", "cancelled", "blocked"],
        default: "active"
    }
})

module.exports = mongoose.model("Subscription", subscriptionSchema);