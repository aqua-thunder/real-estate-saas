const User = require("../models/User-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");



// *-----------------------
// * Register Logic
// *-----------------------
const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "TENANT",  // safe default
            phone
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                isBlocked: user.isBlocked,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// *-----------------------
// * Login Logic
// *-----------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked." });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Your account is inactive." });
        }


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Update last login timestamp
        user.lastLoginAt = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// *-----------------------
// * User Logic
// *-----------------------
const user = async (req, res) => {
    try {
        const userData = req.user
        console.log(userData)
        return res.status(200).json({ userData })
    } catch (error) {
        console.log("Error from the user root")
    }
}



const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            msg: users
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = { register, login, user, getAllUsers }