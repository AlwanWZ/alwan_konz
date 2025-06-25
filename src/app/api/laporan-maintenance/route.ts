import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import LaporanMaintenance from "@/models/laporan-maintenance";

export async function GET() {
  await connectMongo();
  const data = await LaporanMaintenance.find().sort({ tanggal: -1 }).lean();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const { nama, unit, deskripsi } = await req.json();
  if (!nama || !unit || !deskripsi) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }
  const tanggal = new Date().toISOString().slice(0, 10);
  const laporan = await LaporanMaintenance.create({
    nama,
    unit,
    tanggal,
    deskripsi,
    status: "belum",
  });
  return NextResponse.json({ success: true, laporan });
}

export async function PATCH(req: NextRequest) {
  await connectMongo();
  const { id, status } = await req.json();
  if (!id || !["belum", "proses", "selesai"].includes(status)) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }
  await LaporanMaintenance.findByIdAndUpdate(id, { status });
  return NextResponse.json({ success: true });
}