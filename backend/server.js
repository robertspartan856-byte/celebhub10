import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import newsletterRoutes from "./src/routes/newsletterRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://celebhub1.up.railway.app",
  "https://celebhub1-production.up.railway.app",
  ...(process.env.CORS_ORIGIN?.split(",").map((value) => value.trim()).filter(Boolean) ?? []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(origin) ||
        /^https:\/\/[-a-z0-9]+\.vercel\.dev$/i.test(origin) ||
        /^https:\/\/[-a-z0-9]+\.up\.railway\.app$/i.test(origin) ||
        /^https:\/\/[-a-z0-9]+\.railway\.app$/i.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CELEBHUB API is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 CELEBHUB backend running on port ${PORT}`);
});
