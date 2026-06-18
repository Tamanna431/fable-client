"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Person, ShoppingCart, Star } from "@gravity-ui/icons";

const stats = [
  {
    icon: BookOpen,
    value: 5000,
    suffix: "+",
    label: "Ebooks Published",
    description: "Original stories and guides",
    color: "from-violet-600 to-purple-500",
    glow: "rgba(124, 58, 237, 0.4)",
  },
  {
    icon: Person,
    value: 1200,
    suffix: "+",
    label: "Active Writers",
    description: "Talented authors worldwide",
    color: "from-purple-500 to-pink-500",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  {
    icon: ShoppingCart,
    value: 50000,
    suffix: "+",
    label: "Ebooks Sold",
    description: "Happy readers globally",
    color: "from-indigo-500 to-blue-500",
    glow: "rgba(99, 102, 241, 0.4)",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Avg. Rating",
    description: "Reader satisfaction score",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.4)",
  },
];

function AnimatedCounter({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const isDecimal = target % 1 !== 0;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1e] via-[#1a1035] to-[#0f0a1e]" />
      <div className="orb orb-purple w-72 h-72 top-0 right-1/4 opacity-15" />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
            Platform at a Glance
          </span>
          <h2 className="section-heading text-4xl md:text-5xl mt-3 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Join a thriving community of readers and writers shaping the future of digital literature.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="stat-card p-6 text-center group cursor-default"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 8px 24px ${stat.glow}` }}
                >
                  <Icon className="text-white" width={26} height={26} />
                </div>

                {/* Counter */}
                <div className="text-4xl font-black font-heading gradient-text mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-slate-500 text-xs">{stat.description}</div>

                {/* Bottom glow line on hover */}
                <div
                  className={`h-0.5 w-0 group-hover:w-full mx-auto mt-4 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
