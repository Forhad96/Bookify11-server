// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDatabase = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const databaseRoutes = require("./routes/databaseRoutes");
const roomRoutes = require("./routes/roomRoutes");

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

// connect to the database
connectToDatabase()
  .then((db) => {
    app.locals.db = db;
    console.log("MongoDB connection established");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// routes
app.use("/auth", authRoutes);
app.use("/database", databaseRoutes);
app.use("/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.send("bookify is running");
});

app.listen(port, () => {
  console.log(`bookify Server is running on port ${port}`);
});
