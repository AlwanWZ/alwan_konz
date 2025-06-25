import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Readable } from "stream";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "kontrakan" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

    const result: any = await upload();
    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    console.error("Cloudinary upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}