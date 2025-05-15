import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  originalFilename: String,
  format: String, // e.g., jpg, mp4
  width: Number,
  thumbnailUrl: String,
  height: Number,
  duration: Number, // for videos
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Media = mongoose.model("Media", mediaSchema);
