const Location = require("../../models/Location-model");
const Owner = require("../../models/Owner-model");
const Property = require("../../models/Property-Model");

const createProperty = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("Owner data", userId);

        const {
            propertyName,
            propertyType,
            location,
            address,
            totalUnit,
            isActive
        } = req.body;

        // 1️⃣ Find Owner directly by _id
        const owner = await Owner.findById(userId);

        if (!owner) {
            return res.status(400).json({ message: "Owner not found" });
        }

        // 2️⃣ Check approvalStatus (UPDATED)
        if (owner.approvalStatus !== "APPROVED") {
            return res.status(403).json({
                message: "Owner not approved by admin"
            });
        }

        // 3️⃣ Calculate default values
        const occupiedUnits = 0;
        const vacantUnits = totalUnit; // initially all vacant
        const revenue = 0; // initially no revenue

        const property = await Property.create({
            owner: owner._id,
            propertyName,
            propertyType,
            location,        // string now
            address,
            totalUnit,
            occupiedUnits,
            vacantUnits,
            revenue,
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

        const owner = await Owner.findById(userId);

        if (!owner) {
            return res.status(403).json({
                message: "Owner profile not found"
            });
        }

        if (owner.approvalStatus !== "APPROVED") {
            return res.status(403).json({
                message: "Owner not approved"
            });
        }

        const property = await Property.findOne({
            _id: propertyId,
            owner: owner._id
        });

        if (!property) {
            return res.status(403).json({
                message: "You are not allowed to update this property"
            });
        }

        // Allowed fields only
        const allowedFields = [
            "propertyName",
            "propertyType",
            "location",
            "address",
            "totalUnit",
            "isActive"
        ];

        allowedFields.forEach(field => {
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
        const propertyId = req.params.id;

        const owner = await Owner.findById(userId);

        if (!owner) {
            return res.status(403).json({
                message: "Owner profile not found"
            });
        }

        const property = await Property.findOne({
            _id: propertyId,
            owner: owner._id
        });

        if (!property) {
            return res.status(403).json({
                message: "You are not allowed to delete this property"
            });
        }

        await property.deleteOne();

        res.status(200).json({
            message: "Property deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createProperty, updateProperty, deleteProperty };
