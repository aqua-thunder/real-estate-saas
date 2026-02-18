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
            description,
            location,
            address,
            city,
            state,
            zipCode,
            country,
            totalFloors,
            totalUnit,
            isActive
        } = req.body;

        // 1️⃣ Find Owner by user field, not _id
        let owner = await Owner.findOne({ user: userId });

        if (!owner) {
            // Safety: Handle existing users with OWNER role who might be missing a profile record
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

        // 2️⃣ Check isApproved (based on model)
        if (!owner.isApproved) {
            return res.status(403).json({
                message: "Owner not approved by admin"
            });
        }

        // 3️⃣ Calculate default values
        const occupiedUnits = 0;
        const vacantUnits = totalUnit || 0; // initially all vacant
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
            totalFloors,
            totalUnit,
            occupiedUnits,
            vacantUnits,
            totalRevenue: 0,
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

            // Safety: If an OWNER user exists but has no Owner profile, create one
            if (!owner) {
                owner = await Owner.create({
                    user: userId,
                    ownerType: "INDIVIDUAL",
                    contactNumber: req.user.phone || "0000000000",
                    isApproved: true, // Existing owners are considered approved
                });
            }
            query = { owner: owner._id };
        } else if (role === "SUPER_ADMIN") {
            // Admin sees all properties
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

        // Authorization check
        if (role === "OWNER") {
            const owner = await Owner.findOne({ user: userId });
            if (!owner || property.owner.toString() !== owner._id.toString()) {
                return res.status(403).json({ message: "You are not allowed to update this property" });
            }
        }

        // Allowed fields only
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
            "totalFloors",
            "totalUnit",
            "isActive"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });

        // Recalculate vacant units if total units changed
        if (req.body.totalUnit !== undefined) {
            property.vacantUnits = req.body.totalUnit - (property.occupiedUnits || 0);
        }

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

        // Authorization check
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
