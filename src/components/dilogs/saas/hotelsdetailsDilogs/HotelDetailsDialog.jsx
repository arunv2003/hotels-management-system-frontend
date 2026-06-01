"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  User,
  Mail,
  Phone,
  Shield,
  Globe,
  MapPin,
  ExternalLink,
  FileText,
  CreditCard,
  Building2,
  Users,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/** Rewrite Cloudinary image URLs to raw for PDFs so they open correctly. */
function getDocUrl(url) {
  if (!url) return url;
  // PDFs uploaded as image resource type won't render — switch to raw
  if (url.includes("/image/upload/") && url.toLowerCase().endsWith(".pdf")) {
    return url.replace("/image/upload/", "/raw/upload/");
  }
  return url;
}

export default function HotelDetailsDialog({ isOpen, onClose, hotel }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !hotel) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "owner", label: "Owner & Location", icon: MapPin },
    { id: "settings", label: "Settings & Plan", icon: Shield },
    { id: "rooms", label: "Room Types & Staff", icon: User },
    { id: "documents", label: "Documents & Photos", icon: FileText },
  ];

  const name = hotel.hotelName || hotel.name || "N/A";
  const brand = hotel.brandName || "Independent Brand";
  const type = hotel.hotelType || "Hotel";
  const starRating = Number(hotel.starRating) || 3;
  const isActive = hotel.isActive !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col"
      >
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/20 overflow-hidden shrink-0">
              {hotel.hotelLogo?.cloudUrl ? (
                <img src={hotel.hotelLogo.cloudUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-none tracking-tight">
                  {name}
                </h2>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none shadow-sm",
                  isActive 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/10" 
                    : "bg-rose-50 text-rose-600 border border-rose-100/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/10"
                )}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold mt-1.5 uppercase tracking-widest flex items-center gap-2">
                <span>{brand}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-indigo-600 dark:text-indigo-400">{type}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto bg-slate-50/20 dark:bg-slate-950/10 px-6 md:px-8 shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4.5 px-4 font-bold text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer",
                  isCurrent
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/10 dark:bg-slate-950/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="outline-none"
            >
              {/* --- OVERVIEW TAB --- */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Star Class</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < starRating ? "text-amber-500 fill-amber-500" : "text-slate-100 dark:text-slate-800"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1.5 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md text-amber-600 dark:text-amber-400">
                          {starRating} Star
                        </span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Capacity details</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {hotel.totalRooms || 0} Rooms / {hotel.totalFloors || 0} Floors
                        </span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Guest limit</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {hotel.maxGuests || 0} Guests Max
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Hotel Description</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                      {hotel.hotelDescription || "No description provided for this property."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Property Amenities</span>
                    <div className="flex flex-wrap gap-2.5">
                      {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 ? (
                        hotel.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-500/5 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100/30 dark:border-indigo-500/5 transition-all"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No amenities specified.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- OWNER & LOCATION TAB --- */}
              {activeTab === "owner" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Owner */}
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                      <User className="w-4.5 h-4.5 text-indigo-600" /> Owner Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Name</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">{hotel.ownerFullName || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Email Address</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{hotel.ownerEmail || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Phone Number</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{hotel.mobileNumber || "N/A"}</span>
                        </div>
                      </div>
                      {hotel.alternateNumber && (
                        <div className="flex items-center gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Alternate Phone</span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{hotel.alternateNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                      <MapPin className="w-4.5 h-4.5 text-indigo-600" /> Location Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Address</span>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                          {hotel.fullAddress || "N/A"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">City</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{hotel.city || "N/A"}</span>
                        </div>
                        <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">State</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{hotel.state || "N/A"}</span>
                        </div>
                        <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Country</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{hotel.country || "N/A"}</span>
                        </div>
                        <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Pincode</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{hotel.pincode || "N/A"}</span>
                        </div>
                      </div>
                      {(hotel.latitude || hotel.longitude) && (
                        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Map Coordinates</span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {hotel.latitude}, {hotel.longitude}
                            </span>
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-9 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            Open Maps <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SETTINGS TAB --- */}
              {activeTab === "settings" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Plan & Subscription */}
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                      <CreditCard className="w-4.5 h-4.5 text-indigo-600" /> Plan & Billing
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100/30 dark:border-indigo-500/10 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Selected Tier</span>
                          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                            {hotel.planSelected?.name || "Premium Plan"}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                          {hotel.billingCycle || "Monthly"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tax Structure</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">{hotel.taxType || "GST"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Coupon Applied</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">
                            {hotel.couponCode ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">{hotel.couponCode}</span>
                            ) : "None"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">GST Registration</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">{hotel.gstNumber || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PAN Number</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">{hotel.panNumber || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational configurations */}
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                      <Globe className="w-4.5 h-4.5 text-indigo-600" /> Operational Settings
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Check-in Time</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white mt-1 block">{hotel.checkInTime || "12:00 PM"}</span>
                      </div>
                      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Check-out Time</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white mt-1 block">{hotel.checkOutTime || "11:00 AM"}</span>
                      </div>
                      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Invoice Prefix</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white mt-1 block">{hotel.invoicePrefix || "INV-"}</span>
                      </div>
                      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Financial Year</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white mt-1 block">{hotel.financialYear || "April-March"}</span>
                      </div>
                      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Timezone</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white mt-1 block truncate">{hotel.timezone || "Asia/Kolkata"}</span>
                      </div>
                      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100/30">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Currency Code</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white mt-1 block">{hotel.currency || "INR"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- ROOM TYPES & STAFF TAB --- */}
              {activeTab === "rooms" && (
                <div className="space-y-6">
                  {/* Room types */}
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Layers className="w-4.5 h-4.5 text-indigo-600" /> Associated Room Types
                    </h3>
                    <div className="overflow-hidden border border-slate-100/80 dark:border-slate-800/80 rounded-2xl bg-slate-50/30 dark:bg-slate-950/20">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-wider text-slate-500">
                          <tr>
                            <th className="px-5 py-3.5 font-bold">Room Category Name</th>
                            <th className="px-5 py-3.5 font-bold text-right">Registered Rooms</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                          {Array.isArray(hotel.roomTypes) && hotel.roomTypes.length > 0 ? (
                            hotel.roomTypes.map((room, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-200">
                                  {typeof room === "object" ? (room.roomType || room._id) : room}
                                </td>
                                <td className="px-5 py-3 text-right font-black text-slate-950 dark:text-white">
                                  {typeof room === "object" && room.numberOfRooms !== undefined ? room.numberOfRooms : "Enabled"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2" className="px-5 py-6 text-center text-slate-400 italic">No room types selected for this hotel.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Staff members */}
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Users className="w-4.5 h-4.5 text-indigo-600" /> Registered Staff members
                    </h3>
                    <div className="overflow-hidden border border-slate-100/80 dark:border-slate-800/80 rounded-2xl bg-slate-50/30 dark:bg-slate-950/20">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-wider text-slate-500">
                          <tr>
                            <th className="px-5 py-3.5 font-bold">Staff Member</th>
                            <th className="px-5 py-3.5 font-bold">Role</th>
                            <th className="px-5 py-3.5 font-bold">Email</th>
                            <th className="px-5 py-3.5 font-bold">Phone</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                          {Array.isArray(hotel.staff) && hotel.staff.length > 0 ? (
                            hotel.staff.map((member, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">{member.fullName || member.name || "N/A"}</td>
                                <td className="px-5 py-3">
                                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-black uppercase text-[10px]">
                                    {member.role || "Staff"}
                                  </span>
                                </td>
                                <td className="px-5 py-3">{member.email || "N/A"}</td>
                                <td className="px-5 py-3">{member.phone || "N/A"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-5 py-6 text-center text-slate-400 italic">No staff members registered.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- DOCUMENTS TAB --- */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  {/* Documents Grid */}
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                      <FileText className="w-4.5 h-4.5 text-indigo-600" /> Identity & Compliance Documents
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "GST Certificate", key: "gstCertificate" },
                        { label: "PAN Card Document", key: "panCard" },
                        { label: "Hotel License", key: "hotelLicense" },
                        { label: "Owner ID Proof", key: "ownerId" },
                      ].map((docItem, idx) => {
                        const docDetails = hotel.documents?.[docItem.key];
                        const hasUrl = !!docDetails?.cloudUrl;
                        return (
                          <div key={idx} className="p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/60 dark:border-slate-800/50 flex flex-col justify-between min-h-44 gap-4">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{docItem.label}</span>
                              <span className={cn(
                                "inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider mt-2.5 px-2.5 py-0.5 rounded-full border shadow-sm",
                                hasUrl 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/10" 
                                  : "bg-slate-100 text-slate-400 border-slate-200/50 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-800"
                              )}>
                                {hasUrl ? "Verified File" : "No File"}
                              </span>
                            </div>
                            {hasUrl ? (
                              <div className="flex gap-2">
                                <a
                                  href={getDocUrl(docDetails.cloudUrl)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 text-center py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> View
                                </a>
                                <a
                                  href={getDocUrl(docDetails.cloudUrl)}
                                  download
                                  className="flex-1 text-center py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border border-indigo-100/30 dark:border-indigo-500/10 shadow-sm transition-all cursor-pointer"
                                >
                                  Download
                                </a>
                              </div>
                            ) : (
                              <div className="w-full text-center py-2.5 bg-slate-100/50 dark:bg-slate-850 text-slate-400 dark:text-slate-600 rounded-xl text-xs font-bold border border-transparent">
                                Missing Upload
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Property Photos */}
                  {Array.isArray(hotel.hotelImages) && hotel.hotelImages.length > 0 && (
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                        <Building2 className="w-4.5 h-4.5 text-indigo-600" /> Property Image Gallery
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {hotel.hotelImages.map((img, i) => (
                          <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800/80 shadow-sm group">
                            <img src={img.cloudUrl} alt={`Hotel Pic ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="h-11 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-white font-bold px-6 text-sm transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </motion.div>
    </div>
  );
}
