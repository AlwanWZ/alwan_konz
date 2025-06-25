"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Home, Calendar, Edit3, ArrowLeft } from "lucide-react";

export default function PenyewaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [penyewa, setPenyewa] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((json) => setPenyewa(json.data));
  }, [id]);

  if (!penyewa) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-slate-300 mb-4">Penyewa tidak ditemukan.</p>
        <Button onClick={() => router.push("/dashboard/admin/penyewa")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-slate-200 flex flex-col items-center py-10">
      <div className="w-full max-w-lg mx-auto">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push("/dashboard/admin/penyewa")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Penyewa
        </Button>
        <Card className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            <img
              src={penyewa.photoURL || "/api/placeholder/50/50"}
              alt={penyewa.name}
              className="w-24 h-24 rounded-full object-cover mb-4 bg-slate-700"
            />
            <h2 className="text-2xl font-bold text-emerald-400">{penyewa.name}</h2>
            <span className={`mt-2 px-3 py-1 rounded-full text-xs ${
              penyewa.status === "aktif"
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            }`}>
              {penyewa.status === "aktif" ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{penyewa.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{penyewa.noTelp}</span>
            </div>
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>{penyewa.kontrakan}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Bergabung: {penyewa.tanggalBergabung
                ? new Date(penyewa.tanggalBergabung).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                : "-"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Pembayaran Terakhir: {penyewa.lastPayment
                ? new Date(penyewa.lastPayment).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                : "-"}</span>
            </div>
          </div>
          <div className="mt-8 flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/admin/penyewa/${penyewa._id}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Edit Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}