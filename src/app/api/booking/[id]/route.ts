import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import DaftarPengajuan from "@/models/daftar_pengajuan";
import { ObjectId } from "mongodb";

// PATCH pengajuan (update status/alasan)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID pengajuan tidak valid" }, { status: 400 });
    }
    const body = await req.json();
    const updated = await DaftarPengajuan.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update status pengajuan" }, { status: 500 });
  }
}

// DELETE pengajuan
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID pengajuan tidak valid" }, { status: 400 });
    }
    const deleted = await DaftarPengajuan.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus pengajuan" }, { status: 500 });
  }
}