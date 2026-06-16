"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hotel, ArrowRight, ShieldCheck, Zap, Globe, BarChart3, Play, } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function LandingPage() {
    return (<div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Hotel className="w-6 h-6 text-white"/>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              HotelFlow
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {["Features", "Solutions", "Pricing", "Resources"].map((item) => (<a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => {
                e.preventDefault();
                document
                    .getElementById(item.toLowerCase())
                    ?.scrollIntoView({ behavior: "smooth" });
            }} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {item}
              </a>))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 font-bold hover:scale-105 transition-transform">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"/>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              v2.0 is now live
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tighter">
            The Operating System <br />
            <span className="text-indigo-600">for Modern Hotels.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400 mb-12">
            A powerful, multi-tenant SaaS platform designed to scale your
            hospitality business from a single boutique inn to a global resort
            chain.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register">
              <Button className="h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-2xl shadow-indigo-500/40 group">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
              </Button>
            </Link>
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-slate-200 dark:border-slate-800 text-lg font-bold flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Play className="w-3 h-3 text-slate-900 dark:text-white fill-current"/>
              </div>
              Watch Demo
            </Button>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-24 relative max-w-5xl mx-auto">
            <div className="glass-card p-4 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[16/10] flex items-center justify-center group relative">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000" alt="Hotel Dashboard Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"/>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent flex items-end p-12">
                  <div className="text-left">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      HotelFlow
                    </h3>
                    <p className="text-indigo-100 max-w-md text-sm">
                      Real-time room management and advanced analytics at your
                      fingertips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating UI elements */}
            <div className="absolute -top-12 -left-12 glass-card p-6 rounded-3xl hidden lg:block shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-emerald-500"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    Growth
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">
                    +124%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]"/>
          <div className="absolute top-[40%] left-[5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"/>
        </div>
      </section>

      {/* Trust Section */}
      <section id="solutions" className="py-20 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
            Trusted by world-class hospitality groups
          </p>
          <div className="flex flex-wrap justify-center gap-16 opacity-50 grayscale contrast-125">
            {["Hyatt", "Marriott", "Hilton", "Accor", "InterContinental"].map((brand) => (<span key={brand} className="text-2xl font-black text-slate-400 tracking-tighter">
                  {brand}
                </span>))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything you need <br /> in one place.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Modular design allows you to enable exactly what your business
              needs. No bloat, just performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
                title: "RBAC Security",
                desc: "Granular permission control for staff and managers.",
                icon: ShieldCheck,
            },
            {
                title: "Real-time Sync",
                desc: "Inventory and bookings update instantly across all panels.",
                icon: Zap,
            },
            {
                title: "Multi-Currency",
                desc: "Accept payments globally with automatic conversion.",
                icon: Globe,
            },
        ].map((feature, i) => (<motion.div whileHover={{ y: -10 }} key={i} className="glass-card p-10 rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20">
                  <feature.icon className="w-8 h-8 text-white"/>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                Ready to revolutionize <br /> your hotel?
              </h2>
              <p className="text-indigo-100 text-xl max-w-2xl mx-auto mb-12">
                Join 10,000+ properties managing their business with HotelFlow.
                Free setup assistance included.
              </p>
              <Link href="/register">
                <Button className="h-16 px-12 rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 text-xl font-extrabold shadow-2xl transition-transform active:scale-95">
                  Start Your Journey
                </Button>
              </Link>
            </div>
            {/* Decorative background for CTA */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="grid grid-cols-10 gap-4 rotate-12 -translate-y-24">
                {Array.from({ length: 50 }).map((_, i) => (<div key={i} className="h-24 bg-white rounded-xl"/>))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="resources" className="py-20 px-6 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Hotel className="w-5 h-5 text-white"/>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                HotelFlow
              </span>
            </div>
            <p className="text-sm text-slate-500">
              The next generation of hospitality software. Built for scale,
              designed for simplicity.
            </p>
          </div>
          {["Product", "Company", "Support"].map((col) => (<div key={col}>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">
                {col}
              </h4>
              <ul className="space-y-4">
                {["Link 1", "Link 2", "Link 3"].map((link) => (<li key={link}>
                    <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                      {link}
                    </Link>
                  </li>))}
              </ul>
            </div>))}
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-10 border-t border-slate-50 dark:border-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2024 HotelFlow TECHNOLOGIES INC.</p>
          <div className="flex gap-10 mt-6 md:mt-0">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Security</Link>
          </div>
        </div>
      </footer>
    </div>);
}
