const Owner = require("../../models/Owner-model.js");


// Get all owner

const getOwner = async (req, res) => {
    try {
        const owners = await Owner.find().sort({ createdAt: -1 });

        return res.status(200).json({
            msg: owners
        });

    } catch (error) {
        console.log("Error fetching owners:", error);
        return res.status(500).json({
            message: "Failed to fetch owners"
        });
    }
};



// Approve Owner from Super Admin
const approveOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // Find owner by ID
        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        if (owner.isApproved) {
            return res.status(400).json({ message: "Owner is already approved" });
        }

        // Approve owner
        owner.isApproved = true;
        owner.approvedBy = req.user._id; // admin user
        await owner.save();

        res.status(200).json({
            message: "Owner approved successfully",
            owner
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { approveOwner, getOwner };
