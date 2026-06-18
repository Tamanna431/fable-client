"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import Link from "next/link";
import { ArrowRight, BookOpen, Star, Person, Persons, BookmarkFill, PlanetEarth } from "@gravity-ui/icons";

const slides = [
  {
    id: 1,
    tagline: "Discover & Read",
    title: "Original Ebooks",
    subtitle: "From Talented Writers",
    description:
      "Explore thousands of handcrafted stories, novels, and guides written by passionate authors from around the world.",
    cta: "Browse Ebooks",
    ctaHref: "/browse",
    accentColor: "#7c3aed",
    stats: [
      { label: "Ebooks", value: "5,000+", icon: "book", gradient: "from-violet-600 to-purple-500" },
      { label: "Writers", value: "1,200+", icon: "persons", gradient: "from-fuchsia-600 to-pink-500" },
      { label: "Readers", value: "50K+", icon: "planet", gradient: "from-indigo-600 to-blue-500" },
    ],
  },
  {
    id: 2,
    tagline: "Become an Author",
    title: "Share Your Story",
    subtitle: "With the World",
    description:
      "Join our growing community of writers. Publish your ebook, reach global readers, and earn from your passion.",
    cta: "Start Writing",
    ctaHref: "/register",
    accentColor: "#a855f7",
    stats: [
      { label: "Avg. Earnings", value: "$2,400", icon: "bookmark", gradient: "from-emerald-600 to-teal-500" },
      { label: "Genres", value: "12+", icon: "book", gradient: "from-violet-600 to-purple-500" },
      { label: "Countries", value: "80+", icon: "planet", gradient: "from-orange-500 to-amber-400" },
    ],
  },
  {
    id: 3,
    tagline: "All Genres",
    title: "Fiction to Fantasy",
    subtitle: "One Platform",
    description:
      "From heart-pounding thrillers to magical fantasy realms — find every genre curated just for you.",
    cta: "Explore Genres",
    ctaHref: "/browse",
    accentColor: "#6366f1",
    stats: [
      { label: "Genres", value: "12+", icon: "book", gradient: "from-violet-600 to-purple-500" },
      { label: "New Daily", value: "50+", icon: "bookmark", gradient: "from-sky-600 to-cyan-500" },
      { label: "Free Previews", value: "Always", icon: "planet", gradient: "from-green-600 to-emerald-500" },
    ],
  },
];

// Floating book decorations
const floatingBooks = [
  { top: "15%", left: "8%", size: 60, delay: 0, rotate: -15 },
  { top: "70%", left: "5%", size: 45, delay: 0.5, rotate: 10 },
  { top: "20%", right: "8%", size: 55, delay: 0.3, rotate: 12 },
  { top: "65%", right: "6%", size: 50, delay: 0.8, rotate: -8 },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
      {/* ─── Background orbs ─── */}
      <div className="orb orb-purple w-96 h-96 top-10 left-1/4 animate-float" />
      <div className="orb orb-indigo w-80 h-80 bottom-20 right-1/4" style={{ animationDelay: "1s" }} />
      <div className="orb orb-pink w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "2s" }} />

      {/* ─── Grid pattern overlay ─── */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ─── Floating book decorations ─── */}
      {floatingBooks.map((book, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center justify-center rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm"
          style={{
            top: book.top,
            left: book.left,
            right: book.right,
            width: book.size,
            height: book.size * 1.3,
            rotate: book.rotate,
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: book.delay }}
        >
          <BookOpen className="text-purple-400/60" width={book.size * 0.45} height={book.size * 0.45} />
        </motion.div>
      ))}

      {/* ─── Main content ─── */}
      <div className="container-main w-full relative z-10 pt-36 pb-20 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center text-center w-full"
            >
              {/* Slide indicator badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6">
                <Star width={14} height={14} />
                {slide.tagline}
              </div>

              {/* Main heading */}
              <h1 className="text-5xl md:text-7xl font-black font-heading leading-tight mb-2">
                <span className="gradient-text">{slide.title}</span>
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-300 mb-6">
                {slide.subtitle}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                {slide.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link href={slide.ctaHref}>
                  <Button
                    size="lg"
                    className="glow-btn text-white font-bold px-8 py-6 text-lg rounded-xl"
                    endContent={<ArrowRight width={20} height={20} />}
                  >
                    {slide.cta}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="bordered"
                    className="text-purple-300 border-purple-500/40 hover:bg-purple-500/10 px-8 py-6 text-lg rounded-xl transition-all"
                  >
                    Join as Writer
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 w-full max-w-xl mx-auto">
                {slide.stats.map((stat, i) => {
                  const icons = {
                    book: <BookOpen width={18} height={18} />,
                    persons: <Persons width={18} height={18} />,
                    planet: <PlanetEarth width={18} height={18} />,
                    bookmark: <BookmarkFill width={18} height={18} />,
                  };
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-purple-600/20 blur-lg group-hover:bg-purple-500/30 transition-all duration-300" />
                      <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1e1245]/90 to-[#0f0a1e]/90 backdrop-blur-sm p-5 text-center group-hover:border-purple-400/50 transition-all duration-300">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-3 text-white shadow-lg`}>
                          {icons[stat.icon] || <Star width={18} height={18} />}
                        </div>
                        <div className="text-2xl md:text-3xl font-black font-heading gradient-text mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">{stat.label}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Carousel Dots ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setIsAutoPlaying(false); }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2 bg-purple-500"
                : "w-2 h-2 bg-slate-600 hover:bg-purple-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ─── Bottom fade ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0a1e] to-transparent" />
    </section>
  );
}
