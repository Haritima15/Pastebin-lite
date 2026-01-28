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

export const getPasteByShortId = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;

    const paste = await Paste.findOneAndUpdate(
      { shortId },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!paste) {
      return res.status(404).json({ message: "Paste not found" });
    }

    res.json({
      content: paste.content,
      views: paste.views,
      createdAt: paste.createdAt
    });
  } catch (error) {
    console.error("Get paste error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

