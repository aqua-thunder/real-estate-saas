const mongoose = require('mongoose')

const TenantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
        index: true
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true,
        index: true
    },
    floorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // Lease Details
    leaseStart: {
        type: Date,
        required: true
    },
    leaseEnd: {
        type: Date,
        required: true
    },
    leaseStatus: {
        type: String,
        enum: ["Active", "Expiring", "Expired", "Terminated"],
        default: "Active"
    },

    // 💰 Financials
    rent: {
        type: Number,
        required: true,
        min: 0
    },
    deposit: {
        type: Number,
        default: 0,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ["Paid", "Pending"],
        default: "Pending"
    },

    // Aggregated Records (Shown in UI)
    totalCollected: {
        type: Number,
        default: 0,
        min: 0
    },
    pending: {
        type: Number,
        default: 0,
        min: 0
    },
    maintenanceCost: {
        type: Number,
        default: 0,
        min: 0
    },
    lateFees: {
        type: Number,
        default: 0,
        min: 0
    },

    // Maintenance
    maintenanceRequests: {
        type: Number,
        default: 0
    },
    openRequests: {
        type: Number,
        default: 0
    },

    // Metadata
    avatar: {
        type: String // Initials or Image PATH/URL
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Prevent duplicate tenant record for same user - property - unit combination
TenantSchema.index(
    { userId: 1, propertyId: 1, unitId: 1 },
    { unique: true }
);

const Tenant = mongoose.model("Tenant", TenantSchema);
module.exports = Tenant;
