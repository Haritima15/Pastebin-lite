import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Paste from "../models/Paste";

export const createPaste = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const shortId = nanoid(8);

    const paste = await Paste.create({
      content,
      shortId
    });

    res.status(201).json({
      message: "Paste created successfully",
      shortId: paste.shortId,
      url: `http://localhost:5000/${paste.shortId}`
    });
  } catch (error) {
    console.error("Create paste error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
