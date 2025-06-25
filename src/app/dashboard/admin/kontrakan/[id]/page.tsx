"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function KontrakanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/kontrakan/${id}`)
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, [id]);

  if (!data) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Detail Kontrakan</h2>
      <Card className="bg-gray-800 shadow-lg border-none">
        <CardContent>
          <h3 className="text-xl font-semibold">{data.nama}</h3>
          <p>Lokasi: {data.alamat}</p>
          <p>Harga: Rp {data.harga?.toLocaleString()}</p>
          <p>
            Status:{" "}
            <span className={data.status === "tersedia" ? "text-green-400" : "text-red-400"}>
              {data.status === "disewa" ? "terisi" : data.status}
            </span>
          </p>
          <p>Fasilitas:</p>
          <ul className="list-disc ml-6">
            {data.fasilitas?.map((f: string) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {data.foto?.[0] && (
            <img src={data.foto[0]} alt={data.nama} className="mt-4 rounded max-w-xs" />
          )}
        </CardContent>
      </Card>
      <div className="mt-6">
        <Link href="/dashboard/admin/kontrakan" className="text-blue-400 hover:underline">
          &larr; Kembali ke daftar kontrakan
        </Link>
      </div>
    </div>
  );
}