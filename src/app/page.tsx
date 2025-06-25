"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Cpu, MapPin, Coffee, Bed, ChefHat, Droplets, Phone, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { RatingList } from "@/app/rating/rating";
import dynamic from "next/dynamic";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedKontrakan, setSelectedKontrakan] = useState<null | typeof galleryData[0]>(null);
  const [galleryData, setGalleryData] = useState<any[]>([]);

  // Ambil data kontrakan dari API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/kontrakan");
        const json = await res.json();
        setGalleryData(
          (json.data || []).map((item: any) => ({
            id: item._id,
            src: item.foto?.[0] || "/kontrakan/placeholder.jpg",
            nama: item.nama,
            harga: item.harga,
            // tambahkan properti lain jika perlu
          }))
        );
      } catch {
        setGalleryData([]);
      }
    };
    fetchGallery();
  }, []);
  
const RatingList = dynamic(() => import("@/app/rating/rating").then(mod => mod.RatingList), {
  ssr: false,
  loading: () => <div className="text-slate-400">Memuat testimoni...</div>,
});
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Feature rotation
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const features = [
    { icon: <Bed className="w-12 h-12 text-emerald-400" />, title: "Kamar Tidur", description: "Kamar tidur nyaman untuk istirahat berkualitas" },
    { icon: <Coffee className="w-12 h-12 text-emerald-400" />, title: "Ruang Tengah", description: "Area santai untuk berkumpul dan bersantai" },
    { icon: <ChefHat className="w-12 h-12 text-emerald-400" />, title: "Dapur", description: "Dapur praktis untuk menyiapkan hidangan" },
    { icon: <Droplets className="w-12 h-12 text-emerald-400" />, title: "Kamar Mandi", description: "Kamar mandi bersih dengan air lancar" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      {/* Header section with floating animation */}
      
      <header className={`fixed w-full transition-all duration-300 ${scrolled ? 'bg-slate-900/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-6'} z-50`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Cpu className="h-8 w-8 text-emerald-400" />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Kontrakan AA</h2>
          </div>
          <div className="flex gap-4">
            <a href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">Masuk</Button>
            </a>
            <a href="/register">
              <Button variant="outline" className="border-emerald-400 text-emerald-200 hover:bg-emerald-900/30 rounded-full px-6">Daftar</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero section with animated gradient */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-200">
                Sistem Pengelolaan Kontrakan Alwan
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Nikmati pengalaman hunian yang nyaman dan terjangkau dengan sistem pengelolaan yang canggih
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Button
                type="button"
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-medium rounded-full px-8 py-6 flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                onClick={() => setOpenGallery(true)}
              >
                <Camera className="w-5 h-5" />
                Gallery
              </Button>

              <a href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-medium rounded-full px-8 py-6 flex items-center gap-2 shadow-lg shadow-emerald-500/25">
                  <MapPin className="w-5 h-5" /> 
                  Sewa
                </Button>
              </a>
            </div>
          </div>
        </div>

         {/* Dialog Gallery */}
      <Dialog open={openGallery} onClose={() => setOpenGallery(false)} className="fixed z-[100] inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-emerald-700/30 max-w-3xl w-full mx-auto p-8 z-10">
            <button
              onClick={() => setOpenGallery(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-emerald-400 transition"
              aria-label="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-emerald-300 mb-6 text-center">Galeri Kontrakan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {galleryData.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50 shadow flex flex-col items-center p-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => window.location.href = `/detail-kontrakan?id=${item.id}`}
                      className="w-full block relative p-0 bg-transparent border-none outline-none"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={item.src}
                        alt={item.nama}
                        className="w-full h-56 object-contain bg-slate-900 rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                        onError={e => (e.currentTarget.src = "/kontrakan/placeholder.jpg")}
                      />
                      {/* Overlay button */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/50 rounded-lg">
                        <span className="px-4 py-2 bg-emerald-500 text-white rounded-full font-semibold shadow-lg text-sm">
                          Lihat Detail
                        </span>
                      </div>
                    </button>
                    <div className="w-full">
                      <h3 className="text-lg font-bold text-emerald-200">{item.nama}</h3>
                      <div className="text-emerald-400 font-semibold text-xl mb-1">Rp {item.harga.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Dialog>

      {/* Dialog Detail Kontrakan */}
      <Dialog open={!!selectedKontrakan} onClose={() => setSelectedKontrakan(null)} className="fixed z-[110] inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
          {selectedKontrakan && (
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-emerald-700/30 max-w-xl w-full mx-auto p-8 z-10 flex flex-col items-center">
              <button
                onClick={() => setSelectedKontrakan(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-emerald-400 transition"
                aria-label="Tutup"
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src={selectedKontrakan.src}
                alt={selectedKontrakan.nama}
                width={480}
                height={320}
                className="rounded-xl mb-6 object-contain bg-slate-800"
                style={{ maxHeight: 320, width: "100%", objectFit: "contain" }}
              />
              <h3 className="text-2xl font-bold text-emerald-300 mb-2">{selectedKontrakan.nama}</h3>
              <div className="text-emerald-400 font-semibold text-xl mb-4">Rp {selectedKontrakan.harga.toLocaleString()}</div>
              {/* Tambahkan detail lain jika ada */}
              <Button
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-3"
                onClick={() => setSelectedKontrakan(null)}
              >
                Tutup
              </Button>
            </div>
          )}
        </div>
      </Dialog>
      </section>

      {/* Stats counter section */}
      <section className="py-16 px-6 bg-slate-800/30 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-4xl font-bold text-emerald-300 mb-2">30+</h3>
              <p className="text-slate-200">Unit Tersedia</p>
            </div>
            <div className="text-center p-6 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-4xl font-bold text-emerald-300 mb-2">450rb</h3>
              <p className="text-slate-200">Harga Mulai Dari</p>
            </div>
            <div className="text-center p-6 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-4xl font-bold text-emerald-300 mb-2">98%</h3>
              <p className="text-slate-200">Tingkat Kepuasan</p>
            </div>
            <div className="text-center p-6 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-4xl font-bold text-emerald-300 mb-2">24/7</h3>
              <p className="text-slate-200">Layanan Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features section with carousel */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-200">Fasilitas Unggulan</h2>
          
          <div className="relative h-96 overflow-hidden rounded-2xl bg-slate-900/30 backdrop-blur-lg border border-slate-700/50 shadow-xl">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col items-center justify-center p-6 ${index === activeFeature ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'}`}
              >
                <div className="bg-slate-800/50 p-6 rounded-full mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-emerald-200 mb-3">{feature.title}</h3>
                <p className="text-slate-300 text-center max-w-md">{feature.description}</p>
              </div>
            ))}
            
            {/* Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {features.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeFeature ? 'bg-emerald-300 w-8' : 'bg-slate-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

{/* Location section */}
<section className="py-20 px-6 bg-slate-900/50">
  <div className="container mx-auto">
    {/* Lokasi Strategis di atas, melebar tengah */}
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-emerald-200 mb-4 text-center flex items-center justify-center gap-3">
        <MapPin className="w-7 h-7 text-emerald-400" />
        Lokasi Strategis
      </h2>
      <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto text-center">
        Kontrakan AA berlokasi di area yang strategis di Tri Tunggal Jaya, Kec. Banjar Margo, 
        Kab. Tulang Bawang, Lampung. Dengan akses mudah ke berbagai fasilitas umum seperti 
        pasar, sekolah, dan pusat kesehatan.
      </p>
    </div>
    {/* Bawah: kiri kontak admin & testimoni, kanan maps */}
    <div className="flex flex-col md:flex-row gap-12 items-start">
      {/* Kiri: Kontak Admin & Testimoni */}
      <div className="md:w-1/2 flex flex-col gap-8">
        {/* Kontak Admin */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-emerald-700/50 p-2 rounded-lg">
            <Phone className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-200">Kontak Admin</h3>
            <a href="tel:0895320695308" className="text-emerald-300 hover:text-emerald-100 transition-colors">0895-3206-95308</a>
          </div>
        </div>
        {/* Testimoni */}
        <div>
          <h3 className="text-2xl font-bold text-emerald-300 mb-6">Testimoni Penyewa</h3>
          <RatingList />
        </div>
      </div>
      {/* Kanan: Maps */}
      <div className="md:w-1/2 flex items-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-lg shadow-emerald-900/50 aspect-video flex items-center justify-center min-h-[350px] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.929863352067!2d105.28495371103372!3d-4.233923995722161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3ed9ec9414abaf%3A0x14d0276bb0c9fc8e!2sKontrakan%20AA!5e0!3m2!1sid!2sid!4v1747557440108!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 120 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kontrakan AA"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-slate-800 to-zinc-800 rounded-3xl p-12 text-center relative overflow-hidden shadow-xl">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
              <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">Siap Untuk Mendaftar?</h2>
              <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
                Dapatkan akses ke sistem pengelolaan kontrakan modern dengan harga terjangkau hanya Rp450.000 per bulan. 
                Daftar sekarang dan nikmati pengalaman hunian yang nyaman!
              </p>
              <div className="flex gap-6 justify-center">
                <a href="/register">
                  <Button className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full px-8 py-6 text-lg font-medium shadow-lg">
                    Daftar Sekarang
                  </Button>
                </a>
                <a
                  href="https://wa.me/62895320695308?text=Halo%20Admin%20Kontrakan%20AA%2C%20saya%20ingin%20menanyakan%20tentang%20kontrakan."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                    Hubungi Kami
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
<RatingList />
      {/* Footer */}
      <footer className="mt-auto py-10 px-6 bg-zinc-950">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Cpu className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-emerald-300">Kontrakan AA</h2>
            </div>
            <div className="flex gap-4">
              <a href="/privacy" className="text-emerald-300 hover:text-emerald-100 transition-colors">
                Kebijakan Privasi
              </a>
              <a href="/terms" className="text-emerald-300 hover:text-emerald-100 transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="/contact" className="text-emerald-300 hover:text-emerald-100 transition-colors">
                Kontak
              </a>
            </div>
            <p className="text-emerald-400/70 text-sm">
              © 2025 Kontrakan AA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}