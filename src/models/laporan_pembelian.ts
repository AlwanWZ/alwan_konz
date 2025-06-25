import mongoose from "mongoose";

const laporanPembelianSchema = new mongoose.Schema({
  tanggal: { type: Date, required: true },
  namaBarang: { type: String, required: true },
  jumlah: { type: Number, required: true },
  hargaSatuan: { type: Number, required: true },
  totalHarga: { type: Number, required: true },
  bukti: { type: String, default: "" }, // URL Cloudinary
  catatan: { type: String, default: "" },
  status: { type: String, enum: ["menunggu", "diterima", "ditolak"], default: "menunggu" },
  kategori: { type: String, default: "maintenance" },
  sumber: { type: String, default: "maintenance" },
});

export default mongoose.models.LaporanPembelian ||
  mongoose.model("LaporanPembelian", laporanPembelianSchema, "laporan_pembelian");