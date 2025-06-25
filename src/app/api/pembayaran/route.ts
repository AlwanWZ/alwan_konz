import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Pembayaran from "@/models/Pembayaran";
import Kontrakan from "@/models/Kontrakan";
import User from "@/models/user";

// GET: Untuk dashboard keuangan, ambil semua pembayaran
export async function GET(req: NextRequest) {
  await connectMongo();
  const url = new URL(req.url);
  const penyewaId = url.searchParams.get("penyewaId");
  let filter: any = {};
  if (penyewaId) filter.penyewaId = penyewaId;
  const data = await Pembayaran.find(filter).sort({ tanggalBayar: -1 });
  return NextResponse.json({ data });
}

// POST: Proses pembayaran dari penyewa
export async function POST(req: NextRequest) {
  await connectMongo();
  const body = await req.json();
  // Data yang dikirim: kontrakanId, penyewaId, jumlah, bulan, metode
  const pembayaranBaru = await Pembayaran.create({
    kontrakanId: body.kontrakanId,
    penyewaId: body.penyewaId,
    jumlah: body.jumlah,
    bulan: body.bulan,
    metode: body.metode,
    status: "sukses", // Atau "pending" jika perlu approval
    tanggalBayar: new Date(),
  });
  return NextResponse.json({ success: true, data: pembayaranBaru });
}