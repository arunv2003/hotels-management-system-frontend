"use client";
import React, { useState, useEffect } from "react";
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
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementRoutes } from "@/routes/saas/anouncement/anouncement.route";
import { useToast } from "@/hooks/use-toast";
import Pagination from "@/components/shared/Pagination";

export default function AnnouncementsView() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAudience, setFilterAudience] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAnn, setCurrentAnn] = useState({
    _id: "",
    title: "",
    content: "",
    type: "info",
    audience: "All",
    status: "Active",
    publishDate: new Date().toISOString().split("T")[0],
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await AnnouncementRoutes.getAllAnnouncements();
      if (res?.data && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to load announcements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((ann) => {
    const title = ann.title || "";
    const content = ann.content || "";
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || ann.type === filterType;
    const matchesAudience = filterAudience === "all" || ann.audience === filterAudience;
    return matchesSearch && matchesType && matchesAudience;
  });

  const totalPages = Math.ceil(filteredAnnouncements.length / pageSize) || 1;
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentAnn({
      _id: "",
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
    const pubDate = ann.publishDate
      ? new Date(ann.publishDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setCurrentAnn({ ...ann, publishDate: pubDate });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        setSubmitting(true);
        await AnnouncementRoutes.deleteAnnouncement(id);
        setAnnouncements((prev) => prev.filter((ann) => (ann._id || ann.id) !== id));
        toast({
          title: "Success",
          description: "Announcement deleted successfully",
        });
      } catch (err) {
        console.error("Failed to delete announcement:", err);
        toast({
          title: "Error",
          description: err?.response?.data?.message || "Failed to delete announcement",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentAnn.title.trim() || !currentAnn.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: currentAnn.title,
        content: currentAnn.content,
        type: currentAnn.type,
        audience: currentAnn.audience,
        status: currentAnn.status,
        publishDate: currentAnn.publishDate || new Date().toISOString().split("T")[0],
      };

      if (isEditMode) {
        const id = currentAnn._id || currentAnn.id;
        const res = await AnnouncementRoutes.updateAnnouncement(id, payload);
        if (res?.data) {
          setAnnouncements((prev) =>
            prev.map((ann) => ((ann._id || ann.id) === id ? res.data : ann))
          );
        }
        toast({
          title: "Success",
          description: "Announcement updated successfully",
        });
      } else {
        const res = await AnnouncementRoutes.createAnnouncement(payload);
        if (res?.data) {
          setAnnouncements((prev) => [res.data, ...prev]);
        }
        toast({
          title: "Success",
          description: "Announcement created successfully",
        });
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to save announcement:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to save announcement",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 gap-2 cursor-pointer transition-all shadow-md hover:shadow-indigo-600/10"
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
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.val}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout: Filters and Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800">
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

        {/* Announcements Table */}
        <div className="flex-1 overflow-auto max-h-[480px] relative">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Title &amp; Type</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Audience</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Publish Date</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Clicks</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedAnnouncements.map((ann) => {
                const annId = ann._id || ann.id;
                const styles = getTypeStyles(ann.type);
                const formattedDate = ann.publishDate
                  ? new Date(ann.publishDate).toLocaleDateString()
                  : "-";

                return (
                  <tr key={annId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="p-4.5 pl-6 max-w-sm">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-2 rounded-lg border ${styles.bg}`}>
                          {styles.icon}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">{ann.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
                        <Users size={12} className="text-slate-400" />
                        {ann.audience}
                      </span>
                    </td>
                    <td className="p-4.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {formattedDate}
                    </td>
                    <td className="p-4.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {ann.clicks || 0} views
                    </td>
                    <td className="p-4.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(ann.status)}`}>
                        {ann.status}
                      </span>
                    </td>
                    <td className="p-4.5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          disabled={submitting}
                          variant="ghost"
                          onClick={() => handleOpenEdit(ann)}
                          className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                        >
                          <Edit2 size={15} />
                        </Button>
                        <Button
                          disabled={submitting}
                          variant="ghost"
                          onClick={() => handleDelete(annId)}
                          className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
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
                    {loading ? "Loading announcements..." : "No announcements found."}
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
          totalItems={filteredAnnouncements.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEditMode ? "Edit Announcement" : "Create Announcement"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4.5">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Title</label>
                  <Input
                    value={currentAnn.title}
                    onChange={(e) => setCurrentAnn({ ...currentAnn, title: e.target.value })}
                    placeholder="E.g., System Update v4.2.1"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Type</label>
                    <select
                      value={currentAnn.type}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, type: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="info" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Info</option>
                      <option value="success" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Success</option>
                      <option value="warning" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Warning</option>
                      <option value="alert" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Target Audience</label>
                    <select
                      value={currentAnn.audience}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, audience: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Tenants &amp; Users</option>
                      <option value="Hotel Admins" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Hotel Admins Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Publish Date</label>
                    <Input
                      type="date"
                      value={currentAnn.publishDate}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, publishDate: e.target.value })}
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Publish Status</label>
                    <select
                      value={currentAnn.status}
                      onChange={(e) => setCurrentAnn({ ...currentAnn, status: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Active</option>
                      <option value="Scheduled" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Scheduled</option>
                      <option value="Draft" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Content</label>
                  <textarea
                    value={currentAnn.content}
                    onChange={(e) => setCurrentAnn({ ...currentAnn, content: e.target.value })}
                    placeholder="Enter the broadcast message detailed body content here..."
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
                    disabled={submitting}
                    className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting && <Loader className="animate-spin" size={16} />}
                    {isEditMode ? "Save Changes" : "Create & Publish"}
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
