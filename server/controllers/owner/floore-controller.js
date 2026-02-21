const Floor = require("../../models/Floor-model.js")
const Property = require("../../models/Property-Model.js")

const createFloor = async (req, res) => {
    try {
        const { propertyId, name, floorNumber, description } = req.body;

        const ownerId = req.user._id;

        const property = await Property.findOne({
            _id: propertyId,
            ownerId: ownerId
        });

        if (!property) {
            return res.status(404).json({ msg: "Property not found" });
        }
        const floor = await Floor.create({
            propertyId,
            name,
            floorNumber,
            description
        });
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

module.exports = { createFloor }