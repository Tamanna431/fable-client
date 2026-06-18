"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { BookOpen, Eye, EyeSlash } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import toast from "react-hot-toast";

const inputClass =
  "w-full bg-white/5 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-purple-500 transition text-sm";

export default function LoginModal({ isOpen, onOpenChange }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e, onClose) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.fullName?.split(" ")[0] || "there"}! 👋`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-[#1a1035] border border-purple-500/20 shadow-2xl shadow-purple-900/20",
        closeButton: "hover:bg-purple-500/20 text-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center pt-8">
              <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center mb-4">
                <BookOpen className="text-white" width={24} height={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In to Fable</h2>
              <p className="text-sm text-slate-400 font-normal">Welcome back! Please login to your account.</p>
            </ModalHeader>

            <ModalBody className="pb-8">
              <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">

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
                      placeholder="Your password"
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
                      {showPassword ? <EyeSlash width={16} height={16} /> : <Eye width={16} height={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold py-6 shadow-lg shadow-purple-500/30"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="flex items-center gap-3">
                  <span className="flex-1 border-t border-purple-500/20" />
                  <span className="text-xs text-slate-400 uppercase">or</span>
                  <span className="flex-1 border-t border-purple-500/20" />
                </div>

                <GoogleLoginButton role="user" onSuccess={() => onClose()} />
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
