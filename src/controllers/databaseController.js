// src/controllers/databaseController.js
const { ObjectId } = require("mongodb");

// Example of a controller function that requires authentication
const getBookings = async (req, res) => {
  try {
    if (req.user.email !== req.query.email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }

    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email };
    }

    const result = await req.app.locals.db
      .collection("bookings")
      .find(query)
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Example of a controller function that does not require authentication
const createBooking = async (req, res) => {
  try {
    const booking = req.body;
    const result = await req.app.locals.db
      .collection("bookings")
      .insertOne(booking);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Additional controller functions for other database-related operations can be added here

module.exports = {
  getBookings,
  createBooking,
  // Add other functions here
};
