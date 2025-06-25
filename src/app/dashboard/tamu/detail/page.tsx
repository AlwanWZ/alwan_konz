"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Droplets, Phone, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function DetailKontrakanPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [kontrakan, setKontrakan] = useState<any>(null);
  const [fotoUtama, setFotoUtama] = useState<string>("/kontrakan/placeholder.jpg");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/kontrakan/${id}`)
      .then(res => res.json())
      .then(json => {
        setKontrakan(json.data);
        if (json.data?.foto && json.data.foto.length > 0) {
          setFotoUtama(json.data.foto[0]);
        }
      });
  }, [id]);

  if (!kontrakan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Kontrakan tidak ditemukan</p>
          <Link href="/dashboard/tamu" className="text-emerald-400 hover:underline">
            Kembali ke daftar kontrakan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 relative">
        <div className="grid md:grid-cols-2 gap-10 bg-slate-800/30 rounded-2xl shadow-xl border border-slate-700/50 p-6">
          {/* Galeri Gambar */}
          <div>
            <div
              className="w-full bg-slate-700 rounded-xl flex items-center justify-center mb-4 relative"
              style={{ minHeight: 500, maxHeight: 650 }}
            >
              <img
                src={fotoUtama}
                alt={kontrakan.nama}
                className="max-h-[600px] w-auto max-w-full object-contain rounded-xl transition-all duration-300"
                style={{ background: "#1e293b" }}
                onError={e => (e.currentTarget.src = "/kontrakan/placeholder.jpg")}
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    kontrakan.status === "tersedia"
                      ? "bg-emerald-500/80 text-white"
                      : "bg-rose-500/80 text-white"
                  }`}
                >
                  {kontrakan.status === "tersedia" ? "Tersedia" : "Sudah Disewa"}
                </span>
              </div>
            </div>
            {/* Thumbnail Galeri */}
            {kontrakan.foto && kontrakan.foto.length > 1 && (
              <div className="flex gap-3 mt-2 flex-wrap">
                {kontrakan.foto.map((foto: string, idx: number) => (
                  <button
                    key={foto}
                    type="button"
                    className={`border-2 rounded-lg p-1 transition-all ${
                      fotoUtama === foto ? "border-emerald-400" : "border-slate-700"
                    }`}
                    style={{ background: "#1e293b" }}
                    onClick={() => setFotoUtama(foto)}
                  >
                    <img
                      src={foto}
                      alt={`Foto ${idx + 1}`}
                      className="h-24 w-40 object-contain rounded"
                      onError={e => (e.currentTarget.src = "/kontrakan/placeholder.jpg")}
                    />
                  </button>
                ))}
              </div>
            )}
            {kontrakan.foto && kontrakan.foto.length === 1 && (
              <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs">
                <ImageIcon className="w-4 h-4" /> Hanya 1 foto tersedia
              </div>
            )}
          </div>
          {/* Info Detail */}
          <div>
            <h1 className="text-3xl font-bold text-emerald-300 mb-2">{kontrakan.nama}</h1>
            <p className="text-slate-400 flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-emerald-400" /> {kontrakan.lokasi || kontrakan.alamat}
            </p>
            {/* Lokasi Google Maps */}
            <div className="mb-4">
              <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow mb-2" style={{ height: 250 }}>
                <iframe
                  src={kontrakan.mapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.929863352067!2d105.28495371103372!3d-4.233923995722161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3ed9ec9414abaf%3A0x14d0276bb0c9fc8e!2sKontrakan%20AA!5e0!3m2!1sid!2sid!4v1747557440108!5m2!1sid!2sid"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Kontrakan"
                ></iframe>
              </div>
              <span className="text-xs text-slate-400">Lokasi di Google Maps</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                kontrakan.status === "tersedia"
                  ? "bg-emerald-500/80 text-white"
                  : "bg-rose-500/80 text-white"
              }`}>
                {kontrakan.status === "tersedia" ? "Tersedia" : "Sudah Disewa"}
              </span>
              <span className="flex items-center gap-1 text-xl font-bold text-emerald-400">
                <Droplets className="w-5 h-5" /> Rp {kontrakan.harga?.toLocaleString()} <span className="text-base text-slate-400 font-normal">/bulan</span>
              </span>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-emerald-200 mb-1">Deskripsi</h2>
              <p className="text-slate-200">{kontrakan.deskripsi}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-emerald-200 mb-1">Fasilitas</h2>
              <ul className="flex flex-wrap gap-2">
                {kontrakan.fasilitas?.map((f: string, idx: number) => (
                  <li key={idx} className="bg-slate-800/80 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded text-xs">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-emerald-200 mb-1">Kontak Pemilik</h2>
              <div className="flex items-center gap-2 text-emerald-300">
                <Phone className="w-5 h-5" /> {kontrakan.kontak || "0895-3206-95308"}
              </div>
            </div>
            {/* Tombol Sewa */}
            <Link
              href={`/dashboard/tamu/ajukan-sewa?id=${kontrakan._id}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition text-base"
            >
              Sewa Kontrakan Ini
            </Link>
          </div>
        </div>

        {/* Tombol Back Terapung */}
        <div className="fixed top-8 left-8 z-50">
          <Link
            href="/dashboard/tamu"
            className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-full shadow-2xl transition w-16 h-16"
            style={{ boxShadow: "0 8px 32px 0 rgba(16,185,129,0.25)" }}
            aria-label="Kembali ke Daftar"
          >
            <ArrowLeft className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </div>
  );
}