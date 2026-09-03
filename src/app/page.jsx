"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hotel,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  BarChart3,
  Play,
  CheckCircle2,
  Sparkles,
  Users,
  CalendarCheck,
  Check,
  Star,
  Quote,
  Building2,
  Receipt,
  BedDouble,
  Layers,
  ChevronDown,
  TrendingUp,
  CreditCard,
  Clock,
  Smartphone,
  Server,
  Lock,
  Headphones,
  CheckCircle,
  HelpCircle,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plans } from "@/routes/saas/plans/plans.route";
import { TestimonialRoutes } from "@/routes/saas/testimonial/testimonial.route";

const DEFAULT_PLANS = [
  {
    _id: "default-starter",
    name: "Starter Plan",
    description: "Essential management tools tailored for boutique hotels and independent guest houses.",
    halfYearlyPrice: "5999",
    yearlyPrice: "9999",
    trialDays: 14,
    maxDailyBookings: 25,
    maxStaff: 10,
    isPopular: false,
    features: [
      "Front Desk & Reservation System",
      "Instant Room Check-in / Check-out",
      "Up to 25 Daily Bookings",
      "Up to 10 Staff Logins & Roles",
      "Real-time Inventory & Room Status",
      "Standard Revenue & Occupancy Reports",
      "Email & Ticket Support",
    ],
  },
  {
    _id: "default-pro",
    name: "Professional Plan",
    description: "Our most popular package for scaling hotels needing high automation & multi-room capacity.",
    halfYearlyPrice: "11999",
    yearlyPrice: "19999",
    trialDays: 14,
    maxDailyBookings: 100,
    maxStaff: 35,
    isPopular: true,
    features: [
      "Everything in Starter Plan",
      "Up to 100 Daily Bookings",
      "Up to 35 Staff Accounts & RBAC",
      "Multi-Currency & Online Payment Gateway",
      "Automated Invoicing & GST Reports",
      "Housekeeping & Room Maintenance Logs",
      "Priority 24/7 Phone & WhatsApp Support",
    ],
  },
  {
    _id: "default-enterprise",
    name: "Enterprise Plan",
    description: "Full-scale multi-property management designed for luxury resort chains and hotel groups.",
    halfYearlyPrice: "24999",
    yearlyPrice: "39999",
    trialDays: 30,
    maxDailyBookings: 500,
    maxStaff: 150,
    isPopular: false,
    features: [
      "Everything in Professional Plan",
      "Multi-Property Centralized Dashboard",
      "Up to 500 Daily Bookings",
      "Up to 150 Staff Accounts",
      "Custom Role-Based Permissions (RBAC)",
      "Custom Domain & White-label Branding",
      "Dedicated Account Manager & SLA Guarantee",
      "Custom API Access & Webhooks",
    ],
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    author: "Rajesh Malhotra",
    role: "General Manager",
    hotel: "Malhotra Heritage Palace, Jaipur",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    content: "VEDANTA TECH eliminated 90% of our manual front-desk errors. Room check-ins take under 30 seconds now and occupancy rates jumped by 28% in 3 months.",
    rating: 5,
  },
  {
    id: 2,
    author: "Neha Singhania",
    role: "Managing Director",
    hotel: "The Coastal Palms Resort, Goa",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    content: "The multi-currency payment system and instant GST invoice generation have made accounting completely painless. Outstanding software for luxury stays.",
    rating: 5,
  },
  {
    id: 3,
    author: "Amitabh Banerjee",
    role: "Operations Head",
    hotel: "Summit Grand Suites, Kolkata",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content: "The live housekeeping sync is game-changing. Housekeeping staff update room cleaning status on their phones, and front desk knows immediately.",
    rating: 5,
  },
  {
    id: 4,
    author: "Priya Sundaram",
    role: "Owner & Host",
    hotel: "Nilgiri Mist Boutique Stays, Ooty",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    content: "Clean, lightning-fast UI and zero learning curve. Our team was fully onboarded on day one without any training delays. Highly recommended!",
    rating: 5,
  },
];

const AVATAR_FALLBACKS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
];

const FAQS = [
  {
    question: "How quickly can we get our hotel onboarded on VEDANTA TECH?",
    answer:
      "You can be fully set up in under 10 minutes. Our guided setup wizard helps you configure room categories, pricing tiers, and staff permissions immediately.",
  },
  {
    question: "Can our staff access the management panel on mobile devices?",
    answer:
      "Yes! VEDANTA TECH is 100% responsive and works seamlessly on desktops, tablets, and smartphones. Housekeeping and front desk staff can update statuses on the go.",
  },
  {
    question: "Does the system support GST compliant invoices and split bills?",
    answer:
      "Absolutely. Generate professional GST compliant tax invoices, food & beverage folios, room service charges, and split bills with single-click PDF export.",
  },
  {
    question: "Can we manage multiple hotel properties under a single account?",
    answer:
      "Yes, our Enterprise Plan includes a centralized Multi-Property Dashboard where group owners can switch between hotel branches and analyze unified revenue reports.",
  },
  {
    question: "Is there any credit card required for the 14-day free trial?",
    answer:
      "No credit card is required. You can start your free trial immediately with all core features enabled and upgrade whenever you are ready.",
  },
];

