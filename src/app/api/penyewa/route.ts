import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/user";
import Penyewa from "@/models/penyewa";

// POST: Sinkronisasi user ke koleksi penyewa
export async function POST(req: NextRequest) {
  await connectMongo();
  // Ambil semua user dengan role 'penyewa'
  const users = await User.find({ role: "penyewa" }).lean();

  // Untuk setiap user, simpan/update ke koleksi penyewa
  for (const u of users) {
    await Penyewa.updateOne(
      { email: u.email },
      {
        $set: {
          nama: u.name,
          email: u.email,
          phone: u.noTelp || "",
          kontrakan: u.kontrakan || "",
          status: u.status || "aktif",
          joinDate: u.tanggalBergabung || new Date(),
          photoUrl: u.photoURL || "",
          lastPayment: u.lastPayment || null,
        },
      },
      { upsert: true }
    );
  }

  return NextResponse.json({ success: true, message: "Sinkronisasi penyewa selesai", count: users.length });
}

// GET: Ambil data penyewa dari koleksi penyewa
export async function GET() {
  await connectMongo();
  const data = await Penyewa.find().sort({ joinDate: -1 }).lean();
  return NextResponse.json({ data });
}