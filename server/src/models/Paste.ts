import mongoose, { Schema, Document } from "mongoose";

export interface IPaste extends Document {
  content: string;
  shortId: string;
  views: number;
  createdAt: Date;
  expiresAt?: Date;
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
