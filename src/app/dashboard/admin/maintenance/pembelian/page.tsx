"use client";

import { useState, useEffect } from "react";
import { AdminNavbar } from "../../navbar";
import { PlusCircle, FileText, UploadCloud, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { checkRole } from "@/lib/roleGuard";
import { useRouter } from "next/navigation";

type Pembelian = {
  _id: string;
  tanggal: string;
  namaBarang: string;
  jumlah: number;
  hargaSatuan: number;
  totalHarga: number;
  bukti?: string;
  catatan: string;
  status: "menunggu" | "diterima" | "ditolak";
};

export default function LaporanPembelianBarang() {
  const [form, setForm] = useState({
    tanggal: "",
    namaBarang: "",
    jumlah: 1,
    hargaSatuan: 0,
    bukti: "",
    catatan: "",
  });
  const [list, setList] = useState<Pembelian[]>([]);
  const [buktiPreview, setBuktiPreview] = useState<string | null>(null);
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editCatatan, setEditCatatan] = useState("");
  const router = useRouter();
  const [editBuktiFile, setEditBuktiFile] = useState<File | null>(null);
  const [editBuktiPreview, setEditBuktiPreview] = useState<string | null>(null);

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

  // Fetch data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, []);

  async function fetchList() {
    const res = await fetch("/api/laporan_pembelian");
    const data = await res.json();
    setList(data.data || []);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "jumlah" || name === "hargaSatuan" ? Number(value) : value,
    }));
  }

  async function handleBukti(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBuktiFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setBuktiPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!buktiFile) {
      alert("Bukti pembelian (gambar) wajib diupload!");
      return;
    }
    let buktiUrl = "";
    if (buktiFile) {
      const data = new FormData();
      data.append("file", buktiFile);
      const upload = await fetch("/api/upload", { method: "POST", body: data });
      const result = await upload.json();
      buktiUrl = result.url;
    }
    await fetch("/api/laporan_pembelian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        bukti: buktiUrl,
        totalHarga: form.jumlah * form.hargaSatuan,
      }),
    });
    setForm({
      tanggal: "",
      namaBarang: "",
      jumlah: 1,
      hargaSatuan: 0,
      bukti: "",
      catatan: "",
    });
    setBuktiPreview(null);
    setBuktiFile(null);
    fetchList();
  }

  async function handleEdit(id: string, catatan: string) {
    setEditId(id);
    setEditCatatan(catatan);
  }

  async function handleSaveEdit(id: string) {
    await fetch("/api/laporan_pembelian", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, catatan: editCatatan }),
    });
    setEditId(null);
    setEditCatatan("");
    fetchList();
  }

  // Fungsi handle edit bukti
  async function handleEditBukti(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    const file = e.target.files?.[0];
    if (file) {
      setEditBuktiFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setEditBuktiPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      setEditId(id);
    }
  }

  async function handleSaveEditBukti(id: string) {
    if (!editBuktiFile) return;
    const data = new FormData();
    data.append("file", editBuktiFile);
    const upload = await fetch("/api/upload", { method: "POST", body: data });
    const result = await upload.json();
    await fetch("/api/laporan_pembelian", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, bukti: result.url }),
    });
    setEditId(null);
    setEditBuktiFile(null);
    setEditBuktiPreview(null);
    fetchList();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <AdminNavbar />
      <div className="container mx-auto max-w-3xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-emerald-300 mb-6">
          <FileText className="w-7 h-7" />
          Laporan Pembelian Barang
        </h1>

        <form
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 mb-8 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Tanggal Pembelian</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                required
                className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Nama Barang</label>
              <input
                type="text"
                name="namaBarang"
                value={form.namaBarang}
                onChange={handleChange}
                required
                className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                placeholder="Contoh: Kunci Inggris"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Jumlah</label>
              <input
                type="number"
                name="jumlah"
                value={form.jumlah}
                min={1}
                onChange={handleChange}
                required
                className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Harga Satuan</label>
              <input
                type="number"
                name="hargaSatuan"
                value={form.hargaSatuan}
                min={0}
                onChange={handleChange}
                required
                className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                placeholder="Rp"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Bukti Pembelian (Wajib)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBukti}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-emerald-700/20 file:text-emerald-300"
                required
              />
              {buktiPreview && (
                <img
                  src={buktiPreview}
                  alt="Bukti"
                  className="mt-2 rounded shadow max-h-32"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Catatan</label>
            <textarea
              name="catatan"
              value={form.catatan}
              onChange={handleChange}
              className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
              placeholder="Catatan tambahan (opsional)"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg mt-2"
          >
            <PlusCircle className="w-5 h-5" />
            Tambah Laporan
          </button>
        </form>

        {/* Tabel Laporan */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-emerald-200 mb-4">Daftar Pembelian Barang</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="bg-slate-900/70 text-emerald-200">
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Nama Barang</th>
                  <th className="py-2 px-3">Jumlah</th>
                  <th className="py-2 px-3">Harga Satuan</th>
                  <th className="py-2 px-3">Total Harga</th>
                  <th className="py-2 px-3">Bukti</th>
                  <th className="py-2 px-3">Catatan</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-slate-400">
                      Belum ada laporan pembelian.
                    </td>
                  </tr>
                )}
                {list.map((item) => (
                  <tr key={item._id} className="border-t border-slate-700/40">
                    <td className="py-2 px-3">{item.tanggal?.slice(0, 10)}</td>
                    <td className="py-2 px-3">{item.namaBarang}</td>
                    <td className="py-2 px-3">{item.jumlah}</td>
                    <td className="py-2 px-3">
                      Rp {item.hargaSatuan.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-3 font-semibold text-emerald-300">
                      Rp {item.totalHarga.toLocaleString("id-ID")}
                    </td>
                    {/* Kolom Bukti + Edit */}
                    <td className="py-2 px-3">
                      {editId === item._id ? (
                        <div className="flex flex-col gap-2 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleEditBukti(e, item._id)}
                            className="block w-full text-xs text-slate-400"
                          />
                          {editBuktiPreview && (
                            <img
                              src={editBuktiPreview}
                              alt="Preview"
                              className="mt-2 rounded shadow max-h-12"
                            />
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-xs"
                              onClick={() => handleSaveEditBukti(item._id)}
                              type="button"
                            >
                              Simpan Bukti
                            </button>
                            <button
                              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-800 text-xs"
                              onClick={() => {
                                setEditId(null);
                                setEditBuktiFile(null);
                                setEditBuktiPreview(null);
                              }}
                              type="button"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {item.bukti ? (
                            <img
                              src={item.bukti}
                              alt="Bukti"
                              className="mx-auto rounded shadow max-h-12"
                            />
                          ) : (
                            <span className="text-slate-400 text-xs italic">-</span>
                          )}
                          <button
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs mt-1"
                            onClick={() => setEditId(item._id)}
                            type="button"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit Bukti
                          </button>
                        </div>
                      )}
                    </td>
                    {/* Kolom Catatan + Edit */}
                    <td className="py-2 px-3">
                      {editId === item._id && !editBuktiFile ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            className="w-full rounded bg-slate-900/60 border border-slate-700 px-2 py-1 text-xs"
                            value={editCatatan}
                            onChange={e => setEditCatatan(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-xs"
                              onClick={() => handleSaveEdit(item._id)}
                              type="button"
                            >
                              Simpan
                            </button>
                            <button
                              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-800 text-xs"
                              onClick={() => setEditId(null)}
                              type="button"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-slate-200">{item.catatan}</span>
                          <button
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs mt-1"
                            onClick={() => handleEdit(item._id, item.catatan)}
                            type="button"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    {/* Kolom Status */}
                    <td className="py-2 px-3">
                      {item.status === "menunggu" && (
                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 text-xs font-semibold flex items-center gap-1 justify-center">
                          <UploadCloud className="w-4 h-4" /> Menunggu
                        </span>
                      )}
                      {item.status === "diterima" && (
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 justify-center">
                          <CheckCircle2 className="w-4 h-4" /> Diterima
                        </span>
                      )}
                      {item.status === "ditolak" && (
                        <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1 justify-center">
                          <XCircle className="w-4 h-4" /> Ditolak
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}