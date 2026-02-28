const Floor = require("../../models/Floor-model.js");
const Owner = require("../../models/Owner-model.js");
const Property = require("../../models/Property-Model.js");
const Unit = require("../../models/Unit-model.js");

const createFloor = async (req, res) => {
    try {
        const { propertyId, name, floorNumber, description } = req.body;
        const ownerUserId = req.user._id;
        const role = req.user.role;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ msg: "Property not found" });
        }

        if (role === "OWNER") {
            const owner = await Owner.findOne({ user: ownerUserId });
            if (!owner || property.owner.toString() !== owner._id.toString()) {
                return res.status(403).json({ msg: "Unauthorized to add floor in this property" });
            }
        }

        if (role !== "OWNER" && role !== "SUPER_ADMIN") {
            return res.status(403).json({ msg: "Unauthorized access" });
        }

        const floor = await Floor.create({
            propertyId,
            ownerId: ownerUserId,
            name,
            floorNumber,
            description
        });

        // Update Property totalFloors
        await Property.findByIdAndUpdate(propertyId, { $inc: { totalFloors: 1 } });

        return res.status(201).json({
            msg: "Floor created successfully",
            floor
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};

const updateFloor = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const role = req.user.role;

        if (role !== "OWNER" && role !== "SUPER_ADMIN") {
            return res.status(403).json({ msg: "Unauthorized access" });
        }

        const floor = await Floor.findById(id);
        if (!floor) {
            return res.status(404).json({ msg: "Floor not found" });
        }

        const property = await Property.findById(floor.propertyId);
        if (!property) {
            return res.status(404).json({ msg: "Property not found for this floor" });
        }

        if (role === "OWNER") {
            const owner = await Owner.findOne({ user: userId });
            if (!owner || property.owner.toString() !== owner._id.toString()) {
                return res.status(403).json({ msg: "Unauthorized to update floor in this property" });
            }
        }

        const allowedFields = ["name", "floorNumber", "description", "isActive"];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                floor[field] = req.body[field];
            }
        });

        await floor.save();

        return res.status(200).json({
            msg: "Floor updated successfully",
            floor
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: "Floor number already exists in this property" });
        }
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};

const deleteFloor = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const role = req.user.role;

        if (role !== "OWNER" && role !== "SUPER_ADMIN") {
            return res.status(403).json({ msg: "Unauthorized access" });
        }

        const floor = await Floor.findById(id);
        if (!floor) {
            return res.status(404).json({ msg: "Floor not found" });
        }

        const property = await Property.findById(floor.propertyId);
        if (!property) {
            return res.status(404).json({ msg: "Property not found for this floor" });
        }

        if (role === "OWNER") {
            const owner = await Owner.findOne({ user: userId });
            if (!owner || property.owner.toString() !== owner._id.toString()) {
                return res.status(403).json({ msg: "Unauthorized to delete floor in this property" });
            }
        }

        const unitExists = await Unit.exists({ floorId: id });
        if (unitExists) {
            return res.status(400).json({ msg: "Cannot delete floor with existing units" });
        }

        await floor.deleteOne();
        await Property.findByIdAndUpdate(floor.propertyId, { $inc: { totalFloors: -1 } });

        return res.status(200).json({ msg: "Floor deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

const getFloors = async (req, res) => {
    try {
        const { propertyId } = req.query;
        const role = req.user.role;
        const userId = req.user._id;
        const query = {};

        if (propertyId) {
            query.propertyId = propertyId;
        }

        if (role === "OWNER") {
            query.ownerId = userId;
        } else if (role !== "SUPER_ADMIN" && role !== "MANAGER") {
            return res.status(403).json({ msg: "Unauthorized access" });
        }

        const floors = await Floor.find(query).populate("propertyId", "propertyName");
        return res.status(200).json({
            msg: "Floors fetched successfully",
            floors
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};

module.exports = { createFloor, updateFloor, deleteFloor, getFloors };
