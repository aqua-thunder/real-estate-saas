const User = require("../../models/User-model.js")
const Owner = require("../../models/Owner-model.js")
const bcrypt = require("bcrypt")

const addUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" })
        }
        const useExists = await User.findOne({ email })
        if (useExists) {
            return res.status(400).json({ msg: "User is already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
        })

        // If the role is OWNER, automatically create an approved Owner profile
        if (role === "OWNER") {
            await Owner.create({
                user: newUser._id,
                ownerType: "INDIVIDUAL", // Default to individual
                contactNumber: phone || "0000000000",
                isApproved: true, // Admin created owners are auto-approved
                approvedBy: req.user._id // The admin who created them
            });
        }

        res.status(201).json({ msg: "User created successfully", newUser })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addUser, updateUser, deleteUser };