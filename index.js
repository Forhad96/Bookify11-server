const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: ["https://bookify007.web.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shhvx1o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// my created middle ware

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized Access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized Access" });
    }
    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//  bookify::Database
const database = client.db("hotelDB");
// Database::Collection
const hotelsCollection = database.collection("hotels");
const roomsCollection = database.collection("rooms");
const bookingsCollection = database.collection("bookings");

// Auth related api
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send({ success: true });
  // console.log({ token });
  console.log(user);
});

app.post("/logout", async (req, res) => {
  const user = req.body;
  // console.log(user);
  res.clearCookie("token", { maxAge: 0 }).send({ success: true });
});

// DataBase Related api

// Get::Method

// get all hotels
app.get("/hotels", async (req, res) => {
  try {
    const result = await hotelsCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// GET single hotel
app.get("/hotels/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await hotelsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

//All_Rooms http://localhost:3000/rooms
//Filter room by price range http://localhost:3000/rooms?minPrice=200&maxPrice=400
app.get("/rooms", async (req, res) => {
  try {
    const query = {};
    // filter range query
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);

    //  if (isNaN(minPrice) || isNaN(maxPrice)) {
    //    return res.status(400).json({ error: "Invalid price range parameters" });
    //  }
    //  else{
    //   query.price = { $gte: minPrice, $lte: maxPrice }

    //  }
    if (minPrice || maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const filteredRooms = await roomsCollection.find(query).toArray();

    res.send(filteredRooms);
  } catch (error) {
    console.log(error);
  }
});

//Single_Room http://localhost:3000/rooms/65468ba72c31b3dff3acba70
app.get("/rooms/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await roomsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});
// get all bookings localhost:5000/bookings
// and get user specific data via email localhost:5000/bookings?email=teamdot@gamil.com

http: app.get("/bookings", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== req.query.email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email };
    }
    const result = await bookingsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// Post::method
app.post("/bookings", async (req, res) => {
  try {
    const booking = req.body;
    const result = await bookingsCollection.insertOne(booking);
    res.send(result);
  } catch (error) {}
});

// add new review api
app.post("/rooms/:reviewId", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.reviewId) };
    const review = req.body;
    const newReview = {
      $push: { reviews: review },
    };

    const result = await roomsCollection.updateOne(query, newReview);
    res.send(result);
    console.log(query, review);
  } catch (error) {
    console.log(error);
  }
});

// Put::Method

// Patch::Method

// update Availability value
app.patch(`/rooms/:id`, async (req, res) => {
  try {
    const dateObj = req.body;
    const query = { _id: new ObjectId(req.params.id) };
    const availability = Number(req.query.availability);
    const newAvailability = {
      $set: {
        availability,
        bookedDates: [dateObj],
      },
    };
    const result = await roomsCollection.updateOne(query, newAvailability);

    res.send(result);
    console.log(availability);
  } catch (error) {
    console.log(error);
  }
});

// Delete::Method

// delete booking data
app.delete(`/bookings/:id`, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await bookingsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send("bookify is running");
});

app.listen(port, () => {
  console.log(`bookify Server is running on port ${port}`);
});
