import mongoose, { Schema, Document } from "mongoose";

export interface IPembayaranPenyewa extends Document {
  userId: string;
  nama: string;
  kontrakan: string;
  bulan: string; // contoh: "Juni 2025"
  jumlah: number;
  status: "Lunas" | "Belum Lunas" | "Pending";
  tanggalBayar?: string;
  metode?: string;
}

const PembayaranPenyewaSchema = new Schema<IPembayaranPenyewa>({
  userId: { type: String, required: true },
  nama: { type: String, required: true },
  kontrakan: { type: String, required: true },
  bulan: { type: String, required: true },
  jumlah: { type: Number, required: true },
  status: { type: String, enum: ["Lunas", "Belum Lunas", "Pending"], default: "Belum Lunas" },
  tanggalBayar: { type: String, default: "" },
  metode: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.PembayaranPenyewa || mongoose.model<IPembayaranPenyewa>("PembayaranPenyewa", PembayaranPenyewaSchema, "pembayaran_penyewa");