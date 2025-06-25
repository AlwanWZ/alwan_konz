"use client";

import { useState, useEffect } from "react";
import { FileText, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import { AdminNavbar } from "../../navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

type LaporanKeuangan = {
  _id: string;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  sumber: string;
  status: "menunggu" | "diterima" | "ditolak";
  bukti?: string;
};

export default function LaporanKeuanganPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "menunggu" | "diterima" | "ditolak">("all");
  const [laporan, setLaporan] = useState<LaporanKeuangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImg, setModalImg] = useState<string | null>(null);

  useEffect(() => {
    fetchLaporan();
    if (checkRole(["maintenance"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin/maintenance");
    } else if (checkRole(["admin"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin");
    } else if (!checkRole(["keuangan"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman ini.");
      router.replace("/"); // Atau ke halaman lain sesuai kebutuhan
    }
  }, [router]);
  async function fetchLaporan() {
    setLoading(true);
    const res = await fetch("/api/laporan_keuangan");
    const data = await res.json();
    setLaporan(data.data || []);
    setLoading(false);
  }

  async function handleVerifikasi(id: string, status: "diterima" | "ditolak") {
    await fetch("/api/laporan_keuangan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchLaporan();
  }

  const filtered = laporan.filter((lap) => {
    const match =
      lap.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
      lap.kategori?.toLowerCase().includes(search.toLowerCase()) ||
      lap.sumber?.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filterStatus === "all" ? true : lap.status === filterStatus;
    return match && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <AdminNavbar />
      <main className="container mx-auto p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-emerald-300">
            <FileText className="w-7 h-7" />
            Arsip Laporan Keuangan
          </h1>
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
                filterStatus === "menunggu"
                  ? "bg-yellow-600 border-yellow-500 text-white"
                  : "bg-slate-800/60 border-slate-700 text-yellow-300"
              }`}
              onClick={() => setFilterStatus(filterStatus === "menunggu" ? "all" : "menunggu")}
            >
              <Filter className="w-4 h-4" />
              Menunggu
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
                filterStatus === "diterima"
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-slate-800/60 border-slate-700 text-emerald-300"
              }`}
              onClick={() => setFilterStatus(filterStatus === "diterima" ? "all" : "diterima")}
            >
              <CheckCircle className="w-4 h-4" />
              Diterima
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
                filterStatus === "ditolak"
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-slate-800/60 border-slate-700 text-red-300"
              }`}
              onClick={() => setFilterStatus(filterStatus === "ditolak" ? "all" : "ditolak")}
            >
              <XCircle className="w-4 h-4" />
              Ditolak
            </button>
            <div className="flex items-center bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 ml-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari deskripsi, kategori, sumber..."
                className="bg-transparent border-0 focus:outline-none text-sm text-slate-300 pl-2 w-40 md:w-56"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full overflow-x-auto rounded-2xl shadow border border-slate-700/50 bg-slate-800/60">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="bg-slate-900/70 text-emerald-200">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4">Jumlah</th>
                  <th className="py-3 px-4">Sumber</th>
                  <th className="py-3 px-4">Bukti</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-slate-400">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-slate-400">
                      Tidak ada arsip laporan keuangan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((lap) => (
                    <tr key={lap._id} className="border-t border-slate-700/40">
                      <td className="py-3 px-4">{lap.tanggal?.slice(0, 10)}</td>
                      <td className="py-3 px-4">{lap.kategori}</td>
                      <td className="py-3 px-4">{lap.deskripsi}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-300">
                        Rp {lap.jumlah.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4">{lap.sumber}</td>
                      <td className="py-3 px-4">
                        {lap.bukti ? (
                          <button
                            type="button"
                            onClick={() => setModalImg(lap.bukti!)}
                            className="inline-block focus:outline-none"
                          >
                            <Image
                              src={lap.bukti}
                              alt="Bukti"
                              width={48}
                              height={48}
                              className="rounded shadow border border-slate-700 object-cover hover:scale-110 transition"
                            />
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {lap.status === "diterima" ? (
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 justify-center">
                            <CheckCircle className="w-4 h-4" /> Diterima
                          </span>
                        ) : lap.status === "ditolak" ? (
                          <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1 justify-center">
                            <XCircle className="w-4 h-4" /> Ditolak
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 text-xs font-semibold flex items-center gap-1 justify-center">
                            <Filter className="w-4 h-4" /> Menunggu
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {lap.status === "menunggu" ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-xs text-white flex items-center gap-1"
                              onClick={() => handleVerifikasi(lap._id, "diterima")}
                            >
                              <CheckCircle className="w-4 h-4" /> Terima
                            </button>
                            <button
                              className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-xs text-white flex items-center gap-1"
                              onClick={() => handleVerifikasi(lap._id, "ditolak")}
                            >
                              <XCircle className="w-4 h-4" /> Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Terverifikasi</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Preview Gambar */}
        {modalImg && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setModalImg(null)}
          >
            <div className="relative">
              {/* Gunakan <img> agar support url eksternal/non-static */}
              <img
                src={modalImg}
                alt="Bukti besar"
                className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
                onClick={e => e.stopPropagation()}
              />
              <button
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2"
                onClick={() => setModalImg(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}