"use client";
import React, { useState } from "react";
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
  BarChart,
  Bar,
  Legend,
} from "recharts";

const MOCK_REVENUE_DATA = [
  { month: "Jan", revenue: 4500, registrations: 12 },
  { month: "Feb", revenue: 5800, registrations: 19 },
  { month: "Mar", revenue: 8900, registrations: 26 },
  { month: "Apr", revenue: 12400, registrations: 34 },
  { month: "May", revenue: 16800, registrations: 45 },
  { month: "Jun", revenue: 21000, registrations: 62 },
];

const MOCK_REPORTS_LIST = [
  {
    id: "rep-1",
    name: "Q1 Financial Audit Summary",
    type: "Financial",
    generatedBy: "System Auto",
    date: "2026-04-01",
    status: "Completed",
    size: "1.4 MB",
  },
  {
    id: "rep-2",
    name: "May Tenant Growth Matrix",
    type: "Platform Activity",
    generatedBy: "Admin Staff",
    date: "2026-05-18",
    status: "Completed",
    size: "820 KB",
  },
  {
    id: "rep-3",
    name: "SLA Tickets Resolution Speed Report",
    type: "Customer Support",
    generatedBy: "Lead Engineer",
    date: "2026-05-20",
    status: "Completed",
    size: "2.1 MB",
  },
  {
    id: "rep-4",
    name: "Annual Recurring Subscription Projections",
    type: "Projections",
    generatedBy: "System Auto",
    date: "2026-05-21",
    status: "Pending",
    size: "N/A",
  },
];

export default function ReportsView() {
  const [reports, setReports] = useState(MOCK_REPORTS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Custom generator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [newReportParams, setNewReportParams] = useState({
    name: "",
    type: "Financial",
  });

  const filteredReports = reports.filter((rep) => {
    const matchesSearch = rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rep.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || rep.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!newReportParams.name.trim()) {
      alert("Please enter a report name.");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = {
        id: `rep-${Date.now()}`,
        name: newReportParams.name,
        type: newReportParams.type,
        generatedBy: "Admin Staff",
        date: new Date().toISOString().split("T")[0],
        status: "Completed",
        size: `${(Math.random() * 2 + 0.1).toFixed(1)} MB`,
      };
      setReports([generated, ...reports]);
      setNewReportParams({ name: "", type: "Financial" });
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownload = (name) => {
    alert(`Downloading: ${name}... Simulated file download has started.`);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileBarChart2 className="text-indigo-650 dark:text-indigo-400" size={32} />
            Platform Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Analyze multi-tenant subscription transactions, user growth trends, and generate audited PDF summaries.
          </p>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Monthly Recurring Revenue", val: "$21,000", trend: "+24.5% vs Q1", icon: <TrendingUp className="text-emerald-500" />, trendBg: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" },
          { label: "Enterprise Registrations", val: "62 Tiers", trend: "+12.1% MoM", icon: <ArrowUpRight className="text-emerald-500" />, trendBg: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" },
          { label: "Active Subscriptions", val: "94.2% Uptime", trend: "0.01% Latency Variance", icon: <CheckCircle className="text-indigo-500" />, trendBg: "bg-indigo-50 text-indigo-850 dark:bg-indigo-500/10 dark:text-indigo-400" },
          { label: "Support Resolution Rate", val: "18.5 min", trend: "-4.2 min decline", icon: <TrendingDown className="text-rose-500" />, trendBg: "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">{stat.label}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 ${stat.trendBg}`}>
                {stat.icon}
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-955 dark:text-white mt-3">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Visual Analytics Graphs using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col h-96">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Recurring Revenue Growth</h3>
              <p className="text-xs text-slate-400">Total platforms earnings accrued across active subscription plans.</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">Year 2026</span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          </div>
        </div>

        {/* Dynamic New Reports Generator */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-indigo-600" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Instant Report Generator</h3>
            </div>
            <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed mb-6">
              Select variables and generate a filtered analytics spreadsheet immediately available for download.
            </p>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Title Name</label>
                <Input
                  value={newReportParams.name}
                  onChange={(e) => setNewReportParams({ ...newReportParams, name: e.target.value })}
                  placeholder="E.g., Q2 Customer SLA Speed"
                  className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-semibold">Report Audit Category</label>
                <select
                  value={newReportParams.type}
                  onChange={(e) => setNewReportParams({ ...newReportParams, type: e.target.value })}
                  className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                >
                  <option value="Financial">Financial Audits</option>
                  <option value="Platform Activity">Platform Activity Logs</option>
                  <option value="Customer Support">Customer Support Speeds</option>
                  <option value="Projections">Projections &amp; Estimates</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold cursor-pointer transition-all shadow-md mt-2 flex items-center justify-center gap-2 dark:bg-indigo-600 dark:hover:bg-indigo-755"
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

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 leading-normal font-medium mt-4">
            Generated sheets comply strictly with international multi-tenant financial privacy SLA provisions.
          </div>
        </div>
      </div>

      {/* Reports Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <Input
              placeholder="Search past logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10.5 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-205 dark:border-slate-800"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Financial", "Platform Activity", "Customer Support"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs px-4 py-2 rounded-xl font-bold border transition-all ${
                  filterType === type
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-650 dark:border-indigo-650"
                    : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-105 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Compiled Sheet Document Name</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Report Category</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Author Init</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Compilation Date</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Size</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Status</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-105 dark:divide-slate-800/80">
              {filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-55/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="p-4.5 pl-6 font-bold text-slate-900 dark:text-white max-w-sm truncate">
                    {rep.name}
                  </td>
                  <td className="p-4.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {rep.type}
                  </td>
                  <td className="p-4.5 text-sm font-semibold text-slate-700 dark:text-slate-350">
                    {rep.generatedBy}
                  </td>
                  <td className="p-4.5 text-sm text-slate-500 dark:text-slate-450 font-medium">
                    {rep.date}
                  </td>
                  <td className="p-4.5 text-xs text-slate-500 font-mono font-bold">
                    {rep.size}
                  </td>
                  <td className="p-4.5">
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
                  <td className="p-4.5 text-right pr-6">
                    {rep.status === "Completed" ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleDownload(rep.name)}
                        className="h-8.5 px-3 rounded-lg text-slate-500 hover:text-indigo-650 hover:bg-slate-105 dark:hover:bg-slate-800 flex items-center gap-1 font-bold text-xs"
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
                  <td colSpan="7" className="p-10 text-center text-slate-400 text-sm font-medium">
                    No generated sheets logged in the archives.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
