const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;



// middleware
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shhvx1o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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

// # Get all documents from the "users" collection
// # Get a single document from the "users" collection by its ID
// # Create a new document in the "users" collection
// # Update a single document in the "users" collection by its ID
// # Delete a single document from the "users" collection by its ID

// Assignment 11::Database
const database = client.db("hotelDB");
// Database::Collection
const roomsCollection = database.collection("rooms");

// Get::Method


// app.get("/rooms", async (req, res) => {
//   try {
//     const result = await roomsCollection.find().toArray();
//     res.send(result);
//   } catch (error) {
//     console.log(error);
//   }
// });
//Get::All_Rooms
// Filter room by price range http://localhost:3000/rooms?minPrice=200&maxPrice=400
app.get("/rooms", async (req, res) => {
  try {
    const query = {}
 const minPrice = Number(req.query.minPrice);
 const maxPrice = Number(req.query.maxPrice);

//  if (isNaN(minPrice) || isNaN(maxPrice)) {
//    return res.status(400).json({ error: "Invalid price range parameters" });
//  }
//  else{
//   query.price = { $gte: minPrice, $lte: maxPrice }
  
//  }
if(minPrice || maxPrice){
    query.price = { $gte: minPrice, $lte: maxPrice }
}


 const filteredRooms = await roomsCollection.find(query).toArray();

 res.send(filteredRooms);
  } catch (error) {
    console.log(error);
  }
});

//Get::Single_Room
app.get("/rooms/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(typeof id);
    const query = { _id: new ObjectId(id) };
    const result = await roomsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// Post::Method
app.post('/rooms/:id',async(req,res)=>{
  try{
    const query = {_id: new ObjectId(req.params.id)}
    const review = req.body;
    // const options = {upsert:true}
    const newReview = {
      $push: { reviews: review },
    };

const result = await roomsCollection.updateOne(query,newReview)
res.send(result)
console.log(query,review);
  }catch(error){
    console.log(error);
  }
})

// Put::Method
// Patch::Method
// Delete::Method

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
