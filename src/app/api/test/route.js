import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await connectDB();
    return NextResponse.json({ 
      status: 'Berhasil', 
      message: 'Terhubung ke MongoDB!' 
    });
  } catch (error) {
    console.error('Test koneksi gagal:', error);
    return NextResponse.json({ 
      status: 'Gagal', 
      error: error.message 
    }, { status: 500 });
  }
}