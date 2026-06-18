"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Avatar, Chip } from "@heroui/react";
import { Person, Envelope, At, Calendar } from "@gravity-ui/icons";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const roleConfig = {
    admin: { color: "danger", label: "Admin", icon: "👑" },
    writer: { color: "secondary", label: "Writer", icon: "✍️" },
    user: { color: "primary", label: "Reader", icon: "📖" },
  };
  const role = roleConfig[user.role] || roleConfig.user;

  const infoItems = [
    { icon: Person, label: "Full Name", value: user.fullName },
    { icon: Envelope, label: "Email", value: user.email },
    { icon: At, label: "Role", value: role.label },
    {
      icon: Calendar,
      label: "Member Since",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "Recently joined",
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Your personal account information.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-purple-500/10 rounded-2xl overflow-hidden"
      >
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-violet-600/40 via-purple-500/30 to-indigo-600/40 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.3),transparent)]" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <Avatar
              src={user.avatar || ""}
              name={user.fullName?.[0]?.toUpperCase()}
              className="w-20 h-20 text-2xl ring-4 ring-[#0f0a1e] bg-gradient-to-br from-violet-600 to-purple-500 text-white"
            />
            <div className="pb-1">
              <h2 className="text-white text-xl font-bold">{user.fullName}</h2>
              <Chip size="sm" color={role.color} variant="flat" className="mt-1 capitalize">
                {role.icon} {role.label}
              </Chip>
            </div>
          </div>

          {/* Info Fields */}
          <div className="space-y-3">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 bg-white/3 rounded-xl border border-purple-500/10"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Icon width={16} height={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                    <p className="text-white text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verified Badge */}
          {user.isVerified && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="text-emerald-400 text-lg">✓</span>
              <p className="text-emerald-400 text-sm font-medium">Email Verified</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
