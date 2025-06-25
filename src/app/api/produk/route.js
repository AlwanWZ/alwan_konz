import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

const ProdukSchema = new mongoose.Schema({
  nama: String,
  harga: Number,
  deskripsi: String,
});

const Produk = mongoose.models.Produk || mongoose.model("Produk", ProdukSchema);

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const produkBaru = await Produk.create(body);
  return new Response(JSON.stringify(produkBaru), {
    status: 201,
  });
}
