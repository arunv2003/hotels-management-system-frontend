"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  Calendar,
  KeyRound,
  CheckCircle2,
  Copy,
  RefreshCw,
  LogOut,
  Sparkles,
  MapPin,
  FileText,
  BedDouble,
  Briefcase,
  SlidersHorizontal,
  Clock,
  Award,
  Layers
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { superAdminRouted } from "@/routes/saas/auth/superadminlogin";
import { useToast } from "@/hooks/use-toast";

export default function ProfileDetailView() {
  const { user: storeUser, logout } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [profile, setProfile] = useState(storeUser || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  const fetchLatestProfile = async () => {
    setLoading(true);
    try {
      const res = await superAdminRouted.getProfile();
      if (res && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.log("Could not refresh profile from server, using local store data:", err);
      if (storeUser) setProfile(storeUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestProfile();
  }, []);

  const currentUser = profile || storeUser;

  const handleCopyId = () => {
    if (currentUser?.id || currentUser?._id) {
      navigator.clipboard.writeText(currentUser.id || currentUser._id);
      toast({
        title: "Copied!",
        description: "Account ID copied to clipboard",
        variant: "default",
      });
    }
  };

  const getRoleBadgeColor = (type) => {
    const raw = String(type || "").toLowerCase();
    if (raw.includes("super")) return "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    if (raw.includes("owner") || raw.includes("hotel")) return "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    if (raw.includes("employee")) return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  };

  const formattedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderPermissionsList = () => {
    const perms = currentUser?.permissions;
    if (perms === "ALL" || currentUser?.userType === "super-admin" || currentUser?.userType === "hotel-owner") {
      return (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base">Full Administrative Access</h4>
            <p className="text-sm opacity-90">
              This account has unrestricted global permissions across all modules and functions.
            </p>
          </div>
        </div>
      );
    }

    if (!perms || (typeof perms === "object" && Object.keys(perms).length === 0)) {
      return (
        <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
          No specific custom permissions configured.
        </div>
      );
    }

    if (typeof perms === "object" && !Array.isArray(perms)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(perms).map(([moduleName, actions]) => (
            <div key={moduleName} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {moduleName.replace("_", " ")}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium border border-indigo-200 dark:border-indigo-800">
                  {Array.isArray(actions) ? `${actions.length} action(s)` : "Active"}
                </span>
              </div>
              {Array.isArray(actions) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {actions.map((act) => (
                    <span key={act} className="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {act}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (Array.isArray(perms)) {
      return (
        <div className="flex flex-wrap gap-2">
          {perms.map((p, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-sm font-medium">
              {typeof p === "object" ? p.name || JSON.stringify(p) : p}
            </span>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-2xl border border-slate-800"
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-extrabold text-4xl text-white tracking-wider">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full" title="Online" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  {currentUser?.name || "Logged In User"}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleBadgeColor(currentUser?.userType || currentUser?.role)}`}>
                  {String(currentUser?.userType || currentUser?.role?.name || currentUser?.role || "User").replace("_", " ")}
                </span>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                {currentUser?.email || "No email provided"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Joined: {formattedDate(currentUser?.createdAt)}
                </span>
                {currentUser?.hotelName && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Building2 className="w-3.5 h-3.5" />
                    {currentUser.hotelName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
            <button
              onClick={fetchLatestProfile}
              disabled={loading}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleCopyId}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Copy className="w-4 h-4" />
              Copy ID
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2.5 font-medium text-sm rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <User className="w-4 h-4" />
          Account Overview
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-5 py-2.5 font-medium text-sm rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "permissions"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Shield className="w-4 h-4" />
          Roles & Permissions
        </button>
        {currentUser?.hotelId && (
          <button
            onClick={() => setActiveTab("hotel")}
            className={`px-5 py-2.5 font-medium text-sm rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "hotel"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Hotel Details
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                Personal Information
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white text-right">
                  {currentUser?.name || `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || "N/A"}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white text-right">
                  {currentUser?.email || "N/A"}
                </span>
              </div>

              {currentUser?.phone && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white text-right">
                    {currentUser.phone}
                  </span>
                </div>
              )}

              {currentUser?.employeeCode && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Employee Code
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white text-right font-mono">
                    {currentUser.employeeCode}
                  </span>
                </div>
              )}

              {currentUser?.staffCode && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Staff Code
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white text-right font-mono">
                    {currentUser.staffCode}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-400" /> User ID
                </span>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {currentUser?.id || currentUser?._id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Metadata */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                Account & Role Status
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" /> Role Designation
                </span>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                  {typeof currentUser?.role === "object" && currentUser?.role?.name
                    ? currentUser.role.name
                    : String(currentUser?.userType || currentUser?.role || "N/A").replace("_", " ")}
                </span>
              </div>

              {currentUser?.department && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400" /> Department
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {currentUser.department}
                  </span>
                </div>
              )}

              {currentUser?.designation && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-400" /> Designation
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {currentUser.designation}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" /> Account Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> Created At
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {formattedDate(currentUser?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "permissions" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                  Granted Access & Module Permissions
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed view of system module permissions assigned to this user profile.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {renderPermissionsList()}
          </div>
        </motion.div>
      )}

      {activeTab === "hotel" && currentUser?.hotelId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                Hotel Profile Details
              </h3>
              <p className="text-xs text-slate-500">
                Associated hotel property details for this logged in account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" /> Hotel Name
              </span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {currentUser?.hotelName || "N/A"}
              </p>
            </div>

            {currentUser?.hotelType && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Property Type
                </span>
                <p className="font-semibold text-slate-900 dark:text-white capitalize">
                  {currentUser.hotelType}
                </p>
              </div>
            )}

            {currentUser?.totalRooms && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <BedDouble className="w-3.5 h-3.5 text-indigo-500" /> Total Rooms
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {currentUser.totalRooms} Rooms
                </p>
              </div>
            )}

            {currentUser?.fullAddress && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 col-span-1 md:col-span-2">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Location / Address
                </span>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  {currentUser.fullAddress}, {currentUser.city}, {currentUser.state} - {currentUser.pincode}
                </p>
              </div>
            )}

            {currentUser?.gstNumber && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> GST Number
                </span>
                <p className="font-mono font-semibold text-slate-900 dark:text-white text-sm">
                  {currentUser.gstNumber}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
