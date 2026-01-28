import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Paste from "../models/Paste";

export const createPaste = async (req: Request, res: Response) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    // content validation
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return res.status(400).json({ error: "content is required" });
    }

    // ttl_seconds validation
    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return res
        .status(400)
        .json({ error: "ttl_seconds must be an integer >= 1" });
    }

    // max_views validation
    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return res
        .status(400)
        .json({ error: "max_views must be an integer >= 1" });
    }

    // compute expiry time
    let expiresAt: Date | null = null;
    if (ttl_seconds !== undefined) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    // create paste
    const paste = await Paste.create({
      content: content.trim(),
      shortId: nanoid(8),
      maxViews: max_views ?? null,
      expiresAt
    });

    // response (NO hardcoded localhost)
    const baseUrl = process.env.PUBLIC_BASE_URL;
    if (!baseUrl) {
      return res
        .status(500)
        .json({ error: "PUBLIC_BASE_URL not configured" });
    }

    return res.status(201).json({
      id: paste.shortId,
      url: `${baseUrl}/p/${paste.shortId}`
    });
  } catch (err) {
    console.error("Create paste error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};


export const getPasteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const paste = await Paste.findOneAndUpdate(
    { shortId: id },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!paste) {
    return res.status(404).json({ error: "Paste not found" });
  }

  res.json({
    content: paste.content,
    views: paste.views,
    createdAt: paste.createdAt
  });
};
