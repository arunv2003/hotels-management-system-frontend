"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useSubscription } from "@/hooks/use-subscription";
import { Sparkles, Calendar, AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import RenewPlanModal from "@/components/dilogs/hotels/RenewPlanModal";

export default function DashboardLayout({ children, type }) {
  const { user } = useAuthStore();
  const { subscription } = useSubscription();
  const [showRenewModal, setShowRenewModal] = useState(false);

  const isHotelUser =
    user?.userType === "hotel-owner" ||
    user?.userType === "staff" ||
    user?.userType === "admin" ||
    user?.userType === "business";

  const formattedExpiry = subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Active";

  const daysLeft = subscription?.daysRemaining ?? 365;
  const isExpiringSoon = daysLeft <= 7;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-slate-50 dark:bg-slate-950">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 shrink-0 z-20">
        {/* Left: Hotel / SaaS Status */}
        <div className="flex items-center gap-3">
          {isHotelUser && subscription && (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{subscription.planName || "Active Plan"}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Expires {formattedExpiry}
                </span>
              </div>

              {/* Days left pill */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border ${
                  daysLeft <= 7
                    ? "bg-rose-50 dark:bg-rose-950/50 border-rose-300 text-rose-600"
                    : daysLeft <= 30
                    ? "bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-600"
                    : "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-600"
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{daysLeft} Days Left</span>
              </div>

              {/* Quick Renew Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRenewModal(true)}
                className="h-8 px-3 rounded-lg text-xs font-bold border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Renew Plan
              </Button>
            </div>
          )}
        </div>

        {/* Right: Operational Status */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              System Status
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Warning banner if expiring soon */}
      {isHotelUser && isExpiringSoon && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-200 animate-bounce" />
            <span>
              Your <strong>{subscription?.planName}</strong> expires in {daysLeft} days ({formattedExpiry}). Renew today to avoid login interruption.
            </span>
          </div>
          <button
            onClick={() => setShowRenewModal(true)}
            className="px-3 py-1 bg-white text-orange-700 rounded-md font-extrabold hover:bg-amber-50 transition-colors shadow-sm text-xs"
          >
            Renew Now
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto w-full"
        >
          {children}
        </motion.div>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <RenewPlanModal
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
          hotelId={user?.hotelId || user?.id}
          hotelName={user?.hotelName || "Hotel"}
          ownerEmail={user?.email}
          currentPlanName={subscription?.planName}
          onSuccess={() => {
            setShowRenewModal(false);
          }}
        />
      )}
    </div>
  );
}

