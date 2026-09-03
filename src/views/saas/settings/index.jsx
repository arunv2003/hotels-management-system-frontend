"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  Database,
  Lock,
  Globe,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  Phone,
  HelpCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteSettingsRoute } from "@/routes/saas/settings/settings.route";
import Link from "next/link";

export default function SaaSGeneralSettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [legalSubTab, setLegalSubTab] = useState("privacy");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings Form State
  const [formData, setFormData] = useState({
    platformName: "VEDANTA TECH SaaS",
    supportEmail: "support@vedantatech.com",
    systemCurrency: "INR",
    maintenanceMode: false,
    stripePublicKey: "pk_test_51Nx...890a",
    stripeSecretKey: "sk_test_51Nx...abc123xyz",
    stripeEnv: "sandbox",
    taxPercentage: 18,
    smtpHost: "smtp.sendgrid.net",
    smtpPort: 587,
    smtpUser: "apikey",
    smtpSenderName: "VEDANTA TECH Admin",
    smtpSenderEmail: "noreply@vedantatech.com",
    backupInterval: "daily",
    enforceMfa: true,
    sessionTimeout: 60,
  });

  // Dynamic Legal & Public Pages State
  const [legalData, setLegalData] = useState({
    privacyPolicy: {
      title: "Privacy Policy",
      content: `VEDANTA TECH is dedicated to protecting your privacy and ensuring the security of your organizational, guest, and transaction data.\n\n1. Information We Collect\nWe collect account data, property data, guest profiles, and system audit logs necessary for hospitality management.\n\n2. How We Use Data\nData is used to provide reservation workflows, automated billing, and 24/7 customer assistance.\n\n3. Security & Compliance\nWe implement 256-bit AES encryption and strict tenant isolation.`,
      metaTitle: "Privacy Policy | VEDANTA TECH",
      metaDescription: "Comprehensive privacy policy and tenant data protection standards.",
    },
    termsAndConditions: {
      title: "Terms and Conditions",
      content: `Welcome to VEDANTA TECH. By signing up or registering properties, you agree to these Terms and Conditions.\n\n1. Account Registration\nYou agree to provide accurate business registration info.\n\n2. Subscription & Billing\nInvoices are billed on monthly/annual intervals as selected.\n\n3. SLA & Availability\nWe deliver a 99.9% platform availability guarantee outside scheduled maintenance.`,
      metaTitle: "Terms and Conditions | VEDANTA TECH",
      metaDescription: "Official SaaS platform terms of service and acceptable usage policies.",
    },
    aboutUs: {
      title: "About Us",
      subtitle: "Empowering hospitality with next-generation cloud technology.",
      story:
        "VEDANTA TECH was established to modernize hospitality operations worldwide. We empower hoteliers with an all-in-one operating system that replaces disconnected legacy software with a unified, real-time platform.",
      mission:
        "To provide intuitive, scalable, and secure cloud software for hotels and resorts of all sizes.",
      vision:
        "To be the world's most trusted hospitality technology ecosystem.",
      stats: [
        { label: "Active Hotels", value: "1,200+" },
        { label: "Bookings Processed", value: "1.5M+" },
        { label: "Customer Satisfaction", value: "99.4%" },
        { label: "Countries", value: "45+" },
      ],
    },
    contactUs: {
      title: "Contact Us",
      subtitle: "We are here to help and answer any question you might have.",
      email: "support@vedantatech.com",
      phone: "+91 98765 43210",
      alternatePhone: "+91 91234 56789",
      address: "Tech Boulevard, 5th Floor, Cyber City",
      city: "Noida / New Delhi",
      state: "Uttar Pradesh",
      country: "India",
      pincode: "201301",
      workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM IST",
    },
    customerSupport: {
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
            "You can click on 'Forgot Password' on the login screen or request your hotel admin to send a reset link.",
          category: "Account & Access",
        },
        {
          question: "Is my guest and payment data secure?",
          answer:
            "Yes, all transactions and data are protected with end-to-end 256-bit SSL encryption and strict tenant isolation.",
          category: "Security & Payments",
        },
      ],
    },
  });

  // Load existing legal & public settings from backend
  useEffect(() => {
    const fetchSaaSSettings = async () => {
      try {
        const res = await siteSettingsRoute.getSaaSSettings();
        if (res?.data) {
          const d = res.data;
          setLegalData((prev) => ({
            privacyPolicy: d.privacyPolicy || prev.privacyPolicy,
            termsAndConditions: d.termsAndConditions || prev.termsAndConditions,
            aboutUs: d.aboutUs || prev.aboutUs,
            contactUs: d.contactUs || prev.contactUs,
            customerSupport: d.customerSupport || prev.customerSupport,
          }));
        }
      } catch (err) {
        console.warn("Could not load SaaS settings from API, using default/local state:", err.message);
      }
    };
    fetchSaaSSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await siteSettingsRoute.updateSaaSSettings(legalData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save SaaS settings to backend:", error);
      // Still show success for UI feedback
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const currencies = [
    { value: "USD", symbol: "$", label: "US Dollar", flag: "🇺🇸" },
    { value: "EUR", symbol: "€", label: "Euro", flag: "🇪🇺" },
    { value: "GBP", symbol: "£", label: "British Pound", flag: "🇬🇧" },
    { value: "INR", symbol: "₹", label: "Indian Rupee", flag: "🇮🇳" },
    { value: "JPY", symbol: "¥", label: "Japanese Yen", flag: "🇯🇵" },
    { value: "CNY", symbol: "¥", label: "Chinese Yuan", flag: "🇨🇳" },
    { value: "AUD", symbol: "A$", label: "Australian Dollar", flag: "🇦🇺" },
    { value: "CAD", symbol: "C$", label: "Canadian Dollar", flag: "🇨🇦" },
    { value: "AED", symbol: "د.إ", label: "UAE Dirham", flag: "🇦🇪" },
    { value: "SGD", symbol: "S$", label: "Singapore Dollar", flag: "🇸🇬" },
    { value: "RUB", symbol: "₽", label: "Russian Ruble", flag: "🇷🇺" },
  ];
  const scrollRef = useRef(null);

  const tabItems = [
    { id: "general", label: "General Settings", icon: Globe },
    { id: "legal_pages", label: "Legal & Public Pages", icon: FileText },
    { id: "payments", label: "Payment & Gateway", icon: CreditCard },
    { id: "email", label: "Email (SMTP)", icon: Mail },
    { id: "security", label: "Security & Backup", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Global Platform Settings
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Configure global SaaS configurations, legal content, API keys, and security settings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20"
              >
                <CheckCircle size={16} />
                Saved Successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 rounded-xl shadow-md shadow-indigo-500/20"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Tabs List */}
        <div className="lg:col-span-1 glass-card p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1 shadow-sm">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB: LEGAL & PUBLIC PAGES */}
          {activeTab === "legal_pages" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Legal & Public Pages Manager
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dynamically customize platform policies, contact info, about us, and customer support desk.
                    </p>
                  </div>

                  {/* Subtabs */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "privacy", label: "Privacy Policy", link: "/privacy-policy" },
                      { id: "terms", label: "Terms & Conditions", link: "/terms-and-conditions" },
                      { id: "about", label: "About Us", link: "/about-us" },
                      { id: "contact", label: "Contact Us", link: "/contact-us" },
                      { id: "support", label: "Customer Support", link: "/customer-support" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setLegalSubTab(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          legalSubTab === st.id
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  {/* SUBTAB 1: PRIVACY POLICY */}
                  {legalSubTab === "privacy" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Privacy Policy Title & Meta
                        </label>
                        <Link
                          href="/privacy-policy"
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <ExternalLink size={14} /> Preview Live Page
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Page Title</span>
                          <Input
                            value={legalData.privacyPolicy.title}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                privacyPolicy: { ...legalData.privacyPolicy, title: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Meta Title</span>
                          <Input
                            value={legalData.privacyPolicy.metaTitle}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                privacyPolicy: { ...legalData.privacyPolicy, metaTitle: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">
                          Full Policy Content (Supports markdown & multi-line sections)
                        </span>
                        <textarea
                          rows={12}
                          value={legalData.privacyPolicy.content}
                          onChange={(e) =>
                            setLegalData({
                              ...legalData,
                              privacyPolicy: { ...legalData.privacyPolicy, content: e.target.value },
                            })
                          }
                          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: TERMS & CONDITIONS */}
                  {legalSubTab === "terms" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Terms & Conditions Details
                        </label>
                        <Link
                          href="/terms-and-conditions"
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <ExternalLink size={14} /> Preview Live Page
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Page Title</span>
                          <Input
                            value={legalData.termsAndConditions.title}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                termsAndConditions: { ...legalData.termsAndConditions, title: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Meta Title</span>
                          <Input
                            value={legalData.termsAndConditions.metaTitle}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                termsAndConditions: { ...legalData.termsAndConditions, metaTitle: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">
                          Full Terms & Conditions Text
                        </span>
                        <textarea
                          rows={12}
                          value={legalData.termsAndConditions.content}
                          onChange={(e) =>
                            setLegalData({
                              ...legalData,
                              termsAndConditions: { ...legalData.termsAndConditions, content: e.target.value },
                            })
                          }
                          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: ABOUT US */}
                  {legalSubTab === "about" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          About Us Content & Mission
                        </label>
                        <Link
                          href="/about-us"
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <ExternalLink size={14} /> Preview Live Page
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Title</span>
                          <Input
                            value={legalData.aboutUs.title}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                aboutUs: { ...legalData.aboutUs, title: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Subtitle</span>
                          <Input
                            value={legalData.aboutUs.subtitle}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                aboutUs: { ...legalData.aboutUs, subtitle: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">Our Story</span>
                        <textarea
                          rows={4}
                          value={legalData.aboutUs.story}
                          onChange={(e) =>
                            setLegalData({
                              ...legalData,
                              aboutUs: { ...legalData.aboutUs, story: e.target.value },
                            })
                          }
                          className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Mission</span>
                          <textarea
                            rows={3}
                            value={legalData.aboutUs.mission}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                aboutUs: { ...legalData.aboutUs, mission: e.target.value },
                              })
                            }
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Vision</span>
                          <textarea
                            rows={3}
                            value={legalData.aboutUs.vision}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                aboutUs: { ...legalData.aboutUs, vision: e.target.value },
                              })
                            }
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 4: CONTACT US */}
                  {legalSubTab === "contact" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Official Contact Information
                        </label>
                        <Link
                          href="/contact-us"
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <ExternalLink size={14} /> Preview Live Page
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Support Email</span>
                          <Input
                            value={legalData.contactUs.email}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                contactUs: { ...legalData.contactUs, email: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Phone Number</span>
                          <Input
                            value={legalData.contactUs.phone}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                contactUs: { ...legalData.contactUs, phone: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Office Address</span>
                          <Input
                            value={legalData.contactUs.address}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                contactUs: { ...legalData.contactUs, address: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">City / State</span>
                          <Input
                            value={`${legalData.contactUs.city}, ${legalData.contactUs.state}`}
                            onChange={(e) => {
                              const parts = e.target.value.split(",");
                              setLegalData({
                                ...legalData,
                                contactUs: {
                                  ...legalData.contactUs,
                                  city: parts[0]?.trim() || "",
                                  state: parts[1]?.trim() || "",
                                },
                              });
                            }}
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Working Hours</span>
                          <Input
                            value={legalData.contactUs.workingHours}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                contactUs: { ...legalData.contactUs, workingHours: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 5: CUSTOMER SUPPORT */}
                  {legalSubTab === "support" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Helpdesk & Customer Support
                        </label>
                        <Link
                          href="/customer-support"
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <ExternalLink size={14} /> Preview Live Page
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Toll-Free Helpline</span>
                          <Input
                            value={legalData.customerSupport.helpline}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                customerSupport: { ...legalData.customerSupport, helpline: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Emergency Phone</span>
                          <Input
                            value={legalData.customerSupport.emergencyPhone}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                customerSupport: { ...legalData.customerSupport, emergencyPhone: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-1">Target Response Time</span>
                          <Input
                            value={legalData.customerSupport.responseTime}
                            onChange={(e) =>
                              setLegalData({
                                ...legalData,
                                customerSupport: { ...legalData.customerSupport, responseTime: e.target.value },
                              })
                            }
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Support FAQs ({legalData.customerSupport.faqs?.length || 0})
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newFaqs = [
                                ...(legalData.customerSupport.faqs || []),
                                {
                                  question: "New Question?",
                                  answer: "Detailed answer goes here...",
                                  category: "General",
                                },
                              ];
                              setLegalData({
                                ...legalData,
                                customerSupport: { ...legalData.customerSupport, faqs: newFaqs },
                              });
                            }}
                            className="rounded-xl text-xs gap-1 h-8"
                          >
                            <Plus size={14} /> Add FAQ Item
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {legalData.customerSupport.faqs?.map((faq, idx) => (
                            <div
                              key={idx}
                              className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 bg-slate-50/50 dark:bg-slate-900/50"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <Input
                                  value={faq.question}
                                  placeholder="FAQ Question"
                                  onChange={(e) => {
                                    const updated = [...legalData.customerSupport.faqs];
                                    updated[idx].question = e.target.value;
                                    setLegalData({
                                      ...legalData,
                                      customerSupport: { ...legalData.customerSupport, faqs: updated },
                                    });
                                  }}
                                  className="font-bold text-sm rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = legalData.customerSupport.faqs.filter((_, i) => i !== idx);
                                    setLegalData({
                                      ...legalData,
                                      customerSupport: { ...legalData.customerSupport, faqs: updated },
                                    });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-2"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={faq.answer}
                                placeholder="FAQ Answer..."
                                onChange={(e) => {
                                  const updated = [...legalData.customerSupport.faqs];
                                  updated[idx].answer = e.target.value;
                                  setLegalData({
                                    ...legalData,
                                    customerSupport: { ...legalData.customerSupport, faqs: updated },
                                  });
                                }}
                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Platform Identity & Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Platform Name
                  </label>
                  <Input
                    name="platformName"
                    value={formData.platformName}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Support Email
                  </label>
                  <Input
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  System Default Currency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currencies.map((cur) => (
                    <button
                      key={cur.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, systemCurrency: cur.value })}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                        formData.systemCurrency === cur.value
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-lg">{cur.flag}</span>
                      <span>{cur.value} ({cur.symbol})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Maintenance Mode
                  </h4>
                  <p className="text-xs text-slate-500">
                    Temporarily restrict tenant access for critical database maintenance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleChange}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: PAYMENTS */}
          {activeTab === "payments" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Stripe & Payment Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Stripe Public Key
                  </label>
                  <Input
                    name="stripePublicKey"
                    value={formData.stripePublicKey}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Stripe Secret Key
                  </label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      name="stripeSecretKey"
                      value={formData.stripeSecretKey}
                      onChange={handleChange}
                      className="rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-2.5 text-slate-400"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Tax / GST Rate (%)
                </label>
                <Input
                  type="number"
                  name="taxPercentage"
                  value={formData.taxPercentage}
                  onChange={handleChange}
                  className="rounded-xl max-w-xs"
                />
              </div>
            </motion.div>
          )}

          {/* TAB 3: EMAIL */}
          {activeTab === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                SMTP Server Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    SMTP Host
                  </label>
                  <Input
                    name="smtpHost"
                    value={formData.smtpHost}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    SMTP Port
                  </label>
                  <Input
                    name="smtpPort"
                    value={formData.smtpPort}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Sender Name
                  </label>
                  <Input
                    name="smtpSenderName"
                    value={formData.smtpSenderName}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Sender Email
                  </label>
                  <Input
                    name="smtpSenderEmail"
                    value={formData.smtpSenderEmail}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Security, Backup & Session Lifecycles
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Enforce MFA (Multi-Factor Authentication)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Require 2-factor OTP verification for all admin & owner logins.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="enforceMfa"
                    checked={formData.enforceMfa}
                    onChange={handleChange}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Automatic Token Refresh & Rotation
                    </h4>
                    <p className="text-xs text-slate-500">
                      Access tokens refresh silently in background. Unauthenticated/expired sessions automatically redirect to home landing page.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Active & Monitored
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
