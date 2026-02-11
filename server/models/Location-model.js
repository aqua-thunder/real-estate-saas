const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
    {
        country: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,   // ✅ important
        },
    },
    { timestamps: true }
);

LocationSchema.index(
    { country: 1, state: 1, city: 1 },
    { unique: true }
);

module.exports = mongoose.model("Location", LocationSchema);
