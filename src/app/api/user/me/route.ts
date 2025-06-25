import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  await connectMongo();
  // Ganti dengan cara ambil UID user login yang benar
  // Untuk testing, bisa hardcode UID user yang ada di database
  const uid = "UID_USER_ASLI"; // <-- Ganti dengan UID user asli
  const user = await User.findOne({ uid });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
}