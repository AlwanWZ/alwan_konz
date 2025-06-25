"use client";

import { useState } from "react";
import { Wrench, CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
  const [nama, setNama] = useState("");
  const [unit, setUnit] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/laporan-maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, unit, deskripsi }),
    });
    if (res.ok) {
      setSubmitted(true);
      setNama("");
      setUnit("");
      setDeskripsi("");
      setTimeout(() => setSubmitted(false), 2000);
    } else {
      setError("Gagal mengirim laporan. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white flex flex-col items-center justify-center px-4">
      <div className="bg-slate-800/60 rounded-2xl shadow-xl border border-slate-700/50 max-w-md w-full p-8 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-slate-400 hover:text-emerald-400 transition"
          aria-label="Tutup"
          type="button"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="w-7 h-7 text-emerald-400" />
          <h1 className="text-2xl font-bold text-emerald-300">Laporan Kerusakan / Maintenance</h1>
        </div>
        {submitted ? (
          <div className="flex flex-col items-center py-12">
            <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
            <p className="text-lg font-semibold mb-2">Pesan berhasil dikirim!</p>
            <p className="text-slate-300 text-center">Tim maintenance akan segera menindaklanjuti laporan Anda.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Nama Penyewa</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-400 focus:ring-emerald-400 outline-none"
                value={nama}
                onChange={e => setNama(e.target.value)}
                required
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Unit</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-400 focus:ring-emerald-400 outline-none"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                required
                placeholder="Unit (misal: A1)"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Pesan Kerusakan / Permintaan</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-400 focus:ring-emerald-400 outline-none"
                value={deskripsi}
                onChange={e => setDeskripsi(e.target.value)}
                rows={5}
                required
                placeholder="Jelaskan kerusakan atau permintaan maintenance Anda..."
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-semibold text-lg transition"
            >
              Kirim Pesan
            </button>
          </form>
        )}
      </div>
    </div>
  );
}