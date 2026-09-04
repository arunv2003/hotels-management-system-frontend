"use client";
import React, { useState, useEffect } from "react";
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
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { CouponRoutes } from "@/routes/saas/coupons/coupons.route";
import { useToast } from "@/hooks/use-toast";
import Pagination from "@/components/shared/Pagination";

export default function CouponsView() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(() => ({
    _id: "",
    code: "",
    discountType: "Percentage",
    discountValue: 10,
    minPurchase: 0,
    usageLimit: 100,
    usedCount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "Active",
  }));

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await CouponRoutes.getAllCoupons();
      if (res?.data && Array.isArray(res.data)) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to load coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filteredCoupons = coupons.filter((cp) => {
    const code = cp.code || "";
    const matchesSearch = code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || cp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCoupons.length / pageSize) || 1;
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "HMS";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCoupon({ ...currentCoupon, code });
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentCoupon({
      _id: "",
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
    const expDate = cp.expiryDate
      ? new Date(cp.expiryDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setCurrentCoupon({ ...cp, expiryDate: expDate });
    setIsOpen(true);
  };

  const toggleCouponStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Paused" : "Active";
    try {
      setSubmitting(true);
      const res = await CouponRoutes.updateCoupon(id, { status: nextStatus });
      if (res?.data) {
        setCoupons((prev) =>
          prev.map((cp) => ((cp._id || cp.id) === id ? res.data : cp))
        );
      } else {
        setCoupons((prev) =>
          prev.map((cp) => ((cp._id || cp.id) === id ? { ...cp, status: nextStatus } : cp))
        );
      }
      toast({
        title: "Success",
        description: `Coupon ${nextStatus === "Active" ? "activated" : "paused"}`,
      });
    } catch (err) {
      console.error("Failed to toggle coupon status:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update coupon status",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        setSubmitting(true);
        await CouponRoutes.deleteCoupon(id);
        setCoupons((prev) => prev.filter((cp) => (cp._id || cp.id) !== id));
        toast({
          title: "Success",
          description: "Coupon deleted successfully",
        });
      } catch (err) {
        console.error("Failed to delete coupon:", err);
        toast({
          title: "Error",
          description: err?.response?.data?.message || "Failed to delete coupon",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentCoupon.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
      return;
    }
    if (currentCoupon.discountValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a discount value greater than 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        code: currentCoupon.code,
        discountType: currentCoupon.discountType,
        discountValue: Number(currentCoupon.discountValue),
        minPurchase: Number(currentCoupon.minPurchase || 0),
        usageLimit: Number(currentCoupon.usageLimit || 100),
        usedCount: Number(currentCoupon.usedCount || 0),
        expiryDate: currentCoupon.expiryDate || new Date().toISOString().split("T")[0],
        status: currentCoupon.status,
      };

      if (isEditMode) {
        const id = currentCoupon._id || currentCoupon.id;
        const res = await CouponRoutes.updateCoupon(id, payload);
        if (res?.data) {
          setCoupons((prev) =>
            prev.map((cp) => ((cp._id || cp.id) === id ? res.data : cp))
          );
        }
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        });
      } else {
        const res = await CouponRoutes.createCoupon(payload);
        if (res?.data) {
          setCoupons((prev) => [res.data, ...prev]);
        }
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to save coupon:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to save coupon",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics
  const activeCount = coupons.filter((c) => c.status === "Active").length;
  const totalClaims = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Tag className="text-indigo-600 dark:text-indigo-400 w-7 h-7 sm:w-8 sm:h-8" />
            Promo Coupons
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Configure discount promo codes to incentivize platform registration and annual subscription upgrades.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="h-10 sm:h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={18} />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Coupons", val: coupons.length, icon: <Tag className="text-indigo-600" /> },
          { label: "Active Campaign", val: activeCount, icon: <Sparkles className="text-emerald-600" /> },
          { label: "Total Claims", val: totalClaims, icon: <Layers className="text-sky-600" /> },
          { label: "Conversion Rate", val: `${Math.round((totalClaims / (coupons.reduce((s, c) => s + c.usageLimit, 0) || 1)) * 100)}%`, icon: <Percent className="text-amber-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.val}</p>
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
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
         <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <Input
              placeholder="Search coupon codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {["all", "Active", "Paused", "Expired"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold border transition-all ${
                  filterStatus === status
                    ? "bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table representation */}
        <div className="flex-1 overflow-x-auto table-scrollbar relative">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Coupon Code &amp; Type</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Discount Rate</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Min. Purchase Required</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry Date</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Usage Status (Used / Limit)</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Status</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedCoupons.map((cp) => {
                const cpId = cp._id || cp.id;
                const formattedDate = cp.expiryDate
                  ? new Date(cp.expiryDate).toLocaleDateString()
                  : "-";
                const used = cp.usedCount || 0;
                const limit = cp.usageLimit || 1;

                return (
                  <tr key={cpId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
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
                    <td className="p-4.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      ${cp.minPurchase}
                    </td>
                    <td className="p-4.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        {formattedDate}
                      </span>
                    </td>
                    <td className="p-4.5">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                          <span>{used} used</span>
                          <span>{limit} limit</span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600"
                            style={{ width: `${Math.min((used / limit) * 100, 100)}%` }}
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
                          disabled={submitting}
                          variant="ghost"
                          onClick={() => toggleCouponStatus(cpId, cp.status)}
                          className={`h-8.5 w-8.5 p-0 rounded-lg disabled:opacity-50 ${
                            cp.status === "Active"
                              ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                              : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                          }`}
                          title={cp.status === "Active" ? "Pause Coupon" : "Activate Coupon"}
                        >
                          {cp.status === "Active" ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
                        </Button>
                        <Button
                          disabled={submitting}
                          variant="ghost"
                          onClick={() => handleOpenEdit(cp)}
                          className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                        >
                          <Edit2 size={15} />
                        </Button>
                        <Button
                          disabled={submitting}
                          variant="ghost"
                          onClick={() => handleDelete(cpId)}
                          className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-400 text-sm font-medium">
                    {loading ? "Loading coupons..." : "No coupons found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCoupons.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-600" />
                  {isEditMode ? `Edit Coupon: ${currentCoupon.code}` : "Create Promotional Coupon"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4.5">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Coupon Promo Code</span>
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline font-bold"
                    >
                      Generate Code
                    </button>
                  </label>
                  <Input
                    value={currentCoupon.code}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="E.g., WELCOME2026"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-mono tracking-widest text-sm uppercase text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Discount Type</label>
                    <select
                      value={currentCoupon.discountType}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Percentage" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Percentage (%)</option>
                      <option value="Fixed Amount" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Discount Value</label>
                    <Input
                      type="number"
                      value={currentCoupon.discountValue}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountValue: Number(e.target.value) })}
                      placeholder="Value"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Min. Purchase Limit ($)</label>
                    <Input
                      type="number"
                      value={currentCoupon.minPurchase}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, minPurchase: Number(e.target.value) })}
                      placeholder="E.g., 100"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Usage Limit (Max Claims)</label>
                    <Input
                      type="number"
                      value={currentCoupon.usageLimit}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, usageLimit: Number(e.target.value) })}
                      placeholder="E.g., 500"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Expiry Date</label>
                    <Input
                      type="date"
                      value={currentCoupon.expiryDate}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, expiryDate: e.target.value })}
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Initial Status</label>
                    <select
                      value={currentCoupon.status}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, status: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Active</option>
                      <option value="Paused" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Paused</option>
                      <option value="Expired" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <AlertCircle className="text-indigo-500 shrink-0" size={16} />
                  <p className="leading-relaxed">
                    This coupon will apply a {currentCoupon.discountValue}{currentCoupon.discountType === "Percentage" ? "%" : "$"} discount
                    on invoices {currentCoupon.minPurchase > 0 ? `above $${currentCoupon.minPurchase}` : "with no minimum value requirement"}.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
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
                    disabled={submitting}
                    className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting && <Loader className="animate-spin" size={16} />}
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
