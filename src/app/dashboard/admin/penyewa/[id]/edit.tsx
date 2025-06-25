"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

const penyewaList = [
  { 
    id: "1", 
    nama: "Andi Suryanto", 
    email: "andi@mail.com", 
    phone: "081234567890",
    kontrakan: "Unit A4", 
    status: "aktif",
    joinDate: "12 Feb 2025",
    photoUrl: "/api/placeholder/50/50",
    lastPayment: "28 Apr 2025"
  },
  { 
    id: "2", 
    nama: "Budi Santoso", 
    email: "budi@mail.com", 
    phone: "081298765432",
    kontrakan: "Unit B5", 
    status: "nonaktif",
    joinDate: "5 Nov 2024",
    photoUrl: "/api/placeholder/50/50",
    lastPayment: "15 Mar 2025"
  },
  { 
    id: "3", 
    nama: "Cindy Paramita", 
    email: "cindy@mail.com", 
    phone: "082187654321",
    kontrakan: "Unit C3", 
    status: "aktif",
    joinDate: "20 Apr 2025",
    photoUrl: "/api/placeholder/50/50",
    lastPayment: "1 May 2025"
  },
  { 
    id: "4", 
    nama: "Deni Wijaya", 
    email: "deni@mail.com", 
    phone: "085712345678",
    kontrakan: "Unit A2", 
    status: "aktif",
    joinDate: "3 Jan 2025",
    photoUrl: "/api/placeholder/50/50",
    lastPayment: "27 Apr 2025"
  },
];

export default function EditPenyewaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const penyewa = penyewaList.find((p) => p.id === id);

  const [form, setForm] = useState(
    penyewa || {
      nama: "",
      email: "",
      phone: "",
      kontrakan: "",
      status: "aktif",
      joinDate: "",
      photoUrl: "",
      lastPayment: "",
    }
  );

  if (!penyewa) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-slate-300 mb-4">Penyewa tidak ditemukan.</p>
        <Button onClick={() => router.push("/dashboard/admin/penyewa")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi update data
    alert("Data penyewa berhasil diupdate!");
    router.push(`/dashboard/admin/penyewa/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-slate-200 flex flex-col items-center py-10">
      <div className="w-full max-w-lg mx-auto">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push(`/dashboard/admin/penyewa/${id}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Detail Penyewa
        </Button>
        <Card className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">Edit Data Penyewa</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Nama</label>
              <Input name="nama" value={form.nama} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm mb-1">No. Telepon</label>
              <Input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Unit Kontrakan</label>
              <Input name="kontrakan" value={form.kontrakan} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}