const Location = require("../../models/Location-model");
const Owner = require("../../models/Owner-model");
const Property = require("../../models/Property-Model");

const createProperty = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, propertyType, location, address, totalUnit, isActive } = req.body;

        const owner = await Owner.findOne({ user: userId });

        if (!owner) {
            return res.status(400).json({ message: "Owner not found" });
        }

        if (!owner.isApproved) {
            console.log("Owner address:", owner.isApproved);
            return res.status(403).json({ message: "Owner not approved by admin" });
        }

        // Validate location
        const existingLocation = await Location.findById(location);
        if (!existingLocation) {
            return res.status(400).json({ message: "Invalid location" });
        }

        const property = await Property.create({
            owner: owner._id,
            name,
            propertyType,
            location,
            address,
            totalUnit,
            isActive
        });

        res.status(201).json({
            message: "Property created successfully",
            property
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const userId = req.user._id;
        const propertyId = req.params.id;

        // 1️⃣ Find owner
        const owner = await Owner.findOne({ user: userId });

        if (!owner) {
            return res.status(403).json({
                message: "Owner profile not found"
            });
        }

        // 2️⃣ Match property with Owner._id
        const property = await Property.findOne({
            _id: propertyId,
            owner: owner._id
        });

        if (!property) {
            return res.status(403).json({
                message: "You are not allowed to update this property"
            });
        }

        Object.assign(property, req.body);
        await property.save();

        res.status(200).json({
            message: "Property updated successfully",
            property
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const userId = req.user._id;      // from JWT
        const propertyId = req.params.id;

        // 1️⃣ Find owner profile using logged-in user
        const owner = await Owner.findOne({ user: userId });

        if (!owner) {
            return res.status(403).json({
                message: "Owner profile not found"
            });
        }

        // 2️⃣ Find property that belongs to this owner
        const property = await Property.findOne({
            _id: propertyId,
            owner: owner._id
        });

        if (!property) {
            return res.status(403).json({
                message: "You are not allowed to delete this property"
            });
        }
        // 4️⃣ Delete property
        await property.deleteOne();

        res.status(200).json({
            message: "Property deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createProperty, updateProperty, deleteProperty };
