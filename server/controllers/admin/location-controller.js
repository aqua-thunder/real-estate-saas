const Location = require("../../models/Location-model.js")


/**
 * CREATE LOCATION
 * Super Admin only
 */
const createLocation = async (req, res) => {
    try {
        const { country, state, city } = req.body;
        if (!country || !state || !city) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingLocation = await Location.findOne({
            country,
            state,
            city
        })
        if (existingLocation) {
            return res.status(400).json({ message: "Location is already exist" })
        }
        const generateLocation = await Location.create({ country, state, city })
        res.status(201).json({
            message: "Location created successfully",
            generateLocation,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET ALL LOCATION
 * Super Admin only
 */

const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find({ isActive: true }).sort({
            country: 1,
            state: 1,
            city: 1
        })
         if (!locations) {
            res.status(400).json({ msg: "No locations Found" })
        }
        res.status(200).json({ msg: locations })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


/**
 * UPDATE LOCATION
 * Super Admin only
 */
const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const location = await Location.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({
            message: "Location updated successfully",
            location,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ENABLE / DISABLE LOCATION
 * Super Admin only
 */
const toggleLocationStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const location = await Location.findById(id);

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        location.isActive = !location.isActive;
        await location.save();

        res.status(200).json({
            message: `Location ${location.isActive ? "enabled" : "disabled"
                } successfully`,
            location,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createLocation, getAllLocations, updateLocation, toggleLocationStatus }