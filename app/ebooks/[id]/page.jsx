"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Chip, Skeleton, Divider } from "@heroui/react";
import { BookOpen, Bookmark, BookmarkFill, CreditCard, Check, Clock, Person } from "@gravity-ui/icons";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function EbookDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const res = await axios.get(`${API}/ebooks/${id}`);
        setEbook(res.data);

        if (user) {
          // Check if purchased
          const meRes = await axios.get(`${API}/users/me`);
          const me = meRes.data;
          setIsPurchased(me.purchasedEbooks?.some((e) => (e._id || e) === id));
          setIsBookmarked(me.bookmarks?.some((b) => (b._id || b) === id));
        }
      } catch {
        setEbook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEbook();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase.");
      router.push("/login");
      return;
    }
    setPurchasing(true);
    try {
      const res = await axios.post(`${API}/stripe/create-checkout-session`, { ebookId: id });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed.");
      setPurchasing(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark.");
      return;
    }
    try {
      if (isBookmarked) {
        await axios.delete(`${API}/bookmarks/${id}`);
        setIsBookmarked(false);
        toast.success("Bookmark removed.");
      } else {
        await axios.post(`${API}/bookmarks`, { ebookId: id });
        setIsBookmarked(true);
        toast.success("Bookmarked! ✨");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update bookmark.");
    }
  };

  const isOwnEbook = user && ebook && ebook.writer?._id === user._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e]">
        <Navbar />
        <div className="container-main pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Skeleton className="h-96 rounded-2xl bg-purple-900/20" />
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4 rounded bg-purple-900/20" />
              <Skeleton className="h-4 w-1/2 rounded bg-purple-900/20" />
              <Skeleton className="h-4 w-full rounded bg-purple-900/20" />
              <Skeleton className="h-4 w-full rounded bg-purple-900/20" />
              <Skeleton className="h-4 w-5/6 rounded bg-purple-900/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <BookOpen width={60} height={60} className="mx-auto mb-4 text-purple-400 opacity-40" />
          <h2 className="text-2xl font-bold text-white mb-2">Ebook not found</h2>
          <p className="text-slate-400 mb-6">This ebook might have been removed.</p>
          <Link href="/browse">
            <Button className="glow-btn text-white">Browse Ebooks</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e]">
      <Navbar />

      <div className="container-main pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Left: Cover */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/40 group">
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1e]/60 via-transparent to-transparent" />
            </div>

            {/* Purchase / Action Card */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-heading gradient-text">
                  ${ebook.price}
                </span>
                <Chip
                  size="sm"
                  className={`${ebook.isPublished ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"} border`}
                >
                  {ebook.isPublished ? "Available" : "Unavailable"}
                </Chip>
              </div>

              {isPurchased ? (
                <Button
                  className="w-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold"
                  isDisabled
                  startContent={<Check width={18} height={18} />}
                >
                  Already Purchased
                </Button>
              ) : isOwnEbook ? (
                <Button className="w-full bg-slate-700/50 text-slate-400 font-semibold" isDisabled>
                  Your Ebook
                </Button>
              ) : (
                <Button
                  className="glow-btn w-full text-white font-bold py-6"
                  isLoading={purchasing}
                  onPress={handlePurchase}
                  startContent={!purchasing && <CreditCard width={18} height={18} />}
                  isDisabled={!ebook.isPublished}
                >
                  {purchasing ? "Redirecting..." : "Buy Now via Stripe"}
                </Button>
              )}

              <Button
                variant="bordered"
                className={`w-full font-semibold ${isBookmarked ? "text-yellow-400 border-yellow-400/40" : "text-slate-300 border-slate-600"} hover:border-purple-500/40`}
                onPress={handleBookmark}
                startContent={isBookmarked ? <BookmarkFill width={16} height={16} /> : <Bookmark width={16} height={16} />}
              >
                {isBookmarked ? "Bookmarked" : "Add Bookmark"}
              </Button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/browse" className="hover:text-purple-400 transition-colors">Browse</Link>
              <span>/</span>
              <span className="text-slate-300 truncate max-w-[200px]">{ebook.title}</span>
            </div>

            {/* Genre badge */}
            <div>
              <Chip className="bg-purple-500/20 text-purple-300 border border-purple-500/30" size="sm">
                {ebook.genre}
              </Chip>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black font-heading text-white leading-tight">
              {ebook.title}
            </h1>

            {/* Writer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-gradient flex items-center justify-center text-white font-bold">
                {ebook.writerName?.[0] || "W"}
              </div>
              <div>
                <p className="text-slate-400 text-xs">Written by</p>
                <p className="text-white font-semibold">{ebook.writerName}</p>
              </div>
            </div>

            <Divider className="bg-purple-500/10" />

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">About this Ebook</h2>
              <p className="text-slate-300 leading-relaxed">{ebook.description}</p>
            </div>

            {/* Full content (only if purchased) */}
            {isPurchased && (
              <div className="glass-card p-6 border border-green-500/20">
                <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Check width={18} height={18} />
                  Full Content (Purchased)
                </h2>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto pr-2">
                  {ebook.fullContent}
                </div>
              </div>
            )}

            {/* Preview teaser if not purchased */}
            {!isPurchased && (
              <div className="glass-card p-5 border border-purple-500/20 relative overflow-hidden">
                <div className="text-slate-400 leading-relaxed text-sm line-clamp-4">
                  {ebook.fullContent?.substring(0, 300)}...
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1e1245] to-transparent flex items-end justify-center pb-3">
                  <span className="text-xs text-purple-400 font-semibold">Purchase to read full content</span>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Genre", value: ebook.genre, icon: BookOpen },
                { label: "Price", value: `$${ebook.price}`, icon: CreditCard },
                { label: "Published", value: new Date(ebook.createdAt).toLocaleDateString(), icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="glass-card p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Icon width={12} height={12} />
                    {label}
                  </div>
                  <div className="text-white font-semibold text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
