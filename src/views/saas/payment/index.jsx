"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  ArrowUpRight,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronRight,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Pagination from "@/components/shared/Pagination";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { SaaSAnalyticsRoute } from "@/routes/saas/analytics/analytics.route";

export default function SaaSPaymentView() {
  const [stats, setStats] = useState({
    grossVolume: 0,
    mrr: 0,
    avgPlanPrice: 0,
    failedPaymentsCount: 0,
  });
  const [weeklyBreakdown, setWeeklyBreakdown] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTx, setSelectedTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const isMounted = useIsMounted();

  const fetchPaymentData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, txRes] = await Promise.all([
        SaaSAnalyticsRoute.getPaymentStats(),
        SaaSAnalyticsRoute.getTransactions({ search: searchQuery, status: statusFilter }),
      ]);

      if (statsRes?.data) {
        setStats({
          grossVolume: statsRes.data.grossVolume || 0,
          mrr: statsRes.data.mrr || 0,
          avgPlanPrice: statsRes.data.avgPlanPrice || 0,
          failedPaymentsCount: statsRes.data.failedPaymentsCount || 0,
        });
        setWeeklyBreakdown(statsRes.data.weeklyBreakdown || []);
      }

      if (txRes?.data?.transactions) {
        setTransactions(txRes.data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch payment dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.invoice.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "SUCCESSFUL" && (tx.status === "Successful" || tx.status === "Paid")) ||
      (statusFilter === "PENDING" && tx.status === "Pending") ||
      (statusFilter === "FAILED" && tx.status === "Failed");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRefund = async (id) => {
    try {
      await SaaSAnalyticsRoute.refundTransaction(id);
      setTransactions((prev) =>
        prev.map((tx) => {
          if (tx.id === id) {
            return { ...tx, status: "Refunded", amount: -Math.abs(tx.amount) };
          }
          return tx;
        })
      );
      if (selectedTx?.id === id) {
        setSelectedTx((prev) => ({
          ...prev,
          status: "Refunded",
          amount: -Math.abs(prev.amount),
        }));
      }
    } catch (error) {
      console.error("Failed to issue refund:", error);
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Hotel,Owner,Plan,Amount,Status,Date,Invoice,Method\n";
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.hotelName}","${t.owner}","${t.plan}",${t.amount},"${t.status}","${t.date}","${t.invoice}","${t.method}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saas-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Revenue &amp; Payments
          </h1>
          <p className="text-slate-500 mt-1">
            Manage global subscriptions, transactions, and invoices
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchPaymentData}
            disabled={loading}
            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 gap-2 cursor-pointer"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Sync Gateway
          </Button>
          <Button
            onClick={handleExportCSV}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-5 gap-2 cursor-pointer text-white font-bold"
          >
            <Download size={18} /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-lg flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md">
              <DollarSign size={22} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +12.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Gross Volume</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              ₹{stats.grossVolume.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-lg flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md">
              <CreditCard size={22} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +8.2%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Monthly Recurring Revenue
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              ₹{stats.mrr.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-lg flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md">
              <ArrowUpRight size={22} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +15.1%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Average Subscription Plan
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              ₹{stats.avgPlanPrice.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-lg flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-md">
              <AlertCircle size={22} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
              <TrendingDown size={12} /> Live
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Failed / Disputed Payments
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {stats.failedPaymentsCount}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main transaction list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Transaction Logs
                </h3>
                <p className="text-sm text-slate-500">
                  Real-time payment history and invoices
                </p>
              </div>

              <div className="flex gap-2">
                {["ALL", "SUCCESSFUL", "PENDING", "FAILED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setCurrentPage(1);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors capitalize ${
                      statusFilter === st
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {st.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search transactions by hotel owner or invoice number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="overflow-auto max-h-[480px] relative">
              {loading ? (
                <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Loading live transactions...</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm">
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                      <th className="py-4">Tenant / Hotel</th>
                      <th className="py-4">Plan / Cycle</th>
                      <th className="py-4">Amount</th>
                      <th className="py-4">Status</th>
                      <th className="py-4">Date</th>
                      <th className="py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {paginatedTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                      >
                        <td className="py-4 font-bold text-slate-900 dark:text-white">
                          <div>
                            <p>{tx.hotelName}</p>
                            <p className="text-xs text-slate-500 font-normal">
                              {tx.owner}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-md text-indigo-600 dark:text-indigo-400 uppercase">
                            {tx.plan}
                          </span>
                        </td>
                        <td
                          className={`py-4 font-black ${
                            tx.amount < 0 ? "text-rose-500" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          ₹{Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              tx.status === "Successful" || tx.status === "Paid"
                                ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                                : tx.status === "Pending"
                                ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10"
                                : tx.status === "Refunded"
                                ? "text-blue-600 bg-blue-50 dark:bg-blue-500/10"
                                : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                            }`}
                          >
                            {(tx.status === "Successful" || tx.status === "Paid") && (
                              <CheckCircle2 size={12} />
                            )}
                            {tx.status === "Pending" && <AlertCircle size={12} />}
                            {tx.status === "Failed" && <XCircle size={12} />}
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 text-slate-500 font-medium">
                          {tx.date}
                        </td>
                        <td
                          className="py-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedTx(tx)}
                              className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <Download size={15} />
                            </Button>
                            <ChevronRight size={18} className="text-slate-400" />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-8 text-center text-slate-400"
                        >
                          No transactions found matching the filter criteria.
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
              totalItems={filteredTransactions.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Right column: Weekly stats chart & selected transaction detailed overview */}
        <div className="space-y-6">
          {/* Weekly volume breakdown chart */}
          <div className="glass-card p-6 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
              Weekly Growth
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Subscriptions vs add-on purchases
            </p>

            <div className="h-[200px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={weeklyBreakdown}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Bar
                      dataKey="Subscriptions"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar dataKey="Addons" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Transaction detailed view */}
          <div className="glass-card p-6 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[300px] flex flex-col">
            {selectedTx ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Invoice Details
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {selectedTx.invoice}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Total Paid
                      </p>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{Math.abs(selectedTx.amount).toFixed(2)}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-400 font-semibold">Tenant</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedTx.hotelName}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold">Owner</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedTx.owner}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold">
                          Payment Date
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedTx.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold">Method</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedTx.method}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                  {(selectedTx.status === "Successful" || selectedTx.status === "Paid") && (
                    <Button
                      onClick={() => handleRefund(selectedTx.id)}
                      className="w-full rounded-lg border border-rose-100 dark:border-rose-500/20 text-rose-600 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 h-10 px-4 cursor-pointer font-bold transition-all text-xs"
                    >
                      Issue Refund
                    </Button>
                  )}
                  <Button
                    onClick={() => alert(`Downloading Invoice PDF for ${selectedTx.invoice}...`)}
                    className="w-full rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white h-10 px-4 cursor-pointer font-bold transition-all text-xs"
                  >
                    Download Invoice (PDF)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <CreditCard
                  className="text-slate-300 dark:text-slate-700 mb-3"
                  size={32}
                />
                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  Select Transaction
                </h5>
                <p className="text-xs text-slate-400 max-w-[180px] mt-1">
                  Select a transaction log to view full details and print
                  invoices.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
