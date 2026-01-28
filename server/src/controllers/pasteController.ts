import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Paste from "../models/Paste";


const getNow = (req: Request): Date => {
  if (process.env.TEST_MODE === "1") {
    const testNow = req.header("x-test-now-ms");
    if (testNow) {
      const ms = Number(testNow);
      if (!Number.isNaN(ms)) {
        return new Date(ms);
      }
    }
  }
  return new Date();
};

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
  try {
    const { id } = req.params;

    const paste = await Paste.findOne({ shortId: id });

    // Missing paste
    if (!paste) {
      return res.status(404).json({ error: "Paste unavailable" });
    }

    const now = getNow(req);

    // TTL check
    if (paste.expiresAt && paste.expiresAt <= now) {
      return res.status(404).json({ error: "Paste unavailable" });
    }

    // View limit check (before increment)
    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      return res.status(404).json({ error: "Paste unavailable" });
    }

    // Increment views (allowed)
    paste.views += 1;
    await paste.save();

    // Remaining views calculation
    const remainingViews =
      paste.maxViews === null
        ? null
        : Math.max(paste.maxViews - paste.views, 0);

    return res.status(200).json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt
    });
  } catch (err) {
    console.error("Fetch paste error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};
