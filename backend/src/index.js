import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/db.js";
import { app } from "./app.js";

// Load environment variables first
dotenv.config();

connectDB()
  .then(() => {
    // Store the server in a variable
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log("🌍 Server started at port", process.env.PORT || 8000);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
