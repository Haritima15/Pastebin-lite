import mongoose, { Schema, Document } from "mongoose";

export interface IPaste extends Document {
  content: string;
  shortId: string;
  views: number;
  maxViews: number | null;
  expiresAt: Date | null;
  createdAt: Date;
}

const PasteSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    shortId: {
      type: String,
      required: true,
      unique: true
    },
    views: {
      type: Number,
      default: 0
    },
    maxViews: {
      type: Number,
      default: null,
      min: 1
    },
    expiresAt: {
    type: Date,
    default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default mongoose.model<IPaste>("Paste", PasteSchema);
