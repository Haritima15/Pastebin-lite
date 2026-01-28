import express from "express";
import {
  createPaste,
  getPasteByShortId
} from "../controllers/pasteController";

const router = express.Router();

router.post("/paste", createPaste);
router.get("/paste/:shortId", getPasteByShortId);

export default router;
