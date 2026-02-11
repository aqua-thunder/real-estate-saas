const mongoose = require('mongoose')
const URI = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(URI)
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDb