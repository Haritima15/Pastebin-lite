import express, { Request, Response } from "express";
import pasteRoutes from "./routes/pasteRoutes";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api", pasteRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
