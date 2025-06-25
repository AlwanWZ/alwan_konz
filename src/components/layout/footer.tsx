"use client";
import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="lg:ml-64 py-8 px-6 border-t border-slate-800/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Cpu className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-emerald-300">Kontrakan AA</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/privacy" className="text-slate-400 hover:text-emerald-300 transition-colors text-sm">
              Kebijakan Privasi
            </a>
            <a href="/terms" className="text-slate-400 hover:text-emerald-300 transition-colors text-sm">
              Syarat & Ketentuan
            </a>
            <a href="/contact" className="text-slate-400 hover:text-emerald-300 transition-colors text-sm">
              Kontak
            </a>
            <a href="/faq" className="text-slate-400 hover:text-emerald-300 transition-colors text-sm">
              FAQ
            </a>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 Kontrakan AA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}