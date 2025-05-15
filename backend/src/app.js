import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.router.js";
import mediaRouter from "./routes/media.router.js";
dotenv.config();
const app = express();

// Middlewares
const allowedOrigins = [process.env.CORS_ORIGIN];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming origin:", origin); // <- add this
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1024kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routers
app.use("/api/user", userRouter);
app.use("/api/media", mediaRouter);

export { app };
