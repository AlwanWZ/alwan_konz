// src/models/payment.ts
import mongoose, { Schema, Document } from "mongoose";
export interface IPayment extends Document {
  userId: string;
  bulan: string;
  jatuhTempo: string;
  status: string;
  jumlah: number;
  tanggalBayar: string;
}
const PaymentSchema = new Schema({
  userId: { type: String, required: true },
  bulan: String,
  jatuhTempo: String,
  status: String,
  jumlah: Number,
  tanggalBayar: String,
});
export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema, "payments");