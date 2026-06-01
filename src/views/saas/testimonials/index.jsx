"use client";
import React, { useState } from "react";
import {
  Star,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Quote,
  X,
  ThumbsUp,
  ThumbsDown,
  Building2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_TESTIMONIALS = [
  {
    id: "tm-1",
    author: "Rajesh Mehta",
    role: "General Manager",
    hotel: "Grand Hyatt New Delhi",
    rating: 5,
    content:
      "Switching to HMS transformed our entire front-desk workflow. Check-in speeds improved by 40% and our staff now spends less time on manual entries. A truly world-class hotel management platform.",
    status: "Approved",
    submittedOn: "2026-05-10",
    avatar: "RM",
  },
  {
    id: "tm-2",
    author: "Sophie Leclerc",
    role: "Director of Operations",
    hotel: "Paris Ritz Gateway",
    rating: 5,
    content:
      "The integrated POS, housekeeping, and billing modules talk to each other seamlessly. We eliminated three legacy systems and consolidated everything into one beautiful interface.",
    status: "Approved",
    submittedOn: "2026-05-14",
    avatar: "SL",
  },
  {
    id: "tm-3",
    author: "James Okafor",
    role: "Revenue Manager",
    hotel: "Lagos Continental",
    rating: 4,
    content:
      "Solid analytics and reporting. The multi-currency billing has been a game-changer for our international guests. Would love deeper housekeeping granularity in future updates.",
    status: "Pending",
    submittedOn: "2026-05-18",
    avatar: "JO",
  },
  {
    id: "tm-4",
    author: "Mei Lin Zhang",
    role: "IT Head",
    hotel: "Shanghai Marriott Tower",
    rating: 4,
    content:
      "Deployment was surprisingly smooth for an enterprise product. The team onboarding support was exceptional. API documentation could be more detailed, but overall very impressed.",
    status: "Pending",
    submittedOn: "2026-05-20",
    avatar: "MZ",
  },
  {
    id: "tm-5",
    author: "Carlos Rivera",
    role: "Property Owner",
    hotel: "Cancun Beach Resort",
    rating: 3,
    content:
      "Good product overall but the mobile version needs more polish. Tablet responsiveness on Safari has occasional UI glitches. Desktop experience is excellent.",
    status: "Rejected",
    submittedOn: "2026-05-08",
    avatar: "CR",
  },
];

const STAR_COLORS = [
  "text-rose-400",
  "text-orange-400",
  "text-amber-400",
  "text-lime-500",
  "text-emerald-500",
];

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
];

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState(MOCK_TESTIMONIALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [current, setCurrent] = useState({
    id: "",
    author: "",
    role: "",
    hotel: "",
    rating: 5,
    content: "",
    status: "Pending",
    submittedOn: new Date().toISOString().split("T")[0],
    avatar: "",
  });

  const filtered = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.author.toLowerCase().includes(q) ||
      t.hotel.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, status) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const handleDelete = (id) => {
    if (confirm("Delete this testimonial permanently?")) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrent({
      id: `tm-${Date.now()}`,
      author: "",
      role: "",
      hotel: "",
      rating: 5,
      content: "",
      status: "Pending",
      submittedOn: new Date().toISOString().split("T")[0],
      avatar: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (t) => {
    setIsEditMode(true);
    setCurrent({ ...t });
    setIsOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!current.author.trim() || !current.content.trim()) {
      alert("Author and content are required.");
      return;
    }
    const initials = current.author
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const entry = { ...current, avatar: initials };
    if (isEditMode) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === current.id ? entry : t))
      );
    } else {
      setTestimonials((prev) => [entry, ...prev]);
    }
    setIsOpen(false);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        className={
          i < rating
            ? `${STAR_COLORS[rating - 1]} fill-current`
            : "text-slate-200 dark:text-slate-700"
        }
      />
    ));

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Rejected":
        return "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
      default:
        return "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
    }
  };

  // Metrics
  const approvedCount = testimonials.filter((t) => t.status === "Approved").length;
  const pendingCount = testimonials.filter((t) => t.status === "Pending").length;
  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
        ).toFixed(1)
      : "—";

  return (
    <div className="space-y-8 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Quote className="text-indigo-600 dark:text-indigo-400" size={32} />
            Testimonials
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Curate and moderate hotel partner feedback to build trust and social
            proof for your SaaS platform.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 gap-2 cursor-pointer shadow-md"
        >
          <Plus size={18} />
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Submissions",
            val: testimonials.length,
            icon: <Quote className="text-indigo-600" />,
          },
          {
            label: "Published & Live",
            val: approvedCount,
            icon: <ThumbsUp className="text-emerald-600" />,
          },
          {
            label: "Awaiting Review",
            val: pendingCount,
            icon: <Award className="text-amber-600" />,
          },
          {
            label: "Avg Platform Rating",
            val: `${avgRating} / 5`,
            icon: <Star className="text-yellow-500 fill-yellow-500" />,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {s.label}
              </span>
              <p className="text-2xl font-bold text-slate-950 dark:text-white mt-1">
                {s.val}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by author, hotel or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Approved", "Pending", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-4 py-2 rounded-xl font-bold border transition-all ${
                  filterStatus === s
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">
                  Author &amp; Hotel
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Review Excerpt
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((t, idx) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
                >
                  {/* Author */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          AVATAR_COLORS[idx % AVATAR_COLORS.length]
                        }`}
                      >
                        {t.avatar || t.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                          {t.author}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Building2 size={10} />
                          {t.hotel}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Content */}
                  <td className="p-4 max-w-sm">
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {t.content}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                      {t.role}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="p-4">
                    <div className="flex items-center gap-0.5">
                      {renderStars(t.rating)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                      {t.rating}.0 / 5
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-450 font-medium">
                    {t.submittedOn}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status !== "Approved" && (
                        <Button
                          variant="ghost"
                          onClick={() => updateStatus(t.id, "Approved")}
                          className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                          title="Approve"
                        >
                          <CheckCircle2 size={15} />
                        </Button>
                      )}
                      {t.status !== "Rejected" && (
                        <Button
                          variant="ghost"
                          onClick={() => updateStatus(t.id, "Rejected")}
                          className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          title="Reject"
                        >
                          <XCircle size={15} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => handleOpenEdit(t)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(t.id)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-slate-400 text-sm font-medium"
                  >
                    No testimonials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Author Name
                    </label>
                    <Input
                      value={current.author}
                      onChange={(e) =>
                        setCurrent({ ...current, author: e.target.value })
                      }
                      placeholder="E.g., Rajesh Mehta"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Job Title / Role
                    </label>
                    <Input
                      value={current.role}
                      onChange={(e) =>
                        setCurrent({ ...current, role: e.target.value })
                      }
                      placeholder="E.g., General Manager"
                      className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Hotel / Property Name
                  </label>
                  <Input
                    value={current.hotel}
                    onChange={(e) =>
                      setCurrent({ ...current, hotel: e.target.value })
                    }
                    placeholder="E.g., Grand Hyatt New Delhi"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Star Rating Picker */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Star Rating
                    </label>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCurrent({ ...current, rating: n })}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={22}
                            className={
                              n <= current.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200 dark:text-slate-700"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Publication Status
                    </label>
                    <select
                      value={current.status}
                      onChange={(e) =>
                        setCurrent({ ...current, status: e.target.value })
                      }
                      className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Approved">Approved &amp; Live</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Testimonial Review Content
                  </label>
                  <textarea
                    value={current.content}
                    onChange={(e) =>
                      setCurrent({ ...current, content: e.target.value })
                    }
                    placeholder="Enter the guest or partner testimonial review text here..."
                    rows={4}
                    className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="h-11 rounded-xl px-5 text-slate-500 font-semibold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-md"
                  >
                    {isEditMode ? "Save Changes" : "Submit Testimonial"}
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
