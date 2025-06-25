import mongoose, { Schema, Document } from "mongoose";

export interface ILaporanMaintenance extends Document {
  nama: string;
  unit: string;
  tanggal: string;
  deskripsi: string;
  status: "belum" | "proses" | "selesai";
}

const LaporanMaintenanceSchema = new Schema<ILaporanMaintenance>({
  nama: { type: String, required: true },
  unit: { type: String, required: true },
  tanggal: { type: String, required: true },
  deskripsi: { type: String, required: true },
  status: { type: String, enum: ["belum", "proses", "selesai"], default: "belum" },
});

export default mongoose.models.LaporanMaintenance ||
  mongoose.model<ILaporanMaintenance>("LaporanMaintenance", LaporanMaintenanceSchema);