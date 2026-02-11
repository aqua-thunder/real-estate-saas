const Owner = require("../../models/Owner-model.js");

const registerOwner = async (req, res) => {
    try {
        const userId = req.user._id;

        // Only OWNER role can register owner profile
        if (req.user.role !== "OWNER") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { ownerType, companyName, contactNumber, address } = req.body;

        // Check if owner profile already exists
        const existingOwner = await Owner.findOne({ user: userId });
        if (existingOwner) {
            return res.status(400).json({ message: "Owner profile already exists" });
        }

        // Create owner profile (NOT approved yet)
        const owner = await Owner.create({
            user: userId,
            ownerType,
            companyName,
            contactNumber,
            address,
        });

        res.status(201).json({
            message: "Owner registered successfully. Await admin approval.",
            owner
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerOwner };
