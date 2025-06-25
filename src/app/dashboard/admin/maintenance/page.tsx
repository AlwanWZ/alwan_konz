"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "../navbar";
import { Wrench, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { checkRole } from "@/lib/roleGuard";

export default function DashboardMaintenance() {
  const router = useRouter();

  useEffect(() => {
    if (checkRole(["keuangan"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin/keuangan");
    } else if (checkRole(["admin"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin");
    } else if (!checkRole(["maintenance"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman ini.");
      router.replace("/"); // Atau ke halaman lain sesuai kebutuhan
    }
  }, [router]);
  
  // Demo data
  const totalRequest = 12;
  const selesai = 7;
  const proses = 3;
  const gagal = 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-8">
          Dashboard Maintenance
        </h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Request</p>
                <p className="text-2xl font-bold text-white">{totalRequest}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Selesai</p>
                <p className="text-2xl font-bold text-green-400">{selesai}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Proses</p>
                <p className="text-2xl font-bold text-yellow-400">{proses}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Gagal</p>
                <p className="text-2xl font-bold text-red-400">{gagal}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Bisa tambahkan tabel/list request maintenance di sini */}
      </div>
    </div>
  );
}