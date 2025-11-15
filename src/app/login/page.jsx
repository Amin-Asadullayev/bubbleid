"use client";
import { useState } from "react";
import {
  Ghost,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { auth, googleProvider, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { ref, set, get } from "firebase/database";
import { useRouter } from "next/navigation";

const getErrorMessage = (error) => {
  const code = error?.code;
  switch (code) {
    case "auth/email-already-in-use":
      return "Email already registered. Please login.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed. Try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        email: user.email,
        displayName: user.displayName || "",
        createdAt: Date.now(),
        bubbles: [],
        ledger: [],
      });

      router.push("/main");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userSnap = await get(ref(db, `users/${user.uid}`));
      if (!userSnap.exists()) {
        await set(ref(db, `users/${user.uid}`), {
          email: user.email,
          displayName: user.displayName || "",
          createdAt: Date.now(),
          bubbles: [],
          ledger: [],
        });
      }

      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-8 shadow-2xl">

        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Ghost className="w-10 h-10 text-[#386FA4]" />
            <h1 className="text-3xl font-semibold">BubbleID</h1>
          </div>
          <p className="text-zinc-400 text-sm max-w-xs">
            Secure payments without exposing your card.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={register} className="space-y-5" noValidate>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-4 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-[#386FA4] focus:ring-2 focus:ring-[#386FA4]/30 outline-none text-sm transition-all"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-zinc-400">Password</label>
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl px-4">
              <input
                id="password"
                type={visible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 h-12 bg-transparent outline-none text-sm"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                disabled={loading}
              >
                {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#386FA4] hover:bg-[#2f5a85] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 font-semibold text-sm"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>
              <span>Sign up</span>
              <ArrowRight className="w-4 h-4" />
            </>}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="px-3 text-xs text-zinc-600 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Google */}
        <button
          onClick={googleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 transition-all flex items-center justify-center space-x-3 text-sm font-medium"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5 text-white" /> : "Continue with Google"}
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500 space-y-2">
          <p>Already have an account? <a href="/login" className="text-[#386FA4] hover:underline font-medium">Login</a></p>
        </div>
      </div>
    </div>
  );
}
