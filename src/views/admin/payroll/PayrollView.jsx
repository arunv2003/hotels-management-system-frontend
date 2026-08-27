"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  DollarSign,
  CheckCircle2,
  Clock,
  Plus,
  Zap,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Printer,
  X,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { payrollRoute } from "@/routes/business/payrollRoute";
import { StaffRoute } from "@/routes/hotels/staff/staff.route";
import { useToast } from "@/hooks/use-toast";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PayrollView() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // States
  const [salarySlips, setSalarySlips] = useState([]);
  const [summary, setSummary] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSlip, setEditingSlip] = useState(null);
  const [viewingSlip, setViewingSlip] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    staffId: "",
    month: currentMonth,
    year: currentYear,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    paymentStatus: "Unpaid",
  });

  const [bulkFormData, setBulkFormData] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const [actionLoading, setActionLoading] = useState(false);

  // Load Data
  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const params = {
        year: selectedYear,
        ...(selectedMonth ? { month: selectedMonth } : {}),
        ...(paymentStatusFilter !== "all" ? { paymentStatus: paymentStatusFilter } : {}),
        ...(search ? { search } : {}),
      };

      const res = await payrollRoute.getSalarySlips(params);
      if (res && res.success !== false) {
        setSalarySlips(res.data?.salarySlips || []);
      } else {
        setSalarySlips([]);
      }
    } catch (err) {
      console.error("Error fetching salary slips:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to load salary slips.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const params = {
        year: selectedYear,
        ...(selectedMonth ? { month: selectedMonth } : {}),
      };
      const res = await payrollRoute.getPayrollSummary(params);
      if (res && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error("Error fetching payroll summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await StaffRoute.getAllStaff();
      const staffArr = res.data || res.staffs || (Array.isArray(res) ? res : []);
      setStaffList(staffArr);
    } catch (err) {
      console.error("Error fetching staff list:", err);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    fetchPayrollData();
    fetchSummary();
  }, [selectedMonth, selectedYear, paymentStatusFilter, search]);

  // Calculations for Form
  const calculatedNetSalary =
    Math.max(
      0,
      Number(formData.basicSalary || 0) +
        Number(formData.allowances || 0) -
        Number(formData.deductions || 0)
    );

  const handleStaffSelect = (staffId) => {
    const selected = staffList.find((s) => s._id === staffId);
    setFormData((prev) => ({
      ...prev,
      staffId,
      basicSalary: selected?.salary || prev.basicSalary || 15000,
    }));
  };

  // Handlers
  const handleOpenCreateModal = (slip = null) => {
    if (slip) {
      setEditingSlip(slip);
      setFormData({
        staffId: slip.staffId?._id || slip.staffId || "",
        month: slip.month,
        year: slip.year,
        basicSalary: slip.basicSalary,
        allowances: slip.allowances,
        deductions: slip.deductions,
        paymentStatus: slip.paymentStatus,
      });
    } else {
      setEditingSlip(null);
      setFormData({
        staffId: staffList[0]?._id || "",
        month: currentMonth,
        year: currentYear,
        basicSalary: staffList[0]?.salary || 15000,
        allowances: 0,
        deductions: 0,
        paymentStatus: "Unpaid",
      });
    }
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingSlip) {
        const res = await payrollRoute.updateSalarySlip(editingSlip._id, formData);
        if (res && res.success !== false) {
          toast({
            title: "Success",
            description: "Salary slip updated successfully.",
          });
          setIsCreateModalOpen(false);
          fetchPayrollData();
          fetchSummary();
        } else {
          toast({
            title: "Error",
            description: res?.message || "Failed to update salary slip.",
            variant: "destructive",
          });
        }
      } else {
        const res = await payrollRoute.createSalarySlip(formData);
        if (res && res.success !== false) {
          toast({
            title: "Success",
            description: "Salary slip created successfully.",
          });
          setIsCreateModalOpen(false);
          fetchPayrollData();
          fetchSummary();
        } else {
          toast({
            title: "Error",
            description: res?.message || "Failed to create salary slip.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkGenerate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await payrollRoute.bulkGenerateSalarySlips(bulkFormData);
      if (res && res.success !== false) {
        toast({
          title: "Bulk Generation Complete",
          description: res.message || `Salary slips generated successfully.`,
        });
        setIsBulkModalOpen(false);
        fetchPayrollData();
        fetchSummary();
      } else {
        toast({
          title: "Error",
          description: res?.message || "Failed to generate bulk salary slips.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to auto-generate salary slips.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (slip) => {
    const newStatus = slip.paymentStatus === "Paid" ? "Unpaid" : "Paid";
    try {
      const res = await payrollRoute.updatePaymentStatus(slip._id, newStatus);
      if (res && res.success !== false) {
        toast({
          title: `Status Changed`,
          description: `Salary slip marked as ${newStatus}.`,
        });
        fetchPayrollData();
        fetchSummary();
      } else {
        toast({
          title: "Error",
          description: res?.message || "Failed to update status.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Could not update payment status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary slip record?")) return;
    try {
      const res = await payrollRoute.deleteSalarySlip(id);
      if (res && res.success !== false) {
        toast({
          title: "Deleted",
          description: "Salary slip deleted successfully.",
        });
        fetchPayrollData();
        fetchSummary();
      } else {
        toast({
          title: "Error",
          description: res?.message || "Failed to delete salary slip.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Could not delete salary slip.",
        variant: "destructive",
      });
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Payroll Management
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage staff salaries, calculate monthly allowances & deductions, and track payment disbursements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Auto-Generate Monthly Slips
          </button>
          <button
            onClick={() => handleOpenCreateModal()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            New Salary Slip
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Payroll Expense
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {summaryLoading ? "..." : formatCurrency(summary?.totalPayrollCost)}
            </h3>
            <p className="text-xs text-slate-400">Total net pay for selected period</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Disbursed (Paid)
            </span>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {summaryLoading ? "..." : formatCurrency(summary?.totalPaid)}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {summary?.paidCount || 0} slip(s) paid
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Disbursal
            </span>
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {summaryLoading ? "..." : formatCurrency(summary?.totalUnpaid)}
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              {summary?.unpaidCount || 0} slip(s) unpaid
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Staff Members
            </span>
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {summaryLoading ? "..." : summary?.activeStaffCount || staffList.length || 0}
            </h3>
            <p className="text-xs text-slate-400">Eligible for monthly salary</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
            <User className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="">All Months</option>
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setSelectedMonth("");
              setSelectedYear(String(currentYear));
              setPaymentStatusFilter("all");
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Salary Slips Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            Loading salary slips...
          </div>
        ) : salarySlips.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
              No Salary Slips Found
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              No salary slips match your filter criteria. Click &quot;Auto-Generate Monthly Slips&quot; or &quot;New Salary Slip&quot; to create payroll entries.
            </p>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-sm inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Auto-Generate Slips
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Basic Pay</th>
                  <th className="px-6 py-4">Allowances</th>
                  <th className="px-6 py-4">Deductions</th>
                  <th className="px-6 py-4">Net Salary</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {salarySlips.map((slip) => {
                  const staff = slip.staffId;
                  const staffName =
                    staff?.fullName ||
                    `${staff?.firstName || ""} ${staff?.lastName || ""}`.trim() ||
                    "Unknown Staff";
                  const isPaid = slip.paymentStatus === "Paid";

                  return (
                    <tr
                      key={slip._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                            {staffName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {staffName}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                              <span>Code: {staff?.staffCode || "N/A"}</span>
                              {staff?.designation && (
                                <span>• {staff.designation}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {MONTH_NAMES[slip.month - 1]} {slip.year}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {formatCurrency(slip.basicSalary)}
                      </td>

                      <td className="px-6 py-4 text-emerald-600 font-medium">
                        +{formatCurrency(slip.allowances)}
                      </td>

                      <td className="px-6 py-4 text-rose-600 font-medium">
                        -{formatCurrency(slip.deductions)}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(slip.netSalary)}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(slip)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            isPaid
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                          }`}
                          title="Click to toggle status"
                        >
                          {isPaid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          {slip.paymentStatus}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setViewingSlip(slip);
                              setIsViewModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                            title="View / Print Payslip"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenCreateModal(slip)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                            title="Edit Slip"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(slip._id)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 transition-colors"
                            title="Delete Slip"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Salary Slip Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                  {editingSlip ? "Edit Salary Slip" : "Create New Salary Slip"}
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Staff Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Select Staff Member
                  </label>
                  <select
                    disabled={!!editingSlip}
                    value={formData.staffId}
                    onChange={(e) => handleStaffSelect(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  >
                    <option value="" disabled>
                      Select Staff...
                    </option>
                    {staffList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.fullName || `${s.firstName || ""} ${s.lastName || ""}`} ({s.staffCode || "No Code"}) - {s.designation || "Staff"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Period (Month & Year) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Month
                    </label>
                    <select
                      disabled={!!editingSlip}
                      value={formData.month}
                      onChange={(e) => setFormData((prev) => ({ ...prev, month: Number(e.target.value) }))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    >
                      {MONTH_NAMES.map((name, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Year
                    </label>
                    <select
                      disabled={!!editingSlip}
                      value={formData.year}
                      onChange={(e) => setFormData((prev) => ({ ...prev, year: Number(e.target.value) }))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    >
                      {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Basic Salary (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.basicSalary}
                      onChange={(e) => setFormData((prev) => ({ ...prev, basicSalary: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-emerald-600 mb-1">
                        Allowances (+) (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.allowances}
                        onChange={(e) => setFormData((prev) => ({ ...prev, allowances: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-rose-600 mb-1">
                        Deductions (-) (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.deductions}
                        onChange={(e) => setFormData((prev) => ({ ...prev, deductions: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculated Net Pay Highlight */}
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    Calculated Net Pay:
                  </span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(calculatedNetSalary)}
                  </span>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Disbursal Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  >
                    <option value="Unpaid">Unpaid / Pending</option>
                    <option value="Paid">Paid / Disbursed</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md"
                  >
                    {actionLoading ? "Saving..." : editingSlip ? "Update Slip" : "Save Salary Slip"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auto-Generate Bulk Payroll Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Auto-Generate Monthly Payroll
                </h3>
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                This will automatically generate unpaid salary slips for all active staff members based on their configured default base salary for the selected month.
              </p>

              <form onSubmit={handleBulkGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Select Target Month
                  </label>
                  <select
                    value={bulkFormData.month}
                    onChange={(e) => setBulkFormData((prev) => ({ ...prev, month: Number(e.target.value) }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Select Target Year
                  </label>
                  <select
                    value={bulkFormData.year}
                    onChange={(e) => setBulkFormData((prev) => ({ ...prev, year: Number(e.target.value) }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  >
                    {[currentYear - 1, currentYear, currentYear + 1].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md flex items-center gap-2"
                  >
                    {actionLoading ? "Generating..." : "Generate Payroll"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printable Payslip View Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewingSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl space-y-6 print:shadow-none print:p-0 print:m-0"
            >
              {/* Modal Actions */}
              <div className="flex items-center justify-between border-b pb-4 print:hidden">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Official Salary Payslip
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintSlip}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-md"
                  >
                    <Printer className="w-4 h-4" /> Print Payslip
                  </button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                      PAYROLL SALARY SLIP
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Statement of Earnings & Deductions
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase border bg-slate-100 border-slate-200 text-slate-700">
                      {MONTH_NAMES[viewingSlip.month - 1]} {viewingSlip.year}
                    </span>
                    <p className="text-xs text-slate-400 mt-2 font-mono">
                      Slip ID: {viewingSlip._id?.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Staff & Hotel Metadata */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Employee Details</p>
                    <p className="font-bold text-slate-900">
                      {viewingSlip.staffId?.fullName ||
                        `${viewingSlip.staffId?.firstName || ""} ${viewingSlip.staffId?.lastName || ""}`}
                    </p>
                    <p className="text-xs text-slate-600">
                      Staff Code: <span className="font-mono font-semibold">{viewingSlip.staffId?.staffCode || "N/A"}</span>
                    </p>
                    <p className="text-xs text-slate-600">Designation: {viewingSlip.staffId?.designation || "Staff"}</p>
                    <p className="text-xs text-slate-600">Email: {viewingSlip.staffId?.email || "N/A"}</p>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Payment Info</p>
                    <p className="font-bold text-emerald-600 uppercase">
                      Status: {viewingSlip.paymentStatus}
                    </p>
                    {viewingSlip.paymentDate && (
                      <p className="text-xs text-slate-600">
                        Paid On: {new Date(viewingSlip.paymentDate).toLocaleDateString("en-IN")}
                      </p>
                    )}
                    <p className="text-xs text-slate-600">
                      Generated: {new Date(viewingSlip.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Breakdown Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                      <tr>
                        <th className="px-4 py-3">Earnings / Item</th>
                        <th className="px-4 py-3 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3 font-medium text-slate-700">Basic Salary</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatCurrency(viewingSlip.basicSalary)}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-emerald-600">Allowances (+)</td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600">+{formatCurrency(viewingSlip.allowances)}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-rose-600">Deductions (-)</td>
                        <td className="px-4 py-3 text-right font-semibold text-rose-600">-{formatCurrency(viewingSlip.deductions)}</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-indigo-50 border-t border-indigo-100 font-bold text-slate-900">
                      <tr>
                        <td className="px-4 py-3.5 text-base">Net Payable Salary</td>
                        <td className="px-4 py-3.5 text-right text-lg text-indigo-700">{formatCurrency(viewingSlip.netSalary)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer Signatures */}
                <div className="pt-8 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-600">Computer Generated Document</p>
                    <p>No signature required for digital slip verification.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-600">Authorized Signature</p>
                    <p className="mt-4 border-t border-slate-300 pt-1">Hotel Management System</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
