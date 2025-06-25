"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

type User = {
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

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((json) => {
        const u = json.data;
        setUser({
          _id: u._id,
          name: u.name || "",
          email: u.email || "",
          noTelp: u.noTelp || "",
          kontrakan: u.kontrakan || "-",
          status: u.status || "aktif",
          tanggalBergabung: u.tanggalBergabung
            ? new Date(u.tanggalBergabung).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
            : "-",
          photoURL: u.photoURL || "/api/placeholder/50/50",
          lastPayment: u.lastPayment
            ? new Date(u.lastPayment).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
            : "-",
          role: u.role || "penyewa",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal mengambil data user");
        setLoading(false);
      });
  }, [id]);

  // Handle edit
  const handleSave = async (form: User) => {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/user/${form._id}`, {
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
    if (res.ok) {
      router.push("/dashboard/admin/penyewa"); // atau redirect ke halaman list user
    } else {
      setError("Gagal menyimpan perubahan");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Memuat data user...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-400">User tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-slate-200 flex flex-col items-center">
      <div className="w-full max-w-lg mt-12 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl p-8 relative">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">
          Edit Data User
        </h2>
        <EditForm
          user={user}
          onSave={handleSave}
          onCancel={() => router.back()}
          saving={saving}
        />
        {error && <div className="mt-4 text-red-400 text-sm text-center">{error}</div>}
      </div>
    </div>
  );
}

function EditForm({
  user,
  onSave,
  onCancel,
  saving,
}: {
  user: User;
  onSave: (data: User) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...user });

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
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Batal
        </Button>
        <Button type="submit" className="flex items-center gap-2" disabled={saving}>
          <Edit3 className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}