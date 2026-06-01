"use client";
import React, { useState } from "react";
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Percent,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  X,
  PlayCircle,
  PauseCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_COUPONS = [
  {
    id: "cp-1",
    code: "HMSWELCOME30",
    discountType: "Percentage",
    discountValue: 30,
    minPurchase: 100,
    usageLimit: 200,
    usedCount: 142,
    expiryDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "cp-2",
    code: "LAUNCH500",
    discountType: "Fixed Amount",
    discountValue: 500,
    minPurchase: 2000,
    usageLimit: 50,
    usedCount: 48,
    expiryDate: "2026-06-30",
    status: "Active",
  },
  {
    id: "cp-3",
    code: "FESTIVE15",
    discountType: "Percentage",
    discountValue: 15,
    minPurchase: 50,
    usageLimit: 1000,
    usedCount: 889,
    expiryDate: "2026-05-15",
    status: "Expired",
  },
  {
    id: "cp-4",
    code: "SUMMERSPECIAL",
    discountType: "Percentage",
    discountValue: 20,
    minPurchase: 300,
    usageLimit: 500,
    usedCount: 120,
    expiryDate: "2026-08-31",
    status: "Paused",
  },
];

export default function CouponsView() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
 const [currentCoupon, setCurrentCoupon] = useState(() => ({
  id: "",
  code: "",
  discountType: "Percentage",
  discountValue: 10,
  minPurchase: 0,
  usageLimit: 100,
  usedCount: 0,
  expiryDate: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0],
  status: "Active",
}));

  const filteredCoupons = coupons.filter((cp) => {
    const matchesSearch = cp.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || cp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "HMS";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCoupon({ ...currentCoupon, code: code });
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentCoupon({
      id: `cp-${Date.now()}`,
      code: "",
      discountType: "Percentage",
      discountValue: 10,
      minPurchase: 0,
      usageLimit: 100,
      usedCount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Active",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (cp) => {
    setIsEditMode(true);
    setCurrentCoupon({ ...cp });
    setIsOpen(true);
  };

  const toggleCouponStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Paused" : "Active";
    setCoupons(
      coupons.map((cp) => (cp.id === id ? { ...cp, status: nextStatus } : cp))
    );
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((cp) => cp.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentCoupon.code.trim()) {
      alert("Please enter a valid coupon code.");
      return;
    }
    if (currentCoupon.discountValue <= 0) {
      alert("Please enter a discount value greater than 0.");
      return;
    }

    if (isEditMode) {
      setCoupons(coupons.map((cp) => (cp.id === currentCoupon.id ? currentCoupon : cp)));
    } else {
      setCoupons([currentCoupon, ...coupons]);
    }
    setIsOpen(false);
  };

  // Metrics
  const activeCount = coupons.filter((c) => c.status === "Active").length;
  const totalClaims = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Tag className="text-indigo-650 dark:text-indigo-400" size={32} />
            Promo Coupons
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure discount promo codes to incentivize platform registration and annual subscription upgrades.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold text-sm shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <Plus size={18} />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Coupons", val: coupons.length, icon: <Tag className="text-indigo-600" /> },
          { label: "Active Campaign", val: activeCount, icon: <Sparkles className="text-emerald-600" /> },
          { label: "Total Claims", val: totalClaims, icon: <Layers className="text-sky-600" /> },
          { label: "Conversion Rate", val: `${Math.round((totalClaims / (coupons.reduce((s, c) => s + c.usageLimit, 0) || 1)) * 100)}%`, icon: <Percent className="text-amber-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-105 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-955 dark:text-white mt-1">{stat.val}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Grid and Table layout */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <Input
              placeholder="Search coupon codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Active", "Paused", "Expired"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-xs px-4 py-2 rounded-xl font-bold border transition-all ${
                  filterStatus === status
                    ? "bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-650"
                    : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table representation */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-105 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Coupon Code &amp; Type</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Discount Rate</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Min. Purchase Required</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry Date</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Usage Status (Used / Limit)</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Status</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredCoupons.map((cp) => (
                <tr key={cp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="p-4.5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight font-mono text-sm uppercase tracking-wider">{cp.code}</p>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 block">
                          {cp.discountType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4.5 font-bold text-slate-800 dark:text-slate-200">
                    <span className="inline-flex items-center gap-0.5">
                      {cp.discountType === "Percentage" ? (
                        <>
                          {cp.discountValue}
                          <Percent size={14} className="text-slate-400" />
                        </>
                      ) : (
                        <>
                          <DollarSign size={14} className="text-slate-400" />
                          {cp.discountValue}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4.5 text-sm font-semibold text-slate-700 dark:text-slate-350">
                    ${cp.minPurchase}
                  </td>
                  <td className="p-4.5 text-sm text-slate-500 dark:text-slate-450 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      {cp.expiryDate}
                    </span>
                  </td>
                  <td className="p-4.5">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>{cp.usedCount} used</span>
                        <span>{cp.usageLimit} limit</span>
                      </div>
                      <div className="w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-650"
                          style={{ width: `${Math.min((cp.usedCount / cp.usageLimit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        cp.status === "Active"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                          : cp.status === "Paused"
                          ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                          : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                      }`}
                    >
                      {cp.status}
                    </span>
                  </td>
                  <td className="p-4.5 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => toggleCouponStatus(cp.id, cp.status)}
                        className={`h-8.5 w-8.5 p-0 rounded-lg ${
                          cp.status === "Active"
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                            : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                        }`}
                        title={cp.status === "Active" ? "Pause Coupon" : "Activate Coupon"}
                      >
                        {cp.status === "Active" ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleOpenEdit(cp)}
                        className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-indigo-650 hover:bg-slate-105 dark:hover:bg-slate-800"
                      >
                        <Edit2 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(cp.id)}
                        className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-105 dark:hover:bg-slate-800"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-400 text-sm font-medium">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-600" />
                  {isEditMode ? `Edit Coupon: ${currentCoupon.code}` : "Create Promotional Coupon"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-550"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4.5">
                <div>
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    <span>Coupon Promo Code</span>
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-[10px] text-indigo-600 hover:text-indigo-850 dark:text-indigo-400 hover:underline font-bold"
                    >
                      Generate Code
                    </button>
                  </label>
                  <Input
                    value={currentCoupon.code}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="E.g., WELCOME2026"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800 font-mono tracking-widest text-sm uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Discount Type</label>
                    <select
                      value={currentCoupon.discountType}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed Amount">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Discount Value</label>
                    <Input
                      type="number"
                      value={currentCoupon.discountValue}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountValue: Number(e.target.value) })}
                      placeholder="Value"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Min. Purchase Limit ($)</label>
                    <Input
                      type="number"
                      value={currentCoupon.minPurchase}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, minPurchase: Number(e.target.value) })}
                      placeholder="E.g., 100"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Usage Limit (Max Claims)</label>
                    <Input
                      type="number"
                      value={currentCoupon.usageLimit}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, usageLimit: Number(e.target.value) })}
                      placeholder="E.g., 500"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Expiry Date</label>
                    <Input
                      type="date"
                      value={currentCoupon.expiryDate}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, expiryDate: e.target.value })}
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Initial Status</label>
                    <select
                      value={currentCoupon.status}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, status: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                    >
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex gap-3 text-xs text-slate-500 font-medium">
                  <AlertCircle className="text-indigo-500 shrink-0" size={16} />
                  <p className="leading-relaxed">
                    This coupon will apply a {currentCoupon.discountValue}{currentCoupon.discountType === "Percentage" ? "%" : "$"} discount
                    on invoices {currentCoupon.minPurchase > 0 ? `above $${currentCoupon.minPurchase}` : "with no minimum value requirement"}.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="h-11 rounded-xl px-5 text-slate-500 dark:text-slate-400 font-semibold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md"
                  >
                    {isEditMode ? "Save Changes" : "Create Promo Coupon"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
