"use client";

import { useEffect, useState } from "react";
import { AdminNavbar } from "../navbar";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Calendar,
  FileText,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

type GrafikItem = { bulan: string; pemasukan: number; pengeluaran: number };
type Transaksi = { tipe: string; tanggal: string; deskripsi: string };

export default function DashboardKeuangan() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pemasukanBulanIni, setPemasukanBulanIni] = useState(0);
  const [pengeluaranBulanIni, setPengeluaranBulanIni] = useState(0);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [grafik, setGrafik] = useState<GrafikItem[]>([]);
  const [transaksiTerbaru, setTransaksiTerbaru] = useState<Transaksi[]>([]);

  useEffect(() => {
  fetchData();
    if (checkRole(["maintenance"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin/maintenance");
    } else if (checkRole(["admin"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin");
    } else if (!checkRole(["keuangan"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman ini.");
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/keuangan-dashboard");
    const data = await res.json();
    setPemasukanBulanIni(data.pemasukanBulanIni || 0);
    setPengeluaranBulanIni(data.pengeluaranBulanIni || 0);
    setTotalTagihan(data.totalTagihan || 0);
    setTotalPembayaran(data.totalPembayaran || 0);
    setGrafik(data.grafik || []);
    setTransaksiTerbaru(data.transaksiTerbaru || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-slate-200">
      <AdminNavbar />
      <main className="container mx-auto p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            Dashboard Keuangan
          </h1>
          <p className="text-slate-400 mt-2">
            Ringkasan keuangan kontrakan bulan ini.
          </p>
        </div>

        {/* Statistik cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <CreditCard className="h-8 w-8 text-emerald-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Pemasukan Bulan Ini</p>
              <p className="text-3xl font-bold mt-2 text-emerald-400">
                Rp {pemasukanBulanIni.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <CreditCard className="h-8 w-8 text-red-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Pengeluaran Bulan Ini</p>
              <p className="text-3xl font-bold mt-2 text-red-400">
                Rp {pengeluaranBulanIni.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <FileText className="h-8 w-8 text-yellow-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Tagihan Belum Lunas</p>
              <p className="text-3xl font-bold mt-2 text-yellow-400">{totalTagihan}</p>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <Calendar className="h-8 w-8 text-purple-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Total Pembayaran</p>
              <p className="text-3xl font-bold mt-2 text-purple-400">{totalPembayaran}</p>
            </div>
          </div>
        </div>

        {/* Grafik pemasukan/pengeluaran */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-lg text-emerald-200">Grafik Keuangan Bulanan</h3>
              </div>
              {/* Grafik dinamis */}
              <div className="h-64 flex items-end space-x-2">
                {loading ? (
                  <div className="text-slate-400 text-center w-full">Memuat data grafik...</div>
                ) : grafik.length === 0 ? (
                  <div className="text-slate-400 text-center w-full">Belum ada data grafik.</div>
                ) : (
                  grafik.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm"
                        style={{ height: `${Math.max(item.pemasukan / 1000000, 5)}%` }}
                        title={`Pemasukan: Rp ${item.pemasukan.toLocaleString("id-ID")}\nPengeluaran: Rp ${item.pengeluaran.toLocaleString("id-ID")}`}
                      ></div>
                      <div
                        className="w-full bg-gradient-to-t from-red-400 to-red-200 rounded-t-sm mt-1"
                        style={{ height: `${Math.max(item.pengeluaran / 1000000, 5)}%` }}
                        title={`Pengeluaran: Rp ${item.pengeluaran.toLocaleString("id-ID")}`}
                      ></div>
                      <span className="text-xs text-slate-400 mt-2">{item.bulan}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Riwayat transaksi terbaru */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h3 className="font-medium text-lg text-emerald-200 mb-4">Transaksi Terbaru</h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-slate-400">Memuat data transaksi...</div>
                ) : transaksiTerbaru.length === 0 ? (
                  <div className="text-slate-400">Belum ada transaksi.</div>
                ) : (
                  transaksiTerbaru.map((trx, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#1E293B] border border-[#334155]">
                      <div className="flex items-center justify-between">
                        <span className={
                          trx.tipe === "Pemasukan"
                            ? "bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full"
                            : "bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full"
                        }>
                          {trx.tipe}
                        </span>
                        <span className="text-xs text-slate-400">{trx.tanggal}</span>
                      </div>
                      <p className="mt-2 text-sm">{trx.deskripsi}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            className="border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
          >
            Laporan Keuangan
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Transaksi
          </Button>
        </div>
      </main>
    </div>
  );
}