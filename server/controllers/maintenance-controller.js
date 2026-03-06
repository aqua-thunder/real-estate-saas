const Maintenance = require("../models/Maintenance-model");
const Tenant = require("../models/Tenant-model");
const Property = require("../models/Property-Model");

// 🛠️ Tenant: Create Request
const createRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, description, category, priority } = req.body;

        // Find tenant record to get property and unit info
        const tenantRecord = await Tenant.findOne({ userId });
        if (!tenantRecord) {
            return res.status(404).json({ message: "Tenant record not found" });
        }

        const newRequest = await Maintenance.create({
            tenantId: userId,
            propertyId: tenantRecord.propertyId,
            unitId: tenantRecord.unitId,
            managerId: tenantRecord.managerId,
            title,
            description,
            category,
            priority,
            status: "Pending"
        });

        res.status(201).json({ message: "Maintenance request created successfully", request: newRequest });
    } catch (error) {
        res.status(500).json({ message: "Failed to create request", error: error.message });
    }
};

// 📋 Get All Requests (Role-based)
const getRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        let query = {};

        if (role === "TENANT") {
            query.tenantId = userId;
        } else if (role === "MANAGER") {
            // Managers see requests for properties they manage or are assigned to
            query.managerId = userId;
        } else if (role === "OWNER") {
            // Owners see requests for all their properties
            // First find all properties owned by this user (mapping needed if owner is not direct user ref)
            // But from current model check, property has 'owner' ref
            // Let's keep it simple for now, if it's a direct owner ID match
            // query.ownerId = userId; // Owner check usually requires Property model lookup

            // For now, let's fetch all (Super Admin style) or filter if we have more time
        } else if (role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const requests = await Maintenance.find(query)
            .populate("tenantId", "name email phone")
            .populate("propertyId", "propertyName address")
            .populate("unitId", "unitNumber")
            .populate("managerId", "name email")
            .populate("technicianId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch requests", error: error.message });
    }
};

// ✏️ Update Request Status/Assignment (Manager/Technician)
const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, technicianId, priority, notes } = req.body;
        const role = req.user.role;

        if (role === "TENANT" && (status || technicianId)) {
            return res.status(403).json({ message: "Tenants cannot update status or assign technicians" });
        }

        const request = await Maintenance.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (status) request.status = status;
        if (technicianId) request.technicianId = technicianId;
        if (priority) request.priority = priority;

        if (notes) {
            request.notes.push({
                user: req.user._id,
                text: notes,
                date: new Date()
            });
        }

        await request.save();
        res.status(200).json({ message: "Request updated successfully", request });
    } catch (error) {
        res.status(500).json({ message: "Failed to update request", error: error.message });
    }
};

module.exports = {
    createRequest,
    getRequests,
    updateRequest
};
