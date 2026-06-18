"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { BookOpen, Eye, EyeSlash, Envelope, Lock, Person } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const resData = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      const name = resData?.user?.fullName || formData.fullName;
      toast.success(`Account created successfully! Welcome, ${name.split(" ")[0]}! 🎉`);
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
      <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-20" />
      <div className="orb orb-indigo w-80 h-80 bottom-0 right-0 opacity-15" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="text-white" width={22} height={22} />
            </div>
            <span className="text-2xl font-black font-heading gradient-text">Fable</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400 text-sm">Join the Fable community today</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              name="fullName"
              label="Full Name"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              startContent={<Person className="text-slate-400" width={16} height={16} />}
              classNames={{
                inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500 data-[focused=true]:border-purple-500",
                input: "text-white placeholder:text-slate-500",
                label: "text-slate-400",
              }}
            />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              startContent={<Envelope className="text-slate-400" width={16} height={16} />}
              classNames={{
                inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500",
                input: "text-white placeholder:text-slate-500",
                label: "text-slate-400",
              }}
            />

            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              startContent={<Lock className="text-slate-400" width={16} height={16} />}
              endContent={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-white">
                  {showPassword ? <EyeSlash width={16} height={16} /> : <Eye width={16} height={16} />}
                </button>
              }
              classNames={{
                inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500",
                input: "text-white placeholder:text-slate-500",
                label: "text-slate-400",
              }}
            />

            <Input
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              startContent={<Lock className="text-slate-400" width={16} height={16} />}
              classNames={{
                inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500",
                input: "text-white placeholder:text-slate-500",
                label: "text-slate-400",
              }}
            />

            {/* Role Selection */}
            <div>
              <p className="text-sm text-slate-400 mb-3">I want to join as:</p>
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
                    <div className="font-semibold capitalize text-sm">{role === "user" ? "Reader" : "Writer"}</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {role === "user" ? "Browse & purchase ebooks" : "Publish & sell ebooks"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="glow-btn w-full text-white font-bold py-6 text-base mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="border-b border-purple-500/20 w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-slate-400 uppercase">Or continue with</span>
            <span className="border-b border-purple-500/20 w-1/5 lg:w-1/4"></span>
          </div>

          {/* Real Google Sign-In — passes selected role (reader/writer) */}
          <div className="mt-3">
            <GoogleLoginButton role={formData.role} redirectTo="/" />
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
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
