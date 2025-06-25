import mongoose, { Document } from 'mongoose';

interface IKontrakan extends Document {
  nama: string;
  alamat: string;
  harga: number;
  status: 'tersedia' | 'disewa';
  fasilitas: string[];
  foto: string[];
  penyewaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const kontrakanSchema = new mongoose.Schema<IKontrakan>({
    nama: { type: String, required: true, unique: true },
  alamat: { type: String, required: true },
  harga: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['tersedia', 'disewa'], 
    default: 'tersedia' 
  },
  fasilitas: [String],
  foto: [String],
  penyewaId: { type: String }, // Firebase UID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Kontrakan || mongoose.model<IKontrakan>('Kontrakan', kontrakanSchema, 'kontrakan');