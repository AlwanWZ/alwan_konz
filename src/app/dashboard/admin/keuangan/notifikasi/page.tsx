"use client";

import { useState, useEffect } from "react";
import { Bell, Clock, Filter, Search, Send } from "lucide-react";
import { AdminNavbar } from "../../navbar";
import { useRouter } from "next/navigation";
import { checkRole } from "@/lib/roleGuard";

type Penyewa = {
  _id: string;
  name: string;
  kontrakan: string;
  noTelp?: string;
  jatuhTempo: string;
  sisaHari: number | string;
  pernahBayar: boolean;
};

export default function NotifikasiPengingatPembayaran() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterJatuhTempo, setFilterJatuhTempo] = useState(false);
  const [list, setList] = useState<Penyewa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
    if (checkRole(["maintenance"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin/maintenance");
    } else if (checkRole(["admin"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman keuangan.");
      router.replace("/dashboard/admin");
    } else if (!checkRole(["keuangan"])) {
      alert("Maaf, Anda tidak memiliki otoritas untuk mengakses halaman ini.");
      router.replace("/"); // Atau ke halaman lain sesuai kebutuhan
    }
    // eslint-disable-next-line
  }, [router]);

  async function fetchList() {
    setLoading(true);
    const resUser = await fetch("/api/user?role=penyewa");
    const userJson = await resUser.json();
    const penyewaArr = userJson.data || [];

    const resBayar = await fetch("/api/pembayaran-penyewa");
    const bayarJson = await resBayar.json();
    const pembayaranArr = bayarJson.data || [];

    const listData = penyewaArr.map((u: any) => {
      const pembayaranUser = pembayaranArr
        .filter(
          (p: any) =>
            p.kontrakan === u.kontrakan &&
            p.status === "Lunas" &&
            p.tanggalBayar
        )
        .sort(
          (a: any, b: any) =>
            new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime()
        );
      const lastBayar = pembayaranUser[0];

      let jatuhTempo = "";
      let sisaHari: number | string = "-";
      if (lastBayar && lastBayar.tanggalBayar) {
        const tgl = new Date(lastBayar.tanggalBayar);
        tgl.setDate(tgl.getDate() + 30);
        jatuhTempo = tgl.toISOString().slice(0, 10);
        const now = new Date();
        sisaHari = Math.ceil((tgl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        // Belum pernah bayar
        const besok = new Date();
        besok.setDate(besok.getDate() + 1);
        jatuhTempo = besok.toISOString().slice(0, 10);
        sisaHari = 1;
      }

      return {
        _id: u._id,
        name: u.name,
        kontrakan: u.kontrakan,
        noTelp: u.noTelp,
        jatuhTempo,
        sisaHari,
        pernahBayar: !!lastBayar,
      };
    });

    setList(listData);
    setLoading(false);
  }

  // Filter data
  const filtered = list.filter((d) => {
    const match =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.kontrakan || "").toLowerCase().includes(search.toLowerCase());
    const jatuhTempoMatch = filterJatuhTempo
      ? typeof d.sisaHari === "number" && d.sisaHari < 3
      : true;
    return match && jatuhTempoMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
      <AdminNavbar />
      <main className="container mx-auto p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-emerald-300">
            <Bell className="w-7 h-7" />
            Notifikasi Pengingat Pembayaran
          </h1>
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
                filterJatuhTempo
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-slate-800/60 border-slate-700 text-emerald-300"
              }`}
              onClick={() => setFilterJatuhTempo((v) => !v)}
            >
              <Filter className="w-4 h-4" />
              Jatuh Tempo {"<"} 3 Hari
            </button>
            <div className="flex items-center bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau unit..."
                className="bg-transparent border-0 focus:outline-none text-sm text-slate-300 pl-2 w-40 md:w-56"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full overflow-x-auto rounded-2xl shadow border border-slate-700/50 bg-slate-800/40">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="bg-slate-900/60 text-emerald-200">
                  <th className="py-3 px-4 font-semibold">Penyewa</th>
                  <th className="py-3 px-4 font-semibold">Unit</th>
                  <th className="py-3 px-4 font-semibold">Jatuh Tempo</th>
                  <th className="py-3 px-4 font-semibold">Sisa Hari</th>
                  <th className="py-3 px-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr
                      key={d._id}
                      className="border-t border-slate-700/40 hover:bg-slate-800/70 transition group"
                    >
                      <td className="py-3 px-4 text-center align-middle">
                        <span className="font-medium">{d.name}</span>
                      </td>
                      <td className="py-3 px-4 text-center align-middle">
                        {d.kontrakan || "-"}
                      </td>
                      <td className="py-3 px-4 text-center align-middle">
                      <span
                        className={
                          typeof d.sisaHari !== "number"
                            ? "text-slate-400"
                            : d.sisaHari < 0
                            ? "text-red-600 font-bold" 
                            : d.sisaHari < 3
                            ? "text-red-600 font-bold" 
                            : "text-emerald-300"
                        }
                      >
                        {d.jatuhTempo}
                      </span>
                      </td>
                      <td className="py-3 px-4 text-center align-middle">
                        <span
                          className={
                            typeof d.sisaHari !== "number"
                              ? "text-slate-400"
                              : d.sisaHari < 0
                              ? "text-red-600 font-bold" 
                              : d.sisaHari < 3
                              ? "text-red-600 font-bold" 
                              : "text-emerald-300"
                          }
                        >
                          {typeof d.sisaHari !== "number"
                            ? "-"
                            : d.sisaHari < 0
                            ? "Lewat"
                            : d.sisaHari + " hari"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center align-middle">
                        {d.noTelp ? (
                          <a
                            href={`https://wa.me/${d.noTelp.replace(/^0/, "62")}?text=Halo%20${encodeURIComponent(
                              d.name
                            )}%2C%20ini%20pengingat%20pembayaran%20kontrakan%20unit%20${d.kontrakan}%20yang%20jatuh%20tempo%20pada%20${d.jatuhTempo}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                          >
                            <Send className="w-4 h-4" />
                            Kirim WA
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-400 flex items-center gap-2 justify-center">
          <Clock className="inline w-4 h-4" />
          Data pengingat otomatis diambil dari user penyewa. Anda juga dapat mengirim pengingat manual via WhatsApp.
        </div>
      </main>
    </div>
  );
}