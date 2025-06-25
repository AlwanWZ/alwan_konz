import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Announcement from "@/models/announcement";

export async function GET() {
  await connectMongo();
  const announcements = await Announcement.find().sort({ date: -1 });
  return NextResponse.json({ announcements });
}