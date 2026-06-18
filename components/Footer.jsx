"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { BookOpen, LogoGithub } from "@gravity-ui/icons";
import { ArrowRight } from "@gravity-ui/icons";

const footerLinks = {
  Platform: [
    { label: "Browse Ebooks", href: "/browse" },
    { label: "Featured Authors", href: "/browse?sort=top" },
    { label: "New Releases", href: "/browse?sort=newest" },
    { label: "All Genres", href: "/browse" },
  ],
  Writers: [
    { label: "Start Writing", href: "/register" },
    { label: "Writer Dashboard", href: "/dashboard/writer" },
    { label: "Publishing Guide", href: "#" },
    { label: "Earnings", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { Icon: LogoGithub, href: "#", label: "GitHub" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a061a] border-t border-purple-500/10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="orb orb-purple w-80 h-80 -bottom-20 right-1/4 opacity-10" />

      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-purple-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="text-white" width={20} height={20} />
              </div>
              <span
                className="text-2xl font-black font-heading"
                style={{
                  background: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Fable
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Fable is the premier platform connecting passionate readers with talented writers.
              Discover, read, and share original ebooks that inspire.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mb-8">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold text-white mb-3">
                📬 Newsletter
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  size="sm"
                  classNames={{
                    base: "flex-1",
                    inputWrapper:
                      "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500",
                    input: "text-white placeholder:text-slate-500",
                  }}
                />
                <Button
                  size="sm"
                  isIconOnly
                  className="glow-btn text-white shrink-0"
                  aria-label="Subscribe"
                >
                  <ArrowRight width={16} height={16} />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Get new releases and author spotlights weekly.
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 text-sm hover:text-purple-300 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center">
            © {currentYear} <span className="text-purple-400 font-medium">Fable</span>. All rights reserved.
            Built with ❤️ for book lovers.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
