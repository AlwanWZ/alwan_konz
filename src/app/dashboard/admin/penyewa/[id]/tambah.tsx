"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function TambahPenyewaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    phone: "",
    kontrakan: "",
    status: "aktif",
    joinDate: "",
    photoUrl: "",
    lastPayment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi tambah data
    alert("Penyewa baru berhasil ditambahkan!");
    router.push("/dashboard/admin/penyewa");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-slate-200 flex flex-col items-center py-10">
      <div className="w-full max-w-lg mx-auto">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push("/dashboard/admin/penyewa")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Penyewa
        </Button>
        <Card className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">Tambah Penyewa Baru</h2>
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
                <PlusCircle className="w-4 h-4" /> Tambah Penyewa
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}