import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  uid: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string;
  noTelp?: string;
  alamat?: string;
  tanggalLahir?: string;
  tanggalBergabung?: string;
  noKTP?: string;
  pekerjaan?: string;
  darurat?: {
    nama: string;
    hubungan: string;
    noTelp: string;
    
  };
  bio?: string; // <-- PASTIKAN INI ADA!
    kontrakan?: string;
  lastPayment?: string;
}

const UserSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  photoURL: { type: String, default: "" },
  noTelp: { type: String, default: "" },
  alamat: { type: String, default: "" },
  tanggalLahir: { type: String, default: "" },
  tanggalBergabung: { type: String, default: "" },
  noKTP: { type: String, default: "" },
  pekerjaan: { type: String, default: "" },
  darurat: {
    nama: { type: String, default: "" },
    hubungan: { type: String, default: "" },
    noTelp: { type: String, default: "" },
  },
  bio: { type: String, default: "" },
  kontrakan: {
  type: String,
  required: function () {
    // Hanya required untuk penyewa
    return this.role === "penyewa";
  },
},
  lastPayment: { type: String, default: "" }, // <-- PASTIKAN INI ADA!
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);