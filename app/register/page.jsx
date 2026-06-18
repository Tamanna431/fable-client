"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import toast from "react-hot-toast";

const inputClass =
  "w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-purple-500 transition text-base";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resData = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      const name = resData?.user?.fullName || formData.fullName;
      toast.success(`Welcome, ${name.split(" ")[0]}! Account created 🎉`);
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl bottom-0 right-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-slate-400 text-sm">Join the Fable community today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <input
                name="fullName"
                type="text"
                placeholder="Tamanna Akter"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeSlash width={18} height={18} /> : <Eye width={18} height={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-300">I want to join as:</p>
              <div className="grid grid-cols-2 gap-3">
                {["user", "writer"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      formData.role === role
                        ? "border-purple-500 bg-purple-500/15 text-white"
                        : "border-slate-700 bg-white/3 text-slate-400 hover:border-purple-500/40"
                    }`}
                  >
                    <div className="text-xl mb-1">{role === "user" ? "📖" : "✍️"}</div>
                    <div className="font-semibold text-sm">{role === "user" ? "Reader" : "Writer"}</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {role === "user" ? "Browse & purchase ebooks" : "Publish & sell ebooks"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold py-6 text-base mt-1 shadow-lg shadow-purple-500/30 hover:opacity-90"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-5 flex items-center gap-3">
            <span className="flex-1 border-t border-purple-500/20" />
            <span className="text-xs text-slate-400 uppercase">Or continue with</span>
            <span className="flex-1 border-t border-purple-500/20" />
          </div>

          {/* Google Button */}
          <div className="mt-3">
            <GoogleLoginButton role={formData.role} redirectTo="/" />
          </div>

          <p className="text-center text-slate-400 text-sm mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
