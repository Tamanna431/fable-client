"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button, Card, CardBody, CardFooter, Chip, Avatar, Skeleton } from "@heroui/react";
import { ArrowRight, BookOpen, Star } from "@gravity-ui/icons";
import axios from "axios";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const genres = [
  { name: "Fiction", emoji: "📖", color: "from-violet-600 to-purple-500" },
  { name: "Mystery", emoji: "🔍", color: "from-slate-600 to-slate-500" },
  { name: "Romance", emoji: "💕", color: "from-pink-600 to-rose-500" },
  { name: "Sci-Fi", emoji: "🚀", color: "from-blue-600 to-cyan-500" },
  { name: "Fantasy", emoji: "🧙", color: "from-indigo-600 to-violet-500" },
  { name: "Horror", emoji: "👻", color: "from-red-700 to-red-600" },
  { name: "Biography", emoji: "👤", color: "from-amber-600 to-orange-500" },
  { name: "Self-Help", emoji: "✨", color: "from-green-600 to-emerald-500" },
  { name: "History", emoji: "🏛️", color: "from-yellow-600 to-amber-500" },
  { name: "Thriller", emoji: "⚡", color: "from-orange-600 to-red-500" },
  { name: "Adventure", emoji: "🗺️", color: "from-teal-600 to-green-500" },
  { name: "Poetry", emoji: "🌸", color: "from-purple-500 to-pink-400" },
];

