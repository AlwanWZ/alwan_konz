"use client";

import { AdminNavbar } from "../navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  PlusCircle,
  Mail,
  Home,
  Calendar,
  Phone,
  Check,
  X,
  Download,
  Edit3,
  Eye,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";
import { useState, useEffect } from "react";

type Penyewa = {
  _id: string;
  name: string;
  email: string;
  noTelp: string;
  kontrakan: string;
  status: string;
  tanggalBergabung: string;
  photoURL: string;
  lastPayment: string;
  role: string;
};

export default function PenyewaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalDetail, setModalDetail] = useState<Penyewa | null>(null);
  const [modalEdit, setModalEdit] = useState<Penyewa | null>(null);
  const [penyewaList, setPenyewaList] = useState<Penyewa[]>([]);
  const router = useRouter();

  // Proteksi role & fetch data penyewa
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
      return;
    }
    fetchPenyewa();
    // eslint-disable-next-line
  }, [router]);

  // Fetch data user role penyewa
  const fetchPenyewa = async () => {
    const res = await fetch("/api/user");
    const json = await res.json();
    setPenyewaList(
    (json.data || []).map((u: any) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        noTelp: u.noTelp,
        kontrakan: u.kontrakan || "-",
        status: u.status || "aktif",
        tanggalBergabung: u.tanggalBergabung
        ? new Date(u.tanggalBergabung).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "-",
        photoURL: u.photoURL || "/api/placeholder/50/50",
        lastPayment: u.lastPayment
        ? new Date(u.lastPayment).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "-",
        role: u.role || "-",  
    }))
    );
  };

  // Filter & Search
  const filteredPenyewa = penyewaList.filter(
    (penyewa) =>
      (filterStatus === "all" || penyewa.status === filterStatus) &&
      (penyewa.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        penyewa.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        penyewa.kontrakan?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Export Data Dummy
  const handleExport = () => {
    alert("Fitur export data belum tersedia.");
  };

  // CRUD: Hapus penyewa
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus penyewa ini?")) return;
    await fetch(`/api/user/${id}`, { method: "DELETE" });
    await fetchPenyewa();
    setModalDetail(null);
  };

  // CRUD: Simpan edit penyewa
  const handleEditSave = async (form: Penyewa) => {
    await fetch(`/api/user/${form._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        noTelp: form.noTelp,
        kontrakan: form.kontrakan,
        status: form.status,
        lastPayment: form.lastPayment, 
        role: form.role, 
      }),
    });
    await fetchPenyewa();
    setModalEdit(null);
    setModalDetail(null);
  };

  // Pagination Dummy (hanya 1 halaman)
  const currentPage = 1;
  const totalPages = 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-slate-200">
      <AdminNavbar />
      <main className="container mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              Daftar User
            </h1>
            <p className="text-slate-400 mt-2">
              Kelola semua User Kontrakan AA di satu tempat
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              onClick={() => alert("Fitur tambah penyewa modal belum tersedia.")}
            >
              <PlusCircle className="h-4 w-4" />
              Tambah User
            </Button>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="mb-6 bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Cari User..."
              className="pl-10 bg-[#1E293B] border-[#334155] text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 md:p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <Users className="h-6 w-6 text-emerald-400/30" />
              </div>
              <p className="text-slate-300 font-medium">Total User</p>
              <p className="text-2xl font-bold mt-2 text-emerald-400">
                {penyewaList.length}
              </p>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 md:p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <Check className="h-6 w-6 text-teal-400/30" />
              </div>
              <p className="text-slate-300 font-medium">User Aktif</p>
              <p className="text-2xl font-bold mt-2 text-teal-400">
                {penyewaList.filter((p) => p.status === "aktif").length}
              </p>
            </div>
          </div>
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 md:p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                <X className="h-6 w-6 text-red-400/30" />
              </div>
              <p className="text-slate-300 font-medium">User Nonaktif</p>
              <p className="text-2xl font-bold mt-2 text-red-400">
                {penyewaList.filter((p) => p.status === "nonaktif").length}
              </p>
            </div>
          </div>
        </div>

        {/* Penyewa List Table */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-xl overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
            <tr className="border-b border-[#334155]">
                <th className="py-4 px-6 text-left font-medium text-slate-300">
                Nama
                </th>
                <th className="py-4 px-6 text-left font-medium text-slate-300">
                Kontak
                </th>
                <th className="py-4 px-6 text-left font-medium text-slate-300">
                Kontrakan
                </th>
                <th className="py-4 px-6 text-left font-medium text-slate-300">
                Pembayaran Terakhir
                </th>
                <th className="py-4 px-6 text-left font-medium text-slate-300">
                Status
                </th>
                <th className="py-4 px-6 text-left font-medium text-slate-300">
                Role
                </th>
                <th className="py-4 px-6 text-right font-medium text-slate-300">
                Aksi
                </th>
            </tr>
            </thead>
           <tbody>
  {filteredPenyewa.length === 0 ? (
    <tr>
      <td colSpan={7} className="py-8 text-center text-slate-400">
        Tidak ada data user yang sesuai dengan pencarian
      </td>
    </tr>
  ) : (
    filteredPenyewa.map((user) => (
      <tr
        key={user._id}
        className="border-b border-[#334155] hover:bg-[#1E293B]/50 transition-colors"
      >
        <td className="py-4 px-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
              <img
                src={user.photoURL}
                alt={user.name}
                className="h-10 w-10 object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-slate-200">
                {user.name}
              </p>
              <p className="text-xs text-slate-400">
                Bergabung {user.tanggalBergabung}
              </p>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Mail className="h-3 w-3 mr-2 text-slate-400" />
              <span className="text-slate-300">
                {user.email}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-3 w-3 mr-2 text-slate-400" />
              <span className="text-slate-300">
                {user.noTelp}
              </span>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-2 text-emerald-400" />
            <span className="text-slate-200">
              {user.kontrakan}
            </span>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-teal-400" />
            <span className="text-slate-200">
              {user.lastPayment}
            </span>
          </div>
        </td>
        <td className="py-4 px-6">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              user.status === "aktif"
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {user.status === "aktif" ? "Aktif" : "Nonaktif"}
          </span>
        </td>
            <td className="py-4 px-6">
            <span className={
                user.role === "nonaktif" ? "text-red-400" : "text-slate-200"
            }>
                {user.role ?? '-'}
            </span>
            </td>
        <td className="py-4 px-6 text-right flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
            onClick={() => setModalDetail(user)}
            title="Lihat Detail"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
            onClick={() => setModalEdit(user)}
            title="Edit"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          {user.status === "nonaktif" && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-400 hover:text-white"
              onClick={() => handleDelete(user._id)}
              title="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center text-slate-300">
          <div className="text-sm">
            Menampilkan {filteredPenyewa.length} dari {penyewaList.length} User
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#334155] hover:bg-[#1E293B] text-slate-300"
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#334155] bg-[#1E293B] text-emerald-300"
              disabled
            >
              {currentPage}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#334155] hover:bg-[#1E293B] text-slate-300"
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </main>

      {/* Modal Detail Penyewa */}
      {modalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              onClick={() => setModalDetail(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center">
              <img
                src={modalDetail.photoURL}
                alt={modalDetail.name}
                className="w-24 h-24 rounded-full object-cover mb-4 bg-slate-700"
              />
              <h2 className="text-2xl font-bold text-emerald-400">{modalDetail.name}</h2>
              <span className={`mt-2 px-3 py-1 rounded-full text-xs ${
                modalDetail.status === "aktif"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              }`}>
                {modalDetail.status === "aktif" ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{modalDetail.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{modalDetail.noTelp}</span>
              </div>
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-emerald-400" />
                <span>{modalDetail.kontrakan}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Bergabung: {modalDetail.tanggalBergabung}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Pembayaran Terakhir: {modalDetail.lastPayment}</span>
              </div>
            </div>
            <div className="mt-8 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setModalEdit(modalDetail);
                  setModalDetail(null);
                }}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Edit Data
              </Button>
              {modalDetail.status === "nonaktif" && (
                <Button
                  variant="outline"
                  onClick={() => handleDelete(modalDetail._id)}
                  className="flex items-center gap-2 text-red-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Penyewa */}
      {modalEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              onClick={() => setModalEdit(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
              Edit Data User
            </h2>
            <EditForm
              penyewa={modalEdit}
              onSave={handleEditSave}
              onCancel={() => setModalEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Form Edit Modal
function EditForm({
  penyewa,
  onSave,
  onCancel,
}: {
  penyewa: Penyewa;
  onSave: (data: Penyewa) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...penyewa });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm mb-1">Nama</label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <Input name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm mb-1">No. Telepon</label>
        <Input name="noTelp" value={form.noTelp} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Unit Kontrakan</label>
        <Input name="kontrakan" value={form.kontrakan} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

       <div>
        <label className="block text-sm mb-1">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="admin">Admin</option>
          <option value="penyewa">Penyewa</option>
          <option value="keuangan">Keuangan</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Edit3 className="w-4 h-4" /> Simpan
        </Button>
      </div>
    </form>
  );
}