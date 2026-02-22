const Unit = require("../../models/Unit-model.js");
const Floor = require("../../models/Floor-model.js");
const Owner = require("../../models/Owner-model.js");
const Property = require("../../models/Property-Model.js");

const createUnit = async (req, res) => {
    try {
        const {
            propertyId,
            floorId,
            unitNumber,
            unitType,
            area,
            bedrooms,
            bathrooms,
            balcony,
            rentAmount,
            securityDeposit,
            maintenanceCharge,
            utilityIncluded,
            status,
            tenantId,
            leaseId,
            images,
            floorPlan,
            isActive
        } = req.body;

        const ownerUserId = req.user._id;
        const role = req.user.role;

        if (role !== "OWNER" && role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (role === "OWNER") {
            const owner = await Owner.findOne({ user: ownerUserId });
            if (!owner || property.owner.toString() !== owner._id.toString()) {
                return res.status(403).json({ message: "Unauthorized to add unit in this property" });
            }
        }

        const floor = await Floor.findOne({ _id: floorId, propertyId });
        if (!floor) {
            return res.status(404).json({ message: "Floor not found for this property" });
        }

        const unit = await Unit.create({
            propertyId,
            floorId,
            ownerId: ownerUserId,
            unitNumber,
            unitType,
            area,
            bedrooms,
            bathrooms,
            balcony,
            rentAmount,
            securityDeposit,
            maintenanceCharge,
            utilityIncluded,
            status,
            tenantId,
            leaseId,
            images,
            floorPlan,
            isActive
        });

        // Update Property totalUnit
        await Property.findByIdAndUpdate(propertyId, { $inc: { totalUnit: 1 } });

        res.status(201).json({ message: "Unit created successfully", unit });
    } catch (error) {
        res.status(500).json({ message: "Failed to create unit", error: error.message });
    }
};

const getUnits = async (req, res) => {
    try {
        const { propertyId, floorId } = req.query;
        const role = req.user.role;
        const userId = req.user._id;
        const query = {};

        if (propertyId) query.propertyId = propertyId;
        if (floorId) query.floorId = floorId;

        if (role === "OWNER") {
            query.ownerId = userId;
        } else if (role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const units = await Unit.find(query)
            .populate("propertyId", "propertyName")
            .populate("floorId", "name floorNumber");

        res.status(200).json({ message: "Units fetched successfully", units });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch units", error: error.message });
    }
};

module.exports = { createUnit, getUnits };
