"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cpu, Lock, Mail, User, Phone } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

export default function RegisterPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const router = useRouter();
  

const handleGoogleSignUp = async () => {
  setLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Tunggu sebentar untuk memastikan koneksi Firestore
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists in Firestore with error handling
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document with error handling
        try {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            role: "tamu",
            createdAt: new Date().toISOString(),
            photoURL: user.photoURL
          });
          console.log("User document created successfully");
        } catch (writeError) {
          console.error("Error creating user document:", writeError);
          throw writeError;
        }
      }

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        role: "tamu"
      }));

      alert("Berhasil masuk dengan Google!");
      router.push("/dashboard/tamu");
    } catch (firestoreError) {
      console.error("Firestore operation failed:", firestoreError);
      throw firestoreError;
    }
  } catch (error: any) {
    console.error("Authentication failed:", error);
    alert(error.message || "Gagal masuk dengan Google");
  } finally {
    setLoading(false);
  }
};
  
  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "tamu",
      createdAt: new Date().toISOString()
    });

    // Kirim ke MongoDB
    await fetch("/api/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        name,
        email,
        role: "tamu",
        photoURL: "",
      }),
    });

    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      email: user.email,
      role: "tamu"
    }));

    alert("Registrasi berhasil!");
    router.push("/dashboard/tamu");
  } catch (error: any) {
    alert(error.message || "Gagal registrasi");
  } finally {
    setLoading(false);
  }
};

  // Phone Registration
  const handlePhoneRegister = async () => {
    if (!phone) {
      alert("Masukkan nomor WhatsApp");
      return;
    }

    setLoading(true);
    try {
      // Format nomor ke format internasional
      const formattedNumber = phone.startsWith("+62") 
        ? phone 
        : `+62${phone.startsWith("0") ? phone.substring(1) : phone}`;

      // Setup reCAPTCHA
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedNumber,
        window.recaptchaVerifier
      );
      
      window.confirmationResult = confirmationResult;
      setShowOTP(true);
      alert("Kode OTP telah dikirim!");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Gagal kirim OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp) {
      alert("Masukkan kode OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        phone,
        role: "tamu",
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        phone,
        role: "tamu"
      }));

      alert("Verifikasi OTP berhasil!");
      router.push("/dashboard/tamu");
    } catch (error: any) {
      console.error("Error:", error);
      alert("Kode OTP tidak valid");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 px-4">
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      
      <div className="w-full max-w-md bg-slate-800/30 backdrop-blur-md p-8 rounded-xl shadow-lg border border-slate-700/50 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <Cpu className="h-8 w-8 text-emerald-400" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              Kontrakan AA
            </h1>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center text-emerald-200">Daftar Akun Baru</h2>

        <Button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-medium py-3 rounded-lg shadow mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
            />
          </svg>
          {loading ? "Memproses..." : "Daftar dengan Google"}
        </Button>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-slate-400 text-xs">atau daftar manual</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-emerald-200">Nama</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-emerald-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                placeholder="Nama Lengkap"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-emerald-200">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-emerald-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-emerald-200">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-emerald-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-emerald-500/25"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-300">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}