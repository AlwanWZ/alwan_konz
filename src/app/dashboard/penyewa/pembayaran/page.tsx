"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRightCircle,
  Wallet,
  CreditCard as CreditCardIcon,
  Ban,
  QrCode,
  X,
} from "lucide-react";
import { PenyewaNavbar } from "../navbar";
import Footer from "@components/layout/footer";

interface PembayaranItem {
  bulan: string;
  status: "Lunas" | "Belum Lunas" | "Pending";
  jumlah: number;
  tanggalBayar: string | null;
  pembayaranId?: string;
}

const pembayaranMetode = [
  { id: "transfer", name: "Transfer Bank", icon: Ban },
  { id: "card", name: "Kartu Kredit/Debit", icon: CreditCardIcon },
  { id: "ewallet", name: "E-Wallet", icon: Wallet },
  { id: "qris", name: "QRIS", icon: QrCode },
];

const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function PembayaranPage() {
  const [user, setUser] = useState<any>(null);
  const [kontrakan, setKontrakan] = useState<any>(null);
  const [pembayaranRiwayat, setPembayaranRiwayat] = useState<any[]>([]);
  const [tagihan, setTagihan] = useState<PembayaranItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PembayaranItem | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPembayaran, setDetailPembayaran] = useState<PembayaranItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ambil user dari localStorage dan data kontrakan dari API
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("User tidak ditemukan. Silakan login ulang.");
      setUser(null);
      return;
    }
    const localUser = JSON.parse(userStr);
    setUser(localUser);

    // Ambil data user dan kontrakan dari API
    fetch(`/api/pembayaran-penyewa?nama=${encodeURIComponent(localUser.kontrakan)}`)
      .then(res => res.json())
      .then(data => {
        const userData = (data.users || []).find((u: any) => u.uid === localUser.uid);
        setUser(userData || localUser);
        setKontrakan(data.kontrakan || null);
      })
      .catch(() => setError("Gagal mengambil data kontrakan."));
  }, []);

  // Ambil riwayat pembayaran user
  useEffect(() => {
    if (!user) return;
    fetch(`/api/pembayaran-penyewa?userId=${user.uid}`)
      .then(res => res.json())
      .then(data => setPembayaranRiwayat(data.data || []))
      .catch(() => setError("Gagal mengambil riwayat pembayaran."));
  }, [user, paymentSuccess]);

  // Generate tagihan otomatis (bulan awal sewa + 2 bulan ke depan)
  useEffect(() => {
    if (!user || !kontrakan) return;
    const bulanAwal = user.tanggalBergabung
      ? new Date(user.tanggalBergabung)
      : new Date();
    const tagihanArr: PembayaranItem[] = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const bulanTagihan = new Date(bulanAwal);
      bulanTagihan.setMonth(bulanAwal.getMonth() + i);
      const bulanStr = bulanTagihan.toLocaleString("id-ID", { month: "long", year: "numeric" });

      // Cek apakah sudah ada pembayaran di bulan ini
      const pembayaran = pembayaranRiwayat.find(
        (p) =>
          p.bulan === bulanStr
      );

tagihanArr.push({
  bulan: bulanStr,
  status: pembayaran
    ? (pembayaran.status === "Lunas" ? "Lunas" : pembayaran.status === "Pending" ? "Pending" : "Belum Lunas")
    : (bulanTagihan <= now ? "Belum Lunas" : "Pending"),
  jumlah: kontrakan.harga,
  tanggalBayar: pembayaran ? pembayaran.tanggalBayar : null,
  pembayaranId: pembayaran ? pembayaran._id : undefined,
});
    }
    setTagihan(tagihanArr);
  }, [user, kontrakan, pembayaranRiwayat, paymentSuccess]);

  // Modal logic
  const openPaymentModal = (payment: PembayaranItem) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
    setPaymentStep(1);
    setSelectedMethod(null);
    setPaymentSuccess(false);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleContinuePayment = () => {
    if (selectedMethod) {
      setPaymentStep(2);
    }
  };

  // Proses pembayaran: POST ke API pembayaran-penyewa
  const handleProcessPayment = async () => {
    if (!selectedPayment || !user || !kontrakan) return;
    setIsProcessing(true);
    const res = await fetch("/api/pembayaran-penyewa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        nama: user.name,
        kontrakan: kontrakan.nama,
        bulan: selectedPayment.bulan,
        jumlah: selectedPayment.jumlah,
        metode: selectedMethod,
      }),
    });
    setIsProcessing(false);
    if (res.ok) {
      setPaymentSuccess(true);
      setShowPaymentModal(false);
      // Refresh riwayat pembayaran
      fetch(`/api/pembayaran-penyewa?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => setPembayaranRiwayat(data.data || []));
    }
  };

  // Summary
const totalTagihan = pembayaranRiwayat
  .reduce((sum, p) => sum + (p.jumlah || 0), 0);
const sudahDibayar = pembayaranRiwayat
  .filter((p) => p.status === "Lunas")
  .reduce((sum, p) => sum + (p.jumlah || 0), 0);
  const tagihanAktif = tagihan.filter((t) => t.status !== "Lunas").length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <PenyewaNavbar />
      <main className="lg:ml-64 flex-grow">
        <section className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <CreditCard className="w-8 h-8" />
                Pembayaran Sewa Kontrakan
              </h1>
              <p className="text-slate-400 text-lg">
                Kelola dan pantau pembayaran sewa kontrakan Anda dengan mudah.
              </p>
              {kontrakan && (
                <div className="mt-2 text-slate-300">
                  <b>Kontrakan:</b> {kontrakan.nama} | <b>Harga:</b> {formatRupiah(kontrakan.harga)}
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 rounded bg-red-900/40 border border-red-600 text-red-300 font-semibold">
                  {error}
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-800 p-5 rounded-xl border border-emerald-500/30 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-slate-200">Total Tagihan</h3>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{formatRupiah(totalTagihan)}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-800 p-5 rounded-xl border border-blue-500/30 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-slate-200">Sudah Dibayar</h3>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{formatRupiah(sudahDibayar)}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-slate-800 p-5 rounded-xl border border-purple-500/30 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-slate-200">Tagihan Aktif</h3>
                    <p className="text-2xl font-bold text-purple-400 mt-1">{tagihanAktif} Bulan</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Riwayat Pembayaran */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Riwayat Pembayaran</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tagihan.length === 0 && !error && (
                  <div className="col-span-3 text-center text-slate-400 py-10">
                    Tidak ada data tagihan. Pastikan data user dan kontrakan sudah benar.
                  </div>
                )}
                {tagihan.map((item, idx) => {
                  const isLunas = item.status === "Lunas";
                  const isBelum = item.status === "Belum Lunas";
                  const isPending = item.status === "Pending";

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-5 shadow-lg border transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${
                        isLunas
                          ? "from-green-900/40 to-slate-800 border-green-500/30"
                          : isBelum
                          ? "from-red-900/30 to-slate-800 border-red-500/30"
                          : "from-yellow-900/30 to-slate-800 border-yellow-500/30"
                      }`}
                    >
                      <div className="text-xl font-semibold mb-1">{item.bulan}</div>
                      <div className="text-sm text-slate-300 mb-4">
                        Jumlah: {formatRupiah(item.jumlah)}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {isLunas && (
                          <>
                            <CheckCircle2 className="text-green-400 w-5 h-5" />
                            <span className="text-green-300 bg-green-500/20 px-3 py-1 text-xs rounded-full font-medium">
                              Lunas
                            </span>
                          </>
                        )}
                        {isBelum && (
                          <>
                            <XCircle className="text-red-400 w-5 h-5" />
                            <span className="text-red-300 bg-red-500/20 px-3 py-1 text-xs rounded-full font-medium">
                              Belum Lunas
                            </span>
                          </>
                        )}
                        {isPending && (
                          <>
                            <Clock className="text-yellow-400 w-5 h-5" />
                            <span className="text-yellow-300 bg-yellow-500/20 px-3 py-1 text-xs rounded-full font-medium">
                              Pending
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-slate-400 mb-4">
                        Tanggal Bayar:{" "}
                        <span className="text-white font-medium">
                          {item.tanggalBayar || "-"}
                        </span>
                      </div>
                      {(isBelum || isPending) && (
                        <button
                          onClick={() => openPaymentModal(item)}
                          className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition duration-200 shadow-md hover:shadow-emerald-500/20"
                        >
                          <ArrowRightCircle className="w-5 h-5" />
                          {isBelum ? "Bayar Sekarang" : "Cek Status"}
                        </button>
                      )}
                      {isLunas && (
                        <button
                          className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition duration-200"
                          onClick={() => {
                            setDetailPembayaran(item);
                            setShowDetailModal(true);
                          }}
                        >
                          <CreditCard className="w-5 h-5" />
                          Detail Pembayaran
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Payment Modal */}
        {showPaymentModal && selectedPayment && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-slate-700">
              {/* Modal Header */}
              <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100">
                  {paymentSuccess ? "Pembayaran Berhasil" : `Pembayaran ${selectedPayment.bulan}`}
                </h3>
                <button
                  onClick={closePaymentModal}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Modal Content */}
              <div className="p-5">
                {paymentSuccess ? (
                  <div className="text-center py-6">
                    <div className="mx-auto bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-green-400 mb-2">Pembayaran Berhasil!</h4>
                    <p className="text-slate-300 mb-6">Pembayaran {selectedPayment.bulan} sebesar {formatRupiah(selectedPayment.jumlah)} telah berhasil.</p>
                    <button
                      onClick={closePaymentModal}
                      className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
                    >
                      Tutup
                    </button>
                  </div>
                ) : (
                  <>
                    {paymentStep === 1 && (
                      <>
                        <div className="mb-5">
                          <div className="flex justify-between mb-3">
                            <span className="text-slate-400">Tagihan</span>
                            <span className="font-semibold">{selectedPayment.bulan}</span>
                          </div>
                          <div className="flex justify-between mb-3">
                            <span className="text-slate-400">Jumlah</span>
                            <span className="font-semibold">{formatRupiah(selectedPayment.jumlah)}</span>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3">Pilih Metode Pembayaran</h4>
                        <div className="space-y-3 mb-6">
                          {pembayaranMetode.map((metode) => {
                            const Icon = metode.icon;
                            const isSelected = selectedMethod === metode.id;
                            return (
                              <div
                                key={metode.id}
                                onClick={() => handleSelectMethod(metode.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition duration-200 border ${
                                  isSelected
                                    ? "bg-emerald-500/10 border-emerald-500"
                                    : "border-slate-700 hover:bg-slate-700/50"
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isSelected ? "bg-emerald-500/20" : "bg-slate-700"
                                }`}>
                                  <Icon className={`w-5 h-5 ${isSelected ? "text-emerald-400" : "text-slate-300"}`} />
                                </div>
                                <div className="flex-grow">
                                  <p className={`font-medium ${isSelected ? "text-emerald-400" : "text-white"}`}>{metode.name}</p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={handleContinuePayment}
                          disabled={!selectedMethod}
                          className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                            selectedMethod
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : "bg-slate-700 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          Lanjutkan Pembayaran
                        </button>
                      </>
                    )}
                    {paymentStep === 2 && (
                      <>
                        <div className="mb-5 p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                          <h4 className="font-medium text-emerald-400 mb-3">Detail Pembayaran</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Tagihan</span>
                              <span>{selectedPayment.bulan}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Jumlah</span>
                              <span>{formatRupiah(selectedPayment.jumlah)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Biaya Admin</span>
                              <span>{formatRupiah(2500)}</span>
                            </div>
                            <div className="border-t border-slate-700 mt-2 pt-2 flex justify-between">
                              <span className="font-medium">Total</span>
                              <span className="font-semibold text-emerald-400">{formatRupiah(selectedPayment.jumlah + 2500)}</span>
                            </div>
                          </div>
                        </div>
                        {/* Instruksi pembayaran sesuai metode */}
                        {selectedMethod === "transfer" && (
                          <div className="mb-5 p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                            <h4 className="font-medium text-blue-400 mb-3">Instruksi Transfer Bank</h4>
                            <div className="space-y-2 text-sm">
                              <p>1. Transfer ke rekening berikut:</p>
                              <div className="bg-slate-700 p-3 rounded-md mb-2">
                                <div className="text-slate-300">Bank BCA</div>
                                <div className="text-white font-semibold">1234-5678-9012</div>
                                <div className="text-slate-300">a.n. PT Kontrakan Sejahtera</div>
                              </div>
                              <p>2. Transfer tepat sampai 3 digit terakhir</p>
                              <p>3. Konfirmasi dengan klik tombol di bawah</p>
                            </div>
                          </div>
                        )}
                        {selectedMethod === "card" && (
                          <div className="mb-5 space-y-4">
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm text-slate-300 mb-1 block">Nomor Kartu</label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-sm text-slate-300 mb-1 block">Expired Date</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-slate-300 mb-1 block">CVV</label>
                                  <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
{selectedMethod === "ewallet" && (
  <div className="mb-5 space-y-4">
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-blue-500/30 bg-blue-500/10 p-3 rounded-lg flex items-center justify-center cursor-pointer">
          <img src="/images/logo-ovo.png" alt="OVO" className="h-8" />
        </div>
        <div className="border border-slate-700 p-3 rounded-lg flex items-center justify-center cursor-pointer">
          <img src="/images/logo-dana.png" alt="DANA" className="h-8" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-slate-700 p-3 rounded-lg flex items-center justify-center cursor-pointer">
          <img src="/images/logo-gopay.png" alt="GoPay" className="h-8" />
        </div>
        <div className="border border-slate-700 p-3 rounded-lg flex items-center justify-center cursor-pointer">
          <img src="/images/logo-shopeepay.png" alt="ShopeePay" className="h-8" />
        </div>
      </div>
    </div>
  </div>
)}
                        {selectedMethod === "qris" && (
                          <div className="mb-5 p-4 border border-slate-700 rounded-lg bg-slate-800/50 text-center">
                            <h4 className="font-medium text-blue-400 mb-3">Scan QRIS Code</h4>
                            <div className="bg-white p-3 rounded-lg inline-block mb-3">
                              <img src="/api/placeholder/200/200" alt="placeholder" className="w-48 h-48" />
                            </div>
                            <p className="text-sm text-slate-300">Scan kode QR di atas menggunakan aplikasi e-wallet atau m-banking yang Anda gunakan</p>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setPaymentStep(1)}
                            className="flex-1 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 transition duration-200"
                          >
                            Kembali
                          </button>
                          <button
                            onClick={handleProcessPayment}
                            disabled={isProcessing}
                            className="flex-1 py-3 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition duration-200 flex items-center justify-center"
                          >
                            {isProcessing ? (
                              <div className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Memproses...
                              </div>
                            ) : "Konfirmasi Pembayaran"}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal detail pembayaran */}
      <DetailPembayaranModal
        show={showDetailModal}
        pembayaran={detailPembayaran}
        onClose={() => setShowDetailModal(false)}
      />

      <Footer />
    </div>
  );
}

// Modal component for detail pembayaran
interface DetailPembayaranModalProps {
  show: boolean;
  pembayaran: PembayaranItem | null;
  onClose: () => void;
}

function DetailPembayaranModal({ show, pembayaran, onClose }: DetailPembayaranModalProps) {
  if (!show || !pembayaran) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-slate-700">
        <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100">
            Detail Pembayaran {pembayaran.bulan}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Bulan</span>
              <span className="font-semibold">{pembayaran.bulan}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Jumlah</span>
              <span className="font-semibold">{formatRupiah(pembayaran.jumlah)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Status</span>
              <span className="font-semibold">{pembayaran.status}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Tanggal Bayar</span>
              <span className="font-semibold">{pembayaran.tanggalBayar || "-"}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}