"use client";

import { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimoni {
  _id: string;
  nama: string;
  komentar: string;
  rating: number;
  tanggal: string;
  foto?: string;
}

export function RatingList() {
  const [testimoniList, setTestimoniList] = useState<Testimoni[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/rating")
      .then((res) => res.json())
      .then((data) => setTestimoniList(data.data || []));
  }, []);

  useEffect(() => {
    if (testimoniList.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimoniList.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimoniList]);

  const goLeft = () =>
    setCurrent((prev) => (prev === 0 ? testimoniList.length - 1 : prev - 1));
  const goRight = () => setCurrent((prev) => (prev + 1) % testimoniList.length);

  if (testimoniList.length === 0) {
    return (
      <div className="text-slate-400 text-center py-8">
        Belum ada testimoni.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <div className="overflow-hidden">
        <div className="flex items-center justify-center">
          <button
            onClick={goLeft}
            className="p-2 rounded-full bg-slate-700/60 hover:bg-slate-700 text-emerald-300 transition disabled:opacity-50 mr-2"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="w-full">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimoniList.map((t, idx) => (
                <div key={t._id} className="min-w-full px-4">
                  <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-10 flex gap-8 items-start shadow group">
                    <div className="flex-shrink-0">
                      {t.foto ? (
                        <img
                          src={t.foto}
                          alt={t.nama}
                          className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-emerald-700 flex items-center justify-center text-2xl font-bold text-white">
                          {t.nama[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-lg">{t.nama}</span>
                        <span className="text-xs text-slate-400">{new Date(t.tanggal).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                            fill={i < t.rating ? "#facc15" : "none"}
                          />
                        ))}
                      </div>
                      <div className="text-slate-200 text-base">{t.komentar}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={goRight}
            className="p-2 rounded-full bg-slate-700/60 hover:bg-slate-700 text-emerald-300 transition disabled:opacity-50 ml-2"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>
      {/* Indikator bulat */}
      <div className="flex justify-center gap-2 mt-6">
        {testimoniList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${current === idx ? "bg-emerald-400" : "bg-slate-600"}`}
            aria-label={`Testimoni ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}