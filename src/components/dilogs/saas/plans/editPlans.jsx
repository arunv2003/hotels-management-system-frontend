"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plans } from "@/routes/saas/plans/plans.route";

export default function EditPlanDialog({ isOpen, onClose, plan, getAllPlans }) {
  const [formData, setFormData] = useState({
    name: "",
    halfYearlyPrice: "",
    yearlyPrice: "",
    status: "Active",
    maxStaff: "",
    maxDailyBookings: "",
    description: "",
    features: [""],
    trialDays: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        halfYearlyPrice: plan.halfYearlyPrice ?? "",
        yearlyPrice: plan.yearlyPrice ?? "",
        status: plan.status || "Active",
        maxStaff: plan.maxStaff ?? "",
        maxDailyBookings: plan.maxDailyBookings ?? "",
        description: plan.description || "",
        features:
          Array.isArray(plan.features) && plan.features.length > 0
            ? [...plan.features]
            : [""],
        trialDays: plan.trialDays ?? 0,
      });
      setErrorMessage("");
    }
  }, [plan, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    const numericValue = cleanedValue === "" ? "" : parseFloat(cleanedValue);
    setFormData((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const planId = plan?._id || plan?.id;
      if (!planId) {
        throw new Error("Plan ID is missing");
      }

      // Filter out empty features
      const payload = {
        ...formData,
        features: formData.features.filter((f) => f && f.trim() !== ""),
      };

      await Plans.updatePlan(planId, payload);
      if (getAllPlans) {
        await getAllPlans();
      }
      onClose();
    } catch (error) {
      console.error("Error updating plan:", error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[0.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Edit Plan
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Modify details, pricing and limits for {plan?.name || "this plan"}.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mx-8 mt-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Form Content */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <form
              id="edit-plan-form"
              onSubmit={handleSubmit}
              className="p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Plan Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Premium Plan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Half-Yearly Price (INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-medium">
                      ₹
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="halfYearlyPrice"
                      value={formData.halfYearlyPrice}
                      onChange={handleNumberChange}
                      required
                      placeholder="2999"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Yearly Price (INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-medium">
                      ₹
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="yearlyPrice"
                      value={formData.yearlyPrice}
                      onChange={handleNumberChange}
                      required
                      placeholder="4999"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Active</option>
                    <option value="Inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Inactive</option>
                    <option value="Draft" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Draft</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Max Staff Allowed <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="maxStaff"
                    value={formData.maxStaff}
                    onChange={handleNumberChange}
                    required
                    placeholder="e.g. 10"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Max Daily Bookings <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="maxDailyBookings"
                    value={formData.maxDailyBookings}
                    onChange={handleNumberChange}
                    required
                    placeholder="e.g. 50"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Trial Days Allowed
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="trialDays"
                    value={formData.trialDays}
                    onChange={handleNumberChange}
                    placeholder="e.g. 14"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of who this plan is for..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Plan Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={14} /> Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 group">
                      <div className="flex-1 relative">
                        <CheckCircle2
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
                          size={18}
                        />
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            handleFeatureChange(index, e.target.value)
                          }
                          placeholder="e.g. Unlimited room categories"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                        />
                      </div>
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="w-12 flex-shrink-0 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
              className="h-12 px-6 rounded-xl font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-plan-form"
              disabled={loading}
              className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
