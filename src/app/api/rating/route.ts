import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Rating from "@/models/rating";

export async function GET() {
  await connectMongo();
  const data = await Rating.find().sort({ tanggal: -1 }).lean();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const body = await req.json();
  const { nama, komentar, rating, foto } = body;
  if (!nama || !komentar || !rating) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }
  const newRating = await Rating.create({
    nama,
    komentar,
    rating,
    foto,
    tanggal: new Date(),
  });
  return NextResponse.json({ success: true, data: newRating });
}