"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { BookOpen, Bookmark, ArrowRight } from "@gravity-ui/icons";
import toast from "react-hot-toast";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/my`);
        setBookmarks(res.data?.bookmarks || []);
      } catch {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const removeBookmark = async (ebookId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${ebookId}`);
      setBookmarks(prev => prev.filter(b => b.ebook?._id !== ebookId));
      toast.success("Bookmark removed");
    } catch {
      toast.error("Failed to remove bookmark");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Bookmarked Ebooks</h1>
        <p className="text-slate-400 text-sm mt-1">Ebooks you saved for later reading.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-purple-500/10 rounded-2xl">
          <p className="text-6xl mb-4">🔖</p>
          <p className="text-white font-semibold text-xl">No bookmarks yet</p>
          <p className="text-slate-400 text-sm mt-2 mb-6">Save ebooks you want to read later.</p>
          <Link
            href="/browse"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition"
          >
            Browse Ebooks <ArrowRight width={16} height={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {bookmarks.map((b, i) => {
            const ebook = b.ebook;
            if (!ebook) return null;
            return (
              <motion.div
                key={b._id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                {/* Remove bookmark button */}
                <button
                  onClick={() => removeBookmark(ebook._id)}
                  className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500/80"
                  title="Remove bookmark"
                >
                  <span className="text-white text-xs">✕</span>
                </button>

                <Link href={`/ebooks/${ebook._id}`} className="block">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-purple-500/10 group-hover:border-purple-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      {ebook.coverImage ? (
                        <img
                          src={ebook.coverImage}
                          alt={ebook.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-600/30 to-blue-500/10 flex flex-col items-center justify-center gap-2">
                          <BookOpen width={32} height={32} className="text-indigo-400" />
                          <p className="text-indigo-300 text-xs text-center px-2 font-medium line-clamp-2">{ebook.title}</p>
                        </div>
                      )}
                      {/* Bookmark icon */}
                      <div className="absolute top-2 right-2">
                        <Bookmark width={16} height={16} className="text-purple-400 fill-purple-400" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-purple-300 transition">{ebook.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-slate-400 text-xs line-clamp-1">{ebook.writer?.fullName || "Unknown"}</p>
                        <p className="text-emerald-400 text-xs font-bold">${ebook.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
