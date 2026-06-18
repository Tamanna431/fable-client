"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { BookOpen, ArrowRight } from "@gravity-ui/icons";

export default function PurchasedEbooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/my`);
        const books = (res.data?.transactions || []).map(t => t.ebook).filter(Boolean);
        setEbooks(books);
      } catch {
        setEbooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">My Purchased Ebooks</h1>
        <p className="text-slate-400 text-sm mt-1">All ebooks you own — click to start reading.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-purple-500/10 rounded-2xl">
          <p className="text-6xl mb-4">📚</p>
          <p className="text-white font-semibold text-xl">Your shelf is empty</p>
          <p className="text-slate-400 text-sm mt-2 mb-6">Purchase ebooks to start building your library.</p>
          <Link
            href="/browse"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition"
          >
            Browse Ebooks <ArrowRight width={16} height={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {ebooks.map((ebook, i) => (
            <motion.div
              key={ebook._id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/ebooks/${ebook._id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-purple-500/10 group-hover:border-purple-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                  {/* Cover Image */}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {ebook.coverImage ? (
                      <img
                        src={ebook.coverImage}
                        alt={ebook.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-purple-500/10 flex flex-col items-center justify-center gap-2">
                        <BookOpen width={32} height={32} className="text-purple-400" />
                        <p className="text-purple-300 text-xs text-center px-2 font-medium line-clamp-2">{ebook.title}</p>
                      </div>
                    )}
                    {/* Owned Badge */}
                    <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      ✓ Owned
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-purple-300 transition">{ebook.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{ebook.writer?.fullName || "Unknown"}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
