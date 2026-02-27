const Owner = require("../../models/Owner-model");
const Property = require("../../models/Property-Model");

const createProperty = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            propertyName,
            propertyType,
            description,
            location,
            address,
            city,
            state,
            zipCode,
            country,
            isActive
        } = req.body;

        let owner = await Owner.findOne({ user: userId });

        if (!owner) {
            if (req.user.role === "OWNER" || req.user.role === "SUPER_ADMIN") {
                owner = await Owner.create({
                    user: userId,
                    ownerType: "INDIVIDUAL",
                    contactNumber: req.user.phone || "0000000000",
                    isApproved: true,
                    approvedBy: userId
                });
            } else {
                return res.status(400).json({ message: "Owner profile not found" });
            }
        }

        if (!owner.isApproved) {
            return res.status(403).json({
                message: "Owner not approved by admin"
            });
        }

        const property = await Property.create({
            owner: owner._id,
            propertyName,
            propertyType,
            description,
            location,
            address,
            city,
            state,
            zipCode,
            country,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            message: "Property created successfully",
            property
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProperties = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let query = {};

        if (role === "OWNER") {
            let owner = await Owner.findOne({ user: userId });

            if (!owner) {
                owner = await Owner.create({
                    user: userId,
                    ownerType: "INDIVIDUAL",
                    contactNumber: req.user.phone || "0000000000",
                    isApproved: true
                });
            }
            query = { owner: owner._id };
        } else if (role === "SUPER_ADMIN") {
            query = {};
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const properties = await Property.find(query).populate({
            path: "owner",
            select: "companyName ownerType",
            populate: {
                path: "user",
                select: "name"
            }
        });

        res.status(200).json({
            message: "Properties fetched successfully",
            properties
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        const propertyId = req.params.id;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (role === "OWNER") {
            const owner = await Owner.findOne({ user: userId });
            if (!owner || property.owner.toString() !== owner._id.toString()) {
                return res.status(403).json({ message: "You are not allowed to update this property" });
            }
        }

        const allowedFields = [
            "propertyName",
            "propertyType",
            "description",
            "location",
            "address",
            "city",
            "state",
            "zipCode",
            "country",
            "isActive"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });

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
        const userId = req.user._id;
        const role = req.user.role;
        const propertyId = req.params.id;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (role === "OWNER") {
            const owner = await Owner.findOne({ user: userId });
            if (!owner || property.owner.toString() !== owner._id.toString()) {
                return res.status(403).json({ message: "You are not allowed to delete this property" });
            }
        }

        await property.deleteOne();

        res.status(200).json({
            message: "Property deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProperty, updateProperty, deleteProperty, getProperties };
