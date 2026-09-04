"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Users,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Download,
  Plus,
  Eye,
  Trash2,
  Edit2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AddPlanDialog from "@/components/dilogs/saas/plans/addPlans";
import EditPlanDialog from "@/components/dilogs/saas/plans/editPlans";
import { Plans } from "@/routes/saas/plans/plans.route";
import Pagination from "@/components/shared/Pagination";

export default function PlanTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, seDesable] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const limit = 5;

  const getAllPlans = async () => {
    try {
      setLoading(true);
      const result = await Plans.getAllPlans();
      setPlans(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPlans();
  }, []);

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditPlanOpen(true);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this subscription plan?")) {
      return;
    }
    setDeletingId(planId);
    try {
      await Plans.deletePlan(planId);
      await getAllPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert(error.response?.data?.message || "Failed to delete plan.");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Fix: Handle popular toggle
  const handlePopularToggle = async (planId) => {
    seDesable(true);
    try {
      const result = await Plans.makePopular(planId);
      getAllPlans();
    } catch (error) {
      console.error("Error toggling popular status:", error);
    } finally {
      seDesable(false);
    }
  };

  const filteredPlans = plans?.filter((plan) =>
    plan.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredPlans.length / limit);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Plans Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your Plans and pricing across all properties.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="h-10 sm:h-11 rounded-xl gap-2 font-bold text-xs sm:text-sm cursor-pointer flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button
            className="h-10 sm:h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 cursor-pointer flex-1 sm:flex-none"
            onClick={() => setIsAddPlanOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Plans",
            value: plans.length,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
          },
          {
            label: "Active Plans",
            value: plans.filter((p) => p?.status === "Active").length,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "Inactive Plans",
            value: plans.filter((p) => p?.status === "Inactive").length,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
          {
            label: "Popular Plans",
            value: plans.filter((p) => p?.isPopular === true).length,
            icon: Building,
            color: "text-rose-600",
            bg: "bg-rose-50 dark:bg-rose-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                stat.bg,
              )}
            >
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2 font-bold text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Filter className="w-4 h-4" /> Filters
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 rounded-xl p-0 flex-none"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto table-scrollbar relative">
          <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-[750px]">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
              <tr>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Plan Name
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Max Staff
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Daily Bookings
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Half-Yearly Price
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Yearly Price
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Trial Days
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Status
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Popular
                </th>
                <th className="px-4 py-2.5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginatedPlans.map((plan, i) => (
                <motion.tr
                  key={plan._id || plan.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-sm">
                        {plan.name?.charAt(0) || "P"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-none text-sm">
                          {plan.name}
                        </p>
                        {plan.description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {plan.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-xs text-slate-500 dark:text-slate-400">
                      {plan.maxStaff || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-xs text-slate-500 dark:text-slate-400">
                      {plan.maxDailyBookings || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      ₹{plan.halfYearlyPrice}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      ₹{plan.yearlyPrice}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-xs text-slate-500 dark:text-slate-400">
                      {plan.trialDays || 0} days
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        plan.status === "Active"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                          : "bg-rose-50 dark:bg-rose-500/10 text-rose-600",
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {plan.status || "Inactive"}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={disable}
                        className="sr-only peer"
                        checked={plan.isPopular || false}
                        onChange={() => handlePopularToggle(plan._id)}
                      />
                      {/* Direct conditional classes - No peer-checked dependency */}
                      <div
                        className={cn(
                          "w-9 h-5 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm",
                          plan.isPopular
                            ? "bg-green-600 after:translate-x-4"
                            : "bg-gray-300 dark:bg-gray-600 after:translate-x-0",
                        )}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditPlan(plan)}
                        title="View Plan Details"
                        className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditPlan(plan)}
                        title="Edit Plan"
                        className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === (plan._id || plan.id)}
                        onClick={() => handleDeletePlan(plan._id || plan.id)}
                        title="Delete Plan"
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredPlans.length === 0 && !loading && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Plans Found
              </h3>
              <p className="text-slate-400 text-sm">
                We couldn&apos;t find any plan matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Table Pagination */}
        {filteredPlans.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPlans.length}
            pageSize={limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AddPlanDialog
        isOpen={isAddPlanOpen}
        getAllPlans={getAllPlans}
        onClose={() => setIsAddPlanOpen(false)}
      />

      <EditPlanDialog
        isOpen={isEditPlanOpen}
        plan={selectedPlan}
        getAllPlans={getAllPlans}
        onClose={() => {
          setIsEditPlanOpen(false);
          setSelectedPlan(null);
        }}
      />
    </div>
  );
}
