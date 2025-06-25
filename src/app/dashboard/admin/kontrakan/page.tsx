"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Edit, Trash2, Plus, Check, X } from "lucide-react";
import { AdminNavbar } from "../navbar";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

type Kontrakan = {
  id: string;
  nama: string;
  lokasi: string;
  harga: number;
  status: "tersedia" | "terisi";
  fasilitas: string[];
  foto?: string;
};

const lokasiList = [
  "Semua Lokasi",
  "Rancaekek",
  "Rancaekek Kulon",
  "Rancaekek Wetan",
  "Linggar",
  "Bojongloa",
  "Sangiang",
  "Nanjungmekar",
  "Jelegong",
  "Haurpugur",
  "Cipacing",
  "Jatinangor",
  "Cileunyi",
  "Cicalengka"
];

export default function KontrakanPage() {
  const [search, setSearch] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("Semua Lokasi");
  const [filterStatus, setFilterStatus] = useState<"all" | "tersedia" | "terisi">("all");
  const [modalEdit, setModalEdit] = useState<Kontrakan | null>(null);
  const [modalTambah, setModalTambah] = useState(false);
  const [data, setData] = useState<Kontrakan[]>([]);
  const router = useRouter();

  // Ambil data dari MongoDB
  const fetchKontrakan = async () => {
    try {
      const res = await fetch("/api/kontrakan");
      const json = await res.json();
      setData(
        (json.data || []).map((k: any) => ({
          id: k._id,
          nama: k.nama,
          lokasi: k.alamat,
          harga: k.harga,
          status: k.status === "disewa" ? "terisi" : "tersedia",
          fasilitas: k.fasilitas,
          foto: k.foto?.[0] || "",
        }))
      );
    } catch {
      setData([]);
    }
  };

  useEffect(() => {
    fetchKontrakan();
  }, []);

  // Filter & Search
  const filtered = data.filter((k) => {
    const nama = k.nama || "";
    const lokasi = k.lokasi || "";
    const matchSearch =
      nama.toLowerCase().includes(search.toLowerCase()) ||
      lokasi.toLowerCase().includes(search.toLowerCase());
    const matchLokasi =
      filterLokasi === "Semua Lokasi" || lokasi === filterLokasi;
    const matchStatus =
      filterStatus === "all" || k.status === filterStatus;
    return matchSearch && matchLokasi && matchStatus;
  });

  // Tambah kontrakan
  const handleTambah = async (form: Kontrakan) => {
    await fetch("/api/kontrakan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        alamat: form.lokasi,
        harga: form.harga,
        status: form.status === "terisi" ? "disewa" : "tersedia",
        fasilitas: form.fasilitas,
        foto: [form.foto],
      }),
    });
    await fetchKontrakan();
    setModalTambah(false);
  };

  // Edit kontrakan
  const handleEditSave = async (form: Kontrakan) => {
    await fetch(`/api/kontrakan/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        alamat: form.lokasi,
        harga: form.harga,
        status: form.status === "terisi" ? "disewa" : "tersedia",
        fasilitas: form.fasilitas,
        foto: [form.foto],
      }),
    });
    await fetchKontrakan();
    setModalEdit(null);
  };

  // Hapus kontrakan
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kontrakan ini?")) return;
    await fetch(`/api/kontrakan/${id}`, { method: "DELETE" });
    await fetchKontrakan();
  };

  // Proteksi role
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-emerald-400" />
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-200">
                Daftar Kontrakan
              </h2>
              <p className="text-slate-300 mt-1">Kelola semua unit kontrakan di satu tempat</p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white flex items-center gap-2 shadow-lg"
            onClick={() => setModalTambah(true)}
          >
            <Plus className="h-5 w-5" /> Tambah Kontrakan
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Cari nama/lokasi kontrakan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white md:w-1/3"
          />
          <select
            value={filterLokasi}
            onChange={(e) => setFilterLokasi(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white rounded-md px-3 py-2"
          >
            {lokasiList.map((lokasi) => (
              <option key={lokasi} value={lokasi}>
                {lokasi}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-800 border-slate-700 text-white rounded-md px-3 py-2"
          >
            <option value="all">Semua Status</option>
            <option value="tersedia">Tersedia</option>
            <option value="terisi">Terisi</option>
          </select>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((k) => (
            <div
              key={k.id}
              className="h-full flex flex-col bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative w-full aspect-[4/3] bg-slate-700 overflow-hidden">
                <img
                  src={k.foto || "/kontrakan/placeholder.jpg"}
                  alt={k.nama}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={e => (e.currentTarget.src = "/kontrakan/placeholder.jpg")}
                />
                <Badge className={`absolute top-4 right-4 ${
                  k.status === "tersedia"
                    ? "bg-emerald-500/80"
                    : "bg-rose-500/80"
                } text-white px-3 py-1`}>
                  {k.status === "tersedia" ? "Tersedia" : "Terisi"}
                </Badge>
              </div>
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-semibold mb-2">{k.nama}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1 mb-2">
                  <MapPin className="h-4 w-4 text-emerald-400" /> {k.lokasi}
                </p>
                <p className="mb-2">
                  <span className="text-emerald-400 font-bold text-lg">
                    Rp {k.harga.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm"> /bulan</span>
                </p>
                <div className="mb-2">
                  <span className="text-slate-400 text-sm">Fasilitas:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {k.fasilitas.map((f, idx) => (
                      <Badge key={idx} className="bg-slate-700 text-emerald-300 border-emerald-500/20">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-auto pt-4 border-t border-emerald-800/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-400 hover:text-emerald-300 border-emerald-800/60"
                    onClick={() => setModalEdit(k)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-white border-rose-700"
                    onClick={() => handleDelete(k.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Hapus
                  </Button>
                  <Link href={`/dashboard/admin/kontrakan/${k.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-300 hover:text-emerald-200 border-emerald-800/60"
                    >
                      Detail
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Edit */}
      {modalEdit && (
        <ModalKontrakan
          title="Edit Kontrakan"
          initial={modalEdit}
          onSave={handleEditSave}
          onClose={() => setModalEdit(null)}
        />
      )}

      {/* Modal Tambah */}
      {modalTambah && (
        <ModalKontrakan
          title="Tambah Kontrakan"
          initial={{
            id: "",
            nama: "",
            lokasi: "",
            harga: 0,
            status: "tersedia",
            fasilitas: [],
          }}
          onSave={handleTambah}
          onClose={() => setModalTambah(false)}
        />
      )}
    </div>
  );
}

