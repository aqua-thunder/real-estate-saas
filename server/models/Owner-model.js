const mongoose = require("mongoose")
const ownerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    ownerType: {
        type: String,
        enum: ["INDIVIDUAL", "COMPANY"],
        required: true
    },

    companyName: {
        type: String,
        required: function () {
            return this.ownerType === "COMPANY";
        }
    },

    contactNumber: {
        type: String,
        required: true
    },

    address: {
        type: String
    },

    isApproved: {
        type: Boolean,
        default: false
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    { timestamps: true }
);

const Owner = new mongoose.model("Owner", ownerSchema);
module.exports = Owner