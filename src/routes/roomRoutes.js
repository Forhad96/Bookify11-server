// src/routes/roomRoutes.js
const express = require("express");
const roomController = require("../controllers/roomController");

const router = express.Router();

// GET all rooms
router.get("/", roomController.getRooms);

// GET a specific room by ID
router.get("/:id", roomController.getRoomById);

// Additional routes for room-related operations can be added here

module.exports = router;
