import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import LaporanPembelian from "@/models/laporan_pembelian";
import LaporanKeuangan from "@/models/laporan_keuangan";

export async function GET() {
  await connectMongo();
  const data = await LaporanPembelian.find().sort({ tanggal: -1 }).lean();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const body = await req.json();
  const {
    tanggal,
    namaBarang,
    jumlah,
    hargaSatuan,
    totalHarga,
    bukti,
    catatan,
    kategori = "maintenance",
    sumber = "maintenance",
  } = body;

  if (!tanggal || !namaBarang || !jumlah || !hargaSatuan || !totalHarga) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  // Simpan ke laporan pembelian
  const pembelian = await LaporanPembelian.create({
    tanggal,
    namaBarang,
    jumlah,
    hargaSatuan,
    totalHarga,
    bukti,
    catatan,
    kategori,
    sumber,
    status: "menunggu",
  });

  // Otomatis simpan ke laporan keuangan
  await LaporanKeuangan.create({
    tanggal,
    kategori,
    deskripsi: `Pembelian ${namaBarang} x${jumlah}`,
    jumlah: totalHarga,
    sumber,
    status: "menunggu",
    bukti,
  });

  return NextResponse.json({ success: true, pembelian });
}

export async function PATCH(req: NextRequest) {
  await connectMongo();
  const { id, catatan, status } = await req.json();
  const update: any = {};
  if (catatan !== undefined) update.catatan = catatan;
  if (status) update.status = status;
  const pembelian = await LaporanPembelian.findByIdAndUpdate(id, update, { new: true });

  // Sinkronkan status ke laporan keuangan
  await LaporanKeuangan.updateMany(
    {
      tanggal: pembelian.tanggal,
      jumlah: pembelian.totalHarga,
      deskripsi: new RegExp(pembelian.namaBarang, "i"),
    },
    { status: pembelian.status }
  );

  return NextResponse.json({ success: true, pembelian });
}