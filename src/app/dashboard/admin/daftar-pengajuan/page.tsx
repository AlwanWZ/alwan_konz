"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Home,
  MessageSquare,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  Eye,
} from "lucide-react";
import { AdminNavbar } from "../navbar";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

interface Pengajuan {
  id: string; 
  nama: string;
  noHp: string;
  catatan?: string;
  kontrakanId: string;
  kontrakanNama: string;
  status: "pending" | "disetujui" | "ditolak";
  tanggalPengajuan: string;
  durasi?: string;
  hargaSewa: number;
  profileImage?: string;
  penyewaId: string; 
}

interface FilterState {
  status: "all" | "pending" | "disetujui" | "ditolak";
  search: string;
}

function isBiodataLengkap(user: any) {
  return (
    !!user &&
    !!user.name &&
    !!user.email &&
    !!user.noTelp &&
    !!user.alamat &&
    !!user.tanggalLahir &&
    !!user.noKTP &&
    !!user.pekerjaan &&
    !!user.darurat &&
    !!user.darurat.nama &&
    !!user.darurat.hubungan &&
    !!user.darurat.noTelp
  );
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "disetujui":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "ditolak":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "disetujui":
        return <CheckCircle className="w-3 h-3" />;
      case "ditolak":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const BiodataStatus: React.FC<{ uid: string }> = ({ uid }) => {
  const [status, setStatus] = useState<"loading" | "lengkap" | "belum">("loading");
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${uid}`);
      const json = await res.json();
      setStatus(isBiodataLengkap(json.data) ? "lengkap" : "belum");
    };
    fetchUser();
  }, [uid]);
  if (status === "loading") return <span className="ml-2 text-xs text-gray-400">Cek biodata...</span>;
  if (status === "lengkap")
    return <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Biodata Lengkap</span>;
  return <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Biodata Belum Lengkap</span>;
};

const PengajuanCard: React.FC<{
  pengajuan: Pengajuan;
  onSetujui: (pengajuan: Pengajuan) => void;
  onTolak: (pengajuan: Pengajuan) => void;
  onDelete: (pengajuan: Pengajuan) => void;
  onDetail: (pengajuan: Pengajuan) => void;
}> = ({ pengajuan, onSetujui, onTolak, onDelete, onDetail }) => {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:bg-gray-800/60 transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white truncate">{pengajuan.nama}</h3>
              <StatusBadge status={pengajuan.status} />
              <BiodataStatus uid={pengajuan.penyewaId} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{pengajuan.noHp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <span className="truncate">{pengajuan.kontrakanNama}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{new Date(pengajuan.tanggalPengajuan).toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-medium">
                  Rp {pengajuan.hargaSewa.toLocaleString("id-ID")}/bulan
                </span>
              </div>
            </div>
            {pengajuan.catatan && (
              <div className="mt-3 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300 line-clamp-2">{pengajuan.catatan}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onDetail(pengajuan)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Detail
          </button>
          <button
            onClick={() => onDelete(pengajuan)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Hapus
          </button>
          {pengajuan.status === "pending" && (
            <>
              <button
                onClick={() => onSetujui(pengajuan)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Setujui
              </button>
              <button
                onClick={() => onTolak(pengajuan)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Tolak
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const BiodataModal: React.FC<{
  open: boolean;
  onClose: () => void;
  user: any;
}> = ({ open, onClose, user }) => {
  if (!open) return null;
  if (!user)
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg relative flex flex-col items-center">
          <span className="text-gray-700">Memuat biodata...</span>
        </div>
      </div>
    );
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <XCircle className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" /> Biodata User
        </h2>
        <div className="space-y-2 text-gray-800">
          <div><b>Nama:</b> {user.name}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>No. Telepon:</b> {user.noTelp}</div>
          <div><b>Alamat:</b> {user.alamat}</div>
          <div><b>Tanggal Lahir:</b> {user.tanggalLahir}</div>
          <div><b>No. KTP:</b> {user.noKTP}</div>
          <div><b>Pekerjaan:</b> {user.pekerjaan}</div>
          <div>
            <b>Kontak Darurat:</b> {user.darurat?.nama} ({user.darurat?.hubungan}) - {user.darurat?.noTelp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DaftarPengajuanPage() {
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const [filteredList, setFilteredList] = useState<Pengajuan[]>([]);
  const [filter, setFilter] = useState<FilterState>({ status: "all", search: "" });
  const [biodataModal, setBiodataModal] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [modalTolak, setModalTolak] = useState<{ open: boolean; pengajuan: Pengajuan | null }>({ open: false, pengajuan: null });
  const [alasanTolak, setAlasanTolak] = useState("");
  const router = useRouter();

  // Fetch pengajuan dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/booking");
        const json = await res.json();
        const data: Pengajuan[] = (json.data || []).map((item: any) => ({
          id: item._id, // ini _id MongoDB, harus 24 char hex
          nama: item.nama,
          noHp: item.noHp,
          catatan: item.catatan,
          kontrakanId: item.kontrakanId,
          kontrakanNama: item.kontrakanNama || "-",
          status: item.status,
          tanggalPengajuan: item.createdAt || item.tanggalPengajuan,
          durasi: item.durasi,
          hargaSewa: item.hargaSewa || 0,
          profileImage: item.profileImage || undefined,
          penyewaId: item.uid, // harus UID user
        }));
        setPengajuanList(data);
      } catch (err) {
        setPengajuanList([]);
      }
    };
    fetchData();
  }, []);

  // Filter pengajuan
  useEffect(() => {
    let filtered = pengajuanList;
    if (filter.status !== "all") {
      filtered = filtered.filter((p) => p.status === filter.status);
    }
    if (filter.search) {
      filtered = filtered.filter(
        (p) =>
          p.nama.toLowerCase().includes(filter.search.toLowerCase()) ||
          p.kontrakanNama.toLowerCase().includes(filter.search.toLowerCase()) ||
          p.noHp.includes(filter.search)
      );
    }
    setFilteredList(filtered);
  }, [pengajuanList, filter]);

  // Role guard
  useEffect(() => {
    if (!checkRole(["admin"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman ini.");
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const user = userStr ? JSON.parse(userStr) : {};
      if (user.role === "keuangan") {
        router.replace("/dashboard/admin/keuangan");
      } else if (user.role === "maintenance") {
        router.replace("/dashboard/admin/maintenance");
      } else {
        router.replace("/login");
      }
    }
  }, [router]);

  // Setujui pengajuan (tidak ubah role user, hanya update status dan kirim notifikasi)
const handleSetujui = async (pengajuan: Pengajuan) => {
  try {
    if (!pengajuan.id || !pengajuan.penyewaId) {
      alert("ID pengajuan atau user tidak ditemukan!");
      return;
    }
    const res = await fetch(`/api/booking/${pengajuan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "disetujui" }),
    });
    if (!res.ok) {
      const errorRes = await res.json();
      throw new Error(errorRes.error || "Gagal update status pengajuan");
    }
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: pengajuan.penyewaId,
        type: "success",
        title: "Pengajuan Disetujui",
        message: "Pengajuan sewa Anda telah disetujui oleh admin. Silakan cek detail pengajuan di dashboard.",
        time: new Date().toISOString(),
      }),
    });
    alert("Pengajuan disetujui! Notifikasi telah dikirim ke penyewa.");
    window.location.reload();
  } catch (e: any) {
    alert("Gagal menyetujui pengajuan: " + (e?.message || e));
  }
};

  // Buka modal tolak
  const handleTolak = (pengajuan: Pengajuan) => {
    setModalTolak({ open: true, pengajuan });
  };

  // Submit penolakan
  const submitTolak = async () => {
    if (!modalTolak.pengajuan) return;
    try {
      if (!modalTolak.pengajuan.id || !modalTolak.pengajuan.penyewaId) {
        alert("ID pengajuan atau user tidak ditemukan!");
        return;
      }
      // Update status pengajuan + alasan
      const res = await fetch(`/api/booking/${modalTolak.pengajuan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ditolak", alasan: alasanTolak }),
      });
      if (!res.ok) throw new Error("Gagal update status pengajuan");

      // Kirim notifikasi ke user
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: modalTolak.pengajuan.penyewaId,
          type: "warning",
          title: "Pengajuan Ditolak",
          message: `Pengajuan anda ditolak. Alasan: ${alasanTolak}`,
          time: new Date().toISOString(),
        }),
      });
      setModalTolak({ open: false, pengajuan: null });
      setAlasanTolak("");
      window.location.reload();
    } catch {
      alert("Gagal menolak pengajuan.");
    }
  };

  // Hapus pengajuan
  const handleDelete = async (pengajuan: Pengajuan) => {
    if (!pengajuan.id) {
      alert("ID pengajuan tidak ditemukan!");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan ini?")) return;
    try {
      const res = await fetch(`/api/booking/${pengajuan.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPengajuanList((prev) => prev.filter((p) => p.id !== pengajuan.id));
      } else {
        alert("Gagal menghapus pengajuan.");
      }
    } catch {
      alert("Gagal menghapus pengajuan.");
    }
  };

  // Detail pengajuan (biarkan, sudah benar)
  const handleDetail = async (pengajuan: Pengajuan) => {
    if (!pengajuan.penyewaId) {
      alert("ID user tidak ditemukan pada pengajuan ini!");
      return;
    }
    try {
      const res = await fetch(`/api/user/${pengajuan.penyewaId}`);
      const json = await res.json();
      setBiodataModal({ open: true, user: json.data });
    } catch {
      setBiodataModal({ open: true, user: null });
    }
  };

  const getStatsData = () => {
    const total = pengajuanList.length;
    const pending = pengajuanList.filter((p) => p.status === "pending").length;
    const disetujui = pengajuanList.filter((p) => p.status === "disetujui").length;
    const ditolak = pengajuanList.filter((p) => p.status === "ditolak").length;
    return { total, pending, disetujui, ditolak };
  };

  const stats = getStatsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Daftar Pengajuan Sewa
            </h1>
            <p className="text-gray-400">Kelola semua pengajuan sewa kontrakan</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Pengajuan</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Menunggu</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Disetujui</p>
                <p className="text-2xl font-bold text-green-400">{stats.disetujui}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ditolak</p>
                <p className="text-2xl font-bold text-red-400">{stats.ditolak}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari nama, kontrakan, atau nomor HP..."
                  value={filter.search}
                  onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter.status}
                onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value as any }))}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pengajuan List */}
        {filteredList.length === 0 ? (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Tidak ada pengajuan</h3>
            <p className="text-gray-400">
              {filter.search || filter.status !== "all"
                ? "Tidak ada pengajuan yang sesuai dengan filter"
                : "Belum ada pengajuan sewa yang masuk"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((pengajuan) => (
              <PengajuanCard
                key={pengajuan.id}
                pengajuan={pengajuan}
                onSetujui={handleSetujui}
                onTolak={handleTolak}
                onDelete={handleDelete}
                onDetail={handleDetail}
              />
            ))}
          </div>
        )}

        {/* Modal Tolak */}
        {modalTolak.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-2 text-gray-900">Alasan Penolakan</h2>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                value={alasanTolak}
                onChange={(e) => setAlasanTolak(e.target.value)}
                placeholder="Tulis alasan penolakan"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                  onClick={() => setModalTolak({ open: false, pengajuan: null })}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white"
                  onClick={submitTolak}
                  disabled={!alasanTolak}
                >
                  Tolak Pengajuan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Biodata */}
        <BiodataModal
          open={biodataModal.open}
          onClose={() => setBiodataModal({ open: false, user: null })}
          user={biodataModal.user}
        />
      </div>
    </div>
  );
}