"use client";

import { useEffect, useState } from "react";
import { TamuNavbar } from "./navbar";
import Footer from "@components/layout/footer";
import {
  CreditCard,
  Bell,
  Download,
  AlertCircle,
  CheckCircle,
  User,
  Info,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "Lunas";
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
        isPaid
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-red-500/20 text-red-400 border-red-500/30"
      }`}
    >
      {isPaid ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {status}
    </span>
  );
}

function NotifIcon({ type }: { type: string }) {
  if (type === "info") return <Info className="w-5 h-5 text-blue-400" />;
  if (type === "success") return <CheckCircle className="w-5 h-5 text-emerald-400" />;
  if (type === "warning") return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  return null;
}

export default function DashboardTamu() {
  const [pembayaran, setPembayaran] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notifikasi, setNotifikasi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; photoURL?: string; uid?: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const userObj = JSON.parse(userStr);
    setUser(userObj);

    // Fetch pembayaran
    fetch(`/api/payments?userId=${userObj.uid}`)
      .then((res) => res.json())
      .then((data) => setPembayaran(data.data || data.payments || []));

    // Fetch pengumuman
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.data || data.announcements || []));

    // Fetch notifikasi
    fetch(`/api/notifications?userId=${userObj.uid}`)
      .then((res) => res.json())
      .then((data) => setNotifikasi(data.data || []));

    setLoading(false);
  }, []);

  // Hitung jumlah notifikasi belum dibaca
  const notifBaru = notifikasi.filter((n) => !n.read).length;
  const previewNotifikasi = notifikasi.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <TamuNavbar/>
      <main className="lg:ml-64 flex-grow">
        {/* Header Selamat Datang */}
        <section className="container mx-auto px-4 pt-10 pb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-700/30 rounded-2xl shadow-lg p-6 md:p-10 mb-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-400 overflow-hidden shadow-lg bg-slate-800 flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-emerald-300" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-300 mb-2">
                Selamat datang, {user?.name || "Tamu"}!
              </h1>
              <p className="text-slate-300 text-lg">
                Ini adalah dashboard tamu kontrakan. Cek riwayat pembayaran, pengumuman, dan info penting lainnya di sini.
              </p>
            </div>
          </div>
        </section>

        {/* Notifikasi Preview */}
        <section className="container mx-auto px-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-100">Notifikasi Terbaru</h3>
              <Link href="/tamu/notifikasi" className="ml-auto text-emerald-300 hover:underline text-sm">
                Lihat semua &rarr;
              </Link>
            </div>
            {previewNotifikasi.length === 0 ? (
              <div className="text-slate-400 text-center py-4">Tidak ada notifikasi.</div>
            ) : (
              <ul className="space-y-3">
                {previewNotifikasi.map((n) => (
                  <li
                    key={n._id}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
                      n.read
                        ? "bg-slate-800/50 border border-slate-700/40 opacity-80"
                        : "bg-slate-900/70 border border-emerald-700/30"
                    }`}
                  >
                    <NotifIcon type={n.type} />
                    <div>
                      <div className="font-medium text-slate-100">{n.title}</div>
                      <div className="text-slate-300 text-sm">{n.message}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(n.time).toLocaleString("id-ID")}
                        {!n.read && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 font-bold">
                            Baru
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Tabel Pembayaran */}
        <section className="container mx-auto px-4 py-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl shadow-lg overflow-x-auto mb-8">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                Riwayat Pembayaran Bulanan
              </h2>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-semibold shadow"
                onClick={() => alert("Export data pembayaran!")}
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-emerald-200 bg-slate-900/70">
                  <th className="py-3 px-4">Bulan</th>
                  <th className="py-3 px-4">Jatuh Tempo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Jumlah</th>
                  <th className="py-3 px-4">Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody>
                {pembayaran.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      Tidak ada data pembayaran.
                    </td>
                  </tr>
                )}
                {pembayaran.map((p, idx) => (
                  <tr key={idx} className="border-t border-slate-700/40">
                    <td className="py-3 px-4">{p.bulan}</td>
                    <td className="py-3 px-4">{p.jatuhTempo}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-emerald-300 font-semibold">
                      Rp {p.jumlah?.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">{p.tanggalBayar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pengumuman */}
          <div className="mt-8">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-slate-100">
                  Pengumuman Terbaru
                </h3>
              </div>
              <div className="space-y-4">
                {announcements.length === 0 && (
                  <div className="text-slate-400 text-center py-8">
                    Tidak ada pengumuman.
                  </div>
                )}
                {announcements.map((a, idx) => (
                  <div key={idx} className="bg-slate-900/70 border-l-4 border-emerald-500 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-slate-100">{a.title}</span>
                      <span className="text-xs text-slate-400">{a.date ? new Date(a.date).toLocaleDateString("id-ID") : ""}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}