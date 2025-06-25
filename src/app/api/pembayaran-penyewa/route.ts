import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/user";
import Kontrakan from "@/models/Kontrakan";
import PembayaranPenyewa from "@/models/pembayaran-penyewa";

// GET pembayaran penyewa berdasarkan userId atau nama kontrakan
export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);

    // Jika ada userId, ambil pembayaran user tersebut
    const userId = searchParams.get("userId");
    if (userId) {
      const data = await PembayaranPenyewa.find({ userId }).lean();
      return NextResponse.json({ data });
    }

    // Jika ada nama kontrakan, ambil user dan data kontrakan
    const namaKontrakan = searchParams.get("nama");
    if (namaKontrakan) {
      const users = await User.find({ kontrakan: namaKontrakan }).lean();
      const kontrakan = await Kontrakan.findOne({ nama: namaKontrakan }).lean();
      return NextResponse.json({ users, kontrakan });
    }

    // JIKA TIDAK ADA PARAMETER, KEMBALIKAN SEMUA DATA PEMBAYARAN
    const data = await PembayaranPenyewa.find({}).lean();
    return NextResponse.json({ data });

  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server", detail: error }, { status: 500 });
  }
}

// POST pembayaran penyewa baru
export async function POST(req: NextRequest) {
  await connectMongo();
  const body = await req.json();
  // Data: userId, nama, kontrakan, bulan, jumlah, metode
  const pembayaranBaru = await PembayaranPenyewa.create({
    userId: body.userId,
    nama: body.nama,
    kontrakan: body.kontrakan,
    bulan: body.bulan,
    jumlah: body.jumlah,
    metode: body.metode,
    status: "Lunas", // <-- PASTIKAN INI "Lunas"
    tanggalBayar: new Date().toISOString(),
  });
  return NextResponse.json({ success: true, data: pembayaranBaru });
}
