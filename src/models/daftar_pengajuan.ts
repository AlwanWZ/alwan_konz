import mongoose, { Schema, Document } from "mongoose";

export interface IDaftarPengajuan extends Document {
  kontrakanId: string;
  uid: string; // <-- PENTING!
  nama: string;
  noHp: string;
  tanggalMulai: string;
  durasi: string;
  catatan?: string;
  status: string;
  createdAt?: Date;
}

const DaftarPengajuanSchema = new Schema<IDaftarPengajuan>({
  kontrakanId: { type: String, required: true },
  uid: { type: String, required: true },
  nama: { type: String, required: true },
  noHp: { type: String, required: true },
  tanggalMulai: { type: String, required: true },
  durasi: { type: String, required: true },
  catatan: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.DaftarPengajuan ||
  mongoose.model<IDaftarPengajuan>("DaftarPengajuan", DaftarPengajuanSchema);