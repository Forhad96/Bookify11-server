// src/controllers/roomController.js

const getRooms = async (req, res) => {
  try {
    const query = {};
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const filteredRooms = await req.app.locals.db
      .collection("rooms")
      .find(query)
      .toArray();

    res.send(filteredRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRoomById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await req.app.locals.db.collection("rooms").findOne(query);

    if (!result) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Additional controller functions for room-related operations can be added here

module.exports = {
  getRooms,
  getRoomById,
  // Add other functions here
};
