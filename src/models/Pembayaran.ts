import mongoose, { Document } from 'mongoose';

interface IPembayaran extends Document {
  kontrakanId: mongoose.Schema.Types.ObjectId;
  penyewaId: string;
  jumlah: number;
  tanggalBayar: Date;
  buktiPembayaran?: string;
  status: 'pending' | 'sukses' | 'gagal';
}

const pembayaranSchema = new mongoose.Schema<IPembayaran>({
  kontrakanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Kontrakan',
    required: true 
  },
  penyewaId: { 
    type: String,
    required: true 
  },
  jumlah: { 
    type: Number, 
    required: true 
  },
  tanggalBayar: { 
    type: Date, 
    default: Date.now 
  },
  buktiPembayaran: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'sukses', 'gagal'],
    default: 'pending'  
  }
});

export default mongoose.models.Pembayaran || mongoose.model<IPembayaran>('pembayaran', pembayaranSchema);