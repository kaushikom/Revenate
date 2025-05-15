import { Media } from "../models/media.model.js";
import { User } from "../models/user.model.js";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";

// Cloudinary helper
const uploadToCloudinary = (fileBuffer, folder, resourceType = "image") =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: resourceType, folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });

// Polling helper
const pollForVideo = async (
  generationId,
  apiKey,
  maxRetries = 60,
  delay = 10000
) => {
  for (let i = 0; i < maxRetries; i++) {
    const response = await axios.get(
      `https://api.aimlapi.com/v2/generate/video/runway/generation`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          generation_id: generationId,
        },
      }
    );

    const data = response.data;
    console.log(`Poll #${i + 1}: status = ${data.status}`);

    if (data.status === "completed") {
      console.log("FULL COMPLETED DATA:", data);
    }

    // Handle "completed" or "succeeded"
    if (
      (data.status === "completed" || data.status === "succeeded") &&
      data.video[0]
    ) {
      return data.video[0]; // Return video URL once ready
    } else if (data.status === "failed") {
      throw new Error("Video generation failed");
    }

    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before next poll
  }

  throw new Error("Video generation timed out");
};

export const uploadMedia = async (req, res) => {
  try {
    const { file } = req;
    const clerkId = req.body.userId;

    const userExists = await User.findOne({ clerkId });
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userId = userExists._id;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // 1. Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(
      file.buffer,
      "revenate/images",
      "image"
    );

    // 6. Save to DB
    const imageRecord = await Media.create({
      userId,
      type: "image",
      cloudinaryPublicId: imageResult.public_id,
      url: imageResult.secure_url,
      originalFilename: imageResult.original_filename,
      format: imageResult.format,
      width: imageResult.width,
      height: imageResult.height,
      duration: imageResult.duration,
    });

    // 2. Call AI API to start video generation
    const generationResponse = await axios.post(
      "https://api.aimlapi.com/v2/generate/video/runway/generation",
      {
        model: "runway/gen4_turbo",
        prompt:
          "A model wearing the clothe in image and showing off it from different angles and poses",
        ratio: "9:16",
        image_url: imageResult.secure_url,
        duration: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIMLAPI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generationId = generationResponse.data.id;

    console.log("AIMLAPI Generation Response:", generationResponse.data);

    // 3. Poll until video is ready
    const finalVideoUrl = await pollForVideo(
      generationId,
      process.env.AIMLAPI_API_KEY
    );

    // 4. Download generated video
    const videoBuffer = await axios
      .get(finalVideoUrl, { responseType: "arraybuffer" })
      .then((r) => r.data);

    // 5. Upload video to Cloudinary
    const videoResult = await uploadToCloudinary(
      Buffer.from(videoBuffer),
      "revenate/videos",
      "video"
    );

    // 6. Save to DB
    const mediaRecord = await Media.create({
      userId,
      type: "video",
      cloudinaryPublicId: videoResult.public_id,
      url: videoResult.secure_url,
      originalFilename: videoResult.original_filename,
      format: videoResult.format,
      width: videoResult.width,
      height: videoResult.height,
      duration: videoResult.duration,
      thumbnailUrl: videoResult.secure_url
        .replace("/upload/", "/upload/so_1,du_1,pg_1/w_300,h_300,c_fill/")
        .replace(/\.\w+$/, ".jpg"), // Convert to JPG
    });

    res.status(200).json({
      message: "Upload and video generation successful",
      media: mediaRecord,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong during media processing." });
  }
};

export const getMediaByUser = async (req, res) => {
  const { clerkId } = req.params;
  try {
    if (!clerkId) {
      return res
        .status(404)
        .json({ success: false, message: "clerkId not found" });
    }
    // check if user exists
    const userExists = await User.findOne({ clerkId });
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const media = await Media.find({ userId: userExists._id });
    return res
      .status(200)
      .json({ success: true, message: "Retreived Media", media });
  } catch (error) {
    console.error("Error retreiving media");
    return res
      .status(500)
      .json({ success: false, message: "Error getting media by user", error });
  }
};
