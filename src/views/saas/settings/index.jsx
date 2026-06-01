"use client";
import React, { useRef, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SaaSGeneralSettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings Form State
  const [formData, setFormData] = useState({
    platformName: "HotelFlow SaaS",
    supportEmail: "support@hotelflow.com",
    systemCurrency: "INR",
    maintenanceMode: false,
    stripePublicKey: "pk_test_51Nx...890a",
    stripeSecretKey: "sk_test_51Nx...abc123xyz",
    stripeEnv: "sandbox",
    taxPercentage: 18,
    smtpHost: "smtp.sendgrid.net",
    smtpPort: 587,
    smtpUser: "apikey",
    smtpSenderName: "HotelFlow Admin",
    smtpSenderEmail: "noreply@hotelflow.com",
    backupInterval: "daily",
    enforceMfa: true,
    sessionTimeout: 60,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
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

  const scrollCurrencies = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const tabItems = [
    { id: "general", label: "General Settings", icon: Globe },
    { id: "payments", label: "Payment & Gateway", icon: CreditCard },
    { id: "email", label: "Email (SMTP)", icon: Mail },
    { id: "security", label: "Security & Backup", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Global Platform Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Configure global SaaS configurations, keys, and security settings
          </p>
        </div>

        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20"
            >
              <CheckCircle size={16} />
              Settings saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Tabs List */}
        <div className="lg:col-span-1 glass-card p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900  space-y-1">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Form Content */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSave}
            className="glass-card p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900  space-y-8"
          >
            <AnimatePresence mode="wait">
              {/* General Tab */}
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      General Configurations
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure global metadata and platform access
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Platform Title
                      </label>
                      <Input
                        name="platformName"
                        value={formData.platformName}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Support Desk Email
                      </label>
                      <Input
                        type="email"
                        name="supportEmail"
                        value={formData.supportEmail}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      System Currency
                    </label>

                    <select
                      value={formData.systemCurrency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          systemCurrency: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.flag} {currency.value} ({currency.symbol}) -{" "}
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                      <div className="flex gap-4">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            System Maintenance Mode
                          </p>
                          <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                            Activating maintenance mode will block all non-admin
                            users from accessing their dashboards. Existing
                            active sessions will be paused.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={formData.maintenanceMode}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      Stripe Payment Settings
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure global keys to interface subscriptions and
                      coupon checkouts
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Stripe Public Key
                      </label>
                      <Input
                        name="stripePublicKey"
                        value={formData.stripePublicKey}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Stripe Secret Key
                      </label>
                      <div className="relative">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          name="stripeSecretKey"
                          value={formData.stripeSecretKey}
                          onChange={handleChange}
                          className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 pr-12 font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showApiKey ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Environment Mode
                        </label>
                        <select
                          name="stripeEnv"
                          value={formData.stripeEnv}
                          onChange={handleChange}
                          className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-sm font-medium transition-all"
                        >
                          <option value="sandbox">
                            Sandbox (Development / Testing)
                          </option>
                          <option value="live">Live (Real Operations)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Platform VAT / GST Tax (%)
                        </label>
                        <Input
                          type="number"
                          name="taxPercentage"
                          value={formData.taxPercentage}
                          onChange={handleChange}
                          className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email (SMTP) Tab */}
              {activeTab === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      Email Delivery System
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure global SMTP connection variables for system
                      notifications
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        SMTP Host Server
                      </label>
                      <Input
                        name="smtpHost"
                        value={formData.smtpHost}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        SMTP Port
                      </label>
                      <Input
                        type="number"
                        name="smtpPort"
                        value={formData.smtpPort}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        SMTP Auth Username
                      </label>
                      <Input
                        name="smtpUser"
                        value={formData.smtpUser}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Sender Display Name
                      </label>
                      <Input
                        name="smtpSenderName"
                        value={formData.smtpSenderName}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Sender Email Address
                    </label>
                    <Input
                      type="email"
                      name="smtpSenderEmail"
                      value={formData.smtpSenderEmail}
                      onChange={handleChange}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </motion.div>
              )}

              {/* Security & Backup Tab */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      Security Policies &amp; Backups
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure global backup targets, schedules, and login
                      rules
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Database size={16} className="text-indigo-500" />{" "}
                        Database Backup Interval
                      </label>
                      <select
                        name="backupInterval"
                        value={formData.backupInterval}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-sm font-medium transition-all"
                      >
                        <option value="hourly">
                          Hourly Automated Snapshots
                        </option>
                        <option value="daily">
                          Daily Snapshots (Recommended)
                        </option>
                        <option value="weekly">Weekly Full Archive</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Lock size={16} className="text-indigo-500" /> Max
                        Session Inactivity (Minutes)
                      </label>
                      <Input
                        type="number"
                        name="sessionTimeout"
                        value={formData.sessionTimeout}
                        onChange={handleChange}
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          Enforce 2FA for Administrators
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Require all Super-Admin accounts to log in with an
                          authenticator app.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enforceMfa"
                          checked={formData.enforceMfa}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Footer Action */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
              <Button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-8 gap-2 cursor-pointer text-white font-bold"
              >
                <Save size={18} /> Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
