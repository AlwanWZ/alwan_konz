import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  if (!uid) return NextResponse.json({ success: false, error: "No uid" }, { status: 400 });

  const user = await User.findOne({ uid });
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, user }); // <-- bio otomatis ikut jika ada di schema
}