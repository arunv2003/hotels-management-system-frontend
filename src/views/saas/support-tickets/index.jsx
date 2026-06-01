"use client";
import React, { useState } from "react";
import {
  LifeBuoy,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  MessageSquare,
  Trash2,
  X,
  Send,
  User,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_TICKETS = [
  {
    id: "TC-8392",
    hotel: "Grand Hyatt New York",
    subject: "Stripe API Checkout Integration Fails",
    category: "Billing",
    priority: "High",
    status: "Open",
    lastActivity: "2026-05-21 11:20",
    conversation: [
      { sender: "user", text: "Whenever checkout is executed for a guest, we receive a webhook status 400 parameter invalid.", time: "11:15 AM" },
      { sender: "system", text: "Automated Ticket Created.", time: "11:15 AM" }
    ],
  },
  {
    id: "TC-8380",
    hotel: "Hilton London Metro",
    subject: "Custom Brand logo upload resolution error",
    category: "Technical",
    priority: "Medium",
    status: "In Progress",
    lastActivity: "2026-05-20 14:02",
    conversation: [
      { sender: "user", text: "We try to upload our high-res PNG logo but the dashboard crops it aggressively to a square.", time: "Yesterday" },
      { sender: "admin", text: "Hi, I am reviewing the logo dimensions aspect ratio settings. Please hold on.", time: "Yesterday" }
    ],
  },
  {
    id: "TC-8311",
    hotel: "Tokyo Ritz-Carlton",
    subject: "Requesting refund for premium trial trial-run",
    category: "Billing",
    priority: "Medium",
    status: "Resolved",
    lastActivity: "2026-05-18 09:30",
    conversation: [
      { sender: "user", text: "We registered with trial option but were immediately charged full monthly enterprise fee.", time: "3 days ago" },
      { sender: "admin", text: "Apologies. I have reversed the credit charge. It should hit your card in 3 days.", time: "2 days ago" },
      { sender: "user", text: "Thank you. Received successfully.", time: "2 days ago" }
    ],
  },
  {
    id: "TC-8302",
    hotel: "Marriott Paris Gateway",
    subject: "Database connection timeouts during checkout",
    category: "Technical",
    priority: "High",
    status: "Open",
    lastActivity: "2026-05-21 12:45",
    conversation: [
      { sender: "user", text: "Checkout logs show DB Pool connectivity exhaustion during high traffic dining shifts.", time: "12:40 PM" }
    ],
  },
];

export default function SupportTicketsView() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  
  // Drawer / Detail modal state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredTickets = tickets.filter((tc) => {
    const matchesSearch = tc.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tc.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tc.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || tc.status === filterStatus;
    const matchesPriority = filterPriority === "all" || tc.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenTicket = (tc) => {
    setSelectedTicket({ ...tc });
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const newReply = {
      sender: "admin",
      text: replyMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedTicket = {
      ...selectedTicket,
      lastActivity: new Date().toISOString().replace("T", " ").substring(0, 16),
      conversation: [...selectedTicket.conversation, newReply],
    };

    // Update tickets list
    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
    setReplyMessage("");
  };

  const updateTicketStatus = (id, nextStatus) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: nextStatus, lastActivity: new Date().toISOString().replace("T", " ").substring(0, 16) } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: nextStatus });
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to permanently delete this support ticket?")) {
      setTickets(tickets.filter((t) => t.id !== id));
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(null);
      }
    }
  };

  // Status/Priority Style helpers
  const getPriorityBadge = (prio) => {
    switch (prio) {
      case "High":
        return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20";
      case "Medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20";
      default:
        return "bg-slate-50 text-slate-655 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
      case "In Progress":
        return "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800";
      case "Resolved":
        return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750";
    }
  };

  // Metrics
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const progressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <LifeBuoy className="text-indigo-650 dark:text-indigo-400" size={32} />
            Support Desk
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review technical glitches, billing disputes, and assist tenant hotel admins with a simulated conversational interface.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Open Tickets", val: openCount, icon: <AlertCircle className="text-rose-550" /> },
          { label: "Under Review", val: progressCount, icon: <Clock className="text-indigo-600" /> },
          { label: "Resolved Speed", val: resolvedCount, icon: <CheckCircle className="text-emerald-600" /> },
          { label: "Avg SLA Response", val: "18.5 min", icon: <ArrowUpRight className="text-sky-650" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-105 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-955 dark:text-white mt-1">{stat.val}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <Input
              placeholder="Search by hotel or ticket details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            />
          </div>
    
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 px-2.5 font-bold">Status:</span>
              {["all", "Open", "In Progress", "Resolved"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                    filterStatus === s
                      ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400"
                      : "text-slate-505 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 px-2.5 font-bold">Priority:</span>
              {["all", "High", "Medium"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                    filterPriority === p
                      ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400"
                      : "text-slate-505 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-105 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">ID &amp; Tenant Hotel</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Issue</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Activity</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTickets.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="p-4.5 pl-6">
                    <div>
                      <p className="font-mono text-xs font-extrabold text-indigo-650 dark:text-indigo-400 leading-none">{tc.id}</p>
                      <p className="font-bold text-slate-905 dark:text-white mt-1">{tc.hotel}</p>
                    </div>
                  </td>
                  <td className="p-4.5 max-w-xs">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{tc.subject}</p>
                  </td>
                  <td className="p-4.5 text-xs font-bold text-slate-500">
                    {tc.category}
                  </td>
                  <td className="p-4.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getPriorityBadge(tc.priority)}`}>
                      {tc.priority}
                    </span>
                  </td>
                  <td className="p-4.5 text-sm text-slate-500 dark:text-slate-450 font-medium">
                    {tc.lastActivity}
                  </td>
                  <td className="p-4.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(tc.status)}`}>
                      {tc.status}
                    </span>
                  </td>
                  <td className="p-4.5 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleOpenTicket(tc)}
                        className="h-8.5 px-3 rounded-lg text-indigo-650 hover:text-indigo-755 hover:bg-slate-105 dark:hover:bg-slate-800 flex items-center gap-1 font-bold text-xs"
                      >
                        <MessageSquare size={13} />
                        Assist
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(tc.id)}
                        className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-105 dark:hover:bg-slate-800"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-400 text-sm font-medium">
                    No support tickets found in search indices.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assist conversational dialogue drawer modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/45 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%", opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.9 }}
              className="bg-white dark:bg-slate-900 border-l border-slate-205 dark:border-slate-850 w-full max-w-lg h-full shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-extrabold text-indigo-650 dark:text-indigo-400">{selectedTicket.id}</span>
                  <h3 className="text-lg font-bold text-slate-905 dark:text-white mt-1 leading-tight">{selectedTicket.hotel}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{selectedTicket.subject}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-550"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status config section inside drawer */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">STATUS TRIGGER:</span>
                <div className="flex gap-1.5">
                  {["Open", "In Progress", "Resolved"].map((stat) => (
                    <button
                      key={stat}
                      onClick={() => updateTicketStatus(selectedTicket.id, stat)}
                      className={`px-2 py-1 rounded transition-all ${
                        selectedTicket.status === stat
                          ? "bg-slate-900 text-white dark:bg-indigo-650"
                          : "bg-white border text-slate-600 hover:bg-slate-105 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat timeline */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-950/20">
                {selectedTicket.conversation.map((msg, i) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div key={i} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className="flex items-start gap-2.5 max-w-[80%]">
                        {!isAdmin && (
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg shrink-0">
                            <User size={13} />
                          </div>
                        )}
                        <div>
                          <div
                            className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                              isAdmin
                                ? "bg-indigo-600 text-white rounded-tr-none"
                                : "bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 block px-1 text-right">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex gap-2">
                <Input
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Enter detailed reply message content..."
                  className="rounded-xl h-11 bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-xs"
                />
                <Button
                  type="submit"
                  className="h-11 w-11 p-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md"
                >
                  <Send size={15} />
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
