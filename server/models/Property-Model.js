const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        enum: ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"],
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
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
    isActive: {
        type: Boolean,
        required: true
    }
})

const Property = new mongoose.model("Property", propertySchema)
module.exports = Property