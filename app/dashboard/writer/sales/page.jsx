"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { BookOpen } from "@gravity-ui/icons";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/writer-sales`);
      setSales(Array.isArray(res.data) ? res.data : res.data?.transactions || []);
    } catch {
      toast.error("Failed to load sales history");
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales History</h1>
          <p className="text-slate-400 text-sm mt-1">Track your earnings and book purchases by readers.</p>
        </div>
        <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-purple-500/10 flex items-center gap-3">
          <span className="text-slate-400 text-sm">Total Earnings:</span>
          <span className="text-emerald-400 font-bold text-lg">${totalEarnings.toFixed(2)}</span>
        </div>
      </motion.div>

      {/* Main Table Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-purple-500/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-5xl mb-4">📈</p>
            <p className="text-white font-semibold text-lg">No sales yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-5">Promote your ebooks to start earning.</p>
            <Link href="/dashboard/writer/ebooks" className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition">
              Manage Ebooks
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/10 bg-white/3">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Ebook</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Buyer</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Purchase Date</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Amount</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/5">
                {sales.map((s, i) => (
                  <motion.tr
                    key={s._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/3 transition"
                  >
                    {/* Ebook Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {s.ebook?.coverImage ? (
                          <img src={s.ebook.coverImage} alt="" className="w-8 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <BookOpen width={14} height={14} className="text-purple-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium line-clamp-1">{s.ebook?.title || "Deleted Ebook"}</p>
                          <p className="text-slate-500 text-xs">ID: {s._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Buyer Info */}
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-slate-200 font-medium">{s.buyer?.fullName || s.user?.fullName || "Anonymous"}</p>
                        <p className="text-slate-500 text-xs">{s.buyer?.email || s.user?.email || "—"}</p>
                      </div>
                    </td>

                    {/* Purchase Date */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-slate-300 text-sm">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        }) : "—"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4">
                      <span className="text-emerald-400 font-bold text-sm">${(s.amount || 0).toFixed(2)}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ● Completed
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
