"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Avatar, Chip } from "@heroui/react";
import {
  BookOpen, Person, ChartLine, ShoppingCart, Bookmark,
  TextPlus, List, BarsAscendingAlignCenter, ArrowLeft, Bars, Xmark
} from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const userLinks = [
  { href: "/dashboard/user", label: "Overview", icon: ChartLine, exact: true },
  { href: "/dashboard/user/purchases", label: "Purchase History", icon: ShoppingCart },
  { href: "/dashboard/user/ebooks", label: "My Ebooks", icon: BookOpen },
  { href: "/dashboard/user/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/dashboard/user/profile", label: "Profile", icon: Person },
];

const writerLinks = [
  { href: "/dashboard/writer", label: "Overview", icon: ChartLine, exact: true },
  { href: "/dashboard/writer/ebooks", label: "Manage Ebooks", icon: List },
  { href: "/dashboard/writer/add", label: "Add Ebook", icon: TextPlus },
  { href: "/dashboard/writer/sales", label: "Sales History", icon: BarsAscendingAlignCenter },
  { href: "/dashboard/writer/bookmarks", label: "Bookmarks", icon: Bookmark },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Analytics", icon: ChartLine, exact: true },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Person },
  { href: "/dashboard/admin/ebooks", label: "All Ebooks", icon: BookOpen },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: ShoppingCart },
];

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to access dashboard.");
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const links = user.role === "admin" ? adminLinks : user.role === "writer" ? writerLinks : userLinks;

  const isActive = (link) => {
    if (link.exact) return pathname === link.href;
    return pathname.startsWith(link.href);
  };

  const getRoleColor = () => {
    if (user.role === "admin") return "danger";
    if (user.role === "writer") return "secondary";
    return "primary";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-purple-500/10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-purple-gradient flex items-center justify-center">
            <BookOpen className="text-white" width={16} height={16} />
          </div>
          <span className="text-lg font-black font-heading gradient-text">Fable</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-purple-500/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5">
          <Avatar
            src={user.avatar || ""}
            name={user.fullName?.[0]}
            size="sm"
            className="bg-purple-gradient ring-2 ring-purple-500/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user.fullName}</p>
            <Chip size="sm" color={getRoleColor()} variant="flat" className="h-4 text-[10px] capitalize">
              {user.role}
            </Chip>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link ${active ? "active" : ""}`}
            >
              <Icon width={18} height={18} />
              <span className="text-sm">{link.label}</span>
              {active && (
                <motion.div
                  layoutId="sidebarActive"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-500/10">
        <Link href="/" className="sidebar-link mb-1">
          <ArrowLeft width={18} height={18} />
          <span className="text-sm">Back to Site</span>
        </Link>
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="sidebar-link w-full text-left text-red-400 hover:bg-red-500/10"
        >
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0f0a1e] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0d0820] border-r border-purple-500/10 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 bg-[#0d0820] border-r border-purple-500/10 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-purple-500/10 bg-[#0d0820]/80 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0">
          <Button
            isIconOnly
            variant="light"
            className="lg:hidden text-slate-400"
            onPress={() => setSidebarOpen(true)}
          >
            <Bars width={20} height={20} />
          </Button>
          <h1 className="text-white font-semibold capitalize">
            {pathname.split("/").pop() || "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <Avatar
              src={user.avatar || ""}
              name={user.fullName?.[0]}
              size="sm"
              className="bg-purple-gradient ring-2 ring-purple-500/30"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
