"use client";

import { useState, useEffect } from "react";
import { Wrench, Search, Filter, User2, Home, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { AdminNavbar } from "../../navbar";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

type Laporan = {
  _id: string;
  nama: string;
  unit: string;
  tanggal: string;
  deskripsi: string;
  status: "belum" | "proses" | "selesai";
};

export default function LaporanMaintenance() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "belum" | "proses" | "selesai">("all");
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLaporan();
    if (checkRole(["keuangan"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin/keuangan");
    } else if (checkRole(["admin"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin");
    } else if (!checkRole(["maintenance"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman ini.");
      router.replace("/"); // Atau ke halaman lain sesuai kebutuhan
    }
  }, [router]);

  const fetchLaporan = async () => {
    setLoading(true);
    const res = await fetch("/api/laporan-maintenance");
    const data = await res.json();
    setLaporan(data.data || []);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: "belum" | "proses" | "selesai") => {
    await fetch("/api/laporan-maintenance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchLaporan();
  };

  const filtered = laporan.filter((lap) => {
    const match =
      lap.nama.toLowerCase().includes(search.toLowerCase()) ||
      lap.unit.toLowerCase().includes(search.toLowerCase()) ||
      lap.deskripsi.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filterStatus === "all" ? true : lap.status === filterStatus;
    return match && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <AdminNavbar />
      <main className="container mx-auto p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-emerald-300">
            <Wrench className="w-7 h-7" />
            Daftar Laporan Maintenance
          </h1>
          <div className="flex gap-2">
            {["belum", "proses", "selesai"].map((status) => (
              <button
                key={status}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  filterStatus === status
                    ? status === "belum"
                      ? "bg-red-600 border-red-500 text-white"
                      : status === "proses"
                      ? "bg-yellow-600 border-yellow-500 text-white"
                      : "bg-emerald-600 border-emerald-500 text-white"
                    : "bg-slate-800/60 border-slate-700 " +
                      (status === "belum"
                        ? "text-red-300"
                        : status === "proses"
                        ? "text-yellow-300"
                        : "text-emerald-300")
                }`}
                onClick={() => setFilterStatus(filterStatus === status ? "all" : (status as any))}
              >
                {status === "belum" ? (
                  <XCircle className="w-4 h-4" />
                ) : status === "proses" ? (
                  <Filter className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
            <div className="flex items-center bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, unit, atau masalah..."
                className="bg-transparent border-0 focus:outline-none text-sm text-slate-300 pl-2 w-40 md:w-56"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full overflow-x-auto rounded-2xl shadow border border-slate-700/50 bg-slate-800/60">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-900/70 text-emerald-200">
                  <th className="py-3 px-4 font-semibold text-center">Penyewa</th>
                  <th className="py-3 px-4 font-semibold text-center">Unit</th>
                  <th className="py-3 px-4 font-semibold text-center">Tanggal</th>
                  <th className="py-3 px-4 font-semibold text-center">Deskripsi</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Tidak ada laporan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((lap) => (
                    <tr
                      key={lap._id}
                      className="border-t border-slate-700/40 hover:bg-slate-800/90 transition group"
                    >
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <User2 className="w-5 h-5 text-emerald-400" />
                          <span className="font-medium">{lap.nama}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Home className="w-4 h-4 text-slate-400" />
                          <span>{lap.unit}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-200 font-semibold">{lap.tanggal}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-slate-200">{lap.deskripsi}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {lap.status === "selesai" ? (
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 justify-center">
                            <CheckCircle className="w-4 h-4" /> Selesai
                          </span>
                        ) : lap.status === "proses" ? (
                          <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 text-xs font-semibold flex items-center gap-1 justify-center">
                            <Clock className="w-4 h-4" /> Proses
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1 justify-center">
                            <XCircle className="w-4 h-4" /> Belum
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={lap.status}
                          onChange={e =>
                            handleStatusChange(lap._id, e.target.value as "belum" | "proses" | "selesai")
                          }
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="belum">Belum</option>
                          <option value="proses">Proses</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-400 flex items-center gap-2 justify-center">
          <FileText className="inline w-4 h-4" />
          Daftar laporan maintenance dari penyewa. Status dapat difilter & diubah.
        </div>
      </main>
    </div>
  );
}