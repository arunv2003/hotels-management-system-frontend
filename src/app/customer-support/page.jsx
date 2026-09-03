"use client";
import React, { useEffect, useState } from "react";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { siteSettingsRoute } from "@/routes/saas/settings/settings.route";
import {
  LifeBuoy,
  PhoneCall,
  Mail,
  Clock,
  HelpCircle,
  ChevronDown,
  AlertCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CustomerSupportPage() {
  const [supportData, setSupportData] = useState({
    title: "Customer Support",
    subtitle: "24/7 Dedicated Assistance & Technical Helpdesk",
    supportEmail: "helpdesk@vedantatech.com",
    helpline: "1800-123-4567",
    emergencyPhone: "+91 98765 00000",
    responseTime: "Under 15 minutes response time for priority support",
    faqs: [
      {
        question: "How do I reset my password or access token?",
        answer:
          "You can click on 'Forgot Password' on the login screen or request your hotel admin/superadmin to reset your credentials from the Staff/Employee management panel.",
        category: "Account & Access",
      },
      {
        question: "Is my guest and payment data secure?",
        answer:
          "Yes, all transactions and data are protected with end-to-end 256-bit SSL encryption, isolated multi-tenant architecture, and strict GDPR/compliance standards.",
        category: "Security & Privacy",
      },
      {
        question: "How can I update room inventory and rates in real-time?",
        answer:
          "Navigate to Rooms & Inventory in your admin dashboard to update rates, availability, or block rooms instantly across all connected channels.",
        category: "Operations",
      },
      {
        question: "What should I do if my session expires?",
        answer:
          "Our system automatically attempts to refresh your authentication tokens in the background. If your refresh token has expired, you will simply be redirected to the landing page to securely re-authenticate.",
        category: "Authentication",
      },
    ],
  });

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await siteSettingsRoute.getPublicSettings({ scope: "saas" });
        if (res?.data?.customerSupport) {
          setSupportData((prev) => ({
            ...prev,
            ...res.data.customerSupport,
          }));
        }
      } catch (err) {
        console.warn("Using fallback customer support content:", err.message);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <PublicNavbar />

      <main className="pt-36 pb-24 px-6 max-w-6xl mx-auto w-full flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <LifeBuoy className="w-4 h-4" /> Help Center & Desk
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
            {supportData.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {supportData.subtitle}
          </p>
        </motion.div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none text-center"
          >
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
              <PhoneCall className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Toll-Free Helpline
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instant voice support for critical reservation and POS queries.
            </p>
            <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
              {supportData.helpline}
            </div>
            <div className="text-xs text-slate-400">
              Emergency: {supportData.emergencyPhone}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none text-center"
          >
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Email Desk
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Send detailed technical logs, integration tickets, or billing inquiries.
            </p>
            <a
              href={`mailto:${supportData.supportEmail}`}
              className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline block mb-2"
            >
              {supportData.supportEmail}
            </a>
            <div className="text-xs text-slate-400">
              Average response: 15 mins
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none text-center"
          >
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Live Portal Tickets
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Open and track priority support tickets directly from your dashboard.
            </p>
            <Link href="/login">
              <Button className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-5">
                Open Support Ticket
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* FAQs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500">
                Quick solutions to common operational and account questions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {supportData.faqs?.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>

      <PublicFooter />
    </div>
  );
}
