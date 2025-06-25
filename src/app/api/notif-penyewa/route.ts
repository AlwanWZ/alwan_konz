import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import NotifPenyewa from "@/models/notif-penyewa";

// GET: /api/notif-penyewa?penyewaId=xxx
export async function GET(req: NextRequest) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const penyewaId = searchParams.get("penyewaId");

  let filter: any = {};
  if (penyewaId) filter.penyewaId = penyewaId;

  try {
    const data = await NotifPenyewa.find(filter).sort({ tanggal: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// POST: /api/notif-penyewa
export async function POST(req: NextRequest) {
  await connectMongo();
  try {
    const body = await req.json();
    const notif = await NotifPenyewa.create(body);
    return NextResponse.json({ success: true, data: notif });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}