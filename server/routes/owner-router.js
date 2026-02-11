const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const roleMiddleware = require("../middlewares/role-middleware");

const { registerOwner } = require("../controllers/owner/owner-controller.js");
const  PropertyController  = require("../controllers/owner/property-controller.js")

// Owner registration
router.post("/register", authMiddleware, roleMiddleware("OWNER"), registerOwner);
router.post("/properties", authMiddleware, roleMiddleware("OWNER"), PropertyController.createProperty);
router.put("/property/:id", authMiddleware, roleMiddleware("OWNER"), PropertyController.updateProperty)
router.delete("/property/:id", authMiddleware, roleMiddleware("OWNER"), PropertyController.deleteProperty)
module.exports = router;