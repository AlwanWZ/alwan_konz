import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import LaporanKeuangan from "@/models/laporan_keuangan";
import LaporanPembelian from "@/models/laporan_pembelian";

export async function GET() {
  await connectMongo();
  const data = await LaporanKeuangan.find().sort({ tanggal: -1 }).lean();
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  await connectMongo();
  const { id, status } = await req.json();
  if (!id || !["menunggu", "diterima", "ditolak"].includes(status)) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }
  const keuangan = await LaporanKeuangan.findByIdAndUpdate(id, { status }, { new: true });

  // Sinkronkan status ke laporan pembelian
  if (keuangan) {
    await LaporanPembelian.updateMany(
      {
        tanggal: keuangan.tanggal,
        totalHarga: keuangan.jumlah,
        namaBarang: { $regex: /.+/, $options: "i" }, // fallback, bisa lebih spesifik jika ada field pembelianId
      },
      { status: keuangan.status }
    );
  }

  return NextResponse.json({ success: true });
}