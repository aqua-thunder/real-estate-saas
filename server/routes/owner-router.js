const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const roleMiddleware = require("../middlewares/role-middleware");

const { registerOwner } = require("../controllers/owner/owner-controller.js");
const PropertyController = require("../controllers/owner/property-controller.js");

// Owner registration
router.post("/register", authMiddleware, roleMiddleware("OWNER"), registerOwner);

// Property Management (Allow OWNER and SUPER_ADMIN for testing/management)
router.post("/properties", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.createProperty);
router.get("/properties", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.getProperties);
router.put("/property/:id", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.updateProperty);
router.delete("/property/:id", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.deleteProperty);

module.exports = router;