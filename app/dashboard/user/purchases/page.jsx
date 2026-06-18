"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { BookOpen } from "@gravity-ui/icons";

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/my`);
        setPurchases(res.data?.transactions || []);
      } catch {
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Purchase History</h1>
        <p className="text-slate-400 text-sm mt-1">All your ebook purchases in one place.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-purple-500/10 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-white font-semibold text-lg">No purchases yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-4">Discover amazing ebooks and start reading!</p>
            <Link
              href="/browse"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Browse Ebooks
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/10 bg-white/3">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Ebook</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Writer</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Price</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4 hidden sm:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/5">
                {purchases.map((p, i) => (
                  <motion.tr
                    key={p._id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/3 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.ebook?.coverImage ? (
                          <img src={p.ebook.coverImage} alt="" className="w-8 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <BookOpen width={14} height={14} className="text-purple-400" />
                          </div>
                        )}
                        <Link
                          href={`/ebooks/${p.ebook?._id}`}
                          className="text-white text-sm font-medium hover:text-purple-300 transition line-clamp-1"
                        >
                          {p.ebook?.title || "Untitled"}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-slate-300 text-sm">{p.ebook?.writer?.fullName || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-purple-400 font-semibold text-sm">${p.amount?.toFixed(2) || "0.00"}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-slate-400 text-sm">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                        ✓ Completed
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
