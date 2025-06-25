"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <p>Logging out...</p>
      <button
        className="mt-6 px-4 py-2 bg-emerald-500 rounded hover:bg-emerald-600"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}