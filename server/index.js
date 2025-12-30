import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import PostgresConnection from "./DBConnection/PostgresConnection.js";
import router from "./Routes/main.js";
import { initializePool, initializeTable } from "./models/qrcode.js";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 5000;

// ✅ CORRECT CORS CONFIG
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://qrcode-project-omega.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS ONCE (this already handles OPTIONS)
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`--> ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/project", router);

// Start server
(async () => {
  try {
    await PostgresConnection();
    initializePool();
    await initializeTable();

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
