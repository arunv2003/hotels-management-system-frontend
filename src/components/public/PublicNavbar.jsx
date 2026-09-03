"use client";
import React from "react";
import Link from "next/link";
import { Hotel, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            VEDANTA TECH
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about-us"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/customer-support"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Customer Support
          </Link>
          <Link
            href="/contact-us"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors px-3 py-2"
          >
            Login
          </Link>
          <Link href="/register">
            <Button className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 font-bold hover:scale-105 transition-transform shadow-md">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
