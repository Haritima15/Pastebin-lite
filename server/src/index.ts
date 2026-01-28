import express, { Request, Response } from "express";
import pasteRoutes from "./routes/pasteRoutes";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api", pasteRoutes);

app.get("/api/healthz", (req, res) => {
  /*
    readyState meanings:
    0 = disconnected
    1 = connected
    2 = connecting
    3 = disconnecting
  */

  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ ok: true });
  }

  return res.status(500).json({ ok: false });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
