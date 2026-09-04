"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FileBarChart2,
  Calendar,
  Download,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  Play,
  Briefcase,
  PieChart as PieIcon,
  RefreshCcw,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Pagination from "@/components/shared/Pagination";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { SaaSAnalyticsRoute } from "@/routes/saas/analytics/analytics.route";

export default function ReportsView() {
  const [reports, setReports] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [mrrText, setMrrText] = useState("₹21,000");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const isMounted = useIsMounted();

  // Custom generator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [newReportParams, setNewReportParams] = useState({
    name: "",
    type: "Financial",
  });

  const fetchReportsData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await SaaSAnalyticsRoute.getPlatformReports();
      if (res?.data) {
        setReports(res.data.reports || []);
        setRevenueData(res.data.revenueData || []);
        if (res.data.mrr) setMrrText(res.data.mrr);
      }
    } catch (error) {
      console.error("Failed to fetch reports data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || rep.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredReports.length / pageSize) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!newReportParams.name.trim()) {
      alert("Please enter a report name.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await SaaSAnalyticsRoute.generateReport({
        name: newReportParams.name,
        type: newReportParams.type,
      });

      if (res?.data) {
        setReports([res.data, ...reports]);
        setNewReportParams({ name: "", type: "Financial" });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (name) => {
    const csvData = `Report Title,Category,Date,DownloadedAt\n"${name}","Financial","${new Date().toISOString()}","${new Date().toLocaleString()}"`;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 sm:space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileBarChart2 className="text-indigo-600 dark:text-indigo-400 shrink-0" size={28} />
            Platform Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
            Analyze multi-tenant subscription transactions, user growth trends, and generate audited PDF summaries.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchReportsData}
          disabled={loading}
          className="w-full sm:w-auto h-10 rounded-xl border-slate-200 dark:border-slate-800 gap-2 cursor-pointer text-xs sm:text-sm"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh Reports
        </Button>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { label: "Monthly Recurring Revenue", val: mrrText, trend: "+24.5% vs Q1", icon: <TrendingUp className="text-emerald-500" />, trendBg: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" },
          { label: "Enterprise Registrations", val: "62 Tiers", trend: "+12.1% MoM", icon: <ArrowUpRight className="text-emerald-500" />, trendBg: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" },
          { label: "Active Subscriptions", val: "99.4% Uptime", trend: "0.01% Latency Variance", icon: <CheckCircle className="text-indigo-500" />, trendBg: "bg-indigo-50 text-indigo-850 dark:bg-indigo-500/10 dark:text-indigo-400" },
          { label: "Support Resolution Rate", val: "18.5 min", trend: "-4.2 min decline", icon: <TrendingDown className="text-rose-500" />, trendBg: "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">{stat.label}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${stat.trendBg}`}>
                {stat.icon}
                {stat.trend}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2 sm:mt-3">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Visual Analytics Graphs using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col h-80 sm:h-96">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Monthly Recurring Revenue Growth</h3>
              <p className="text-xs text-slate-400">Total platforms earnings accrued across active subscription plans.</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">Year 2026</span>
          </div>

          <div className="flex-1 w-full text-xs">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Dynamic New Reports Generator */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-indigo-600" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Instant Report Generator</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 sm:mb-6">
              Select variables and generate a filtered analytics spreadsheet immediately available for download.
            </p>

            <form onSubmit={handleGenerateReport} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Report Title Name</label>
                <Input
                  value={newReportParams.name}
                  onChange={(e) => setNewReportParams({ ...newReportParams, name: e.target.value })}
                  placeholder="E.g., Q2 Customer SLA Speed"
                  className="mt-1.5 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-semibold">Report Audit Category</label>
                <select
                  value={newReportParams.type}
                  onChange={(e) => setNewReportParams({ ...newReportParams, type: e.target.value })}
                  className="w-full mt-1.5 h-10 px-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="Financial" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Financial Audits</option>
                  <option value="Platform Activity" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Platform Activity Logs</option>
                  <option value="Customer Support" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Customer Support Speeds</option>
                  <option value="Projections" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Projections &amp; Estimates</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full h-10 rounded-lg bg-slate-900 hover:bg-slate-950 text-white font-bold cursor-pointer transition-all shadow-md mt-2 flex items-center justify-center gap-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-xs sm:text-sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw size={16} className="animate-spin" />
                    Generating Audit...
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    Trigger Compilation
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 leading-normal font-medium mt-4">
            Generated sheets comply strictly with international multi-tenant financial privacy SLA provisions.
          </div>
        </div>
      </div>

      {/* Reports Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search past logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto table-scrollbar pb-1 sm:pb-0">
            {["all", "Financial", "Platform Activity", "Customer Support"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold border transition-all cursor-pointer shrink-0 ${
                  filterType === type
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Table */}
        <div className="flex-1 overflow-x-auto table-scrollbar relative">
          {loading ? (
            <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading compiled reports...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-xs">
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-4 sm:pl-6">Compiled Sheet Document Name</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Report Category</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Author Init</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Compilation Date</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Status</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-4 sm:pr-6">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {paginatedReports.map((rep) => (
                  <tr key={rep._id || rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="p-4 pl-4 sm:pl-6 font-bold text-slate-900 dark:text-white max-w-sm truncate">
                      {rep.name}
                    </td>
                    <td className="p-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {rep.type}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {rep.generatedBy}
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {rep.date}
                    </td>
                    <td className="p-4 text-xs text-slate-500 font-mono font-bold">
                      {rep.size}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          rep.status === "Completed"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 animate-pulse"
                        }`}
                      >
                        {rep.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-4 sm:pr-6">
                      {rep.status === "Completed" ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleDownload(rep.name)}
                          className="h-8 px-2.5 sm:px-3 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 font-bold text-xs cursor-pointer"
                        >
                          <Download size={13} />
                          Export
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">Pending...</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 sm:p-10 text-center text-slate-400 text-sm font-medium">
                      No generated sheets logged in the archives.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredReports.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