// Modal untuk tambah/edit kontrakan
function ModalKontrakan({
  title,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  initial: Kontrakan;
  onSave: (k: Kontrakan) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Kontrakan>({ ...initial });
  const [fasilitasInput, setFasilitasInput] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | undefined>(form.foto);
  const [uploading, setUploading] = useState(false);

  // Handler upload ke Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({
          ...prev,
          foto: data.url,
        }));
        setFotoPreview(data.url);
      } else {
        alert("Gagal upload gambar");
      }
    } catch {
      alert("Gagal upload gambar");
    }
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: name === "harga" ? Number(value) : value,
    }));
  };

  const handleAddFasilitas = () => {
    if (fasilitasInput.trim() && !form.fasilitas.includes(fasilitasInput.trim())) {
      setForm((prev) => ({
        ...prev,
        fasilitas: [...prev.fasilitas, fasilitasInput.trim()],
      }));
      setFasilitasInput("");
    }
  };

  const handleRemoveFasilitas = (f: string) => {
    setForm((prev) => ({
      ...prev,
      fasilitas: prev.fasilitas.filter((x) => x !== f),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.lokasi || !form.harga) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-900 border border-emerald-800/60 rounded-xl shadow-2xl w-full max-w-3xl p-6 relative flex flex-col md:flex-row gap-6">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        {/* Sisi Kiri: Foto */}
        <div className="md:w-1/2 w-full flex flex-col items-center justify-start">
          <label className="block text-sm mb-1 w-full">Foto Kontrakan</label>
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-slate-300 bg-[#1E293B] border border-emerald-800/60 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-900/30 file:text-emerald-300"
            disabled={uploading}
          />
          {uploading && (
            <div className="text-emerald-400 text-sm mt-2">Mengupload gambar...</div>
          )}
          {fotoPreview && (
            <div className="w-full aspect-video mt-3 flex items-center justify-center bg-slate-800 rounded-lg">
              <img
                src={fotoPreview}
                alt="Preview"
                className="object-contain rounded-lg border border-emerald-800/60 w-full h-full"
                style={{ maxHeight: 400 }}
              />
            </div>
          )}
        </div>
        {/* Sisi Kanan: Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-emerald-400 mb-2 text-center md:text-left">
            {title}
          </h2>
          <div>
            <label className="block text-sm mb-1">Nama Kontrakan</label>
            <Input name="nama" value={form.nama} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Lokasi</label>
            <select
              name="lokasi"
              value={form.lokasi}
              onChange={handleChange}
              className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Pilih Lokasi</option>
              {lokasiList.slice(1).map((lokasi) => (
                <option key={lokasi} value={lokasi}>{lokasi}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Harga Sewa (Rp)</label>
            <Input
              name="harga"
              type="number"
              value={form.harga}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="tersedia">Tersedia</option>
              <option value="terisi">Terisi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Fasilitas</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={fasilitasInput}
                onChange={(e) => setFasilitasInput(e.target.value)}
                placeholder="Tambah fasilitas"
              />
              <Button type="button" onClick={handleAddFasilitas}>
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.fasilitas.map((f) => (
                <Badge
                  key={f}
                  className="bg-slate-700 text-emerald-300 border-emerald-500/20 flex items-center gap-1"
                >
                  {f}
                  <button
                    type="button"
                    className="ml-1 text-red-400 hover:text-white"
                    onClick={() => handleRemoveFasilitas(f)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}