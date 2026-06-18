"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, BookOpen, ShoppingCart, Eye } from "@gravity-ui/icons";
import axios from "axios";

export default function WriterDashboardPage() {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const [ebRes, saleRes] = await Promise.all([
          axios.get(`${API}/ebooks/writer/my-ebooks`),
          axios.get(`${API}/transactions/writer-sales`),
        ]);
        setEbooks(Array.isArray(ebRes.data) ? ebRes.data : ebRes.data?.ebooks || []);
        setSales(Array.isArray(saleRes.data) ? saleRes.data : saleRes.data?.transactions || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
  const published = ebooks.filter(e => e.isPublished).length;

  const stats = [
    { label: "Total Ebooks", icon: "📚", value: ebooks.length, color: "from-violet-600 to-purple-500", href: "/dashboard/writer/ebooks" },
    { label: "Published", icon: "✅", value: published, color: "from-emerald-600 to-teal-500", href: "/dashboard/writer/ebooks" },
    { label: "Total Sales", icon: "🛒", value: sales.length, color: "from-indigo-600 to-blue-500", href: "/dashboard/writer/sales" },
    { label: "Revenue", icon: "💰", value: `$${totalRevenue.toFixed(2)}`, color: "from-orange-600 to-amber-500", href: "/dashboard/writer/sales" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user?.fullName?.split(" ")[0]} ✍️</h1>
          <p className="text-slate-400 mt-1">Manage your ebooks and track your sales.</p>
        </div>
        <Link
          href="/dashboard/writer/add"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/20"
        >
          + Add New Ebook
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={stat.href} className="block bg-white/5 border border-purple-500/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{loading ? "—" : stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Ebooks + Recent Sales */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Ebooks */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-purple-500/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">My Ebooks</h2>
            <Link href="/dashboard/writer/ebooks" className="text-purple-400 hover:text-purple-300 text-sm transition">Manage →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">📝</p>
              <p className="text-slate-400 text-sm mb-3">No ebooks yet</p>
              <Link href="/dashboard/writer/add" className="text-purple-400 text-sm hover:underline">Upload your first ebook →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {ebooks.slice(0, 4).map((eb, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition">
                  {eb.coverImage ? (
                    <img src={eb.coverImage} alt="" className="w-8 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <BookOpen width={14} height={14} className="text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{eb.title}</p>
                    <p className="text-slate-500 text-xs">${eb.price} · {eb.genre}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eb.isPublished ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                    {eb.isPublished ? "Live" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Sales */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 border border-purple-500/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Recent Sales</h2>
            <Link href="/dashboard/writer/sales" className="text-purple-400 hover:text-purple-300 text-sm transition">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : sales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">📈</p>
              <p className="text-slate-400 text-sm">No sales yet. Keep publishing!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 4).map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 text-sm">
                    {s.buyer?.fullName?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{s.ebook?.title || "Ebook"}</p>
                    <p className="text-slate-500 text-xs">{s.buyer?.fullName || "Reader"}</p>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">${s.amount}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
