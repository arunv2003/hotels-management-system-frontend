"use client";
import React, { useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Trash2,
  Send,
  AlertTriangle,
  CreditCard,
  UserCheck,
  LifeBuoy,
  X,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/components/shared/Pagination";

const MOCK_NOTIFICATIONS = [
  {
    id: "nt-1",
    title: "Global Security Certificate Rotated",
    message:
      "SSL and database encryption keys have been successfully rotated. No action is required from tenants.",
    category: "System",
    recipient: "All Users",
    sentDate: "2026-05-20 12:44",
    status: "Sent",
  },
  {
    id: "nt-2",
    title: "Premium Subscription Due Notification",
    message:
      "Monthly billing processing will occur in 48 hours. Please verify that your payment settings are active.",
    category: "Billing",
    recipient: "Admins",
    sentDate: "2026-05-19 09:00",
    status: "Sent",
  },
  {
    id: "nt-3",
    title: "New High-Priority Support Ticket #3928",
    message:
      "An urgent payment discrepancy ticket has been lodged. Support engineers should resolve this ASAP.",
    category: "Support",
    recipient: "Support Staff",
    sentDate: "2026-05-21 11:05",
    status: "Sent",
  },
  {
    id: "nt-4",
    title: "Platform Maintenance Alert Broadcast",
    message:
      "Weekly server load balancers upgrade scheduled. Minor latency increases may be noticed.",
    category: "System",
    recipient: "All Users",
    sentDate: "2026-05-22 04:00",
    status: "Queued",
  },
];

export default function NotificationsView() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [currentNotif, setCurrentNotif] = useState({
    id: "",
    title: "",
    message: "",
    category: "System",
    recipient: "All Users",
    sentDate: "",
    status: "Sent",
  });

  const filteredNotifications = notifications.filter((nt) => {
    const matchesSearch =
      nt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nt.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || nt.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setCurrentNotif({
      id: `nt-${Date.now()}`,
      title: "",
      message: "",
      category: "System",
      recipient: "All Users",
      sentDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "Sent",
    });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this notification record?")) {
      setNotifications(notifications.filter((nt) => nt.id !== id));
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!currentNotif.title.trim() || !currentNotif.message.trim()) {
      alert("Please enter both title and message.");
      return;
    }

    setNotifications([
      {
        ...currentNotif,
        sentDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      },
      ...notifications,
    ]);
    setIsOpen(false);
  };

  // Category Icon helper
  const getCategoryDetails = (cat) => {
    switch (cat) {
      case "System":
        return {
          icon: <AlertTriangle size={15} className="text-amber-500" />,
          bg: "bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
        };
      case "Billing":
        return {
          icon: <CreditCard size={15} className="text-emerald-500" />,
          bg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
        };
      case "Support":
        return {
          icon: <LifeBuoy size={15} className="text-indigo-500" />,
          bg: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-850 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20",
        };
      default:
        return {
          icon: <UserCheck size={15} className="text-sky-500" />,
          bg: "bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-400 border-sky-100 dark:border-sky-500/20",
        };
    }
  };

  // Metrics
  const systemCount = notifications.filter(
    (n) => n.category === "System",
  ).length;
  const billingCount = notifications.filter(
    (n) => n.category === "Billing",
  ).length;
  const queuedCount = notifications.filter((n) => n.status === "Queued").length;

  return (
    <div className="space-y-6 sm:space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Bell className="text-indigo-600 dark:text-indigo-400 shrink-0" size={28} />
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
            Dispatch urgent admin system notices, billing warnings, and user
            activity alerts directly to panel dashboards.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-10 sm:h-11 px-5 sm:px-6 gap-2 cursor-pointer transition-all shadow-md text-xs sm:text-sm font-semibold justify-center"
        >
          <Plus size={18} />
          Send Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          {
            label: "Total Sent Alerts",
            val: notifications.length - queuedCount,
            icon: <Send className="text-indigo-600" />,
          },
          {
            label: "System Notices",
            val: systemCount,
            icon: <AlertTriangle className="text-amber-600" />,
          },
          {
            label: "Billing Alerts",
            val: billingCount,
            icon: <CreditCard className="text-emerald-600" />,
          },
          {
            label: "Scheduled Queue",
            val: queuedCount,
            icon: <RefreshCw className="text-sky-600 animate-spin-slow" />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {stat.label}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.val}
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid View */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto table-scrollbar pb-1 sm:pb-0">
            {["all", "System", "Billing", "Support", "Activity"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold border transition-all shrink-0 ${
                  filterCategory === cat
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Table */}
        <div className="flex-1 overflow-x-auto table-scrollbar relative">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-xs">
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-4 sm:pl-6">
                  Notification Details
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sent Timestamp
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-4 sm:pr-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedNotifications.map((nt) => {
                const catDetails = getCategoryDetails(nt.category);
                return (
                  <tr
                    key={nt.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
                  >
                    <td className="p-4 pl-4 sm:pl-6 max-w-md">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">
                          {nt.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed truncate max-w-xs sm:max-w-md">
                          {nt.message}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${catDetails.bg}`}
                      >
                        {catDetails.icon}
                        {nt.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {nt.recipient}
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {nt.sentDate}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          nt.status === "Sent"
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100"
                            : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100"
                        }`}
                      >
                        {nt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-4 sm:pr-6">
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(nt.id)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredNotifications.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 sm:p-10 text-center text-slate-400 text-sm font-medium"
                  >
                    No notifications logged.
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
          totalItems={filteredNotifications.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Trigger Dialog Modal */}
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
                  Dispatch Instant Notification
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSend} className="p-6 space-y-4.5">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Notification Subject
                  </label>
                  <Input
                    value={currentNotif.title}
                    onChange={(e) =>
                      setCurrentNotif({
                        ...currentNotif,
                        title: e.target.value,
                      })
                    }
                    placeholder="E.g., Urgent Plan Migration Notice"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Message Category
                    </label>
                    <select
                      value={currentNotif.category}
                      onChange={(e) =>
                        setCurrentNotif({
                          ...currentNotif,
                          category: e.target.value,
                        })
                      }
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="System" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">System Alert</option>
                      <option value="Billing" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Billing Alert</option>
                      <option value="Support" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Support Alert</option>
                      <option value="Activity" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">User Activity Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Recipient Audience
                    </label>
                    <select
                      value={currentNotif.recipient}
                      onChange={(e) =>
                        setCurrentNotif({
                          ...currentNotif,
                          recipient: e.target.value,
                        })
                      }
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="All Users" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Dashboard Tenants</option>
                      <option value="Admins" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Hotel Admins Only</option>
                      <option value="Support Staff" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        SaaS Support Engineers
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Core Alert Message Body
                  </label>
                  <textarea
                    value={currentNotif.message}
                    onChange={(e) =>
                      setCurrentNotif({
                        ...currentNotif,
                        message: e.target.value,
                      })
                    }
                    placeholder="Enter short, descriptive notice message details here..."
                    rows={4}
                    className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none placeholder:text-slate-400"
                  />
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
                    className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Send size={15} />
                    Dispatch Notice
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
