const express = require("express")
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware.js");
const roleMiddleware = require("../middlewares/role-middleware.js");

const locationController = require("../controllers/admin/location-controller.js");
const { approveOwner } = require("../controllers/admin/owner-approval-controller.js")

// Create locations
router.post("/locations", authMiddleware, roleMiddleware("SUPER_ADMIN"), locationController.createLocation);

// Get all locations
router.get("/locations", authMiddleware, roleMiddleware("SUPER_ADMIN"), locationController.getAllLocations);

// Update location
router.put("/locations/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), locationController.updateLocation);

// Enable / Disable location
router.patch("/locations/:id/toggle", authMiddleware, roleMiddleware("SUPER_ADMIN"), locationController.toggleLocationStatus);


// Approve Owner
router.patch("/owner/:ownerId/approve", authMiddleware, roleMiddleware("SUPER_ADMIN"), approveOwner)
module.exports = router; 