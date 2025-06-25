import mongoose, { Schema, Document } from 'mongoose';

export interface IPenyewa extends Document {
  nama: string;
  email: string;
  phone: string;
  kontrakan: string;
  status: string;
  joinDate: Date;
  photoUrl: string;
  lastPayment: Date;
}

const PenyewaSchema: Schema = new Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  kontrakan: { type: String, required: true },
  status: { type: String, required: true },
  joinDate: { type: Date, required: true },
  photoUrl: { type: String, required: true },
  lastPayment: { type: Date, required: true },
});

// 👇 Koleksi eksplisit 'penyewa' biar gak salah pluralisasi
const Penyewa = mongoose.models.Penyewa || mongoose.model<IPenyewa>('Penyewa', PenyewaSchema, 'penyewa');

export default Penyewa;
