"use client";

import { Cpu, Home, CreditCard, Bell, User, LogOut, Menu, X, Wrench, ChevronDown, } from "lucide-react";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { PenyewaNavbar } from "../navbar";

interface Rating {
  _id?: string;
  nama: string;
  komentar: string;
  rating: number;
  tanggal: string;
}

export default function SistemRatingPenyewa() {
  const [form, setForm] = useState({ nama: "", komentar: "", rating: 0 });
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/rating")
      .then((res) => res.json())
      .then((data) => setRatings(data.data || []));
  }, []);

  const handleStarClick = (idx: number) => {
    setForm((prev) => ({ ...prev, rating: idx + 1 }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.komentar || form.rating === 0) return;
    const res = await fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newRating = await res.json();
      setRatings([newRating.data, ...ratings]);
      setForm({ nama: "", komentar: "", rating: 0 });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <PenyewaNavbar />
      <div className="lg:ml-64 flex justify-start">
        <div className="w-full max-w-6xl px-2 md:px-6 py-10 mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-10 text-center tracking-tight">
            Rating dan Testimoni dari Penyewa Lain
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Rating */}
            <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl p-6 md:p-8 shadow-lg w-full min-h-[400px] flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-emerald-300 mb-6 text-center">Beri Rating & Testimoni</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nama Anda</label>
                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Komentar</label>
                  <textarea
                    name="komentar"
                    value={form.komentar}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleStarClick(i)}
                        className="focus:outline-none"
                        tabIndex={-1}
                      >
                        <Star
                          className={`w-7 h-7 ${i < form.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                          fill={i < form.rating ? "#facc15" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg mt-2 transition"
                >
                  Kirim Rating
                </button>
                {submitted && (
                  <div className="text-center text-emerald-400 font-medium mt-2">Terima kasih atas rating & testimoni Anda!</div>
                )}
              </form>
            </div>
            {/* Testimoni */}
            <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl p-6 md:p-8 shadow-lg w-full min-h-[400px] flex flex-col">
              <h3 className="text-2xl font-bold text-emerald-300 mb-6 text-center">Testimoni Penyewa</h3>
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[420px] pr-1">
                {ratings.length === 0 ? (
                  <div className="text-slate-400 text-center py-8">Belum ada testimoni.</div>
                ) : (
                  ratings.map((r, idx) => (
                    <div
                      key={r._id || idx}
                      className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-5 flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{r.nama}</span>
                        <span className="text-xs text-slate-400">{new Date(r.tanggal).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                            fill={i < r.rating ? "#facc15" : "none"}
                          />
                        ))}
                      </div>
                      <div className="text-slate-200 text-sm">{r.komentar}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}