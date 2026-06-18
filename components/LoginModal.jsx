"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input } from "@heroui/react";
import { Envelope, Lock, BookOpen } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import toast from "react-hot-toast";

export default function LoginModal({ isOpen, onOpenChange }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e, onClose) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock login for now since backend might not be connected perfectly yet
      // You can replace this with actual login logic when backend is ready
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.fullName || "User"}!`);
      onClose(); // Close modal on success
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
              <div className="mx-auto w-12 h-12 rounded-xl bg-purple-gradient flex items-center justify-center mb-4">
                <BookOpen className="text-white" width={24} height={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In to Fable</h2>
              <p className="text-sm text-slate-400 font-normal">Welcome back, please login to your account.</p>
            </ModalHeader>
            <ModalBody className="pb-8">
              <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="admin@fable.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  startContent={<Envelope className="text-slate-400" width={16} height={16} />}
                  classNames={{
                    inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500",
                    input: "text-white",
                    label: "text-slate-400",
                  }}
                />

                <Input
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Admin@123"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  startContent={<Lock className="text-slate-400" width={16} height={16} />}
                  classNames={{
                    inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500",
                    input: "text-white",
                    label: "text-slate-400",
                  }}
                />

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold py-6 shadow-lg shadow-purple-500/30"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="flex items-center gap-3 my-1">
                  <span className="flex-1 border-t border-purple-500/20" />
                  <span className="text-xs text-slate-400 uppercase">or</span>
                  <span className="flex-1 border-t border-purple-500/20" />
                </div>

                <GoogleLoginButton
                  role="user"
                  onSuccess={() => onClose()}
                />
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
