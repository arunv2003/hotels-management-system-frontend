"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  Bell,
  Users,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  X,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Scheduled System Maintenance",
    content: "The platform will undergo routine database optimization on Sunday, May 24th, between 02:00 AM and 04:00 AM UTC. Expect brief service interruptions of up to 10 minutes.",
    type: "warning",
    audience: "All",
    status: "Active",
    publishDate: "2026-05-20",
    clicks: 145,
  },
  {
    id: "ann-2",
    title: "Version 4.2.0 Released!",
    content: "We've rolled out new performance analytics, faster dashboard load times, and an improved multi-currency billing integration for all enterprise hotel tiers.",
    type: "success",
    audience: "Hotel Admins",
    status: "Active",
    publishDate: "2026-05-18",
    clicks: 382,
  },
  {
    id: "ann-3",
    title: "New GST Configuration Policies",
    content: "Please ensure your tax parameters are updated in alignment with the newly modified local standard rates. Refer to our latest compliance guides for details.",
    type: "info",
    audience: "Hotel Admins",
    status: "Scheduled",
    publishDate: "2026-05-25",
    clicks: 0,
  },
  {
    id: "ann-4",
    title: "Security Update: Session Expirations",
    content: "To bolster tenant data protection, inactive administrative sessions will now automatically terminate after 30 minutes. Make sure to save your drafts frequently.",
    type: "alert",
    audience: "All",
    status: "Draft",
    publishDate: "2026-05-15",
    clicks: 0,
  },
];

export default function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAudience, setFilterAudience] = useState("all");
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAnn, setCurrentAnn] = useState({
    id: "",
    title: "",
    content: "",
    type: "info",
    audience: "All",
    status: "Draft",
    publishDate: new Date().toISOString().split("T")[0],
  });

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || ann.type === filterType;
    const matchesAudience = filterAudience === "all" || ann.audience === filterAudience;
    return matchesSearch && matchesType && matchesAudience;
  });

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentAnn({
      id: `ann-${Date.now()}`,
      title: "",
      content: "",
      type: "info",
      audience: "All",
      status: "Active",
      publishDate: new Date().toISOString().split("T")[0],
      clicks: 0,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setIsEditMode(true);
    setCurrentAnn({ ...ann });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter((ann) => ann.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentAnn.title.trim() || !currentAnn.content.trim()) {
      alert("Please fill in both title and content.");
      return;
    }

    if (isEditMode) {
      setAnnouncements(
        announcements.map((ann) => (ann.id === currentAnn.id ? currentAnn : ann))
      );
    } else {
      setAnnouncements([currentAnn, ...announcements]);
    }
    setIsOpen(false);
  };

  // Status/Type helper details
  const getTypeStyles = (type) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20",
          text: "text-amber-700 dark:text-amber-400",
          badge: "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400",
          icon: <AlertTriangle className="text-amber-500 shrink-0" size={16} />,
        };
      case "success":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
          text: "text-emerald-700 dark:text-emerald-400",
          badge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400",
          icon: <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />,
        };
      case "alert":
        return {
          bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
          text: "text-rose-700 dark:text-rose-400",
          badge: "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400",
          icon: <Bell className="text-rose-500 shrink-0" size={16} />,
        };
      default:
        return {
          bg: "bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20",
          text: "text-sky-700 dark:text-sky-400",
          badge: "bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-400",
          icon: <Info className="text-sky-500 shrink-0" size={16} />,
        };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Scheduled":
        return "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    }
  };

  // Metrics
  const activeCount = announcements.filter((a) => a.status === "Active").length;
  const scheduledCount = announcements.filter((a) => a.status === "Scheduled").length;
  const totalClicks = announcements.reduce((sum, a) => sum + (a.clicks || 0), 0);

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Megaphone className="text-indigo-600 dark:text-indigo-400" size={32} />
            Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Broadcast platform-wide updates, release notes, and alerts to hotel tenants and partners.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 gap-2 cursor-pointer transition-all shadow-md hover:shadow-indigo-600/10"
        >
          <Plus size={18} />
          Create Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Broadcasts", val: announcements.length, icon: <Megaphone className="text-indigo-600" /> },
          { label: "Active Now", val: activeCount, icon: <CheckCircle2 className="text-emerald-600" /> },
          { label: "Scheduled", val: scheduledCount, icon: <Calendar className="text-amber-600" /> },
          { label: "Total Views/Clicks", val: totalClicks, icon: <Eye className="text-sky-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-950 dark:text-white mt-1">{stat.val}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout: Filters and Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10.5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-400 px-2.5 font-bold">Type:</span>
              {["all", "info", "success", "warning", "alert"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                    filterType === t
                      ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-400 px-2.5 font-bold">Audience:</span>
              {["all", "All", "Hotel Admins"].map((a) => (
                <button
                  key={a}
                  onClick={() => setFilterAudience(a)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                    filterAudience === a
                      ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {a === "all" ? "All Tiers" : a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Title &amp; Type</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Audience</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Publish Date</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Clicks</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredAnnouncements.map((ann) => {
                const styles = getTypeStyles(ann.type);
                return (
                  <tr key={ann.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="p-4.5 pl-6 max-w-sm">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-2 rounded-lg border ${styles.bg}`}>
                          {styles.icon}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">{ann.title}</p>
                          <p className="text-xs text-slate-450 dark:text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4.5 text-sm font-semibold text-slate-700 dark:text-slate-350">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-105 dark:bg-slate-800 rounded-lg text-xs font-bold">
                        <Users size={12} className="text-slate-400" />
                        {ann.audience}
                      </span>
                    </td>
                    <td className="p-4.5 text-sm text-slate-500 dark:text-slate-450 font-medium">
                      {ann.publishDate}
                    </td>
                    <td className="p-4.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {ann.clicks} views
                    </td>
                    <td className="p-4.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(ann.status)}`}>
                        {ann.status}
                      </span>
                    </td>
                    <td className="p-4.5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleOpenEdit(ann)}
                          className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-indigo-650 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(ann.id)}
                          className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAnnouncements.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400 text-sm font-medium">
                    No announcements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEditMode ? "Edit Announcement" : "Create Announcement"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-550"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4.5">
                <div>
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Title</label>
                  <Input
                    value={currentAnn.title}
                    onChange={(e) => setCurrentAnn({ ...currentAnn, title: e.target.value })}
                    placeholder="E.g., System Update v4.2.1"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Type</label>
                    <select
                      value={currentAnn.type}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, type: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Target Audience</label>
                    <select
                      value={currentAnn.audience}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, audience: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                    >
                      <option value="All">All Tenants &amp; Users</option>
                      <option value="Hotel Admins">Hotel Admins Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Publish Date</label>
                    <Input
                      type="date"
                      value={currentAnn.publishDate}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, publishDate: e.target.value })}
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Publish Status</label>
                    <select
                      value={currentAnn.status}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, status: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                    >
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Content</label>
                  <textarea
                    value={currentAnn.content}
                    onChange={(e) => setCurrentAnn({ ...currentAnn, content: e.target.value })}
                    placeholder="Enter the broadcast message detailed body content here..."
                    rows={4}
                    className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-3">
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
                    className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md"
                  >
                    {isEditMode ? "Save Changes" : "Create &amp; Publish"}
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