function EbookCard({ ebook, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/ebooks/${ebook._id}`}>
        <Card className="ebook-card glass-card border-0 overflow-hidden group cursor-pointer h-full">
          <div className="relative overflow-hidden h-52">
            <img
              src={ebook.coverImage}
              alt={ebook.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1e] via-transparent to-transparent" />
            <Chip
              size="sm"
              className="absolute top-2 right-2 bg-purple-500/80 text-white text-xs backdrop-blur-sm"
            >
              {ebook.genre}
            </Chip>
          </div>
          <CardBody className="p-4">
            <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
              {ebook.title}
            </h3>
            <p className="text-slate-500 text-xs mb-2">by {ebook.writerName}</p>
            <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{ebook.description}</p>
          </CardBody>
          <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
            <span className="text-purple-400 font-bold text-sm">${ebook.price}</span>
            <Button
              size="sm"
              className="glow-btn text-white text-xs px-3 py-1 min-w-0 h-7"
            >
              View
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

function EbookSkeleton() {
  return (
    <Card className="glass-card border-0">
      <Skeleton className="h-52 rounded-t-xl bg-purple-900/20" />
      <CardBody className="p-4 gap-2">
        <Skeleton className="h-4 w-3/4 rounded bg-purple-900/20" />
        <Skeleton className="h-3 w-1/2 rounded bg-purple-900/20" />
        <Skeleton className="h-3 w-full rounded bg-purple-900/20" />
      </CardBody>
    </Card>
  );
}

export default function HomePage() {
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ebooksRes, writersRes] = await Promise.all([
          axios.get(`${API}/ebooks/featured`).catch(() => ({ data: [] })),
          axios.get(`${API}/ebooks/top-writers`).catch(() => ({ data: [] })),
        ]);
        setFeaturedEbooks(ebooksRes.data);
        setTopWriters(writersRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredRef = useRef(null);
  const writersRef = useRef(null);
  const genresRef = useRef(null);
  const featuredInView = useInView(featuredRef, { once: true, margin: "-100px" });
  const writersInView = useInView(writersRef, { once: true, margin: "-100px" });
  const genresInView = useInView(genresRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroBanner />
      <StatsSection />

      {/* ─── Featured Ebooks ─── */}
      <section ref={featuredRef} className="py-20 relative">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
                Handpicked
              </span>
              <h2 className="section-heading text-4xl md:text-5xl mt-2">
                Featured Ebooks
              </h2>
            </div>
            <Link href="/browse">
              <Button
                variant="light"
                className="text-purple-400 hover:text-purple-300 hidden sm:flex"
                endContent={<ArrowRight width={16} height={16} />}
              >
                View All
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading
              ? Array(6).fill(0).map((_, i) => <EbookSkeleton key={i} />)
              : featuredEbooks.length > 0
              ? featuredEbooks.map((ebook, i) => (
                  <EbookCard key={ebook._id} ebook={ebook} index={i} />
                ))
              : (
                <div className="col-span-6 text-center py-20 text-slate-500">
                  <BookOpen width={40} height={40} className="mx-auto mb-3 opacity-40" />
                  <p>No ebooks yet. Be the first to publish!</p>
                </div>
              )
            }
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/browse">
              <Button className="glow-btn text-white" endContent={<ArrowRight width={16} height={16} />}>
                View All Ebooks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Top Writers ─── */}
      <section ref={writersRef} className="py-20 relative bg-[#1a1035]/50">
        <div className="orb orb-indigo w-72 h-72 -top-20 left-1/4 opacity-10" />
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={writersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
              Community Stars
            </span>
            <h2 className="section-heading text-4xl md:text-5xl mt-2 mb-3">
              Top Writers
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Meet the most celebrated authors on Fable — trusted by thousands of readers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {loading
              ? Array(3).fill(0).map((_, i) => (
                  <div key={i} className="glass-card p-6 text-center">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4 bg-purple-900/20" />
                    <Skeleton className="h-4 w-3/4 mx-auto rounded bg-purple-900/20 mb-2" />
                    <Skeleton className="h-3 w-1/2 mx-auto rounded bg-purple-900/20" />
                  </div>
                ))
              : topWriters.length > 0
              ? topWriters.map((writer, i) => (
                  <motion.div
                    key={writer._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={writersInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="glass-card p-6 text-center group hover:border-purple-500/40 transition-all"
                  >
                    <div className="relative inline-block mb-4">
                      <Avatar
                        src={writer.writerInfo?.avatar || ""}
                        name={writer.writerName?.[0] || "W"}
                        className="w-20 h-20 text-2xl bg-purple-gradient ring-2 ring-purple-500/30 group-hover:ring-purple-400/60 transition-all"
                      />
                      {i === 0 && (
                        <span className="absolute -top-1 -right-1 text-lg">👑</span>
                      )}
                    </div>
                    <h3 className="font-bold text-white mb-1">{writer.writerName}</h3>
                    <p className="text-slate-500 text-xs mb-3">{writer.ebookCount} ebooks</p>
                    <div className="flex items-center justify-center gap-1 text-purple-400 text-sm font-semibold">
                      <Star width={14} height={14} />
                      {writer.totalSales} sales
                    </div>
                  </motion.div>
                ))
              : (
                <div className="col-span-3 text-center py-12 text-slate-500">
                  No top writers yet — start publishing to be featured!
                </div>
              )
            }
          </div>
        </div>
      </section>

      {/* ─── Genre Grid ─── */}
      <section ref={genresRef} className="py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={genresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
              Something for Everyone
            </span>
            <h2 className="section-heading text-4xl md:text-5xl mt-2 mb-3">
              Ebook Genres
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Explore a world of stories across every genre imaginable.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {genres.map((genre, i) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={genresInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/browse?genre=${genre.name}`}>
                  <div className="glass-card p-4 text-center group hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300 cursor-pointer">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${genre.color} flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {genre.emoji}
                    </div>
                    <span className="text-slate-300 text-xs font-semibold group-hover:text-white transition-colors">
                      {genre.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="container-main">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-600" />
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
              }}
            />
            <div className="relative z-10 px-8 py-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black font-heading text-white mb-4">
                Ready to Start Your Story?
              </h2>
              <p className="text-purple-200 text-lg max-w-xl mx-auto mb-8">
                Join thousands of writers and readers on Fable. Publish your first ebook today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 font-bold px-8 hover:bg-purple-50 transition-colors"
                    endContent={<ArrowRight width={18} height={18} />}
                  >
                    Create Account
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="bordered"
                    className="border-white/40 text-white hover:bg-white/10 px-8"
                  >
                    Explore Ebooks
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
