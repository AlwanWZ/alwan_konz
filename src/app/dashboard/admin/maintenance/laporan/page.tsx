"use client";

import { useState, useEffect } from "react";
import { Wrench, Search, CheckCircle, User2, Home, FileText, Edit2 } from "lucide-react";
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
  hasil?: string;
};

export default function LaporanMaintenance() {
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [hasilInput, setHasilInput] = useState("");
  const [laporan, setLaporan] = useState<Laporan[]>([]);
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
    const res = await fetch("/api/laporan-maintenance");
    const data = await res.json();
    // Filter hanya yang statusnya selesai
    setLaporan((data.data || []).filter((lap: Laporan) => lap.status === "selesai"));
  };

  const filtered = laporan.filter((lap) => {
    const match =
      lap.nama.toLowerCase().includes(search.toLowerCase()) ||
      lap.unit.toLowerCase().includes(search.toLowerCase()) ||
      lap.deskripsi.toLowerCase().includes(search.toLowerCase());
    return match;
  });

  const handleEdit = (id: string, hasil: string = "") => {
    setEditId(id);
    setHasilInput(hasil);
  };

  const handleSave = async (id: string) => {
    // PATCH untuk update hasil pekerjaan
    await fetch("/api/laporan-maintenance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, hasil: hasilInput }),
    });
    setEditId(null);
    setHasilInput("");
    fetchLaporan();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <AdminNavbar />
      <main className="container mx-auto p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-emerald-300">
            <Wrench className="w-7 h-7" />
            Data Laporan Maintenance (Sudah Ditangani)
          </h1>
          <div className="flex gap-2">
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
                  <th className="py-3 px-4 font-semibold text-center">Hasil Pekerjaan</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Tidak ada laporan yang sudah ditangani.
                    </td>
                  </tr>
                )}
                {filtered.map((lap) => (
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
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 justify-center">
                        <CheckCircle className="w-4 h-4" /> Selesai
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editId === lap._id ? (
                        <div className="flex flex-col items-center gap-2">
                          <textarea
                            className="w-40 md:w-56 rounded bg-slate-900/60 border border-slate-700 text-slate-200 px-2 py-1 text-xs resize-none"
                            rows={2}
                            value={hasilInput}
                            onChange={(e) => setHasilInput(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-xs"
                              onClick={() => handleSave(lap._id)}
                            >
                              Simpan
                            </button>
                            <button
                              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-800 text-xs"
                              onClick={() => setEditId(null)}
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-slate-200">
                            {lap.hasil && lap.hasil.trim() !== ""
                              ? lap.hasil
                              : <span className="italic text-slate-400">Belum diisi</span>}
                          </span>
                          <button
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs mt-1"
                            onClick={() => handleEdit(lap._id, lap.hasil || "")}
                          >
                            <Edit2 className="w-3 h-3" />
                            {lap.hasil && lap.hasil.trim() !== "" ? "Edit" : "Isi"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-400 flex items-center gap-2 justify-center">
          <FileText className="inline w-4 h-4" />
          Melihat dan mengisi laporan hasil pekerjaan perbaikan.
        </div>
      </main>
    </div>
  );
}