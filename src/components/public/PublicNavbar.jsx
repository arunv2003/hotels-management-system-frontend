"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Hotel, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Customer Support", href: "/customer-support" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 shadow-md shadow-indigo-500/10 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src="/chacha-vatiza-logo.png"
              alt="CHACHA VATIZA HOTELS"
              className="w-full h-full object-contain"
            />
          </div>
          {/* hhh */}
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              CHACHA VATIZA
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-600 dark:text-amber-400 -mt-0.5">
              HOTELS
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors px-3 py-2"
          >
            Login
          </Link>
          <Link href="/register">
            <Button className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 sm:px-6 font-bold hover:scale-105 transition-transform shadow-md text-sm">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/login" className="text-xs font-bold text-indigo-600 px-2.5 py-1.5 rounded-lg">
            Login
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 py-2 border-b border-slate-100 dark:border-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-500/20 text-sm">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl font-bold h-11 text-sm">
                  Sign In to Portal
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

