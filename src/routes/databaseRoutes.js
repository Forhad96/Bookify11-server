// src/routes/databaseRoutes.js
const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const databaseController = require("../controllers/databaseController");

const router = express.Router();

// Example of a route that requires authentication
router.get("/bookings", verifyToken, databaseController.getBookings);

// Example of a route that does not require authentication
router.post("/bookings", databaseController.createBooking);

// Additional routes for database-related operations can be added here

module.exports = router;
