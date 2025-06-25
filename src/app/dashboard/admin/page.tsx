"use client";

import { AdminNavbar } from "./navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  CreditCard,
  TrendingUp,
  Bell,
  Calendar,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

export default function AdminDashboardPage() {
  const [stat, setStat] = useState({
    kontrakan: 0,
    penyewa: 0,
    tagihanBelumLunas: 0,
    pembayaranBulanIni: 0,
  });
  const [okupansi, setOkupansi] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [notif, setNotif] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Hanya admin yang boleh akses, keuangan & maintenance tidak boleh
    if (!checkRole(["admin"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman ini.");
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const user = userStr ? JSON.parse(userStr) : {};
      if (user.role === "keuangan") {
        router.replace("/dashboard/admin/keuangan");
      } else if (user.role === "maintenance") {
        router.replace("/dashboard/admin/maintenance");
      } else {
        router.replace("/login");
      }
    }
  }, [router]);

  useEffect(() => {
    // Fetch statistik utama
    const fetchStats = async () => {
      try {
        // 1. Jumlah kontrakan
        const kontrakanRes = await fetch("/api/kontrakan");
        const kontrakanData = await kontrakanRes.json();

        // 2. Total penyewa
        const penyewaRes = await fetch("/api/user?role=penyewa");
        const penyewaData = await penyewaRes.json();

        // 3. Pembayaran penyewa
        const pembayaranRes = await fetch("/api/pembayaran-penyewa");
        const pembayaranData = await pembayaranRes.json();

        // Tagihan belum lunas
        const tagihanBelumLunas = (pembayaranData.data || []).filter(
          (p: any) => p.status !== "Lunas"
        ).length;

        // Pembayaran bulan ini
        const now = new Date();
        const pembayaranBulanIni = (pembayaranData.data || [])
          .filter(
            (p: any) =>
              p.status === "Lunas" &&
              p.tanggalBayar &&
              new Date(p.tanggalBayar).getMonth() === now.getMonth() &&
              new Date(p.tanggalBayar).getFullYear() === now.getFullYear()
          )
          .reduce((sum: number, p: any) => sum + (p.jumlah || 0), 0);

        setStat({
          kontrakan: kontrakanData.data?.length || 0,
          penyewa: penyewaData.data?.length || 0,
          tagihanBelumLunas,
          pembayaranBulanIni,
        });

        // Notifikasi terbaru (ambil 3 terakhir)
        const notifList: any[] = [];
        (pembayaranData.data || [])
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3)
          .forEach((p: any) => {
            if (p.status !== "Lunas") {
              notifList.push({
                type: "Tagihan",
                waktu: "Baru",
                pesan: `Tagihan unit ${p.kontrakan} jatuh tempo bulan ${p.bulan}`,
              });
            } else {
              notifList.push({
                type: "Pembayaran",
                waktu: "Baru",
                pesan: `Unit ${p.kontrakan} telah membayar tagihan bulan ${p.bulan}`,
              });
            }
          });
        setNotif(notifList);

        // Statistik okupansi mingguan (jumlah pembayaran lunas per hari minggu ini)
        const okupansiArr = [0, 0, 0, 0, 0, 0, 0]; // Senin-Minggu
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Senin
        (pembayaranData.data || []).forEach((p: any) => {
          if (p.status === "Lunas" && p.tanggalBayar) {
            const tgl = new Date(p.tanggalBayar);
            if (
              tgl >= startOfWeek &&
              tgl <= now &&
              tgl.getMonth() === now.getMonth() &&
              tgl.getFullYear() === now.getFullYear()
            ) {
              const dayIdx = (tgl.getDay() + 6) % 7; // Senin=0, Minggu=6
              okupansiArr[dayIdx]++;
            }
          }
        });
        setOkupansi(okupansiArr);
      } catch (err) {
        // Fallback dummy jika error
        setStat({
          kontrakan: 0,
          penyewa: 0,
          tagihanBelumLunas: 0,
          pembayaranBulanIni: 0,
        });
        setOkupansi([0, 0, 0, 0, 0, 0, 0]);
        setNotif([]);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-slate-200">
      <AdminNavbar />
      <main className="container mx-auto p-6 md:p-8">
        {/* Pesan Selamat Datang */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-emerald-700/30 to-teal-700/20 border border-emerald-500/20 rounded-xl px-6 py-4 flex items-center gap-4 shadow">
            <span className="text-2xl">👋</span>
            <div>
              <div className="text-lg font-semibold text-emerald-300">Selamat datang, Admin!</div>
              <div className="text-slate-400 text-sm">Anda berhasil login ke Dashboard Admin.</div>
            </div>
          </div>
        </div>
        {/* Header dengan greeting dan tanggal */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            Dashboard Admin
          </h1>
          <p className="text-slate-400 mt-2">
            Selamat datang kembali! Berikut adalah ringkasan data Kontrakan AA.
          </p>
        </div>

        {/* Statistik cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <Home className="h-8 w-8 text-emerald-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Jumlah Kontrakan</p>
              <p className="text-3xl font-bold mt-2 text-emerald-400">{stat.kontrakan}</p>
              <div className="mt-4 flex items-center text-xs">
                <div className="flex items-center text-emerald-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Aktif</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <Users className="h-8 w-8 text-teal-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Total Penyewa</p>
              <p className="text-3xl font-bold mt-2 text-teal-400">{stat.penyewa}</p>
              <div className="mt-4 flex items-center text-xs">
                <div className="flex items-center text-teal-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Aktif</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <CreditCard className="h-8 w-8 text-red-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Tagihan Belum Lunas</p>
              <p className="text-3xl font-bold mt-2 text-red-400">{stat.tagihanBelumLunas}</p>
              <div className="mt-4 flex items-center text-xs">
                <div className="flex items-center text-red-300">
                  <Bell className="h-3 w-3 mr-1" />
                  <span>Aktif</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <Calendar className="h-8 w-8 text-purple-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Pembayaran Bulan Ini</p>
              <p className="text-3xl font-bold mt-2 text-purple-400">
                Rp {stat.pembayaranBulanIni.toLocaleString("id-ID")}
              </p>
              <div className="mt-4 flex items-center text-xs">
                <div className="flex items-center text-purple-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grafik aktivitas mingguan */}
          <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-lg text-emerald-200">Statistik Okupansi</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200"
                  >
                    Mingguan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-700 text-emerald-200"
                  >
                    Bulanan
                  </Button>
                </div>
              </div>

              {/* Bar chart visualization */}
              <div className="h-64 flex items-end space-x-2">
                {okupansi.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm"
                      style={{ height: `${Math.max(value * 10, 8)}%` }}
                    ></div>
                    <span className="text-xs text-slate-400 mt-2">
                      {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent notifications */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h3 className="font-medium text-lg text-emerald-200 mb-4">Pemberitahuan Terbaru</h3>
              <div className="space-y-4">
                {notif.length === 0 && (
                  <div className="text-slate-400 text-sm">Belum ada pemberitahuan.</div>
                )}
                {notif.map((n, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#1E293B] border border-[#334155]">
                    <div className="flex items-center justify-between">
                      <span
                        className={`${
                          n.type === "Tagihan"
                            ? "bg-red-500/20 text-red-300"
                            : n.type === "Pembayaran"
                            ? "bg-teal-500/20 text-teal-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        } text-xs px-2 py-1 rounded-full`}
                      >
                        {n.type}
                      </span>
                      <span className="text-xs text-slate-400">{n.waktu}</span>
                    </div>
                    <p className="mt-2 text-sm">{n.pesan}</p>
                  </div>
                ))}
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
            Laporan Bulanan
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Kontrakan
          </Button>
        </div>
      </main>
    </div>
  );
}