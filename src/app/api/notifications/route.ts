import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/notifikasi";

// GET: Ambil notifikasi user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
    const notifications = await Notification.find({ userId }).sort({ time: -1 });
    return NextResponse.json({ data: notifications });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Tambah notifikasi baru
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, type, title, message, time } = body;
    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const notif = await Notification.create({
      userId,
      type,
      title,
      message,
      time: time ? new Date(time) : new Date(),
    });
    return NextResponse.json({ data: notif }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}