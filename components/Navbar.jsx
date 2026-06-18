"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDisclosure, Button } from "@heroui/react";
import { BookOpen } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { label: "Browse Books", href: "/browse" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-4 left-4 right-4 lg:left-8 lg:right-8 z-50 transition-all duration-300 rounded-2xl border ${
          scrolled 
            ? "border-purple-500/30 bg-[#0f0a1e]/90 backdrop-blur-xl shadow-lg shadow-purple-900/20" 
            : "border-white/10 bg-[#0f0a1e]/50 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg group-hover:scale-105 transition-transform">
              <BookOpen className="text-white" width={18} height={18} />
            </div>
            <div className="leading-none">
              <h1 className="text-xl font-bold font-heading bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
                Fable
              </h1>
            </div>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* Desktop Menu */}
            <div className="hidden items-center gap-4 md:flex">
              {/* Nav Links in Pill */}
              <ul className="flex items-center gap-1 rounded-full border border-purple-500/20 bg-white/5 px-1.5 py-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                          isActive 
                            ? "bg-purple-500/20 text-white" 
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Vertical Divider */}
              <div className="h-5 w-px bg-purple-500/20" />

              {/* Auth Links */}
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <span className="text-sm font-medium text-white">
                      Hi, {user.fullName}!
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium text-red-400 transition hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onOpen}
                      className="text-sm font-medium text-purple-400 transition hover:text-purple-300"
                    >
                      Sign In
                    </button>

                    <Button
                      as={Link}
                      href="/register"
                      radius="full"
                      className="h-9 bg-gradient-to-r from-violet-600 to-purple-500 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-90"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg p-1.5 text-white transition hover:bg-purple-500/20 md:hidden"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="border-t border-purple-500/20 bg-[#0f0a1e]/95 backdrop-blur-xl md:hidden rounded-b-2xl">
            <div className="space-y-3 px-4 py-5">
              {/* Nav Links */}
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-purple-500/20 text-white border border-purple-500/30"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Divider */}
              <div className="border-t border-purple-500/20 pt-3 mt-2">
                <div className="flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-white font-medium bg-purple-500/10 rounded-xl border border-purple-500/20 text-sm">
                        Hi, {user.fullName}!
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="text-left rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onOpen();
                          setIsMenuOpen(false);
                        }}
                        className="text-left rounded-xl px-4 py-2.5 text-sm font-medium text-purple-400 transition hover:bg-purple-500/10"
                      >
                        Sign In
                      </button>

                      <Button
                        as={Link}
                        href="/register"
                        className="bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold shadow-lg text-sm"
                        radius="lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal Component */}
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
