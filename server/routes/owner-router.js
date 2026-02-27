const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const roleMiddleware = require("../middlewares/role-middleware");

const { registerOwner } = require("../controllers/owner/owner-controller.js");
const PropertyController = require("../controllers/owner/property-controller.js");
const FloorController = require("../controllers/owner/floore-controller.js")
const UnitController = require("../controllers/owner/unit-controller.js")

// Owner registration
router.post("/register", authMiddleware, roleMiddleware("OWNER"), registerOwner);

// Property Management (Allow OWNER and SUPER_ADMIN for testing/management)
router.post("/properties", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.createProperty);
router.get("/properties", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.getProperties);
router.put("/property/:id", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.updateProperty);
router.delete("/property/:id", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), PropertyController.deleteProperty);


// Floore Management
router.post("/floor", authMiddleware, roleMiddleware("OWNER"), FloorController.createFloor)
router.put("/floor/:id", authMiddleware, roleMiddleware("OWNER"), FloorController.updateFloor)
router.delete("/floor/:id", authMiddleware, roleMiddleware("OWNER"), FloorController.deleteFloor)
router.get("/floors", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), FloorController.getFloors)


// Unit Management
router.post("/unit", authMiddleware, roleMiddleware("OWNER"), UnitController.createUnit)
router.put("/unit/:id", authMiddleware, roleMiddleware("OWNER"), UnitController.updateUnit)
router.delete("/unit/:id", authMiddleware, roleMiddleware("OWNER"), UnitController.deleteUnit)
router.get("/units", authMiddleware, roleMiddleware("OWNER", "SUPER_ADMIN"), UnitController.getUnits)

module.exports = router;
