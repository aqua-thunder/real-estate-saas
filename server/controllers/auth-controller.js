const User = require("../models/User-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");



// *-----------------------
// * Register Logic
// *-----------------------
const register = async (req, res) => {
    try {
        const { name, email, password, role, isActive } = req.body;
        if (!name, !email, !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "User is already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: hashedPassword, role, isActive
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



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

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

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
        return res.status(200).json({userData})
    } catch (error) {
        console.log("Error from the user root")
    }
}

module.exports = { register, login, user }