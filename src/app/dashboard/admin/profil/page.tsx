"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  User,
  Shield,
  Bell,
  Camera,
  Edit3,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Lock,
} from "lucide-react";
import { AdminNavbar } from "../navbar";
import Footer from "@components/layout/footer";
import { useRouter } from "next/navigation";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  photoURL: string;
  location: string;
  joinDate: string;
  lastLogin: string;
  bio: string;
  stats: {
    totalKontrakan: number;
    totalPenyewa: number;
    pendapatanBulan: number;
    tagihan: number;
  };
}

const defaultStats = {
  totalKontrakan: 0,
  totalPenyewa: 0,
  pendapatanBulan: 0,
  tagihan: 0,
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "security">("overview");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Proteksi akses: hanya admin, keuangan, maintenance
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (!["admin", "keuangan", "maintenance"].includes(user.role)) {
      if (user.role === "tamu") router.replace("/dashboard/tamu/profil");
      else if (user.role === "penyewa") router.replace("/dashboard/penyewa/profil");
      else router.replace("/login");
    }
  }, [router]);

  // Ambil data user yang sedang login
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      window.location.href = "/login";
      return;
    }
    const localUser = JSON.parse(userStr);
    if (!["admin", "keuangan", "maintenance"].includes(localUser.role)) {
      window.location.href = `/dashboard/${localUser.role}/profil`;
      return;
    }
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Ambil data user
        const res = await fetch(`/api/get-user?uid=${localUser.uid}`);
        const data = await res.json();
        if (data.user) {
          // Ambil statistik real
          const [kontrakanRes, penyewaRes, pembayaranRes] = await Promise.all([
            fetch("/api/kontrakan"),
            fetch("/api/user?role=penyewa"),
            fetch("/api/pembayaran-penyewa"),
          ]);
          const kontrakanData = await kontrakanRes.json();
          const penyewaData = await penyewaRes.json();
          const pembayaranData = await pembayaranRes.json();

          // Hitung statistik dari pembayaran-penyewa
          const now = new Date();
          const pendapatanBulan = (pembayaranData.data || [])
            .filter(
              (p: any) =>
                p.status === "Lunas" &&
                p.tanggalBayar &&
                new Date(p.tanggalBayar).getMonth() === now.getMonth() &&
                new Date(p.tanggalBayar).getFullYear() === now.getFullYear()
            )
            .reduce((sum: number, p: any) => sum + (p.jumlah || 0), 0);

          const tagihanPending = (pembayaranData.data || []).filter((p: any) => p.status === "Pending").length;

          setUser({
            uid: data.user.uid,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.noTelp || "",
            role: data.user.role || "admin",
            photoURL: data.user.photoURL || "/all.jpg",
            location: data.user.alamat || "-",
            joinDate: data.user.tanggalBergabung || "",
            lastLogin: data.user.lastLogin || "",
            bio: data.user.bio || "",
            stats: {
              totalKontrakan: kontrakanData.data?.length || 0,
              totalPenyewa: penyewaData.data?.length || 0,
              pendapatanBulan,
              tagihan: tagihanPending,
            },
          });
        }
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  const profileStats = [
    {
      label: "Total Kontrakan",
      value: user.stats.totalKontrakan,
      icon: <User className="w-6 h-6" />,
      color: "from-emerald-400 to-teal-500",
      trend: "",
    },
    {
      label: "Penyewa Aktif",
      value: user.stats.totalPenyewa,
      icon: <Shield className="w-6 h-6" />,
      color: "from-blue-400 to-indigo-500",
      trend: "",
    },
    {
      label: "Pendapatan Bulan Ini",
      value: `Rp ${user.stats.pendapatanBulan.toLocaleString("id-ID")}`,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-purple-400 to-pink-500",
      trend: "",
    },
    {
      label: "Tagihan Pending",
      value: user.stats.tagihan,
      icon: <Bell className="w-6 h-6" />,
      color: "from-red-400 to-orange-500",
      trend: "",
    },
  ];

  const handleEditToggle = (): void => {
    if (isEditing) {
      setUser((prev) => ({ ...prev!, ...editForm }));
    } else {
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserProfile, value: string): void => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Upload foto profil ke Cloudinary
  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload ke Cloudinary
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        // Simpan url ke user
        const syncBody: any = {
          uid: user.uid,
          photoURL: uploadData.url,
        };
        // Tidak perlu kontrakan untuk admin
        const syncRes = await fetch("/api/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(syncBody),
        });
        const syncData = await syncRes.json();
        if (syncData.success) {
          setUser((prev) => ({ ...prev!, photoURL: uploadData.url }));
          // Update localStorage juga
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              photoURL: uploadData.url,
            })
          );
        } else {
          alert("Gagal menyimpan foto profil.");
        }
      } else {
        alert("Gagal upload foto.");
      }
    } catch {
      alert("Terjadi kesalahan saat upload foto.");
    }
    setUploading(false);
  };

  const TabButton: React.FC<{
    tab: string;
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }> = ({ tab, active, onClick, icon, label }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  async function saveProfileChanges(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Siapkan data yang akan dikirim
      const payload: any = {
        uid: user.uid,
        name: editForm.name,
        email: editForm.email,
        role: user.role,
        noTelp: editForm.phone,
        alamat: editForm.location,
        bio: editForm.bio,
        photoURL: user.photoURL,
      };
      // Tidak perlu kontrakan untuk admin
      const res = await fetch("/api/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => ({
          ...prev!,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.noTelp,
          location: data.user.alamat,
          bio: data.user.bio,
        }));
        setIsEditing(false);
        // Update localStorage user dengan data terbaru dari backend
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.noTelp,
            location: data.user.alamat,
            bio: data.user.bio,
          })
        );
      } else {
        alert("Gagal memperbarui profil." + (data.error || "Unknown error"));
      }
    } catch {
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col">
      <AdminNavbar />
      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Left Sidebar - Profile Card */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden h-full">
                {/* Profile Header */}
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-center">
                  <div className="relative group mb-4">
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                    />
                    <button
                      type="button"
                      className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={handleAvatarClick}
                      disabled={uploading}
                      title="Ubah foto profil"
                    >
                      {uploading ? (
                        <span className="text-white">Uploading...</span>
                      ) : (
                        <Camera className="w-8 h-8 text-white" />
                      )}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                  <div className="flex items-center justify-center gap-2 text-emerald-100 mb-4">
                    <Shield className="w-4 h-4" />
                    <span>{user.role}</span>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg mx-auto transition-all duration-200"
                  >
                    <Lock className="w-4 h-4" />
                    Ubah Password
                  </button>
                </div>
                {/* Profile Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                      <p className="text-white text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Telepon</p>
                      <p className="text-white text-sm">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Lokasi</p>
                      <p className="text-white text-sm">{user.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Bergabung</p>
                      <p className="text-white text-sm">
                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString("id-ID") : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Content - Main Content Area */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden h-full flex flex-col">
                {/* Tabs */}
                <div className="border-b border-gray-700/50 p-6">
                  <div className="flex space-x-1 justify-center lg:justify-start">
                    <TabButton
                      tab="overview"
                      active={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                      icon={<User className="w-4 h-4" />}
                      label="Overview"
                    />
                    <TabButton
                      tab="settings"
                      active={activeTab === "settings"}
                      onClick={() => setActiveTab("settings")}
                      icon={<Edit3 className="w-4 h-4" />}
                      label="Seting Profil"
                    />
                    <TabButton
                      tab="security"
                      active={activeTab === "security"}
                      onClick={() => setActiveTab("security")}
                      icon={<Shield className="w-4 h-4" />}
                      label="Keamanan"
                    />
                  </div>
                </div>
                {/* Tab Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6">
                          Dashboard Overview
                        </h3>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                          {profileStats.map((stat, index) => (
                            <div
                              key={index}
                              className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-emerald-500/30 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div
                                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                                >
                                  {stat.icon}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                  {stat.value}
                                </h3>
                                <p className="text-gray-400 text-sm mb-2">
                                  {stat.label}
                                </p>
                                {stat.trend && (
                                  <p className="text-emerald-400 text-xs font-medium">
                                    {stat.trend}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Bio Section */}
                        <div className="bg-gray-700/30 rounded-xl p-6">
                          <h4 className="text-lg font-semibold text-white mb-3">Bio</h4>
                          <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "settings" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-white">
                          Seting Profil
                        </h3>
                        <div className="flex gap-2">
                          {!isEditing ? (
                            <button
                              onClick={handleEditToggle}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                            >
                              <Edit3 className="w-4 h-4" /> Edit Profil
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={saveProfileChanges}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                              >
                                <Save className="w-4 h-4" /> Simpan
                              </button>
                              <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
                              >
                                Batal
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={editForm.name ?? user.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editForm.email ?? user.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Telepon
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone ?? user.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Lokasi
                          </label>
                          <input
                            type="text"
                            value={editForm.location ?? user.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label className="block text-sm text-gray-400 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={editForm.bio ?? user.bio}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200"
                            rows={4}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-white">
                        Keamanan Akun
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                              <Lock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Ganti Password</h4>
                              <p className="text-sm text-gray-400">Terakhir diubah: 30 hari lalu</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">
                            Perbarui password Anda secara berkala untuk keamanan yang lebih baik.
                          </p>
                          <button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
                            onClick={() => setShowPasswordModal(true)}
                          >
                            Ganti Password
                          </button>
                        </div>
                        <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Autentikasi 2FA</h4>
                              <p className="text-sm text-gray-400">Status: Tidak aktif</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">
                            Tingkatkan keamanan akun dengan mengaktifkan autentikasi dua faktor.
                          </p>
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium">
                            Aktifkan 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modal Ubah Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-slate-700">
            <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Ubah Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan password lama"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan password baru"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Konfirmasi password baru"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white transition duration-200"
                  >
                    Batal
                  </button>
                  <button className="flex-1 py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition duration-200">
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
};

export default ProfilePage;