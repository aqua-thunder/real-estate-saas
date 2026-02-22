const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },

    // 📌 Basic Info
    propertyName: {
        type: String,
        required: true,
        trim: true
    },

    propertyType: {
        type: String,
        enum: ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"],
        required: true
    },

    description: {
        type: String
    },

    location: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: String,
    state: String,
    zipCode: String,
    country: String,

    // 🏢 Structure
    totalFloors: {
        type: Number,
        default: 0
    },

    totalUnit: {
        type: Number,
        default: 0
    },


    // 🖼 Property Images
    images: [
        {
            url: String,
            publicId: String
        }
    ],

    // 📂 Documents
    documents: [
        {
            name: String,
            fileUrl: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    // ⚙ Status
    isActive: {
        type: Boolean,
        default: true
    }

})

// Prevent duplicate property name per owner
propertySchema.index(
    { owner: 1, propertyName: 1 },
    { unique: true }
);

const Property = mongoose.model("Property", propertySchema)
module.exports = Property