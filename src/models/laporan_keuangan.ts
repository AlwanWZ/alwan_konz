import mongoose from 'mongoose';

const laporanKeuanganSchema = new mongoose.Schema({
  tanggal: Date,
  kategori: String,
  deskripsi: String,
  jumlah: Number,
  sumber: String,
  status: String,
  bukti: String,
});

export default mongoose.models.LaporanKeuangan ||
  mongoose.model('LaporanKeuangan', laporanKeuanganSchema, 'laporan_keuangan');