const mongoose = require('mongoose')

const FloorSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
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

// Prevent duplicate floor number inside same property
FloorSchema.index(
    { propertyId: 1, floorNumber: 1 },
    { unique: true }
);

const Floor = mongoose.model("Floor", FloorSchema)
module.exports = Floor