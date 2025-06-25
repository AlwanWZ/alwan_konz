import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    let filter: any = {};
    if (role) filter.role = role;
    const users = await User.find(filter).lean();
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();

    if (!body.uid || !body.name || !body.email || !body.role) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ uid: body.uid });

    if (!user) {
      user = await User.create({
        uid: body.uid,
        name: body.name,
        email: body.email,
        role: body.role,
        photoURL: body.photoURL || "",
        noTelp: body.noTelp || "",
        alamat: body.alamat || "",
        tanggalLahir: body.tanggalLahir || "",
        tanggalBergabung: new Date().toISOString(),
        noKTP: body.noKTP || "",
        pekerjaan: body.pekerjaan || "",
        darurat: body.darurat || { nama: "", hubungan: "", noTelp: "" },
      });
    } else {
      // Update field yang dikirim
      if (body.name !== undefined) user.name = body.name;
      if (body.email !== undefined) user.email = body.email;
      if (body.role !== undefined) user.role = body.role;
      if (body.photoURL !== undefined) user.photoURL = body.photoURL;
      if (body.noTelp !== undefined) user.noTelp = body.noTelp;
      if (body.alamat !== undefined) user.alamat = body.alamat;
      if (body.tanggalLahir !== undefined) user.tanggalLahir = body.tanggalLahir;
      if (body.noKTP !== undefined) user.noKTP = body.noKTP;
      if (body.pekerjaan !== undefined) user.pekerjaan = body.pekerjaan;
      if (body.darurat !== undefined) user.darurat = body.darurat;
      if (body.bio !== undefined) user.bio = body.bio; // <-- TAMBAHKAN INI!
      if (!user.tanggalBergabung) user.tanggalBergabung = new Date().toISOString();
      await user.save();
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Sync user error:", error);
    return NextResponse.json(
      { error: "Gagal sinkronisasi user" },
      { status: 500 }
    );
  }
}