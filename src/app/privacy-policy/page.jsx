"use client";
import React, { useEffect, useState } from "react";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { siteSettingsRoute } from "@/routes/saas/settings/settings.route";
import { Shield, Clock, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const [policyData, setPolicyData] = useState({
    title: "Privacy Policy",
    content: `VEDANTA TECH ("we", "our", or "us") is dedicated to protecting your privacy and ensuring the security of your organizational, guest, and transaction data. This Privacy Policy details how we collect, process, store, and safeguard information across our multi-tenant SaaS platform and hotel management services.

1. Information We Collect
We collect information required to operate our hotel management services efficiently, including:
- Account & Profile Data: Business registration details, hotel identity, tax numbers (GST/PAN), and administrative contact details.
- Tenant & Property Data: Room inventory, pricing, reservation history, and POS transaction records.
- Guest Profile Data: Guest contact info, reservation dates, and identification details entered solely by authorized property staff.
- System Telemetry: IP addresses, login timestamps, and audit log activities for security monitoring.

2. How We Use Information
We utilize data strictly to:
- Deliver high-availability hotel management workflows and billing automation.
- Facilitate real-time guest reservations, check-ins, check-outs, and POS settlement.
- Enforce strict security auditing, prevent unauthorized access, and ensure tenant data isolation.
- Provide 24/7 technical customer support and operational diagnostics.

3. Tenant Isolation & Data Security
All tenant data is segregated using strict logical multi-tenant database partitions. We implement 256-bit AES encryption at rest and TLS 1.3 encryption in transit. Automated security audits and daily backups ensure high resilience.

4. Third-Party Integrations
We do not sell, rent, or trade your data to third parties. Data is shared solely with certified providers essential for platform operations, such as cloud hosting (AWS), encrypted payment processors (Stripe/Razorpay), and transactional email delivery (SendGrid).

5. Data Retention & Deletion
You retain full ownership of your data. You may request data export or complete account data deletion upon termination of your subscription in accordance with applicable laws.

6. Updates To This Policy
We may update this policy periodically to reflect platform enhancements and regulatory requirements. We encourage you to review this page regularly.`,
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await siteSettingsRoute.getPublicSettings({ scope: "saas" });
        if (res?.data?.privacyPolicy) {
          setPolicyData((prev) => ({
            ...prev,
            ...res.data.privacyPolicy,
          }));
        }
      } catch (err) {
        console.warn("Using fallback privacy policy content:", err.message);
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
            <Shield className="w-4 h-4" /> Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {policyData.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>
              Last Updated:{" "}
              {new Date(policyData.lastUpdated || Date.now()).toLocaleDateString(
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
            {policyData.content}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              <span>GDPR & ISO 27001 Standard Aligned</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>Enterprise Grade 256-bit Encryption</span>
            </div>
          </div>
        </motion.div>
      </main>

      <PublicFooter />
    </div>
  );
}
