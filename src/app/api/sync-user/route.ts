import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    let user = await User.findOne({ uid: body.uid });

    if (!user) {
      // User baru, set role dari body jika ada, jika tidak default "tamu"
      user = await User.create({
        uid: body.uid,
        name: body.name,
        email: body.email,
        role: body.role || "tamu",
        photoURL: body.photoURL || "",
        noTelp: body.noTelp || "",
        alamat: body.alamat || "",
        tanggalLahir: body.tanggalLahir || "",
        tanggalBergabung: new Date().toISOString(),
        noKTP: body.noKTP || "",
        pekerjaan: body.pekerjaan || "",
        darurat: body.darurat || { nama: "", hubungan: "", noTelp: "" },
        bio: body.bio || "",
      });
    } else {
      // Hanya update data profile, JANGAN update role!
      if (body.name !== undefined) user.name = body.name;
      if (body.email !== undefined) user.email = body.email;
      if (body.photoURL !== undefined) user.photoURL = body.photoURL;
      if (body.noTelp !== undefined) user.noTelp = body.noTelp;
      if (body.alamat !== undefined) user.alamat = body.alamat;
      if (body.tanggalLahir !== undefined) user.tanggalLahir = body.tanggalLahir;
      if (body.noKTP !== undefined) user.noKTP = body.noKTP;
      if (body.pekerjaan !== undefined) user.pekerjaan = body.pekerjaan;
      if (body.darurat !== undefined) user.darurat = body.darurat;
      if (body.bio !== undefined) user.bio = body.bio;
      if (!user.tanggalBergabung) user.tanggalBergabung = new Date().toISOString();
      // JANGAN update user.role di sini!
      await user.save();
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("❌ Failed to sync user:", error);
    return NextResponse.json({ success: false, error: error?.toString() }, { status: 500 });
  }
}