export default function LandingPage() {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [testimonialsList, setTestimonialsList] = useState(DEFAULT_TESTIMONIALS);
  const [billingCycle, setBillingCycle] = useState("yearly"); // 'halfYearly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("frontdesk");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await Plans.getAllActivePlans();
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setPlans(res.data);
        }
      } catch (err) {
        console.warn("Using default plans:", err);
      }

      try {
        let testRes = await TestimonialRoutes.getAllActiveTestimonials().catch(() => null);
        if (!testRes || !testRes.data || testRes.data.length === 0) {
          testRes = await TestimonialRoutes.getAllTestimonials().catch(() => null);
        }
        if (isMounted && testRes?.data && Array.isArray(testRes.data) && testRes.data.length > 0) {
          const approved = testRes.data.filter((t) => t.status === "Approved" || !t.status);
          if (approved.length > 0) {
            setTestimonialsList(approved);
          }
        }
      } catch (err) {
        console.warn("Using default testimonials:", err);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Background Lighting Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-5%] w-[600px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                VEDANTA TECH
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                  SaaS
                </span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80">
            <a
              href="#features"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Platform Tour
            </a>
            <a
              href="#pricing"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Reviews
            </a>
            <a
              href="#faqs"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1"
            >
              Log In
            </Link>
            <Link href="/register">
              <Button className="h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-all">
                Start Free Trial
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 md:pt-32 pb-12 px-4 sm:px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Release Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-3.5 py-1 rounded-full mb-5 shadow-inner"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Next-Gen Hospitality OS 2.4 • Smart Automation
            </span>
            <span className="text-slate-500 text-xs">|</span>
            <span className="text-[11px] font-bold text-indigo-400">What's New &rarr;</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] mb-4"
          >
            The Operating System for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              High-Performance Hotels.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-400 mb-7 leading-relaxed font-normal"
          >
            Automate front desk reservations, guest billing, live room housekeeping, and multi-property revenues on a single ultra-fast cloud platform.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex flex-wrap items-center justify-center gap-3.5 mb-5"
          >
            <Link href="/register">
              <Button className="h-12 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 group transition-all">
                Start 14-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#interactive-demo">
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-bold text-sm sm:text-base flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Play className="w-2.5 h-2.5 fill-current" />
                </div>
                Book a Demo
              </Button>
            </a>
          </motion.div>

          {/* Micro Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              No credit card required
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              2-minute cloud setup
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Cancel anytime
            </span>
          </div>

          {/* High-Fidelity App Mockup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="mt-10 relative max-w-5xl mx-auto"
            id="interactive-demo"
          >
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl md:rounded-3xl blur-xl opacity-75" />

            {/* Simulated Desktop Window */}
            <div className="relative rounded-2xl md:rounded-3xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Window Titlebar */}
              <div className="h-10 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-[11px] text-slate-400 font-mono">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>app.vedantatech.com/dashboard/live-matrix</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </div>
              </div>

              {/* Main Visual: Hotel Image Preview + Interactive Live Status Matrix */}
              <div className="relative aspect-[16/8.5] sm:aspect-[16/7.5] w-full overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000"
                  alt="Hotel Resort Management"
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Overlay Dashboard Widgets */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                  {/* Top Overlay Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md p-2.5 sm:p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Live Occupancy</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-black text-white">94.2%</span>
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md p-2.5 sm:p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Today's Revenue</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-black text-white">₹1,84,200</span>
                        <span className="text-[10px] font-bold text-indigo-400">42 Bookings</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md p-2.5 sm:p-3 rounded-xl hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Active Check-ins</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-black text-white">28 Guests</span>
                        <span className="text-[10px] font-bold text-amber-400">4 Pending</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md p-2.5 sm:p-3 rounded-xl hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Housekeeping</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-black text-white">46 / 50</span>
                        <span className="text-[10px] font-bold text-emerald-400">Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Room Matrix Bar */}
                  <div className="bg-slate-950/90 border border-slate-800/90 backdrop-blur-md rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        Live Room Inventory Status
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        ⚡ Real-time Cloud PMS
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { num: "101", type: "Deluxe King", status: "Occupied", color: "border-indigo-500/50 bg-indigo-500/20 text-indigo-200" },
                        { num: "102", type: "Deluxe Twin", status: "Available", color: "border-emerald-500/50 bg-emerald-500/20 text-emerald-200" },
                        { num: "201", type: "Executive Suite", status: "Occupied", color: "border-indigo-500/50 bg-indigo-500/20 text-indigo-200" },
                        { num: "202", type: "Ocean Villa", status: "Cleaning", color: "border-amber-500/50 bg-amber-500/20 text-amber-200" },
                        { num: "301", type: "Presidential", status: "Occupied", color: "border-indigo-500/50 bg-indigo-500/20 text-indigo-200" },
                        { num: "302", type: "Luxury King", status: "Available", color: "border-emerald-500/50 bg-emerald-500/20 text-emerald-200" },
                      ].map((room, idx) => (
                        <div key={idx} className={`p-2 rounded-lg border ${room.color} text-left transition-transform hover:scale-105`}>
                          <p className="text-[11px] font-black font-mono">#{room.num}</p>
                          <p className="text-[9px] truncate font-semibold opacity-90">{room.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Live Channel Badge */}
            <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Channel Sync</p>
                <p className="text-xs font-bold text-white">Booking.com & Agoda synced</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof & Trust Metrics Strip */}
      <section className="py-8 border-y border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">2,500+</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Properties Worldwide</p>
            </div>
            <div className="p-2">
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-tight">99.98%</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Platform Uptime SLA</p>
            </div>
            <div className="p-2">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">3.5M+</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Guest Check-ins Handled</p>
            </div>
            <div className="p-2">
              <p className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">4.9 / 5.0</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Matrix */}
      <section className="py-16 md:py-20 px-4 sm:px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              Everything Built-In
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2.5">
              Engineered for Frictionless Hospitality.
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Replace 6 disconnected software tools with one single lightning-fast system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-6 rounded-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-400 transition-colors">
                  Front Desk & Live Reservation Grid
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Drag-and-drop room assignments, instant QR check-in, express check-out, and auto-generated guest registration cards.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center text-xs font-semibold text-indigo-400">
                <span>Explore Reservation Hub</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-6 rounded-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors">
                  Automated GST & Folio Invoicing
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  100% tax compliant billing with automated GST breakdown, split folios, restaurant & service add-ons, and instant PDF receipts.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center text-xs font-semibold text-emerald-400">
                <span>Explore Tax & Folios</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-6 rounded-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <BedDouble className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors">
                  Mobile Housekeeping & Maintenance
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Real-time room status updates from mobile devices. Housekeeping staff tag rooms as cleaned, inspected, or under repair in one tap.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center text-xs font-semibold text-amber-400">
                <span>Explore Housekeeping</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-6 rounded-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-purple-400 transition-colors">
                  Granular RBAC Security & Audit Logs
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Assign custom roles for Front Desk, Housekeeping, Accountants, and General Managers with complete timestamped audit trails.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center text-xs font-semibold text-purple-400">
                <span>Explore RBAC Security</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-6 rounded-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                  Multi-Currency & Online Payments
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Accept international credit cards, UPI, net banking, and digital wallets. Auto-converts currencies for international guests.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center text-xs font-semibold text-blue-400">
                <span>Explore Payment Gateways</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-6 rounded-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-rose-400 transition-colors">
                  Multi-Property Centralized Control
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Manage multiple hotel branches, resorts, and vacation rentals from a single master dashboard with consolidated P&L statements.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center text-xs font-semibold text-rose-400">
                <span>Explore Multi-Property</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Marquee (Compact, High-Credibility with Avatar Images) */}
      <section id="testimonials" className="py-14 border-y border-slate-800/80 bg-slate-950/70 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
            <Quote className="w-3.5 h-3.5" />
            Verified Hotelier Reviews
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Trusted by World-Class Hospitality Teams
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            See how properties grow occupancy and streamline operations with VEDANTA TECH.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-slate-950 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-slate-950 to-transparent z-20" />

          <div className="animate-marquee-left flex gap-4 py-2">
            {Array.from({ length: Math.max(2, Math.ceil(8 / testimonialsList.length)) })
              .flatMap(() => testimonialsList)
              .map((item, idx) => {
                const avatarSrc =
                  item.avatar ||
                  item.image ||
                  AVATAR_FALLBACKS[idx % AVATAR_FALLBACKS.length];

                return (
                  <div
                    key={`${item._id || item.id || idx}-${idx}`}
                    className="w-[320px] sm:w-[380px] shrink-0 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: Number(item.rating) || 5 }).map((_, sIdx) => (
                            <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Verified Stay Host
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                        &ldquo;{item.content}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                      <img
                        src={avatarSrc}
                        alt={item.author}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0 shadow-md"
                      />
                      <div className="overflow-hidden text-left">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.author}</h4>
                        <p className="text-[11px] text-indigo-400 font-medium truncate">{item.role || "Hotelier"}</p>
                        {(item.hotel?.name || item.hotel) && (
                          <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 shrink-0" />
                            {typeof item.hotel === "object" ? item.hotel?.name : item.hotel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Pricing & Subscription Section */}
      <section id="pricing" className="py-16 md:py-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
              <CreditCard className="w-3.5 h-3.5" />
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2.5">
              Predictable Plans. Zero Hidden Fees.
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Select the right plan for your hotel. Scale smoothly without unexpected surcharges.
            </p>

            {/* Toggle Billing */}
            <div className="mt-6 inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setBillingCycle("halfYearly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${billingCycle === "halfYearly"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Half-Yearly (6 Mo)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${billingCycle === "yearly"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Yearly (12 Mo)
                <span className="ml-1.5 text-[9px] uppercase font-black bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, idx) => {
              const isPopular = plan.isPopular;
              const price =
                billingCycle === "yearly"
                  ? Number(plan.yearlyPrice || 0)
                  : Number(plan.halfYearlyPrice || 0);

              const durationLabel = billingCycle === "yearly" ? "/ year" : "/ 6 months";
              const monthlyEquivalent =
                billingCycle === "yearly" ? Math.round(price / 12) : Math.round(price / 6);

              return (
                <div
                  key={plan._id || plan.id || idx}
                  className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all ${isPopular
                      ? "bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2"
                      : "bg-slate-900/60 border border-slate-800 hover:border-slate-700"
                    }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] uppercase tracking-wider font-black px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                      {plan.trialDays > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {plan.trialDays}-Day Free Trial
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {plan.description || "Comprehensive solution crafted for optimal hotel performance."}
                    </p>

                    <div className="mb-4 pb-4 border-b border-slate-800">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">{durationLabel}</span>
                      </div>
                      <p className="text-[11px] mt-1 font-medium text-indigo-400">
                        Approx ₹{monthlyEquivalent.toLocaleString("en-IN")}/mo billed{" "}
                        {billingCycle === "yearly" ? "annually" : "semi-annually"}
                      </p>
                    </div>

                    {/* Limits Badges */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Staff Accounts</p>
                          <p className="text-xs font-bold text-white">{plan.maxStaff || "Unlimited"}</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                        <CalendarCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Daily Bookings</p>
                          <p className="text-xs font-bold text-white">{plan.maxDailyBookings || "Unlimited"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Included Features:
                      </p>
                      {plan.features?.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-300 leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link href={`/register?plan=${encodeURIComponent(plan.name || "")}`}>
                      <Button
                        className={`w-full h-11 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${isPopular
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                            : "bg-slate-800 hover:bg-slate-700 text-white"
                          }`}
                      >
                        {plan.trialDays > 0 ? `Start ${plan.trialDays}-Day Free Trial` : "Get Started Now"}
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security & Guarantee Strip */}
          <div className="mt-10 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-2.5 px-6 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                No Credit Card Required
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                256-Bit SSL Cloud Security
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Instant Room Activation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faqs" className="py-16 md:py-20 px-4 sm:px-6 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden transition-colors hover:border-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-14 md:py-18 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/80 via-indigo-600 to-violet-700 p-8 sm:p-12 text-center overflow-hidden shadow-2xl border border-indigo-400/30">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                Ready to Upgrade Your Hotel Operations?
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm md:text-base max-w-xl mx-auto mb-7">
                Join forward-thinking hoteliers automating check-ins, reservations, and room revenues with VEDANTA TECH. Setup takes under 2 minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/register">
                  <Button className="h-12 px-8 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-extrabold text-sm sm:text-base shadow-xl hover:scale-[1.02] transition-transform">
                    Start Your 14-Day Free Trial
                  </Button>
                </Link>
                <Link href="/contact-us">
                  <Button
                    variant="outline"
                    className="h-12 px-6 rounded-xl border-white/30 text-white bg-white/10 hover:bg-white/20 font-bold text-sm sm:text-base"
                  >
                    Contact Enterprise Sales
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative background grid pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-slate-800/80 bg-slate-950 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Hotel className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">VEDANTA TECH</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              The next-generation cloud operating system for boutique stays, luxury resorts, and hotel chains.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> All Systems Operational
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Product & Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Front Desk System</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Housekeeping Logs</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">GST & Tax Invoicing</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Subscription Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Company & Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/customer-support" className="hover:text-white transition-colors">Help Desk & Support</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Sales</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Admin Portal Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Direct Contact</h4>
            <p className="text-xs text-slate-400 mb-1">24/7 Hoteliers Support Desk</p>
            <p className="text-xs font-bold text-indigo-400 mb-1">support@vedantatech.com</p>
            <p className="text-xs text-slate-400">+91 98765 43210</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} VEDANTA TECH TECHNOLOGIES INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/customer-support" className="hover:text-slate-300 transition-colors">Support Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
