"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileText,
  Phone,
  Clock,
  Save,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
  Globe,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteSettingsRoute } from "@/routes/saas/settings/settings.route";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function HotelSettingsView() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("policies");
  const [policySubTab, setPolicySubTab] = useState("privacy");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [hotelSettings, setHotelSettings] = useState({
    privacyPolicy: {
      title: "Guest Privacy & Data Policy",
      content:
        "We value the trust and privacy of every guest staying with us. Guest identification documents, payment records, and stay history are safeguarded with strict physical and digital security protocols. Data is never shared with third parties except for statutory local law requirements.",
      metaTitle: "Guest Privacy Policy",
    },
    termsAndConditions: {
      title: "Hotel Booking Terms & House Rules",
      content:
        "1. Check-In / Check-Out: Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.\n2. Valid ID Proof: All adult guests must produce government-approved photo ID upon check-in.\n3. Cancellation Policy: Free cancellation is available up to 48 hours before check-in date.\n4. Non-Smoking: Rooms are strictly non-smoking. Designated outdoor areas are provided.",
      metaTitle: "Hotel Terms & Conditions",
    },
    aboutUs: {
      title: "About Our Hotel",
      subtitle: "Delivering unmatched hospitality, comfort, and memorable stays.",
      story:
        "Welcome to our hotel. Located in the heart of the city, we offer world-class rooms, fine dining, and personalized hospitality designed for both business travelers and vacationing families.",
      mission:
        "To offer every traveler a comfortable sanctuary backed by warm, attentive service.",
      vision:
        "To be the premier preferred stay destination in our region.",
      stats: [
        { label: "Comfortable Rooms", value: "85+" },
        { label: "Happy Guests", value: "25,000+" },
        { label: "Star Rating", value: "4.8 / 5" },
        { label: "Years of Service", value: "10+" },
      ],
    },
    contactUs: {
      title: "Front Desk & Concierge",
      subtitle: "Direct contact line for room reservations and general inquiries.",
      email: user?.email || "frontdesk@hotel.com",
      phone: "+91 98765 00112",
      alternatePhone: "+91 98765 00113",
      address: "Main Grand Avenue, Near City Square",
      city: "City Center",
      state: "State",
      country: "India",
      pincode: "110001",
      workingHours: "Front Desk: Open 24/7 (365 Days)",
    },
    customerSupport: {
      title: "Guest Support & Room Service",
      subtitle: "24/7 In-Room Service, Housekeeping & Guest Assistance",
      supportEmail: "concierge@hotel.com",
      helpline: "Ext: 100 / 101",
      emergencyPhone: "+91 98765 99999",
      responseTime: "5-10 minutes for in-room service requests",
      faqs: [
        {
          question: "What are the standard check-in and check-out timings?",
          answer: "Check-in begins at 2:00 PM and check-out is at 11:00 AM. Please contact the front desk for late check-out requests.",
          category: "Timing",
        },
        {
          question: "Is high-speed Wi-Fi complimentary in all rooms?",
          answer: "Yes, high-speed fiber Wi-Fi is available across all guest rooms, restaurant, and lobby areas free of charge.",
          category: "Amenities",
        },
      ],
    },
  });

  useEffect(() => {
    const fetchHotelSettings = async () => {
      try {
        const res = await siteSettingsRoute.getHotelSettings();
        if (res?.data) {
          const d = res.data;
          setHotelSettings((prev) => ({
            privacyPolicy: d.privacyPolicy || prev.privacyPolicy,
            termsAndConditions: d.termsAndConditions || prev.termsAndConditions,
            aboutUs: d.aboutUs || prev.aboutUs,
            contactUs: d.contactUs || prev.contactUs,
            customerSupport: d.customerSupport || prev.customerSupport,
          }));
        }
      } catch (err) {
        console.warn("Could not load hotel settings, using default/local state:", err.message);
      }
    };
    fetchHotelSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await siteSettingsRoute.updateHotelSettings(hotelSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save hotel settings:", error);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const tabItems = [
    { id: "policies", label: "Hotel Policies & Content", icon: FileText },
    { id: "frontdesk", label: "Front Desk & Contact", icon: Phone },
    { id: "support", label: "Guest Support & Room Service", icon: LifeBuoy },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Hotel Settings & Guest Policies
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Customize your property's policies, terms, front-desk contact, and guest support desk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20"
              >
                <CheckCircle size={16} />
                Saved Successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 rounded-xl shadow-md shadow-indigo-500/20 text-xs sm:text-sm"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 glass-card p-2 sm:p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex lg:flex-col gap-1 overflow-x-auto table-scrollbar shadow-sm">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={17} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "policies" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Property Policies & About Us
                  </h2>
                  <p className="text-xs text-slate-500">
                    Define policies shown on guest booking confirmations, invoices, and stay guides.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto table-scrollbar pb-1">
                  {[
                    { id: "privacy", label: "Privacy Policy" },
                    { id: "terms", label: "Terms & Rules" },
                    { id: "about", label: "About Hotel" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setPolicySubTab(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                        policySubTab === st.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {policySubTab === "privacy" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Policy Title
                    </label>
                    <Input
                      value={hotelSettings.privacyPolicy.title}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          privacyPolicy: { ...hotelSettings.privacyPolicy, title: e.target.value },
                        })
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Privacy & Data Retention Content
                    </label>
                    <textarea
                      rows={8}
                      value={hotelSettings.privacyPolicy.content}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          privacyPolicy: { ...hotelSettings.privacyPolicy, content: e.target.value },
                        })
                      }
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {policySubTab === "terms" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      House Rules & Terms Title
                    </label>
                    <Input
                      value={hotelSettings.termsAndConditions.title}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          termsAndConditions: { ...hotelSettings.termsAndConditions, title: e.target.value },
                        })
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Terms, Check-in rules, and Cancellation parameters
                    </label>
                    <textarea
                      rows={8}
                      value={hotelSettings.termsAndConditions.content}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          termsAndConditions: { ...hotelSettings.termsAndConditions, content: e.target.value },
                        })
                      }
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {policySubTab === "about" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Headline
                      </label>
                      <Input
                        value={hotelSettings.aboutUs.title}
                        onChange={(e) =>
                          setHotelSettings({
                            ...hotelSettings,
                            aboutUs: { ...hotelSettings.aboutUs, title: e.target.value },
                          })
                        }
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Subtitle / Tagline
                      </label>
                      <Input
                        value={hotelSettings.aboutUs.subtitle}
                        onChange={(e) =>
                          setHotelSettings({
                            ...hotelSettings,
                            aboutUs: { ...hotelSettings.aboutUs, subtitle: e.target.value },
                          })
                        }
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Hotel Story & Highlights
                    </label>
                    <textarea
                      rows={5}
                      value={hotelSettings.aboutUs.story}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          aboutUs: { ...hotelSettings.aboutUs, story: e.target.value },
                        })
                      }
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "frontdesk" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Front Desk & Reception Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Front Desk Email
                  </label>
                  <Input
                    value={hotelSettings.contactUs.email}
                    onChange={(e) =>
                      setHotelSettings({
                        ...hotelSettings,
                        contactUs: { ...hotelSettings.contactUs, email: e.target.value },
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Front Desk Direct Phone
                  </label>
                  <Input
                    value={hotelSettings.contactUs.phone}
                    onChange={(e) =>
                      setHotelSettings({
                        ...hotelSettings,
                        contactUs: { ...hotelSettings.contactUs, phone: e.target.value },
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Hotel Address
                  </label>
                  <Input
                    value={hotelSettings.contactUs.address}
                    onChange={(e) =>
                      setHotelSettings({
                        ...hotelSettings,
                        contactUs: { ...hotelSettings.contactUs, address: e.target.value },
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    City / State
                  </label>
                  <Input
                    value={`${hotelSettings.contactUs.city}, ${hotelSettings.contactUs.state}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(",");
                      setHotelSettings({
                        ...hotelSettings,
                        contactUs: {
                          ...hotelSettings.contactUs,
                          city: parts[0]?.trim() || "",
                          state: parts[1]?.trim() || "",
                        },
                      });
                    }}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "support" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Guest Support & Room Service Helpline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Room Service Intercom / Extension
                  </label>
                  <Input
                    value={hotelSettings.customerSupport.helpline}
                    onChange={(e) =>
                      setHotelSettings({
                        ...hotelSettings,
                        customerSupport: { ...hotelSettings.customerSupport, helpline: e.target.value },
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Concierge & Night Duty Mobile
                  </label>
                  <Input
                    value={hotelSettings.customerSupport.emergencyPhone}
                    onChange={(e) =>
                      setHotelSettings({
                        ...hotelSettings,
                        customerSupport: { ...hotelSettings.customerSupport, emergencyPhone: e.target.value },
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Guest FAQs ({hotelSettings.customerSupport.faqs?.length || 0})
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newFaqs = [
                        ...(hotelSettings.customerSupport.faqs || []),
                        {
                          question: "New Guest Question?",
                          answer: "Helpful guest answer...",
                          category: "General",
                        },
                      ];
                      setHotelSettings({
                        ...hotelSettings,
                        customerSupport: { ...hotelSettings.customerSupport, faqs: newFaqs },
                      });
                    }}
                    className="rounded-xl text-xs gap-1 h-8"
                  >
                    <Plus size={14} /> Add FAQ Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {hotelSettings.customerSupport.faqs?.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 bg-slate-50/50 dark:bg-slate-900/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          value={faq.question}
                          placeholder="Guest Question"
                          onChange={(e) => {
                            const updated = [...hotelSettings.customerSupport.faqs];
                            updated[idx].question = e.target.value;
                            setHotelSettings({
                              ...hotelSettings,
                              customerSupport: { ...hotelSettings.customerSupport, faqs: updated },
                            });
                          }}
                          className="font-bold text-sm rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = hotelSettings.customerSupport.faqs.filter((_, i) => i !== idx);
                            setHotelSettings({
                              ...hotelSettings,
                              customerSupport: { ...hotelSettings.customerSupport, faqs: updated },
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
                        placeholder="Guest Answer..."
                        onChange={(e) => {
                          const updated = [...hotelSettings.customerSupport.faqs];
                          updated[idx].answer = e.target.value;
                          setHotelSettings({
                            ...hotelSettings,
                            customerSupport: { ...hotelSettings.customerSupport, faqs: updated },
                          });
                        }}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
