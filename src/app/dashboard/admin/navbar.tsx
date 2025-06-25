"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Building,
  Users,
  CreditCard,
  LogOut,
  Bell,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  ClipboardList,
  DollarSign,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function AdminNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [penyewaOpen, setPenyewaOpen] = useState(false);
  const [opsiOpen, setOpsiOpen] = useState(false);
  const penyewaRef = useRef<HTMLDivElement>(null);
  const opsiRef = useRef<HTMLDivElement>(null);
  const [keuanganOpen, setKeuanganOpen] = useState(false);
  const keuanganRef = useRef<HTMLDivElement>(null);

  // Ambil user dari localStorage untuk foto profil
  const [user, setUser] = useState<{ photoURL?: string } | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (penyewaRef.current && !penyewaRef.current.contains(e.target as Node)) setPenyewaOpen(false);
      if (keuanganRef.current && !keuanganRef.current.contains(e.target as Node)) setKeuanganOpen(false);
      if (opsiRef.current && !opsiRef.current.contains(e.target as Node)) setOpsiOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard/admin", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Kontrakan", href: "/dashboard/admin/kontrakan", icon: <Building className="w-4 h-4 mr-2" /> },
    // Dropdowns below
  ];

  // Contoh notifikasi
  const notifications = [
    { id: 1, type: "tagihan", message: "Tagihan unit B5 jatuh tempo", time: "5 menit yang lalu" },
    { id: 2, type: "penyewa", message: "Penyewa baru di unit C3", time: "1 jam yang lalu" },
  ];

  return (
    <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo dan toggle menu mobile */}
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4 text-slate-400 hover:text-emerald-400 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/dashboard/admin" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 hidden md:block">
                Kontrakan Admin
              </h1>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center",
                  pathname === item.href
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {/* Dropdown: Penyewa */}
            <div className="relative" ref={penyewaRef}>
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  (pathname.startsWith("/dashboard/admin/penyewa") || pathname.startsWith("/dashboard/admin/daftar-pengajuan"))
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50"
                )}
                onClick={() => setPenyewaOpen((v) => !v)}
              >
                <Users className="w-4 h-4 mr-1" />
                User
                <ChevronDown className={`w-4 h-4 transition-transform ${penyewaOpen ? "rotate-180" : ""}`} />
              </button>
              {penyewaOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-slate-800 border border-slate-700/70 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard/admin/penyewa"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/penyewa" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Daftar Penyewa
                  </Link>
                  <Link
                    href="/dashboard/admin/daftar-pengajuan"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/daftar-pengajuan" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Daftar Pengajuan
                  </Link>
                  <Link
                    href="/dashboard/admin/user-kontrakan"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/daftar-pengajuan" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Daftar User
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown: Keuangan */}
            <div className="relative" ref={keuanganRef}>
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  (
                    pathname.startsWith("/dashboard/admin/keuangan") ||
                    pathname.startsWith("/dashboard/admin/pembayaran") ||
                    pathname.startsWith("/dashboard/admin/keuangan/notifikasi") ||
                    pathname.startsWith("/dashboard/admin/laporan-keuangan")
                  )
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50"
                )}
                onClick={() => setKeuanganOpen((v) => !v)}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Keuangan
                <ChevronDown className={`w-4 h-4 transition-transform ${keuanganOpen ? "rotate-180" : ""}`} />
              </button>
              {keuanganOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700/70 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard/admin/keuangan"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/keuangan" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Dashboard Keuangan
                  </Link>
                  <Link
                    href="/dashboard/admin/pembayaran"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/pembayaran" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Halaman Pembayaran
                  </Link>
                  <Link
                    href="/dashboard/admin/keuangan/notifikasi"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/notifikasi-pembayaran" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Notifikasi Pengingat Pembayaran
                  </Link>
                  <Link
                    href="/dashboard/admin/keuangan/keuangan"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/laporan-keuangan" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Laporan Keuangan
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown: Maintenance */}
            <div className="relative" ref={opsiRef}>
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  (pathname.startsWith("/dashboard/admin/maintenance/permintaan") || pathname.startsWith("/dashboard/admin/laporan-maintenance"))
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50"
                )}
                onClick={() => setOpsiOpen((v) => !v)}
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Maintenance
                <ChevronDown className={`w-4 h-4 transition-transform ${opsiOpen ? "rotate-180" : ""}`} />
              </button>
              {opsiOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-slate-800 border border-slate-700/70 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard/admin/maintenance"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/maintenance" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Dashboard Maintenance
                  </Link>
                  <Link
                    href="/dashboard/admin/maintenance/permintaan"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/maintenance/permintaan" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Permintaan Perbaikan
                  </Link>
                  <Link
                    href="/dashboard/admin/maintenance/laporan"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/laporan-maintenance" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Laporan Maintenance
                  </Link>
                  <Link
                    href="/dashboard/admin/maintenance/pembelian"
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-slate-700/50",
                      pathname === "/dashboard/admin/laporan-pembelian" ? "text-emerald-400" : "text-slate-300"
                    )}
                  >
                    Laporan Pembelian
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:flex items-center bg-slate-800/60 rounded-lg px-3 py-1.5 border border-slate-700/50">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="bg-transparent border-0 focus:outline-none text-sm text-slate-300 pl-2 w-32 lg:w-48"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-emerald-400 focus:outline-none relative"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400"></span>
              </button>

              {/* Notification dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700/70 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-medium text-emerald-300">Notifikasi</h3>
                    <span className="text-xs text-slate-400">Tandai semua dibaca</span>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-slate-700/50 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-white">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                          </div>
                          <span className={`h-2 w-2 rounded-full ${notification.type === 'tagihan' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-700">
                    <Link href="/admin/notifications" className="text-xs text-center block text-emerald-400 hover:text-emerald-300">
                      Lihat Semua Notifikasi
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800/70 focus:outline-none"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Foto Profil"
                    className="h-8 w-8 rounded-full object-cover border-2 border-emerald-400"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-emerald-400 to-teal-500 h-8 w-8 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/70 rounded-lg shadow-lg py-1 z-50">
                  <Link href="/dashboard/admin/profil" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50">
                    Profil Admin
                  </Link>
                  <div className="border-t border-slate-700 my-1"></div>
                  <Link href="/logout" className="block px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 pt-4 border-t border-slate-700/50">
                <nav className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center",
                        pathname === item.href
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                  {/* Dropdown mobile: Penyewa */}
                  <div className="col-span-2">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50"
                      onClick={() => setPenyewaOpen((v) => !v)}
                    >
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Penyewa
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${penyewaOpen ? "rotate-180" : ""}`} />
                    </button>
                    {penyewaOpen && (
                      <div className="pl-6">
                        <Link
                          href="/dashboard/admin/penyewa"
                          className={cn(
                            "block px-4 py-2 text-sm hover:bg-slate-700/50 rounded",
                            pathname === "/dashboard/admin/penyewa" ? "text-emerald-400" : "text-slate-300"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Daftar Penyewa
                        </Link>
                        <Link
                          href="/dashboard/admin/daftar-pengajuan"
                          className={cn(
                            "block px-4 py-2 text-sm hover:bg-slate-700/50 rounded",
                            pathname === "/dashboard/admin/daftar-pengajuan" ? "text-emerald-400" : "text-slate-300"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Daftar Pengajuan
                        </Link>
                      </div>
                    )}
                  </div>
                  {/* Dropdown mobile: Opsi */}
                  <div className="col-span-2">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50"
                      onClick={() => setOpsiOpen((v) => !v)}
                    >
                      <span className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Maintenance
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${opsiOpen ? "rotate-180" : ""}`} />
                    </button>
                    {opsiOpen && (
                      <div className="pl-6">
                        <Link
                          href="/dashboard/admin/pembayaran"
                          className={cn(
                            "block px-4 py-2 text-sm hover:bg-slate-700/50 rounded",
                            pathname === "/dashboard/admin/pembayaran" ? "text-emerald-400" : "text-slate-300"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Pembayaran
                        </Link>
                        <Link
                          href="/dashboard/admin/laporan-maintenance"
                          className={cn(
                            "block px-4 py-2 text-sm hover:bg-slate-700/50 rounded",
                            pathname === "/dashboard/admin/laporan-maintenance" ? "text-emerald-400" : "text-slate-300"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Laporan Maintenance
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/logout"
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center text-red-400 hover:bg-slate-800/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}