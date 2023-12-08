const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const connectToDatabase = async () => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shhvx1o.mongodb.net/?retryWrites=true&w=majority`;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log("connected to mongodb");
    return client.db("hotelDB");
  } catch (error) {}
  console.error("Error connected to mongoDB",error);
  throw error
};
module.exports = connectToDatabase;