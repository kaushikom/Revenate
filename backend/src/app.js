import express from "express";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
const allowedOrigins = [process.env.CORS_ORIGIN];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in our allowed list
    // Note: origin can be undefined in some cases (like same-origin requests)
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
app.use("/", (req, res) => {
  res.send("Hello world");
});

export { app };
