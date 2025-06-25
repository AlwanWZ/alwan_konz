"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AjukanSewaPage() {
  const params = useSearchParams();
  const router = useRouter();
  const kontrakanId = params.get("id") || "";
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [durasi, setDurasi] = useState("1");
  const [catatan, setCatatan] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Anda belum login.");
    if (!tanggalMulai) return alert("Tanggal mulai wajib diisi!");

    // Kirim UID user agar pengajuan bisa terhubung dengan akun
    const data = {
      kontrakanId,
      uid: user.uid, // PENTING: ini wajib, penghubung ke user!
      nama: user.name,
      email: user.email,
      noHp: user.noTelp,
      alamat: user.alamat,
      tanggalLahir: user.tanggalLahir,
      noKTP: user.noKTP,
      pekerjaan: user.pekerjaan,
      darurat: user.darurat,
      tanggalMulai,
      durasi,
      catatan,
    };

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => {
        router.push("/dashboard/tamu");
      }, 2000);
    } else {
      alert("Gagal mengajukan sewa. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 relative">
        <div className="fixed top-8 left-8 z-50">
          <Link
            href={`/dashboard/tamu/detail?id=${kontrakanId}`}
            className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-full shadow-2xl transition w-16 h-16"
            aria-label="Kembali ke Detail"
          >
            <ArrowLeft className="w-7 h-7" />
          </Link>
        </div>
        <div className="max-w-lg mx-auto bg-slate-800/40 rounded-2xl shadow-xl border border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-emerald-300 mb-6">Ajukan Sewa Kontrakan</h1>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
              <p className="text-xl font-semibold mb-2">Pengajuan Berhasil!</p>
              <p className="text-slate-300 text-center mb-2">
                Data pengajuan sewa Anda telah dikirim.<br />
                Pemilik akan segera menghubungi Anda.
              </p>
              <Link href="/dashboard/tamu" className="mt-4 px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
                Kembali ke Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  value={user?.name || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">No. HP/WA</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  value={user?.noTelp || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Tanggal Mulai Sewa</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  value={tanggalMulai}
                  onChange={e => setTanggalMulai(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Durasi Sewa</label>
                <select
                  value={durasi}
                  onChange={e => setDurasi(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="1">1 bulan</option>
                  <option value="3">3 bulan</option>
                  <option value="6">6 bulan</option>
                  <option value="12">12 bulan</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Catatan (opsional)</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  rows={3}
                  placeholder="Tulis pesan atau permintaan khusus"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-semibold text-lg transition"
              >
                Ajukan Sewa
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}