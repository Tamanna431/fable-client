"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, CloudUpload, Spinner } from "@gravity-ui/icons";

const GENRES = [
  "Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", 
  "Horror", "Biography", "Self-Help", "History", "Thriller", 
  "Adventure", "Poetry"
];

export default function EditEbookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullContent: "",
    price: "",
    genre: "Fiction",
    coverImage: ""
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEbook();
    }
  }, [id]);

  const fetchEbook = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}`);
      if (res.data) {
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          fullContent: res.data.fullContent || "",
          price: res.data.price !== undefined ? String(res.data.price) : "",
          genre: res.data.genre || "Fiction",
          coverImage: res.data.coverImage || ""
        });
      }
    } catch (err) {
      toast.error("Failed to load ebook details");
      router.push("/dashboard/writer/ebooks");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey === "your_imgbb_api_key" ? "7c3e536beee2e04332467d5e49df29c2" : apiKey}`,
        uploadData
      );

      if (res.data?.data?.url) {
        setFormData(prev => ({ ...prev, coverImage: res.data.data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to get image URL");
      }
    } catch (err) {
      toast.error("Failed to upload image. Please enter URL manually.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coverImage) {
      return toast.error("Please upload or enter a cover image URL");
    }

    setSubmitting(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}`, {
        ...formData,
        price: Number(formData.price)
      });
      toast.success("Ebook updated successfully!");
      router.push("/dashboard/writer/ebooks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update ebook");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Spinner className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm mt-4">Loading ebook details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/writer/ebooks" className="p-2 rounded-xl bg-white/5 border border-purple-500/10 hover:border-purple-500/30 text-slate-300 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Ebook</h1>
          <p className="text-slate-400 text-sm mt-0.5">Update details of your ebook manuscript.</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white/5 border border-purple-500/10 rounded-2xl p-6 lg:p-8 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cover Image Upload */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 text-sm font-medium">Cover Image</label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {formData.coverImage ? (
                <div className="relative group w-32 h-44 rounded-xl overflow-hidden border border-purple-500/20 bg-white/5 flex-shrink-0">
                  <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 text-sm font-semibold transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="w-32 h-44 rounded-xl border border-dashed border-purple-500/20 hover:border-purple-500/40 bg-white/3 flex flex-col items-center justify-center cursor-pointer transition flex-shrink-0">
                  {uploading ? (
                    <Spinner className="w-6 h-6 text-purple-400 animate-spin" />
                  ) : (
                    <>
                      <CloudUpload className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-slate-400 text-xs text-center px-2">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              )}

              <div className="flex-1 w-full space-y-2">
                <p className="text-xs text-slate-400">
                  Upload cover art directly, or provide a public URL below. High-resolution portrait aspect ratio (approx 3:4) is recommended.
                </p>
                <input
                  type="url"
                  placeholder="Or enter image URL manually..."
                  value={formData.coverImage}
                  onChange={e => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/10 focus:border-purple-500/30 text-white text-sm outline-none transition placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 text-sm font-medium">Ebook Title</label>
            <input
              type="text"
              required
              placeholder="e.g. The Chronicles of Fable"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/10 focus:border-purple-500/30 text-white text-sm outline-none transition placeholder-slate-500"
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Genre</label>
            <select
              value={formData.genre}
              onChange={e => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1a1333] border border-purple-500/10 focus:border-purple-500/30 text-white text-sm outline-none transition"
            >
              {GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/10 focus:border-purple-500/30 text-white text-sm outline-none transition placeholder-slate-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 text-sm font-medium">Short Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a compelling synopsis to hook your readers..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/10 focus:border-purple-500/30 text-white text-sm outline-none transition placeholder-slate-500 resize-none"
            />
          </div>

          {/* Full Content */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 text-sm font-medium">Ebook Full Content (Manuscript)</label>
            <textarea
              required
              rows={12}
              placeholder="Write or paste your full book contents here..."
              value={formData.fullContent}
              onChange={e => setFormData(prev => ({ ...prev, fullContent: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/10 focus:border-purple-500/30 text-white text-sm outline-none transition placeholder-slate-500 resize-y"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-purple-500/5">
          <Link
            href="/dashboard/writer/ebooks"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-purple-500/10 hover:border-purple-500/20 text-slate-300 text-sm font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Spinner className="w-4 h-4 text-white animate-spin" /> Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
