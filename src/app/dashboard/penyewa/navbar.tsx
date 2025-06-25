"use client";

import { Cpu, Home, CreditCard, Bell, User, LogOut, Menu, X, Wrench, ChevronDown, Star } from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

// ...existing code...

export function PenyewaNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // ...isActive function...

  const menu = [
    {
      href: "/dashboard/penyewa",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/dashboard/penyewa/pembayaran",
      label: "Pembayaran",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/penyewa/notifikasi",
      label: "Notifikasi",
      icon: <Bell className="h-5 w-5" />,
      badge: (
        <span className="ml-auto bg-emerald-500 text-emerald-950 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
      ),
    },
    // Dropdown group
    {
      dropdown: true,
      label: "Layanan Penyewa",
      icon: <Wrench className="h-5 w-5" />,
      children: [
        {
          href: "/dashboard/penyewa/maintenance",
          label: "Laporkan kerusakan",
          icon: <Wrench className="h-5 w-5" />,
        },
        {
          href: "/dashboard/penyewa/sistem-rating",
          label: "Nilai Kami",
          icon: <Star className="h-5 w-5" />,
        },
      ],
    },
    {
      href: "/dashboard/penyewa/profil",
      label: "Profil",
      icon: <User className="h-5 w-5" />,
    },
  ];

  function isActive(href: string | undefined) {
    if (!href) return false;
    return pathname === href;
  }

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800/50 shadow-xl hidden lg:flex flex-col z-20">
        <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-800/50">
          <Cpu className="h-8 w-8 text-emerald-400" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            Kontrakan AA
          </h1>
        </div>
        <nav className="flex-1 pt-6">
          <ul className="space-y-1 px-3">
            {menu.map((item, idx) =>
              item.dropdown ? (
                <li key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((open) => !open)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full transition-colors ${
                      item.children.some((child) => isActive(child.href))
                        ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-300"
                        : "hover:bg-slate-800/80 text-slate-300 hover:text-slate-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                              isActive(child.href)
                                ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-300"
                                : "hover:bg-slate-800/80 text-slate-300 hover:text-slate-100"
                            }`}
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-300"
                        : "hover:bg-slate-800/80 text-slate-300 hover:text-slate-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge}
                  </a>
                </li>
              )
            )}
          </ul>
          <div className="mt-6 px-3 pt-6 border-t border-slate-800/50">
            <a href="/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Keluar</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 lg:hidden z-30 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="h-6 w-6 text-emerald-400" />
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            Kontrakan AA
          </h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="bg-slate-800 p-2 rounded-lg text-slate-300">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-slate-950/95 backdrop-blur-md lg:hidden overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-emerald-400" />
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                  Kontrakan AA
                </h1>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="bg-slate-800 p-2 rounded-lg text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-2">
              {menu.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-300"
                        : "hover:bg-slate-800/80 text-slate-300 hover:text-slate-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge}
                  </a>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-slate-800/50">
                <a href="/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span>Keluar</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}