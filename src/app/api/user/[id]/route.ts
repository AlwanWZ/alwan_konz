import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/user';

// GET user by UID (prioritas cari pakai uid, bukan _id)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await connectMongo();
    // Selalu cari berdasarkan uid terlebih dahulu (karena sistem relasi pakai uid)
    let user = await User.findOne({ uid: id }).lean();
    // Jika tidak ketemu dan id format 24 hex karakter, coba cari by _id (opsional, fallback)
    if (!user && id.length === 24 && /^[a-fA-F0-9]+$/.test(id)) {
      user = await User.findById(id).lean();
    }
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 });
  }
}

// PATCH user by UID (prioritas update pakai uid, bukan _id)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await connectMongo();
    const body = await req.json();
    // Selalu update berdasarkan uid terlebih dahulu
    let updated = await User.findOneAndUpdate({ uid: id }, { $set: body }, { new: true });
    // Jika tidak ketemu dan id format 24 hex karakter, coba update by _id (opsional, fallback)
    if (!updated && id.length === 24 && /^[a-fA-F0-9]+$/.test(id)) {
      updated = await User.findByIdAndUpdate(id, { $set: body }, { new: true });
    }
    if (!updated) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update user' }, { status: 500 });
  }
}