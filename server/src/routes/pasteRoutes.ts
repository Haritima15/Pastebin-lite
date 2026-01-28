import express from "express";
import { createPaste } from "../controllers/pasteController";

const router = express.Router();

router.post("/paste", createPaste);

export default router;
