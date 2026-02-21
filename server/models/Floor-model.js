const mongoose = require('mongoose')

const FloorSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    floorNumber: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const Floor = mongoose.model("Floor", FloorSchema)
module.exports = Floor