"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Lock,
  Camera,
  FileText,
  Home,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Footer from "@components/layout/footer";
import { TamuNavbar } from "../../tamu/navbar";

type Darurat = {
  nama: string;
  hubungan: string;
  noTelp: string;
};

type ProfileData = {
  uid: string;
  nama: string;
  email: string;
  noTelp: string;
  alamat: string;
  tanggalLahir: string;
  tanggalBergabung: string;
  noKTP: string;
  pekerjaan: string;
  darurat: Darurat;
  role: string;
  photoURL?: string;
};

export default function ProfilTamuPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState<ProfileData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Proteksi login
useEffect(() => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    window.location.href = "/login";
    return;
  }
  const localUser = JSON.parse(userStr);
  if (localUser.role !== "tamu") {
    window.location.href = `/dashboard/${localUser.role}`;
    return;
  }

    // Fetch data user dari MongoDB
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-user?uid=${localUser.uid}`);
        const data = await res.json();
        if (data.user) {
          setProfileData({
            uid: data.user.uid,
            nama: data.user.name || "",
            email: data.user.email || "",
            noTelp: data.user.noTelp || "",
            alamat: data.user.alamat || "",
            tanggalLahir: data.user.tanggalLahir || "",
            tanggalBergabung: data.user.tanggalBergabung || "",
            noKTP: data.user.noKTP || "",
            pekerjaan: data.user.pekerjaan || "",
            darurat: data.user.darurat || { nama: "", hubungan: "", noTelp: "" },
            role: data.user.role || "tamu",
            photoURL: data.user.photoURL || "",
          });
        } else {
          setProfileData(null);
        }
      } catch {
        setProfileData(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Cek apakah profil belum lengkap (ada field kosong selain tanggalBergabung)
  const isIncomplete =
    profileData &&
    Object.entries(profileData)
      .filter(([key]) => key !== "tanggalBergabung" && key !== "uid" && key !== "role" && key !== "photoURL")
      .some(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some((v) => !v);
        }
        return !value;
      });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!tempData) return;
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [keyof ProfileData, keyof Darurat];
      setTempData({
        ...tempData,
        [parent]: {
          ...(tempData[parent] as Darurat),
          [child]: value,
        },
      });
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      });
    }
  };

  const enableEditMode = () => {
    setTempData(profileData ? { ...profileData } : null);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  // Simpan perubahan ke MongoDB
  const saveChanges = async () => {
    if (!tempData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: tempData.uid,
          name: tempData.nama,
          email: tempData.email,
          noTelp: tempData.noTelp,
          alamat: tempData.alamat,
          tanggalLahir: tempData.tanggalLahir,
          tanggalBergabung: tempData.tanggalBergabung,
          noKTP: tempData.noKTP,
          pekerjaan: tempData.pekerjaan,
          darurat: {
            nama: tempData.darurat.nama,
            hubungan: tempData.darurat.hubungan,
            noTelp: tempData.darurat.noTelp,
          },
          role: "tamu",
          photoURL: tempData.photoURL,
        }),
      });
      const data = await res.json();
      if (data.user) {
        setEditMode(false);
        alert("Profil berhasil diperbarui!");
        window.location.reload();
      } else {
        alert("Gagal update data.");
      }
    } catch {
      alert("Gagal update data.");
    }
    setSaving(false);
  };

  const openPasswordModal = () => setShowPasswordModal(true);
  const closePasswordModal = () => setShowPasswordModal(false);

  if (loading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <TamuNavbar />
      <main className="lg:ml-64 flex-grow">
        <section className="container mx-auto px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <User className="w-8 h-8" />
                Profil Tamu
              </h1>
              <p className="text-slate-400">Kelola informasi pribadi Anda sebagai tamu kontrakan</p>
            </div>
            {isIncomplete && (
              <div className="mb-6 flex items-center gap-3 bg-yellow-900/40 border border-yellow-500/30 text-yellow-300 px-5 py-4 rounded-lg shadow">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Lengkapi profil Anda!</div>
                  <div className="text-sm text-yellow-200">
                    Beberapa data profil masih kosong. Silakan lengkapi agar data Anda valid.
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar Profil */}
              <div className="col-span-1">
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
                  {/* Foto dan Nama */}
                  <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 p-6 text-center relative">
                    <div
                      className="relative w-28 h-28 mx-auto mb-4 rounded-full border-4 border-white/30 overflow-hidden"
                      onMouseEnter={() => setIsHoveringPhoto(true)}
                      onMouseLeave={() => setIsHoveringPhoto(false)}
                    >
                      <img
                        src={profileData.photoURL || "/all.jpg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      {isHoveringPhoto && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold mb-1 text-emerald-300">{profileData.nama || "Nama Tamu"}</h2>
                    <p className="text-emerald-200">Tamu</p>
                  </div>
                  {/* Informasi Kontrakan */}
                  <div className="p-5 border-b border-slate-700/50">
                    <h3 className="font-semibold mb-3 text-emerald-400 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Informasi Tamu
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-slate-400 mb-1">Tanggal Bergabung</div>
                        <div className="font-medium text-slate-100">{profileData.tanggalBergabung || "-"}</div>
                      </div>
                    </div>
                  </div>
                  {/* Status & Navigasi */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4 bg-emerald-500/10 text-emerald-400 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span>Status Tamu</span>
                    </div>
                    <button
                      onClick={openPasswordModal}
                      className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 rounded-lg p-3 transition duration-200 mb-3"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Ubah Password</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="col-span-1 lg:col-span-2">
                <div className="rounded-xl shadow-lg border bg-slate-800/60 backdrop-blur-sm border-slate-700/50 overflow-hidden mb-6">
                  <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-slate-100">Data Pribadi</h3>
                    {!editMode ? (
                      <button
                        onClick={enableEditMode}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEdit}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                          Batal
                        </button>
                        <button
                          onClick={saveChanges}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                          disabled={saving}
                        >
                          <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nama Lengkap */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Nama Lengkap</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="nama"
                            value={tempData.nama}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <User className="text-emerald-400 w-5 h-5" />
                            <span className="font-medium">{profileData.nama || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* Email */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Email</label>
                        {editMode && tempData ? (
                          <input
                            type="email"
                            name="email"
                            value={tempData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <Mail className="text-emerald-400 w-5 h-5" />
                            <span className="font-medium">{profileData.email || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* No. Telepon */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">No. Telepon</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="noTelp"
                            value={tempData.noTelp}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <Phone className="text-emerald-400 w-5 h-5" />
                            <span className="font-medium">{profileData.noTelp || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* Tanggal Lahir */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Tanggal Lahir</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="tanggalLahir"
                            value={tempData.tanggalLahir}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <Calendar className="text-emerald-400 w-5 h-5" />
                            <span className="font-medium">{profileData.tanggalLahir || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* No. KTP */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">No. KTP</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="noKTP"
                            value={tempData.noKTP}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <FileText className="text-emerald-400 w-5 h-5" />
                            <span className="font-medium">{profileData.noKTP || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* Pekerjaan */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Pekerjaan</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="pekerjaan"
                            value={tempData.pekerjaan}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <Briefcase className="text-emerald-400 w-5 h-5" />
                            <span className="font-medium">{profileData.pekerjaan || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* Alamat */}
                      <div className="md:col-span-2">
                        <label className="text-sm text-slate-400 mb-1 block">Alamat</label>
                        {editMode && tempData ? (
                          <textarea
                            name="alamat"
                            value={tempData.alamat}
                            onChange={handleChange}
                            rows={2}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          ></textarea>
                        ) : (
                          <div className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <MapPin className="text-emerald-400 w-5 h-5 mt-0.5" />
                            <span className="font-medium">{profileData.alamat || "-"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Kontak Darurat */}
                <div className="rounded-xl shadow-lg border bg-slate-800/60 backdrop-blur-sm border-slate-700/50 overflow-hidden">
                  <div className="p-6 border-b border-slate-700/50">
                    <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Kontak Darurat
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nama Kontak Darurat */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Nama Kontak Darurat</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="darurat.nama"
                            value={tempData.darurat.nama}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <User className="text-yellow-400 w-5 h-5" />
                            <span className="font-medium">{profileData.darurat.nama || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* Hubungan */}
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Hubungan</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="darurat.hubungan"
                            value={tempData.darurat.hubungan}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <User className="text-yellow-400 w-5 h-5" />
                            <span className="font-medium">{profileData.darurat.hubungan || "-"}</span>
                          </div>
                        )}
                      </div>
                      {/* No. Telepon Darurat */}
                      <div className="md:col-span-2">
                        <label className="text-sm text-slate-400 mb-1 block">No. Telepon Darurat</label>
                        {editMode && tempData ? (
                          <input
                            type="text"
                            name="darurat.noTelp"
                            value={tempData.darurat.noTelp}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <Phone className="text-yellow-400 w-5 h-5" />
                            <span className="font-medium">{profileData.darurat.noTelp || "-"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Modal Ubah Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-slate-700">
            {/* Modal Header */}
            <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Ubah Password
              </h3>
              <button
                onClick={closePasswordModal}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Password Lama</label>
                  <input
                    type="password"
                    placeholder="Masukkan password lama"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Password Baru</label>
                  <input
                    type="password"
                    placeholder="Masukkan password baru"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    placeholder="Konfirmasi password baru"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closePasswordModal}
                    className="flex-1 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 transition duration-200"
                  >
                    Batal
                  </button>
                  <button
                    className="flex-1 py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition duration-200"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}