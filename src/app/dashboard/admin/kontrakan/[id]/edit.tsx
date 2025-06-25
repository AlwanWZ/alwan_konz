"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EditKontrakanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/kontrakan/${id}`)
      .then((res) => res.json())
      .then((json) => setForm(json.data));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: name === "harga" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/kontrakan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        alamat: form.lokasi || form.alamat,
        harga: form.harga,
        status: form.status === "terisi" ? "disewa" : "tersedia",
        fasilitas: form.fasilitas,
        foto: form.foto,
      }),
    });
    router.push("/dashboard/admin/kontrakan");
  };

  if (!form) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Edit Kontrakan</h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="nama" className="block mb-1 font-medium">
            Nama Kontrakan
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full rounded-md p-2 text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="lokasi" className="block mb-1 font-medium">
            Lokasi
          </label>
          <input
            type="text"
            id="lokasi"
            name="lokasi"
            value={form.lokasi || form.alamat}
            onChange={handleChange}
            className="w-full rounded-md p-2 text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="harga" className="block mb-1 font-medium">
            Harga Sewa (Rp)
          </label>
          <input
            type="number"
            id="harga"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            className="w-full rounded-md p-2 text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1 font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status === "disewa" ? "terisi" : form.status}
            onChange={handleChange}
            className="w-full rounded-md p-2 text-black"
          >
            <option value="tersedia">Tersedia</option>
            <option value="terisi">Terisi</option>
          </select>
        </div>
        <Button type="submit" variant="default" size="default">
          Simpan
        </Button>
      </form>
    </div>
  );
}