import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  uploadMedia,
  getMediaByUser,
} from "../controllers/media.controller.js";

const mediaRouter = express.Router();

mediaRouter.post("/upload", upload.single("file"), uploadMedia);
mediaRouter.get("/getMediaByUser/:clerkId", getMediaByUser);

export default mediaRouter;
