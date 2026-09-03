"use client";
import React, { useEffect, useState } from "react";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { siteSettingsRoute } from "@/routes/saas/settings/settings.route";
import { Sparkles, Building2, Users, Rocket, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState({
    title: "About Us",
    subtitle: "Empowering hospitality with next-generation cloud technology.",
    story:
      "VEDANTA TECH was established with a singular focus: to modernize hospitality operations across the globe. We empower hoteliers with an all-in-one operating system that replaces disconnected legacy software with a unified, real-time platform.\n\nFrom boutique homestays to multi-property luxury resort chains, our intelligent workflows manage everything from reservations and housekeeping to automated billing and high-speed POS settlement.",
    mission:
      "To provide world-class, intuitive, and highly scalable software solutions that maximize hotel profitability and elevate guest satisfaction.",
    vision:
      "To become the global gold standard for cloud hospitality operating systems.",
    stats: [
      { label: "Active Hotels", value: "1,200+" },
      { label: "Bookings Processed", value: "1.5M+" },
      { label: "Customer Satisfaction", value: "99.4%" },
      { label: "Global Regions", value: "45+" },
    ],
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await siteSettingsRoute.getPublicSettings({ scope: "saas" });
        if (res?.data?.aboutUs) {
          setAboutData((prev) => ({
            ...prev,
            ...res.data.aboutUs,
          }));
        }
      } catch (err) {
        console.warn("Using fallback about us content:", err.message);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <PublicNavbar />

      <main className="pt-36 pb-24 px-6 max-w-6xl mx-auto w-full flex-1">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" /> Who We Are
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
            {aboutData.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {aboutData.subtitle}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {aboutData.stats?.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 text-center shadow-lg shadow-slate-200/40 dark:shadow-none hover:scale-105 transition-transform"
            >
              <div className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Our Story
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
              {aboutData.story}
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Our Mission
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {aboutData.mission}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {aboutData.vision}
              </p>
            </motion.div>
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
        >
          <h3 className="text-3xl font-extrabold mb-4">
            Ready to upgrade your hotel operations?
          </h3>
          <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-base">
            Start your free 14-day trial today and experience the new generation of hospitality management.
          </p>
          <Link href="/register">
            <Button className="rounded-full bg-white text-indigo-600 hover:bg-slate-100 px-8 py-6 font-extrabold text-lg shadow-xl">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </main>

      <PublicFooter />
    </div>
  );
}
