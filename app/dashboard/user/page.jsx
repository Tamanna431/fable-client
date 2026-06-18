"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, BookOpen, Bookmark, Person, ArrowRight } from "@gravity-ui/icons";
import axios from "axios";

const statCards = [
  { label: "Purchased Books", icon: "📚", key: "purchased", color: "from-violet-600 to-purple-500" },
  { label: "Bookmarked", icon: "🔖", key: "bookmarks", color: "from-indigo-600 to-blue-500" },
  { label: "Total Spent", icon: "💰", key: "spent", color: "from-emerald-600 to-teal-500", prefix: "$" },
  { label: "Reading Streak", icon: "🔥", key: "streak", color: "from-orange-600 to-amber-500" },
];

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const [pRes, bRes] = await Promise.all([
          axios.get(`${API}/transactions/my`),
          axios.get(`${API}/bookmarks/my`),
        ]);
        setPurchases(pRes.data?.transactions || []);
        setBookmarks(bRes.data?.bookmarks || []);
      } catch {
        // silently fail — user might have no data yet
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSpent = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  const stats = [
    { label: "Purchased Books", icon: "📚", value: purchases.length, color: "from-violet-600 to-purple-500" },
    { label: "Bookmarked", icon: "🔖", value: bookmarks.length, color: "from-indigo-600 to-blue-500" },
    { label: "Total Spent", icon: "💰", value: `$${totalSpent.toFixed(2)}`, color: "from-emerald-600 to-teal-500" },
    { label: "Reading Streak", icon: "🔥", value: "7 days", color: "from-orange-600 to-amber-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.fullName?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Discover new stories and continue your reading journey.</p>
        </div>
        <Link
          href="/browse"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition text-sm font-medium"
        >
          Browse Ebooks <ArrowRight width={16} height={16} />
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-purple-500/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{loading ? "—" : stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Purchases + Bookmarks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-purple-500/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Recent Purchases</h2>
            <Link href="/dashboard/user/purchases" className="text-purple-400 hover:text-purple-300 text-sm transition">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">📖</p>
              <p className="text-slate-400 text-sm">No purchases yet</p>
              <Link href="/browse" className="text-purple-400 text-sm hover:underline mt-1 inline-block">
                Browse ebooks →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition">
                  <div className="w-8 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <BookOpen width={14} height={14} className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.ebook?.title || "Ebook"}</p>
                    <p className="text-slate-500 text-xs">{p.ebook?.writer?.fullName || "Unknown author"}</p>
                  </div>
                  <span className="text-purple-400 text-sm font-semibold">${p.amount}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Bookmarked Ebooks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-purple-500/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Bookmarked Ebooks</h2>
            <Link href="/dashboard/user/bookmarks" className="text-purple-400 hover:text-purple-300 text-sm transition">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🔖</p>
              <p className="text-slate-400 text-sm">No bookmarks yet</p>
              <Link href="/browse" className="text-purple-400 text-sm hover:underline mt-1 inline-block">
                Save some ebooks →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.slice(0, 4).map((b, i) => (
                <Link
                  key={i}
                  href={`/ebooks/${b.ebook?._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition group"
                >
                  {b.ebook?.coverImage ? (
                    <img src={b.ebook.coverImage} alt="" className="w-8 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <BookOpen width={14} height={14} className="text-indigo-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition">{b.ebook?.title || "Ebook"}</p>
                    <p className="text-slate-500 text-xs">{b.ebook?.genre || "Fiction"}</p>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">${b.ebook?.price}</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
