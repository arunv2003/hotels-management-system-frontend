"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  FileBarChart2,
  Calendar,
  Download,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Bed,
  UtensilsCrossed,
  RefreshCw,
  Plus,
  X,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Trash2,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuthStore } from "@/store/authStore";
import { useIsMounted } from "@/hooks/use-is-mounted";
import Pagination from "@/components/shared/Pagination";

// Live Route Services for Hotel Business Data
import { BookingRoute } from "@/routes/business/bookingRoute";
import { RoomRoute } from "@/routes/business/roomRoute";
import { PosRoute } from "@/routes/business/posRoute";
import { PayrollRoute } from "@/routes/business/payrollRoute";
import { InventoryRoute } from "@/routes/business/inventoryRoute";
import { ReportRoute } from "@/routes/business/reportRoute";

export default function HotelReportsView() {
  const { user } = useAuthStore();
  const isMounted = useIsMounted();

  // Real Database States
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [posOrders, setPosOrders] = useState([]);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Custom Report Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    type: "Financial",
    period: "Year 2026",
  });

  // ── Fetch All Real Hotel Datasets & Generated Reports from Database ────────
  const fetchAllHotelData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        bookingsRes,
        roomsRes,
        posRes,
        payrollRes,
        invStatsRes,
        invItemsRes,
        reportsRes,
      ] = await Promise.allSettled([
        BookingRoute.getBookings(),
        RoomRoute.getRooms(),
        PosRoute.getOrders(),
        PayrollRoute.getPayrollSummary(),
        InventoryRoute.getInventoryStats(),
        InventoryRoute.getInventoryItems(),
        ReportRoute.getReports(),
      ]);

      if (bookingsRes.status === "fulfilled" && bookingsRes.value?.data) {
        setBookings(Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : []);
      } else {
        setBookings([]);
      }

      if (roomsRes.status === "fulfilled" && roomsRes.value?.data) {
        setRooms(Array.isArray(roomsRes.value.data) ? roomsRes.value.data : []);
      } else {
        setRooms([]);
      }

      if (posRes.status === "fulfilled" && posRes.value?.data) {
        setPosOrders(Array.isArray(posRes.value.data) ? posRes.value.data : []);
      } else {
        setPosOrders([]);
      }

      if (payrollRes.status === "fulfilled" && payrollRes.value?.data) {
        setPayrollSummary(payrollRes.value.data);
      } else {
        setPayrollSummary(null);
      }

      if (invStatsRes.status === "fulfilled" && invStatsRes.value?.data) {
        setInventoryStats(invStatsRes.value.data);
      } else {
        setInventoryStats(null);
      }

      if (invItemsRes.status === "fulfilled" && invItemsRes.value?.data) {
        setInventoryItems(Array.isArray(invItemsRes.value.data) ? invItemsRes.value.data : []);
      } else {
        setInventoryItems([]);
      }

      if (reportsRes.status === "fulfilled" && reportsRes.value?.data) {
        setReports(Array.isArray(reportsRes.value.data) ? reportsRes.value.data : []);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error("Error fetching live hotel data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllHotelData();
  }, [fetchAllHotelData]);

  // ── Pure Dynamic Calculations from Live DB ─────────────────────────────────
  const metrics = useMemo(() => {
    const roomRevenue = bookings.reduce((sum, b) => {
      const val = Number(b.totalAmount || b.amount || b.price || 0);
      return sum + val;
    }, 0);

    const posRevenue = posOrders.reduce((sum, o) => {
      const val = Number(o.grandTotal || o.total || o.subTotal || 0);
      return sum + val;
    }, 0);

    const totalGrossRevenue = roomRevenue + posRevenue;

    const totalRoomsCount = rooms.length;
    const bookedRoomsCount = rooms.filter(
      (r) => r.status === "Booked" || r.status === "Occupied"
    ).length;
    const occupancyRate = totalRoomsCount > 0
      ? Math.round((bookedRoomsCount / totalRoomsCount) * 100)
      : 0;

    const revPAR = totalRoomsCount > 0
      ? Math.round(roomRevenue / totalRoomsCount)
      : 0;

    const payrollCost = Number(payrollSummary?.totalPayrollCost || 0);
    const inventoryAssetValue = Number(
      inventoryStats?.totalStockValue ||
      inventoryItems.reduce((acc, it) => acc + (Number(it.quantity || 0) * Number(it.unitPrice || 0)), 0)
    );
    const totalOperatingCost = payrollCost + inventoryAssetValue;

    const netProfit = totalGrossRevenue - totalOperatingCost;

    return {
      roomRevenue,
      posRevenue,
      totalGrossRevenue,
      totalRoomsCount,
      bookedRoomsCount,
      occupancyRate,
      revPAR,
      payrollCost,
      inventoryAssetValue,
      totalOperatingCost,
      netProfit,
    };
  }, [bookings, rooms, posOrders, payrollSummary, inventoryStats, inventoryItems]);

  // ── Monthly Chart Distribution (Built strictly from Real Timestamps) ───────
  const monthlyChartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIdx = new Date().getMonth();

    const monthlyMap = {};
    months.slice(0, currentMonthIdx + 1).forEach((m) => {
      monthlyMap[m] = { month: m, roomRevenue: 0, posRevenue: 0, expenses: 0 };
    });

    bookings.forEach((b) => {
      const date = b.createdAt || b.checkInDate;
      if (date) {
        const m = months[new Date(date).getMonth()];
        if (monthlyMap[m]) {
          monthlyMap[m].roomRevenue += Number(b.totalAmount || b.amount || b.price || 0);
        }
      }
    });

    posOrders.forEach((o) => {
      const date = o.createdAt;
      if (date) {
        const m = months[new Date(date).getMonth()];
        if (monthlyMap[m]) {
          monthlyMap[m].posRevenue += Number(o.grandTotal || o.total || 0);
        }
      }
    });

    const monthlyExp = currentMonthIdx >= 0 ? Math.round(metrics.totalOperatingCost / (currentMonthIdx + 1)) : 0;
    months.slice(0, currentMonthIdx + 1).forEach((m) => {
      monthlyMap[m].expenses = monthlyExp;
    });

    return Object.values(monthlyMap);
  }, [bookings, posOrders, metrics]);

  // ── Dynamic Revenue Share (Built strictly from positive income streams) ─────
  const departmentRevenueShare = useMemo(() => {
    const total = metrics.totalGrossRevenue;
    if (total <= 0) return [];

    const streams = [];
    if (metrics.roomRevenue > 0) {
      streams.push({
        name: "Room Bookings",
        value: Math.round((metrics.roomRevenue / total) * 100),
        amount: metrics.roomRevenue,
        color: "#4f46e5",
      });
    }
    if (metrics.posRevenue > 0) {
      streams.push({
        name: "Restaurant & Bar (POS)",
        value: Math.round((metrics.posRevenue / total) * 100),
        amount: metrics.posRevenue,
        color: "#10b981",
      });
    }

    return streams;
  }, [metrics]);

  // ── Search & Filter over Real Reports ──────────────────────────────────────
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (rep.name || "").toLowerCase().includes(q) ||
        (rep.type || "").toLowerCase().includes(q) ||
        (rep.period || "").toLowerCase().includes(q);
      const matchType = filterType === "all" || rep.type === filterType;
      return matchSearch && matchType;
    });
  }, [reports, searchQuery, filterType]);

  const totalPages = Math.ceil(filteredReports.length / pageSize) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ── Download Individual CSV ────────────────────────────────────────────────
  const handleDownloadReport = (rep) => {
    let content = rep.csvContent;
    if (!content) {
      content = `Report: ${rep.name}\nCategory: ${rep.type}\nPeriod: ${rep.period}\nGenerated By: ${rep.generatedByName || "Hotel Admin"}\nDate: ${new Date(rep.createdAt).toLocaleDateString()}\n\nSummary:\n${rep.summary || ""}\n\nMetric,Value\nGross Turnover,₹${metrics.totalGrossRevenue.toLocaleString()}\nRoom Revenue,₹${metrics.roomRevenue.toLocaleString()}\nPOS Sales,₹${metrics.posRevenue.toLocaleString()}\nOccupancy,${metrics.occupancyRate}%\nRevPAR,₹${metrics.revPAR.toLocaleString()}\nNet Profit,₹${metrics.netProfit.toLocaleString()}`;
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${rep.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${new Date(rep.createdAt || Date.now()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Delete Real Report from DB ─────────────────────────────────────────────
  const handleDeleteReport = async (id) => {
    if (!confirm("Are you sure you want to delete this report from the database?")) return;
    try {
      const res = await ReportRoute.deleteReport(id);
      if (res.success) {
        setReports((prev) => prev.filter((r) => (r._id || r.id) !== id));
      }
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  // ── Export Master Overview CSV from Live Data ──────────────────────────────
  const handleExportAll = () => {
    const csvLines = [
      `"Hotel Management Real-Time Performance Master Export"`,
      `"Property Name:","${user?.hotelName || "Hotel Property"}"`,
      `"Export Date:","${new Date().toLocaleString()}"`,
      "",
      `"LIVE SUMMARY METRICS"`,
      `"Total Gross Turnover:","₹${metrics.totalGrossRevenue.toLocaleString()}"`,
      `"Room Booking Earnings:","₹${metrics.roomRevenue.toLocaleString()}"`,
      `"Restaurant & POS Sales:","₹${metrics.posRevenue.toLocaleString()}"`,
      `"Live Occupancy Rate:","${metrics.occupancyRate}%"`,
      `"RevPAR Yield:","₹${metrics.revPAR.toLocaleString()}"`,
      `"Staff Payroll Cost:","₹${metrics.payrollCost.toLocaleString()}"`,
      `"Inventory Assets:","₹${metrics.inventoryAssetValue.toLocaleString()}"`,
      `"Estimated Net Operating Profit:","₹${metrics.netProfit.toLocaleString()}"`,
      "",
      `"SAVED AUDIT REPORTS IN DATABASE"`,
      `"Report ID","Report Title","Category","Period","Generated By","Created Date","Status"`,
      ...reports.map(
        (r) =>
          `"${r._id || r.id}","${r.name}","${r.type}","${r.period}","${r.generatedByName || "Hotel Admin"}","${new Date(r.createdAt).toLocaleDateString()}","${r.status}"`
      ),
    ].join("\n");

    const blob = new Blob([csvLines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hotel_master_audit_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Custom Report Generator Form (Saves Real Record to Database) ───────────
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!newReport.name.trim()) return;

    setGenerating(true);
    try {
      const summaryText = `Gross Turnover: ₹${metrics.totalGrossRevenue.toLocaleString()} | Occupancy: ${metrics.occupancyRate}% | RevPAR: ₹${metrics.revPAR.toLocaleString()} | Net Margin: ₹${metrics.netProfit.toLocaleString()}`;
      const csvDataString = `Report Title,${newReport.name}\nCategory,${newReport.type}\nReporting Period,${newReport.period}\nProperty Name,${user?.hotelName || "Hotel Property"}\nGenerated Date,${new Date().toISOString()}\n\nLive Snapshot\nGross Turnover,₹${metrics.totalGrossRevenue.toLocaleString()}\nRoom Booking Revenue,₹${metrics.roomRevenue.toLocaleString()}\nPOS Dining Turnover,₹${metrics.posRevenue.toLocaleString()}\nOccupancy Rate,${metrics.occupancyRate}%\nRevPAR,₹${metrics.revPAR.toLocaleString()}\nStaff Payroll Overhead,₹${metrics.payrollCost.toLocaleString()}\nInventory Assets Used,₹${metrics.inventoryAssetValue.toLocaleString()}\nNet Operating Profit,₹${metrics.netProfit.toLocaleString()}`;

      const res = await ReportRoute.createReport({
        name: newReport.name.trim(),
        type: newReport.type,
        period: newReport.period,
        summary: summaryText,
        csvContent: csvDataString,
      });

      if (res.success && res.data) {
        setReports((prev) => [res.data, ...prev]);
        setNewReport({ name: "", type: "Financial", period: "Year 2026" });
        setIsModalOpen(false);
      } else {
        alert(res.message || "Failed to generate report.");
      }
    } catch (err) {
      console.error("Error creating report:", err);
      alert("Failed to create report.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <FileBarChart2 className="text-indigo-600 dark:text-indigo-400" size={32} />
              Hotel Reports & Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Real-time operational records, profit & loss, room yields, and downloadable audit sheets for{" "}
              <strong className="text-slate-800 dark:text-slate-200">{user?.hotelName || "your property"}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setRefreshing(true);
                fetchAllHotelData();
              }}
              disabled={loading || refreshing}
              className="h-11 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold gap-2 shadow-sm cursor-pointer"
            >
              <RefreshCw size={16} className={refreshing || loading ? "animate-spin text-indigo-600" : ""} />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              onClick={handleExportAll}
              className="h-11 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold gap-2 shadow-sm cursor-pointer"
            >
              <Download size={16} /> Export Master CSV
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Plus size={18} /> Generate Custom Report
            </Button>
          </div>
        </div>

        {/* Live Hotel KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Gross Hotel Turnover",
              val: `₹${metrics.totalGrossRevenue.toLocaleString()}`,
              sub: `₹${metrics.roomRevenue.toLocaleString()} Rooms + ₹${metrics.posRevenue.toLocaleString()} POS`,
              icon: <DollarSign className="text-indigo-600" size={22} />,
              bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30",
            },
            {
              label: "Live Room Occupancy",
              val: `${metrics.occupancyRate}%`,
              sub: `${metrics.bookedRoomsCount} of ${metrics.totalRoomsCount} Physical Rooms Occupied`,
              icon: <Bed className="text-emerald-600" size={22} />,
              bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30",
            },
            {
              label: "RevPAR (Rev / Avail Room)",
              val: `₹${metrics.revPAR.toLocaleString()}`,
              sub: `From ${bookings.length} confirmed bookings`,
              icon: <TrendingUp className="text-sky-600" size={22} />,
              bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/30",
            },
            {
              label: "Estimated Net Profit",
              val: `₹${metrics.netProfit.toLocaleString()}`,
              sub: `After ₹${metrics.totalOperatingCost.toLocaleString()} overheads`,
              icon: <Sparkles className="text-amber-600" size={22} />,
              bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border ${stat.bg} bg-white dark:bg-slate-900 shadow-sm flex items-start justify-between`}
            >
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{stat.val}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  {stat.sub}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-inner">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Analytics Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue vs Expenses Comparison Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <BarChart3 className="text-indigo-600" size={18} />
                  Revenue Inflows vs Operating Costs
                </h3>
                <p className="text-xs text-slate-400">Monthly breakdown across Room Bookings, POS Dining, and Expenses.</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                Year 2026
              </span>
            </div>

            <div className="flex-1 w-full text-xs">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <Tooltip
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, ""]}
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        borderRadius: "12px",
                        color: "#fff",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="roomRevenue" name="Room Bookings" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="posRevenue" name="Restaurant & POS" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Operating Costs" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Department Share Donut */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[400px]">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <PieIcon className="text-indigo-600" size={18} />
                Revenue Streams Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Contribution percentage by active income stream.</p>
            </div>

            <div className="h-[200px] w-full flex items-center justify-center relative">
              {isMounted && departmentRevenueShare.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={departmentRevenueShare}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {departmentRevenueShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val, name, item) => [`${val}% (₹${Number(item?.payload?.amount || 0).toLocaleString()})`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
                  <Inbox size={28} className="mb-1 opacity-50" />
                  <span>No revenue logged yet</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              {departmentRevenueShare.length > 0 ? (
                departmentRevenueShare.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{item.amount.toLocaleString()} ({item.value}%)
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 text-xs py-1">Awaiting live hotel transactions</p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Audited Reports Table from Database */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          {/* Filters Bar */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <Input
                placeholder="Search generated reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
              {["all", "Financial", "Occupancy", "F&B / POS", "Payroll", "Inventory"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    filterType === t
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  }`}
                >
                  {t === "all" ? "All Categories" : t}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                <RefreshCw size={24} className="animate-spin text-indigo-600" />
                <span className="text-sm font-semibold">Loading hotel reports from database...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Report Title</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Reporting Period</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6">Created Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {paginatedReports.map((rep) => (
                    <tr key={rep._id || rep.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <FileBarChart2 size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{rep.name}</p>
                            <span className="text-[10px] font-mono text-slate-400 font-semibold">{rep._id || rep.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {rep.type}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        {rep.period || "All Time"}
                      </td>

                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                        {rep.generatedByName || "Hotel Admin"}
                      </td>

                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(rep.createdAt || Date.now()).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleDownloadReport(rep)}
                            className="h-9 px-3 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1.5 font-bold text-xs cursor-pointer"
                          >
                            <Download size={14} /> Download CSV
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteReport(rep._id || rep.id)}
                            className="h-9 w-9 p-0 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400 text-sm font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Inbox size={36} className="text-slate-300 dark:text-slate-600" />
                          <span>No generated reports found in database.</span>
                          <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            className="mt-2 text-xs h-9 rounded-xl border-indigo-200 text-indigo-600 dark:border-indigo-800"
                          >
                            <Plus size={14} className="mr-1" /> Generate First Report
                          </Button>
                        </div>
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

        {/* Modal: Generate Custom Report */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-indigo-600" />
                  Generate Custom Hotel Report
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleGenerateReport} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Report Title</label>
                  <Input
                    required
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                    placeholder="e.g. Q2 Profit & Loss Statement"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                    <select
                      value={newReport.type}
                      onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Financial">Financial P&L</option>
                      <option value="Occupancy">Occupancy & RevPAR</option>
                      <option value="F&B / POS">F&B / POS Dining</option>
                      <option value="Payroll">Staff & Payroll</option>
                      <option value="Inventory">Inventory Consumption</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reporting Period</label>
                    <select
                      value={newReport.period}
                      onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Current Month">Current Month</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Q2 2026">Q2 2026</option>
                      <option value="Year 2026">Full Year 2026</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-300">
                  <p className="font-semibold">Auto-calculated Live Metrics Included:</p>
                  <p className="mt-1 opacity-80">
                    Gross Hotel Turnover (₹{metrics.totalGrossRevenue.toLocaleString()}), Room Revenue (₹{metrics.roomRevenue.toLocaleString()}), POS Dining (₹{metrics.posRevenue.toLocaleString()}), Occupancy ({metrics.occupancyRate}%), RevPAR (₹{metrics.revPAR.toLocaleString()}), and Net Operating Margin.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    className="h-11 rounded-xl px-5 text-slate-500 font-semibold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={generating}
                    className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md flex items-center gap-2"
                  >
                    {generating ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                    {generating ? "Saving to Database..." : "Generate & Save Report"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
