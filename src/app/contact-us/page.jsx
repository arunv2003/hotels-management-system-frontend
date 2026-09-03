"use client";
import React, { useEffect, useState } from "react";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { siteSettingsRoute } from "@/routes/saas/settings/settings.route";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactUsPage() {
  const [contactData, setContactData] = useState({
    title: "Contact Us",
    subtitle: "Have questions about our hotel management platform? Our dedicated team is here to help.",
    email: "support@vedantatech.com",
    phone: "+91 98765 43210",
    alternatePhone: "+91 91234 56789",
    address: "Tech Boulevard, 5th Floor, Cyber City",
    city: "Noida / New Delhi",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "201301",
    workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM IST",
  });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "Hotel",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await siteSettingsRoute.getPublicSettings({ scope: "saas" });
        if (res?.data?.contactUs) {
          setContactData((prev) => ({
            ...prev,
            ...res.data.contactUs,
          }));
        }
      } catch (err) {
        console.warn("Using fallback contact us content:", err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", phone: "", propertyType: "Hotel", message: "" });
    }, 4000);
  };

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
            <MessageSquare className="w-4 h-4" /> Get In Touch
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
            {contactData.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {contactData.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Information Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Direct Contact Details
              </h3>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email Address
                  </div>
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                  >
                    {contactData.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Phone Numbers
                  </div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    {contactData.phone}
                  </div>
                  {contactData.alternatePhone && (
                    <div className="text-sm text-slate-500">
                      {contactData.alternatePhone}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Office Headquarters
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {contactData.address}, {contactData.city}, {contactData.state} - {contactData.pincode}, {contactData.country}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Operating Hours
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {contactData.workingHours}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Send us a Message
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Fill out the form below and an enterprise specialist will respond within 24 hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                  Thank You!
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  Your message has been received. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <Input
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Business Email
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. rahul@hotelgrand.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <Input
                      placeholder="+91 98765 00000"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Property Category
                    </label>
                    <select
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formState.propertyType}
                      onChange={(e) => setFormState({ ...formState, propertyType: e.target.value })}
                    >
                      <option value="Hotel">Hotel / Resort</option>
                      <option value="Boutique">Boutique Inn / Homestay</option>
                      <option value="Chain">Multi-Property Chain</option>
                      <option value="Hostel">Hostel / Service Apartment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message / Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your room inventory, POS requirements, or any specific questions..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/20 gap-2"
                >
                  <Send className="w-4 h-4" /> Send Inquiry
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
