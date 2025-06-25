import mongoose, { Schema, Document } from "mongoose";

export interface IRating extends Document {
  nama: string;
  komentar: string;
  rating: number;
  tanggal: Date;
  foto?: string;
}

const RatingSchema = new Schema<IRating>({
  nama: { type: String, required: true },
  komentar: { type: String, required: true },
  rating: { type: Number, required: true },
  tanggal: { type: Date, default: Date.now },
  foto: { type: String },
});

export default mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema, "rating");