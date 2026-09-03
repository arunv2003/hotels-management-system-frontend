"use client";
import React, { useEffect, useState } from "react";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { siteSettingsRoute } from "@/routes/saas/settings/settings.route";
import { FileText, Clock, CheckSquare, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsAndConditionsPage() {
  const [termsData, setTermsData] = useState({
    title: "Terms and Conditions",
    content: `Welcome to VEDANTA TECH. By signing up, registering your property, or utilizing our cloud hotel management platform, you acknowledge and agree to comply with the following Terms and Conditions.

1. Account Registration & Tenant Responsibility
- You agree to provide accurate, up-to-date business and administrative information during registration.
- Account administrators are responsible for securing login credentials, employee access levels, and role permissions.
- Any unauthorized activities performed under your organizational workspace must be reported immediately to our support team.

2. Subscription Billing & Payment Terms
- Subscriptions are billed on recurring monthly or annual intervals as chosen during plan selection.
- Failure to settle invoices by the due date may result in temporary account suspension or rate limits.
- Upgrades or downgrades between tiers take effect dynamically and will be prorated on the subsequent billing cycle.

3. Acceptable Platform Usage
- The platform is intended exclusively for hospitality management operations, reservations, guest registry, housekeeping, and POS settlement.
- Users are prohibited from reverse engineering, distributing malicious scripts, or conducting unauthorized penetration testing on our servers.
- Automated API integrations must comply with standard rate limits to preserve overall cluster stability.

4. Service Availability & SLA
- We strive to deliver 99.9% platform uptime across all multi-tenant instances.
- Scheduled maintenance windows are announced at least 48 hours in advance via system notifications.
- In the event of unforeseen downtime, our engineering team deploys immediate failover procedures.

5. Termination & Suspension
- Either party may terminate the subscription agreement with 30 days written notice.
- We reserve the right to suspend or terminate accounts that engage in fraudulent actions, non-payment, or security violations.
- Upon account closure, tenant administrators have a 30-day grace period to download full data backups.

6. Governing Law & Jurisdiction
- These terms are governed by the applicable commercial laws. Any disputes arising hereunder will be settled through arbitration under the jurisdiction of our registered headquarters.`,
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await siteSettingsRoute.getPublicSettings({ scope: "saas" });
        if (res?.data?.termsAndConditions) {
          setTermsData((prev) => ({
            ...prev,
            ...res.data.termsAndConditions,
          }));
        }
      } catch (err) {
        console.warn("Using fallback terms content:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <PublicNavbar />

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto w-full flex-1">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {termsData.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>
              Last Updated:{" "}
              {new Date(termsData.lastUpdated || Date.now()).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden"
        >
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-6 text-base whitespace-pre-line font-normal">
            {termsData.content}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
              <CheckSquare className="w-5 h-5" />
              <span>Standard Multi-Tenant SaaS Agreement</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>99.9% Uptime Guarantee</span>
            </div>
          </div>
        </motion.div>
      </main>

      <PublicFooter />
    </div>
  );
}
