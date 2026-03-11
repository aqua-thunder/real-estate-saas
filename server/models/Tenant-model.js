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

// Pre-validate hook to automatically set lease status based on dates
TenantSchema.pre("validate", async function () {
    try {
        // Only auto-update if status is not already manually changed to "Terminated"
        if (this.leaseStatus === "Terminated") {
            return;
        }

        if (!this.leaseStart || !this.leaseEnd) {
            return;
        }

        const currentDate = new Date();
        const start = new Date(this.leaseStart);
        const end = new Date(this.leaseEnd);

        // Basic check for invalid dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return;
        }

        if (currentDate > end) {
            this.leaseStatus = "Expired";
        } else if (currentDate >= new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)) {
            this.leaseStatus = "Expiring";
        } else if (currentDate >= start) {
            this.leaseStatus = "Active";
        }
    } catch (error) {
        console.error("Error in Tenant pre-validate hook:", error);
    }
});

// Static method to bulk update lease statuses for all tenants
TenantSchema.statics.autoUpdateStatuses = async function () {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Note: We avoid updating "Terminated" leases automatically

    // 1. Update to Expired
    await this.updateMany(
        { leaseEnd: { $lt: currentDate }, leaseStatus: { $ne: "Expired", $ne: "Terminated" } },
        { $set: { leaseStatus: "Expired" } }
    );

    // 2. Update to Expiring (within 30 days)
    await this.updateMany(
        {
            leaseEnd: { $gte: currentDate, $lte: thirtyDaysFromNow },
            leaseStatus: { $nin: ["Expiring", "Expired", "Terminated"] }
        },
        { $set: { leaseStatus: "Expiring" } }
    );

    // 3. Update to Active (if it was upcoming/anything else and is now in range)
    await this.updateMany(
        {
            leaseStart: { $lte: currentDate },
            leaseEnd: { $gte: currentDate },
            leaseStatus: { $nin: ["Active", "Expiring", "Terminated"] }
        },
        { $set: { leaseStatus: "Active" } }
    );
};

// Prevent duplicate tenant record for same user - property - unit combination
TenantSchema.index(
    { userId: 1, propertyId: 1, unitId: 1 },
    { unique: true }
);

const Tenant = mongoose.model("Tenant", TenantSchema);
module.exports = Tenant;
