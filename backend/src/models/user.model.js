import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
