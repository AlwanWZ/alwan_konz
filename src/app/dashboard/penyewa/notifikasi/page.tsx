"use client";

import { Bell, Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PenyewaNavbar } from "../navbar";

type Notifikasi = {
  _id: string;
  penyewaId: string;
  judul: string;
  pesan: string;
  tanggal: string;
  sudahDibaca: boolean;
};

export default function NotifikasiTamu() {
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil user dari localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    fetch(`/api/notif-penyewa?penyewaId=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifikasi(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Tandai sudah dibaca
  const handleMarkRead = async (id: string) => {
    setNotifikasi((prev) =>
      prev.map((n) => (n._id === id ? { ...n, sudahDibaca: true } : n))
    );
    await fetch(`/api/notif-penyewa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, sudahDibaca: true, update: true }),
    });
  };

  // Hapus notifikasi
  const handleDelete = async (id: string) => {
    setNotifikasi((prev) => prev.filter((n) => n._id !== id));
    await fetch(`/api/notif-penyewa`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
  };

  // Hapus semua
  const handleDeleteAll = async () => {
    setNotifikasi([]);
    await fetch(`/api/notif-penyewa?all=true`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ penyewaId: notifikasi[0]?.penyewaId }),
    });
  };

  // Tandai semua sudah dibaca
  const handleMarkAllRead = async () => {
    setNotifikasi((prev) => prev.map((n) => ({ ...n, sudahDibaca: true })));
    await fetch(`/api/notif-penyewa?all=true`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ penyewaId: notifikasi[0]?.penyewaId }),
    });
  };

  // Format tanggal
  function formatTanggal(tgl: string) {
    const date = new Date(tgl);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <PenyewaNavbar />
      <main className="container mx-auto px-4 py-10 pl-0 lg:pl-64 transition-all duration-300 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-emerald-300 flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notifikasi
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllRead}
              disabled={notifikasi.length === 0}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              Tandai semua sudah dibaca
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={notifikasi.length === 0}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              Hapus semua
            </button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {loading && (
            <div className="text-center text-slate-400 py-16">
              Memuat notifikasi...
            </div>
          )}
          {!loading && notifikasi.length === 0 && (
            <div className="text-center text-slate-400 py-16">
              Tidak ada notifikasi.
            </div>
          )}
          {notifikasi.map((n) => (
            <div
              key={n._id}
              className={`relative rounded-xl border p-5 flex gap-4 items-start shadow transition ${
                n.sudahDibaca
                  ? "bg-slate-800/60 border-slate-700/40 opacity-70"
                  : "bg-slate-800/90 border-emerald-500/30"
              }`}
            >
              <div className="pt-1">
                <Info className="w-6 h-6 text-blue-400" />
                {/* Bisa tambahkan icon lain sesuai kebutuhan */}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-white">{n.judul}</span>
                  {!n.sudahDibaca && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 font-bold">
                      Baru
                    </span>
                  )}
                </div>
                <div className="text-slate-300 mt-1">{n.pesan}</div>
                <div className="text-xs text-slate-400 mt-2">{formatTanggal(n.tanggal)}</div>
                {!n.sudahDibaca && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="mt-3 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition"
                  >
                    Tandai sudah dibaca
                  </button>
                )}
              </div>
              <button
                onClick={() => handleDelete(n._id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-400 transition"
                title="Hapus notifikasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}