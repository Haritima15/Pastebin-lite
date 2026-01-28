import express from "express";
import {
  createPaste,
  getPasteById
} from "../controllers/pasteController";

const router = express.Router();

router.post("/pastes", createPaste);
router.get("/pastes/:id", getPasteById);

export default router;
