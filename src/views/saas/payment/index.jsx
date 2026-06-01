"use client";
import React, { useState } from "react";
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

const INITIAL_TRANSACTIONS = [
  {
    id: "tx_1",
    hotelName: "Ocean Breeze Inn",
    owner: "Alice Smith",
    plan: "Premium",
    amount: 99.0,
    status: "Successful",
    date: "2026-05-19",
    invoice: "INV-2026-042",
    method: "Visa ending in 4242",
  },
  {
    id: "tx_2",
    hotelName: "Mountain Peak Lodge",
    owner: "Bob Jones",
    plan: "Standard",
    amount: 49.0,
    status: "Successful",
    date: "2026-05-18",
    invoice: "INV-2026-041",
    method: "MasterCard ending in 5555",
  },
  {
    id: "tx_3",
    hotelName: "Desert Oasis Resort",
    owner: "David Wilson",
    plan: "Premium",
    amount: 99.0,
    status: "Successful",
    date: "2026-05-15",
    invoice: "INV-2026-040",
    method: "Visa ending in 9876",
  },
  {
    id: "tx_4",
    hotelName: "Urban Suite Hotel",
    owner: "Charlie Brown",
    plan: "Standard",
    amount: 49.0,
    status: "Pending",
    date: "2026-05-14",
    invoice: "INV-2026-039",
    method: "Bank Transfer",
  },
  {
    id: "tx_5",
    hotelName: "Forest Hideaway",
    owner: "Eva Green",
    plan: "Premium",
    amount: 99.0,
    status: "Failed",
    date: "2026-05-10",
    invoice: "INV-2026-038",
    method: "Amex ending in 1001",
  },
  {
    id: "tx_6",
    hotelName: "Grand View Resort",
    owner: "John Hotelier",
    plan: "Premium",
    amount: 99.0,
    status: "Successful",
    date: "2026-05-08",
    invoice: "INV-2026-037",
    method: "Visa ending in 8811",
  },
  {
    id: "tx_7",
    hotelName: "Lake View Cabins",
    owner: "Sarah Connor",
    plan: "Standard",
    amount: 49.0,
    status: "Successful",
    date: "2026-05-05",
    invoice: "INV-2026-036",
    method: "MasterCard ending in 1234",
  },
];

const WEEKLY_BREAKDOWN = [
  { name: "Wk 18", Subscriptions: 1450, Addons: 200 },
  { name: "Wk 19", Subscriptions: 1850, Addons: 400 },
  { name: "Wk 20", Subscriptions: 2100, Addons: 350 },
  { name: "Wk 21", Subscriptions: 2450, Addons: 600 },
];

export default function SaaSPaymentView() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.invoice.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || tx.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRefund = (id) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          return { ...tx, status: "Refunded", amount: -tx.amount };
        }
        return tx;
      }),
    );
    if (selectedTx?.id === id) {
      setSelectedTx((prev) => ({
        ...prev,
        status: "Refunded",
        amount: -prev.amount,
      }));
    }
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
            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 gap-2"
          >
            <RefreshCcw size={16} /> Sync Gateway
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-5 gap-2 cursor-pointer text-white font-bold">
            <Download size={18} /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 ">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <DollarSign size={22} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +12.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Gross Volume</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              $128,430
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
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
              $24,550
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
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
              $84.20
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl">
              <AlertCircle size={22} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
              <TrendingDown size={12} /> -24%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Failed / Disputed Payments
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              2
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main transaction list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
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
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === "ALL" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("SUCCESSFUL")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === "SUCCESSFUL" ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                >
                  Success
                </button>
                <button
                  onClick={() => setStatusFilter("PENDING")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === "PENDING" ? "bg-amber-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("FAILED")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === "FAILED" ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                >
                  Failed
                </button>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search transactions by hotel owner or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4">Tenant / Hotel</th>
                    <th className="py-4">Plan / Cycle</th>
                    <th className="py-4">Amount</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Date</th>
                    <th className="py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredTransactions.map((tx) => (
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
                        className={`py-4 font-black ${tx.amount < 0 ? "text-rose-500" : "text-slate-900 dark:text-white"}`}
                      >
                        ${Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            tx.status === "Successful"
                              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                              : tx.status === "Pending"
                                ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10"
                                : tx.status === "Refunded"
                                  ? "text-blue-600 bg-blue-50 dark:bg-blue-500/10"
                                  : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                          }`}
                        >
                          {tx.status === "Successful" && (
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
            </div>
          </div>
        </div>

        {/* Right column: Weekly stats chart & selected transaction detailed overview */}
        <div className="space-y-6">
          {/* Weekly volume breakdown chart */}
          <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
              Weekly Growth
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Subscriptions vs add-on purchases
            </p>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={WEEKLY_BREAKDOWN}
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
            </div>
          </div>

          {/* Transaction detailed view */}
          <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900  min-h-[300px] flex flex-col">
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
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Total Paid
                      </p>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        ${Math.abs(selectedTx.amount).toFixed(2)}
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
                  {selectedTx.status === "Successful" && (
                    <Button
                      onClick={() => handleRefund(selectedTx.id)}
                      className="w-full rounded-xl border border-rose-100 dark:border-rose-500/20 text-rose-600 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 h-11 px-4 cursor-pointer font-bold transition-all text-xs"
                    >
                      Issue Refund
                    </Button>
                  )}
                  <Button className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white h-11 px-4 cursor-pointer font-bold transition-all text-xs">
                    Download Invoice (PDF)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
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
