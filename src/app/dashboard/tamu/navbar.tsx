"use client";
import { Cpu, Home, Bell, User, LogOut, Menu, X, Info } from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

export function TamuNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper untuk cek aktif
  const isActive = (href: string) => {
    if (href === "/dashboard/tamu") {
      return pathname === "/dashboard/tamu";
    }
    return pathname.startsWith(href);
  };

  const menu = [
    {
      href: "/dashboard/tamu",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/dashboard/tamu/tentang",
      label: "Tentang Kontrakan",
      icon: <Info className="h-5 w-5" />,
    },

    {
      href: "/dashboard/tamu/notifikasi",
      label: "Notifikasi",
      icon: <Bell className="h-5 w-5" />,
      badge: (
        <span className="ml-auto bg-emerald-500 text-emerald-950 text-xs font-bold px-2 py-0.5 rounded-full">1</span>
      ),
    },
    
    {
      href: "/dashboard/tamu/profil",
      label: "Profil",
      icon: <User className="h-5 w-5" />,
    },
  ];

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