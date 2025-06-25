"use client";

import { useState, useEffect } from "react";
import { Search, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { AdminNavbar } from "../navbar";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

const statusOptions = [
  { value: "semua", label: "Semua Status" },
  { value: "Lunas", label: "Lunas" },
  { value: "Belum Lunas", label: "Belum Lunas" },
  { value: "Pending", label: "Pending" },
];

// Komponen tanggal agar tidak menyebabkan hydration mismatch
function TanggalBayar({ value }: { value: string }) {
  const [tgl, setTgl] = useState("-");
  useEffect(() => {
    if (value) setTgl(new Date(value).toLocaleDateString("id-ID"));
  }, [value]);
  return <>{tgl}</>;
}

export default function PembayaranPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [bulanFilter, setBulanFilter] = useState("semua");
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
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

  // Fetch data pembayaran dari API
  useEffect(() => {
    fetch("/api/pembayaran-penyewa")
      .then(res => res.json())
      .then(res => setData(res.data || []));
  }, []);

  // Ambil bulan unik dari data
  const uniqueMonths = [
    ...new Set(data.map((p) => p.bulan)),
  ];

  // Filter data
  const filtered = data.filter((p) => {
    const matchSearch =
      p.nama?.toLowerCase().includes(search.toLowerCase()) ||
      p.kontrakan?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "semua" ? true : p.status === statusFilter;
    const matchBulan =
      bulanFilter === "semua" ? true : p.bulan === bulanFilter;
    return matchSearch && matchStatus && matchBulan;
  });

  // Statistik
  const totalPendapatan = data.reduce(
    (acc, cur) => acc + (cur.status === "Lunas" ? cur.jumlah : 0),
    0
  );
  const totalPembayaran = data.length;
  const totalLunas = data.filter((p) => p.status === "Lunas").length;
  const totalPenyewa = [
    ...new Set(data.map((p) => p.nama)),
  ].length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <AdminNavbar />
      <div className="container mx-auto p-6 md:p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-emerald-400 mb-2">
          Riwayat Pembayaran
        </h1>
        <p className="text-slate-400 mb-8">
          Monitor dan kelola semua transaksi pembayaran kontrakan
        </p>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#172136] border border-[#22304a] rounded-xl p-6 flex flex-col justify-between">
            <div className="text-slate-400 text-sm mb-2">Total Pendapatan</div>
            <div className="text-2xl font-bold text-emerald-400 mb-2">
              Rp {totalPendapatan.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="bg-[#172136] border border-[#22304a] rounded-xl p-6 flex flex-col justify-between">
            <div className="text-slate-400 text-sm mb-2">Pembayaran Lunas</div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {totalPembayaran === 0 ? 0 : Math.round((totalLunas / totalPembayaran) * 100)}%
            </div>
            <div className="text-slate-400 text-xs">
              {totalLunas} dari {totalPembayaran} pembayaran
            </div>
          </div>
          <div className="bg-[#172136] border border-[#22304a] rounded-xl p-6 flex flex-col justify-between">
            <div className="text-slate-400 text-sm mb-2">Total Penyewa</div>
            <div className="text-2xl font-bold text-emerald-400 mb-2">
              {totalPenyewa}
            </div>
          </div>
        </div>

        {/* Filter dan Export */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Search */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau kontrakan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full bg-[#1E293B] border-[#334155] text-slate-200 placeholder-slate-400 rounded-lg py-2 border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            {/* Filter */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-[#1E293B] border-[#334155] text-slate-200 rounded-lg py-2 px-3 border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Bulan */}
                <select
                  value={bulanFilter}
                  onChange={(e) => setBulanFilter(e.target.value)}
                  className="w-full bg-[#1E293B] border-[#334155] text-slate-200 rounded-lg py-2 px-3 border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="semua">Semua Bulan</option>
                  {uniqueMonths.map((bulan) => (
                    <option key={bulan} value={bulan}>
                      {bulan}
                    </option>
                  ))}
                </select>
                {/* Export */}
                <button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 font-semibold transition"
                  onClick={() => alert("Export data!")}
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Pembayaran */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-emerald-200 bg-[#172136]">
                <th className="py-3 px-4">#ID</th>
                <th className="py-3 px-4">Nama Penyewa</th>
                <th className="py-3 px-4">Kontrakan</th>
                <th className="py-3 px-4">Bulan</th>
                <th className="py-3 px-4">Tanggal Bayar</th>
                <th className="py-3 px-4">Jumlah</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada data pembayaran.
                  </td>
                </tr>
              )}
              {filtered.map((p, idx) => (
                <tr key={p._id || idx} className="border-t border-[#22304a]">
                  <td className="py-3 px-4">#{idx + 1}</td>
                  <td className="py-3 px-4">{p.nama}</td>
                  <td className="py-3 px-4">{p.kontrakan}</td>
                  <td className="py-3 px-4">{p.bulan}</td>
                  <td className="py-3 px-4">
                    {p.tanggalBayar ? <TanggalBayar value={p.tanggalBayar} /> : "-"}
                  </td>
                  <td className="py-3 px-4 text-emerald-300 font-semibold">
                    Rp {p.jumlah?.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4">
                    {p.status === "Lunas" ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                        <CheckCircle className="w-4 h-4" /> Lunas
                      </span>
                    ) : p.status === "Belum Lunas" ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
                        <XCircle className="w-4 h-4" /> Belum Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold">
                        <Clock className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 rounded border border-emerald-500 text-emerald-300 hover:bg-emerald-500/10 text-xs font-semibold mr-2">
                      Detail
                    </button>
                    {p.status !== "Lunas" && (
                      <button className="px-3 py-1 rounded border border-emerald-500 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold">
                        Bayar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-slate-400 text-sm">
          <span>
            Menampilkan {filtered.length} dari {data.length} pembayaran
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-700 text-xs">
              Sebelumnya
            </button>
            <span className="px-3 py-1 rounded border border-emerald-500 text-emerald-300 text-xs bg-emerald-500/10">
              1
            </span>
            <button className="px-3 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-700 text-xs">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}