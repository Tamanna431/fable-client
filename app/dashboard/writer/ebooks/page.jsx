"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { BookOpen } from "@gravity-ui/icons";
import toast from "react-hot-toast";

export default function ManageEbooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/writer/my-ebooks`);
      setEbooks(Array.isArray(res.data) ? res.data : res.data?.ebooks || []);
    } catch {
      toast.error("Failed to load ebooks");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id, currentIsPublished) => {
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}/publish`);
      const updatedEbook = res.data?.ebook || { isPublished: !currentIsPublished };
      setEbooks(prev => prev.map(e => e._id === id ? { ...e, isPublished: updatedEbook.isPublished } : e));
      toast.success(`Ebook ${updatedEbook.isPublished ? "published" : "unpublished"}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteEbook = async (id) => {
    if (!confirm("Are you sure you want to delete this ebook?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}`);
      setEbooks(prev => prev.filter(e => e._id !== id));
      toast.success("Ebook deleted");
    } catch {
      toast.error("Failed to delete ebook");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Ebooks</h1>
          <p className="text-slate-400 text-sm mt-1">View, edit, publish or delete your ebooks.</p>
        </div>
        <Link
          href="/dashboard/writer/add"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/20"
        >
          + Add New Ebook
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-purple-500/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-white font-semibold text-lg">No ebooks yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-5">Start sharing your stories with the world.</p>
            <Link href="/dashboard/writer/add" className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition">
              Upload First Ebook
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/10 bg-white/3">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Ebook</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4 hidden sm:table-cell">Genre</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Price</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/5">
                {ebooks.map((eb, i) => (
                  <motion.tr
                    key={eb._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/3 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {eb.coverImage ? (
                          <img src={eb.coverImage} alt="" className="w-8 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <BookOpen width={14} height={14} className="text-purple-400" />
                          </div>
                        )}
                        <p className="text-white text-sm font-medium line-clamp-1">{eb.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-slate-300 text-sm">{eb.genre || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-purple-400 font-semibold text-sm">${eb.price}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        eb.isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        {eb.isPublished ? "● Published" : "○ Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublish(eb._id, eb.isPublished)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            eb.isPublished
                              ? "bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 border border-slate-500/20"
                              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                          }`}
                        >
                          {eb.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <Link
                          href={`/dashboard/writer/edit/${eb._id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteEbook(eb._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
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
