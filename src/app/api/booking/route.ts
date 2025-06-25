import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import DaftarPengajuan from "@/models/daftar_pengajuan";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    const pengajuan = await DaftarPengajuan.create({
      kontrakanId: body.kontrakanId,
      uid: body.uid,
      nama: body.nama,
      noHp: body.noHp,
      tanggalMulai: body.tanggalMulai,
      durasi: body.durasi,
      catatan: body.catatan,
      status: "pending",
    });
    return NextResponse.json({ data: pengajuan });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengajukan sewa" }, { status: 500 });
  }
}
export async function GET() {
  try {
    await connectMongo();
    const data = await DaftarPengajuan.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}