
const mongoose = require("mongoose")

const UnitSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },

    floorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
        required: true
    },

    // ownerId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    //     index: true
    // },

    unitNumber: {
        type: String, // A-101, Shop-3
        required: true
    },

    unitType: {
        type: String,
        enum: ["Flat", "Shop", "Office", "Warehouse", "Parking"],
        required: true
    },

    area: {
        type: Number // in sq ft
    },

    bedrooms: Number,
    bathrooms: Number,
    balcony: {
        type: Boolean,
        default: false
    },

    // Financial
    rentAmount: {
        type: Number,
        required: true
    },

    securityDeposit: {
        type: Number,
        default: 0
    },

    maintenanceCharge: {
        type: Number,
        default: 0
    },

    utilityIncluded: {
        type: Boolean,
        default: false
    },

    // Status
    status: {
        type: String,
        enum: ["Vacant", "Occupied", "Reserved", "Under Maintenance"],
        default: "Vacant"
    },



    // Media
    images: [
        {
            type: String // store image URL
        }
    ],

    floorPlan: {
        type: String // URL
    },

    isActive: {
        type: Boolean,
        default: true
    }
})

// Prevent duplicate unit number inside same property
UnitSchema.index(
    { propertyId: 1, unitNumber: 1 },
    { unique: true }
);

const Unit = mongoose.model("Unit", UnitSchema)
module.exports = Unit
