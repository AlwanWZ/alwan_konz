import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import PembayaranPenyewa from "@/models/pembayaran-penyewa";
import LaporanPembelian from "@/models/laporan_pembelian";
import User from "@/models/user";

export async function GET() {
  await connectMongo();

  // Ambil tahun & bulan sekarang
  const now = new Date();
  const tahun = now.getFullYear();
  const bulan = now.getMonth() + 1; // 1-12

  // Ambil semua data pembayaran
  const pembayaranAll = await PembayaranPenyewa.find({}).lean();

  // PEMASUKAN BULAN INI (handle string & Date)
  const pemasukanBulanIni = pembayaranAll
    .filter((p: any) => {
      if (p.status !== "Lunas" || !p.tanggalBayar) return false;
      const tgl = typeof p.tanggalBayar === "string" ? new Date(p.tanggalBayar) : p.tanggalBayar;
      return tgl.getMonth() + 1 === bulan && tgl.getFullYear() === tahun;
    })
    .reduce((sum: number, p: any) => sum + (p.jumlah || 0), 0);

  // PENGELUARAN BULAN INI (hanya jika ada model LaporanPembelian)
  let pengeluaranBulanIni = 0;
  try {
    const pengeluaranAll = await LaporanPembelian.find({ status: "diterima" }).lean();
    pengeluaranBulanIni = pengeluaranAll
      .filter((p: any) => {
        if (!p.tanggal) return false;
        const tgl = typeof p.tanggal === "string" ? new Date(p.tanggal) : p.tanggal;
        return tgl.getMonth() + 1 === bulan && tgl.getFullYear() === tahun;
      })
      .reduce((sum: number, p: any) => sum + (p.totalHarga || 0), 0);
  } catch {
    pengeluaranBulanIni = 0;
  }

  // TOTAL PENYEWA
  const totalPenyewa = await User.countDocuments({ role: "penyewa" });

  // PENYEWA YANG SUDAH BAYAR BULAN INI (unik userId)
  const penyewaSudahBayar = pembayaranAll
    .filter((p: any) => {
      if (p.status !== "Lunas" || !p.tanggalBayar) return false;
      const tgl = typeof p.tanggalBayar === "string" ? new Date(p.tanggalBayar) : p.tanggalBayar;
      return tgl.getMonth() + 1 === bulan && tgl.getFullYear() === tahun;
    })
    .map((p: any) => p.userId);

  const uniquePenyewaSudahBayar = [...new Set(penyewaSudahBayar)];

  // TAGIHAN BELUM LUNAS = total penyewa - yang sudah bayar bulan ini
  const totalTagihan = Math.max(totalPenyewa - uniquePenyewaSudahBayar.length, 0);

  // TOTAL PEMBAYARAN (semua status "Lunas")
  const totalPembayaran = pembayaranAll.filter((p: any) => p.status === "Lunas").length;

  // GRAFIK 12 BULAN TERAKHIR
  const grafik: any[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    // Pemasukan per bulan
    const pemasukanBulan = pembayaranAll
      .filter((p: any) => {
        if (p.status !== "Lunas" || !p.tanggalBayar) return false;
        const tgl = typeof p.tanggalBayar === "string" ? new Date(p.tanggalBayar) : p.tanggalBayar;
        return tgl.getMonth() + 1 === m && tgl.getFullYear() === y;
      })
      .reduce((sum: number, p: any) => sum + (p.jumlah || 0), 0);
    // Pengeluaran per bulan
    let pengeluaranBulan = 0;
    try {
      const pengeluaranAll = await LaporanPembelian.find({ status: "diterima" }).lean();
      pengeluaranBulan = pengeluaranAll
        .filter((p: any) => {
          if (!p.tanggal) return false;
          const tgl = typeof p.tanggal === "string" ? new Date(p.tanggal) : p.tanggal;
          return tgl.getMonth() + 1 === m && tgl.getFullYear() === y;
        })
        .reduce((sum: number, p: any) => sum + (p.totalHarga || 0), 0);
    } catch {
      pengeluaranBulan = 0;
    }
    grafik.push({
      bulan: date.toLocaleString("id-ID", { month: "short" }),
      pemasukan: pemasukanBulan,
      pengeluaran: pengeluaranBulan,
    });
  }

  // TRANSAKSI TERBARU (5 terakhir)
  const transaksiPemasukan = pembayaranAll
    .filter((p: any) => p.status === "Lunas" && p.tanggalBayar)
    .sort((a: any, b: any) => new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime())
    .slice(0, 5);

  let transaksiPengeluaran: any[] = [];
  try {
    const pengeluaranAll = await LaporanPembelian.find({ status: "diterima" }).lean();
    transaksiPengeluaran = pengeluaranAll
      .filter((p: any) => p.tanggal)
      .sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 5);
  } catch {
    transaksiPengeluaran = [];
  }

  const transaksiTerbaru = [
    ...transaksiPemasukan.map((t) => ({
      tipe: "Pemasukan",
      tanggal: t.tanggalBayar
        ? new Date(t.tanggalBayar).toISOString().slice(0, 10)
        : "",
      deskripsi: `Pembayaran ${t.nama} (${t.kontrakan}) bulan ${t.bulan} Rp ${t.jumlah?.toLocaleString("id-ID")}`,
    })),
    ...transaksiPengeluaran.map((t) => ({
      tipe: "Pengeluaran",
      tanggal: t.tanggal
        ? new Date(t.tanggal).toISOString().slice(0, 10)
        : "",
      deskripsi: `Pembelian ${t.namaBarang || "-"} Rp ${t.totalHarga?.toLocaleString("id-ID")}`,
    })),
  ]
    .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
    .slice(0, 5);

  return NextResponse.json({
    pemasukanBulanIni,
    pengeluaranBulanIni,
    totalTagihan,
    totalPembayaran,
    grafik,
    transaksiTerbaru,
  });
}