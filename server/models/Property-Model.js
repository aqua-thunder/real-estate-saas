const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    propertyName: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        enum: ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    totalUnit: {
        type: Number,
        required: true
    },
    occupiedUnits: {
        type: Number,
        default: 0
    },

    vacantUnits: {
        type: Number,
        default: 0
    },

    revenue: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
})

const Property = new mongoose.model("Property", propertySchema)
module.exports = Property