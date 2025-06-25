"use client";

import React, { useEffect, useState } from "react";
import { PenyewaNavbar } from "./navbar";
import Footer from "@components/layout/footer";
import { 
  Home, CreditCard, Bell, User, LogOut, Calendar, 
  CheckCircle, AlertCircle, Phone, Mail, ChevronRight 
} from "lucide-react";

// Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const isPaid = status === "Lunas";
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
      isPaid 
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
        : "bg-red-500/20 text-red-400 border border-red-500/30"
    }`}>
      {isPaid ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
      {status}
    </div>
  );
};

// Card
const DashboardCard = ({ title, icon, children, className = "" }: any) => (
  <div className={`bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 p-4 border-b border-slate-700/50 flex items-center gap-3">
      <div className="bg-slate-900 p-2 rounded-lg">
        {icon}
      </div>
      <h2 className="text-lg font-medium text-slate-100">{title}</h2>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const PenyewaDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [kontrakan, setKontrakan] = useState<any>(null);
  const [pembayaran, setPembayaran] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  const localUser = JSON.parse(userStr);
  setUser(localUser);

  // Ambil data kontrakan berdasarkan nama kontrakan di user
  fetch("/api/kontrakan")
    .then(res => res.json())
    .then(data => {
      // Cari kontrakan berdasarkan nama (bukan penyewaId)
      const kontrakanUser = (data.data || []).find(
        (k: any) => k.nama === localUser.kontrakan
      );
      setKontrakan(kontrakanUser);

      // Ambil pembayaran berdasarkan userId
      fetch(`/api/pembayaran-penyewa?userId=${localUser.uid}`)
        .then(res => res.json())
        .then(data => setPembayaran(data.data || []))
        .finally(() => setLoading(false));
    });
}, []);

  // Data fallback jika belum ada
  const namaKontrakan = kontrakan?.nama || "-";
  const alamatKontrakan = kontrakan?.alamat || "-";
  const hargaKontrakan = kontrakan?.harga ? formatRupiah(kontrakan.harga) : "-";
  const fasilitas = kontrakan?.fasilitas?.join(", ") || "-";
  const fotoKontrakan = kontrakan?.foto?.[0] || "/api/placeholder/600/300";

  // Pembayaran terakhir
  const pembayaranTerakhir = pembayaran[0];
  const statusApril = pembayaran.find((p: any) => p.bulan === "April 2025")?.status === "sukses" ? "Lunas" : "Belum Dibayar";
  const statusMei = pembayaran.find((p: any) => p.bulan === "Mei 2025")?.status === "sukses" ? "Lunas" : "Belum Dibayar";
  const tenggat = pembayaranTerakhir?.jatuhTempo || "-";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <PenyewaNavbar />
      <main className="lg:ml-64 flex-grow">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-teal-900/20"></div>
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          <div className="relative container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-3xl">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                Dashboard Penyewa
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 mb-3">
                Selamat datang kembali{user?.name ? `, ${user.name}!` : "!"}
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Pantau status kontrakan, pembayaran, dan pengumuman penting di sini. Semua informasi yang Anda butuhkan dalam satu tempat.
              </p>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-20 text-slate-400">Memuat data...</div>
          ) : (
          <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-lg border border-emerald-500/40">
                <Home className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Kontrakan</p>
                <p className="text-lg font-semibold text-slate-100">{namaKontrakan}</p>
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
              <div className="bg-teal-500/20 p-3 rounded-lg border border-teal-500/40">
                <CreditCard className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Harga Sewa</p>
                <p className="text-lg font-semibold text-slate-100">{hargaKontrakan} / bulan</p>
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
              <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/40">
                <Calendar className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Tenggat Pembayaran</p>
                <p className="text-lg font-semibold text-slate-100">{tenggat}</p>
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/40">
                <Bell className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Notifikasi</p>
                <p className="text-lg font-semibold text-slate-100">2 Baru</p>
              </div>
            </div>
          </div>
          
          {/* Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informasi Kontrakan */}
            <DashboardCard 
              title="Informasi Kontrakan" 
              icon={<Home className="h-5 w-5 text-emerald-400" />}
            >
              <div className="space-y-4">
                <div>
                  <img 
                    src={fotoKontrakan} 
                    alt={namaKontrakan} 
                    className="w-full h-40 object-cover rounded-lg mb-4" 
                  />
                  <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <p className="text-slate-400">Nama Kontrakan</p>
                      <p className="font-medium text-emerald-300">{namaKontrakan}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-slate-400">Alamat</p>
                      <p className="text-slate-200 text-right">{alamatKontrakan}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-slate-400">Harga Sewa</p>
                      <p className="font-medium text-emerald-300">{hargaKontrakan} / bulan</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-slate-400">Fasilitas</p>
                      <p className="text-slate-200 text-right">{fasilitas}</p>
                    </div>
                  </div>
                </div>
                <a 
                  href="/detail-kontrakan"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  <span>Lihat Detail Kontrakan</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </DashboardCard>
            {/* Status Pembayaran */}
            <DashboardCard 
              title="Status Pembayaran" 
              icon={<CreditCard className="h-5 w-5 text-emerald-400" />}
            >
              <div className="space-y-5">
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg divide-y divide-slate-700/50">
                  {pembayaran.length === 0 ? (
                    <div className="p-4 text-slate-400 text-center">Belum ada data pembayaran.</div>
                  ) : (
                    pembayaran.slice(0,2).map((item, idx) => (
                      <div className="p-4 flex items-center justify-between" key={idx}>
                        <div>
                          <p className="text-slate-100 font-medium">{item.bulan}</p>
                          <p className="text-slate-400 text-sm">Jatuh tempo: {item.jatuhTempo || "-"}</p>
                        </div>
                        <StatusBadge status={item.status === "sukses" ? "Lunas" : "Belum Dibayar"} />
                      </div>
                    ))
                  )}
                </div>
                <button className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Bayar Sekarang</span>
                </button>
                <a 
                  href="/dashboard/penyewa/pembayaran"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  <span>Lihat Riwayat Pembayaran</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </DashboardCard>
            {/* Kontak Admin */}
            <DashboardCard 
              title="Kontak Admin" 
              icon={<Phone className="h-5 w-5 text-emerald-400" />}
            >
              <div className="space-y-5">
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/40">
                      <Phone className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Telepon/WhatsApp</p>
                      <a href="tel:0895320695308" className="text-slate-100 font-medium hover:text-emerald-300 transition-colors">
                        0895-3206-95308
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2.5 rounded-lg border border-purple-500/40">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <a href="mailto:admin@kontrakan.com" className="text-slate-100 font-medium hover:text-emerald-300 transition-colors">
                        admin@kontrakan.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Telepon</span>
                  </button>
                  <button className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-300 text-sm mb-2">Jam operasional admin:</p>
                  <p className="text-slate-400 text-sm">Senin - Jumat: 08.00 - 17.00 WIB</p>
                  <p className="text-slate-400 text-sm">Sabtu: 08.00 - 12.00 WIB</p>
                </div>
              </div>
            </DashboardCard>
          </div>
          {/* Pengumuman */}
          <div className="mt-8">
            <DashboardCard 
              title="Pengumuman Terbaru" 
              icon={<Bell className="h-5 w-5 text-emerald-400" />}
              className="w-full"
            >
              <div className="space-y-4">
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 border-l-4 border-l-emerald-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg text-slate-100">Pemeliharaan Sistem Air</h3>
                    <span className="text-xs text-slate-400">15 Mei 2025</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Akan ada pemeliharaan sistem air pada tanggal 20 Mei 2025 pukul 08.00-12.00 WIB. Air akan mati sementara selama pemeliharaan. Mohon maaf atas ketidaknyamanannya.
                  </p>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg text-slate-100">Pembayaran Bulan Mei</h3>
                    <span className="text-xs text-slate-400">10 Mei 2025</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Jangan lupa melakukan pembayaran kontrakan untuk bulan Mei 2025 sebelum tanggal 25 Mei 2025. Pembayaran dapat dilakukan melalui transfer bank atau melalui sistem pembayaran di aplikasi.
                  </p>
                </div>
                <a 
                  href="/pengumuman"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  <span>Lihat Semua Pengumuman</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </DashboardCard>
          </div>
          </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PenyewaDashboard;