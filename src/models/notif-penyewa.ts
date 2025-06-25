import mongoose, { Schema, Document } from "mongoose";

export interface INotifPenyewa extends Document {
  penyewaId: string; // UID user penyewa
  judul: string;
  pesan: string;
  tanggal: Date;
  sudahDibaca: boolean;
}

const NotifPenyewaSchema = new Schema<INotifPenyewa>({
  penyewaId: { type: String, required: true },
  judul: { type: String, required: true },
  pesan: { type: String, required: true },
  tanggal: { type: Date, default: Date.now },
  sudahDibaca: { type: Boolean, default: false },
});

export default mongoose.models.NotifPenyewa ||
  mongoose.model<INotifPenyewa>("NotifPenyewa", NotifPenyewaSchema, "notif-penyewa");