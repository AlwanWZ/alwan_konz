import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Kontrakan from "@/models/Kontrakan";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = context.params; // Tidak perlu await
    const kontrakan = await Kontrakan.findById(id).lean();
    if (!kontrakan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: kontrakan });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    await connectMongo();
    const body = await req.json();
    // Hanya update field yang dikirim di body
    const updateFields: any = {};
    if (body.nama !== undefined) updateFields.nama = body.nama;
    if (body.alamat !== undefined) updateFields.alamat = body.alamat;
    if (body.harga !== undefined) updateFields.harga = body.harga;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.fasilitas !== undefined) updateFields.fasilitas = body.fasilitas;
    if (body.foto !== undefined) updateFields.foto = body.foto;

    const updated = await Kontrakan.findByIdAndUpdate(
      params.id,
      updateFields,
      { new: true }
    ).lean();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update kontrakan' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    await connectMongo();
    const deleted = await Kontrakan.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus kontrakan' }, { status: 500 });
  }
}