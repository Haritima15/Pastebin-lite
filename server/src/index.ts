import express, { Request, Response } from "express";
import pasteRoutes from "./routes/pasteRoutes";
import Paste from "./models/Paste";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

app.use("/api", pasteRoutes);

app.get("/p/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const paste = await Paste.findOne({ shortId: id });

    if (!paste) {
      return res.status(404).send("Not Found");
    }

    const now =
      process.env.TEST_MODE === "1" && req.header("x-test-now-ms")
        ? new Date(Number(req.header("x-test-now-ms")))
        : new Date();

    // TTL check
    if (paste.expiresAt && paste.expiresAt <= now) {
      return res.status(404).send("Not Found");
    }

    // View limit check
    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      return res.status(404).send("Not Found");
    }

    // Increment views
    paste.views += 1;
    await paste.save();

    // Return safe HTML
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Paste</title>
          <meta charset="utf-8" />
        </head>
        <body>
          <pre>${escapeHtml(paste.content)}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("HTML paste view error:", err);
    res.status(500).send("Internal Server Error");
  }
});



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
