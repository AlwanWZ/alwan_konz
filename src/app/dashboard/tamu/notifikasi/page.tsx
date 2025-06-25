"use client";
import { useEffect, useState } from "react";
import { Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { TamuNavbar } from "../../tamu/navbar";

export default function NotifikasiTamu() {
  const [notifikasi, setNotifikasi] = useState<any[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    fetch(`/api/notifications?userId=${user.uid}`)
      .then((res) => res.json())
      .then((data) => setNotifikasi(data.data || []));
  }, []);

  // Handler untuk menghapus notifikasi
const handleDelete = async (id: string) => {
  if (!id) return;
  if (!confirm("Hapus notifikasi ini?")) return;
  const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
  if (res.ok) {
    setNotifikasi((prev) => prev.filter((n) => n._id !== id));
  } else {
    const error = await res.json();
    alert("Gagal menghapus notifikasi. " + (error?.error || ''));
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <TamuNavbar />
      <main className="container mx-auto px-4 py-10 pl-0 lg:pl-64 transition-all duration-300 flex-1">
        <div className="max-w-2xl mx-auto space-y-4">
          {notifikasi.length === 0 && (
            <div className="text-center text-slate-400 py-16">
              Tidak ada notifikasi.
            </div>
          )}
          {notifikasi.map((n) => (
            <div
              key={n._id}
              className={`relative rounded-xl border p-5 flex gap-4 items-start shadow transition ${
                n.read
                  ? "bg-slate-800/60 border-slate-700/40 opacity-70"
                  : "bg-slate-800/90 border-emerald-500/30"
              }`}
            >
              <button
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                title="Hapus notifikasi"
                onClick={() => handleDelete(n._id)}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="pt-1">
                {n.type === "info" && <Info className="w-6 h-6 text-blue-400" />}
                {n.type === "success" && <CheckCircle className="w-6 h-6 text-emerald-400" />}
                {n.type === "warning" && <AlertTriangle className="w-6 h-6 text-yellow-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-white">{n.title}</span>
                  {!n.read && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 font-bold">
                      Baru
                    </span>
                  )}
                </div>
                <div className="text-slate-300 mt-1">{n.message}</div>
                <div className="text-xs text-slate-400 mt-2">{new Date(n.time).toLocaleString("id-ID")}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}