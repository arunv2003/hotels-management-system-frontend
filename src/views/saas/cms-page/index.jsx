"use client";
import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
  Settings,
  Eye,
  CheckCircle,
  FileEdit,
  X,
  Layers,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_CMS_PAGES = [
  {
    id: "cms-1",
    title: "Privacy Policy",
    slug: "privacy-policy",
    status: "Published",
    metaTitle: "Privacy Policy & GDPR Compliance | Hotel HMS",
    metaDesc: "Read our privacy policy guidelines and GDPR data protocols carefully to understand how tenant data is stored and utilized.",
    lastUpdated: "2026-05-10 14:32",
    content: "This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our SaaS platform. We strictly secure and isolate all tenant database contents in highly protected VPC environments...",
  },
  {
    id: "cms-2",
    title: "Terms of Service",
    slug: "terms-of-service",
    status: "Published",
    metaTitle: "Terms of Service | Hotel Management SaaS",
    metaDesc: "Comprehensive terms of use, licensing configurations, billing policies, and legal parameters for hotel subscription tiers.",
    lastUpdated: "2026-05-12 09:15",
    content: "By activating your hotel subscription or launching the platform, you agree to these legal and operational terms. Multi-tenant instances are monitored for performance thresholds and automated security auditing...",
  },
  {
    id: "cms-3",
    title: "Refund & Cancellation Policy",
    slug: "refund-policy",
    status: "Draft",
    metaTitle: "Refunds and Cancellation Terms | HMS",
    metaDesc: "Find information about trial tier conversions, annual prepayment billing cycles, and customer cancellation refunds.",
    lastUpdated: "2026-05-18 17:40",
    content: "Subscribers can terminate their accounts at any time. Monthly plan prepayments are eligible for partial refunds within the first 7 days of activation subject to auditing parameters. Please reach out to billing support...",
  },
  {
    id: "cms-4",
    title: "SLA Agreement",
    slug: "sla-agreement",
    status: "Published",
    metaTitle: "Enterprise SLA Guarantees & Uptime Status | HMS",
    metaDesc: "Platform Service Level Agreements, 99.9% uptime commitments, disaster recovery policies, and maintenance schedules.",
    lastUpdated: "2026-05-15 11:22",
    content: "We commit to a 99.9% platform availability guarantee outside of planned maintenance windows. High-availability clusters run on AWS multi-zone infrastructure to handle high guest traffic volumes seamlessly...",
  },
];

export default function CMSPageView() {
  const [pages, setPages] = useState(MOCK_CMS_PAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    id: "",
    title: "",
    slug: "",
    status: "Draft",
    metaTitle: "",
    metaDesc: "",
    content: "",
    lastUpdated: "",
  });

  const filteredPages = pages.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTitleChange = (val) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setCurrentPage({
      ...currentPage,
      title: val,
      slug: slug,
      metaTitle: `${val} | HMS Platform`,
    });
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentPage({
      id: `cms-${Date.now()}`,
      title: "",
      slug: "",
      status: "Draft",
      metaTitle: "",
      metaDesc: "",
      content: "",
      lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 16),
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (p) => {
    setIsEditMode(true);
    setCurrentPage({ ...p });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this CMS page?")) {
      setPages(pages.filter((p) => p.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentPage.title.trim() || !currentPage.slug.trim()) {
      alert("Please fill in the title and unique slug.");
      return;
    }

    const updatedPage = {
      ...currentPage,
      lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    if (isEditMode) {
      setPages(pages.map((p) => (p.id === currentPage.id ? updatedPage : p)));
    } else {
      setPages([updatedPage, ...pages]);
    }
    setIsOpen(false);
  };

  // Metrics
  const totalPages = pages.length;
  const publishedPages = pages.filter((p) => p.status === "Published").length;
  const draftPages = pages.filter((p) => p.status === "Draft").length;

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Globe className="text-indigo-650 dark:text-indigo-400" size={32} />
            CMS Pages
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Build, publish, and manage legal agreements, policies, and rich-text pages for your public platform.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="rounded-xl bg-indigo-655 hover:bg-indigo-700 text-white h-11 px-6 gap-2 cursor-pointer transition-all shadow-md hover:shadow-indigo-600/10"
        >
          <Plus size={18} />
          Create Page
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Platform Pages", val: totalPages, icon: <Layers className="text-indigo-600" /> },
          { label: "Published & Active", val: publishedPages, icon: <CheckCircle className="text-emerald-600" /> },
          { label: "Draft pages", val: draftPages, icon: <FileEdit className="text-amber-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-105 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
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

      {/* Grid List & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <Input
              placeholder="Search by slug, title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Published", "Draft"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-xs px-4 py-2 rounded-xl font-bold border transition-all ${
                  filterStatus === status
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-650 dark:border-indigo-650"
                    : "bg-white border-slate-205 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                {status === "all" ? "All Pages" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Table representation */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Page &amp; Route URL</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">SEO Meta Title</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Modified</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredPages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="p-4.5 pl-6 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{p.title}</p>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 font-mono">
                          /{p.slug}
                          <ExternalLink size={10} className="text-slate-400/80" />
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4.5 max-w-sm">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{p.metaTitle}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{p.metaDesc}</p>
                  </td>
                  <td className="p-4.5 text-sm text-slate-500 dark:text-slate-450 font-medium">
                    {p.lastUpdated}
                  </td>
                  <td className="p-4.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === "Published"
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4.5 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleOpenEdit(p)}
                        className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-indigo-650 hover:bg-slate-105 dark:hover:bg-slate-800"
                      >
                        <Edit2 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(p.id)}
                        className="h-8.5 w-8.5 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-105 dark:hover:bg-slate-800"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPages.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-400 text-sm font-medium">
                    No CMS pages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings size={20} className="text-indigo-600" />
                  {isEditMode ? `Edit Page: ${currentPage.title}` : "Create New CMS Page"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-550"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Page Name</label>
                    <Input
                      value={currentPage.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="E.g., Privacy Policy"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Page Slug (Slug URL)</label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">/</span>
                      <Input
                        value={currentPage.slug}
                        onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                        placeholder="privacy-policy"
                        className="pl-7 h-11 rounded-xl bg-slate-55 dark:bg-slate-955 border-slate-205 dark:border-slate-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">SEO Meta Title</label>
                    <Input
                      value={currentPage.metaTitle}
                      onChange={(e) => setCurrentPage({ ...currentPage, metaTitle: e.target.value })}
                      placeholder="Enter meta title tag..."
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Publish Status</label>
                    <select
                      value={currentPage.status}
                      onChange={(e) => setCurrentPage({ ...currentPage, status: e.target.value })}
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                    >
                      <option value="Published">Published (Live)</option>
                      <option value="Draft">Draft (Offline)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">SEO Meta Description</label>
                  <textarea
                    value={currentPage.metaDesc}
                    onChange={(e) => setCurrentPage({ ...currentPage, metaDesc: e.target.value })}
                    placeholder="Short description for Google search engine indexing snippets (150-160 characters suggested)..."
                    rows={2.5}
                    className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-sm font-medium text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    <span>Page Core Content</span>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider font-mono">HTML / Plain Text Supported</span>
                  </label>
                  <textarea
                    value={currentPage.content}
                    onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                    placeholder="Type the full detailed page content markup or plain text guidelines here..."
                    rows={8}
                    className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-55 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-sm font-mono text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-indigo-650 resize-y"
                  />
                </div>

                <div className="pt-5 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-3">
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
                    className="h-11 rounded-xl px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md"
                  >
                    {isEditMode ? "Update Page" : "Publish CMS Page"}
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
