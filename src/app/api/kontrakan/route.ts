import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Kontrakan from '@/models/Kontrakan';

export async function GET() {
  try {
    await connectMongo();
    const kontrakan = await Kontrakan.find().lean();
    return NextResponse.json({ data: kontrakan });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data kontrakan' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    console.log("Body POST:", body); // Tambahkan log ini
    const kontrakan = await Kontrakan.create({
      nama: body.nama,
      alamat: body.alamat,
      harga: body.harga,
      status: body.status,
      fasilitas: body.fasilitas,
      foto: body.foto,
    });
    return NextResponse.json({ data: kontrakan });
  } catch (error) {
    console.error("POST Kontrakan error:", error); // Tambahkan log ini
    return NextResponse.json({ error: 'Gagal tambah kontrakan' }, { status: 500 });
  }
}