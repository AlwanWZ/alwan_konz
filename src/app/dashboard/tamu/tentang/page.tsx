"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import { TamuNavbar } from "../navbar";
import Footer from "@components/layout/footer";

interface Kontrakan {
  _id: string;
  nama: string;
  alamat: string;
  harga: number;
  status: "tersedia" | "disewa";
  fasilitas: string[];
  foto: string[];
  penyewaId?: string;
}

export default function TentangKontrakan() {
  const [kontrakanList, setKontrakanList] = useState<Kontrakan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKontrakan = async () => {
      try {
        const res = await fetch("/api/kontrakan");
        const data = await res.json();
        setKontrakanList(data.data || []);
      } catch {
        setKontrakanList([]);
      }
      setLoading(false);
    };
    fetchKontrakan();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <TamuNavbar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-emerald-300 mb-8 text-center">Daftar Kontrakan</h2>
          {loading ? (
            <div className="text-center text-slate-400">Memuat data kontrakan...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kontrakanList.map((k) => (
                <div
                  key={k._id}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-xl shadow-lg overflow-hidden hover:shadow-emerald-900/10 transition-all duration-300 group"
                >
                  <div className="h-44 bg-slate-700 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={k.foto && k.foto.length > 0 ? k.foto[0] : "/kontrakan/placeholder.jpg"}
                      alt={k.nama}
                      className="w-full h-full object-cover"
                      onError={e => (e.currentTarget.src = "/kontrakan/placeholder.jpg")}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        k.status === "tersedia"
                          ? "bg-emerald-500/80 text-white"
                          : "bg-rose-500/80 text-white"
                      }`}>
                        {k.status === "tersedia" ? "Tersedia" : "Sudah Disewa"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {k.nama}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-2">
                      <MapPin className="h-4 w-4 text-emerald-400" /> {k.alamat}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3 mb-4">
                      {k.fasilitas?.slice(0, 3).map((f, idx) => (
                        <span key={idx} className="bg-slate-800/80 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded text-xs">
                          {f}
                        </span>
                      ))}
                      {k.fasilitas && k.fasilitas.length > 3 && (
                        <span className="bg-slate-800/80 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded text-xs">
                          +{k.fasilitas.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className="text-sm text-slate-400">Harga Sewa</span>
                      <div className="text-xl font-bold text-emerald-400">
                        Rp {k.harga.toLocaleString()} <span className="text-slate-400 text-sm">/bulan</span>
                      </div>
                    </div>
                    {/* Deskripsi bisa ditambah jika ada di schema */}
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 text-sm">Kontak: 0895-3206-95308</span>
                    </div>
                    <Link
                      href={`/dashboard/tamu/detail?id=${k._id}`}
                      className={`inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg font-medium transition ${
                        k.status === "tersedia"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white"
                          : "bg-slate-700 text-slate-400 cursor-not-allowed pointer-events-none"
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {k.status === "tersedia" ? "Lihat Detail" : "Tidak Tersedia"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}