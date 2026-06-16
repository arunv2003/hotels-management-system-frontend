"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Quote,
  ThumbsUp,
  ThumbsDown,
  Building2,
  Award,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestimonialDialog } from "@/components/dilogs/saas/testimonial/testimonial.dilogs";
import { TestimonialRoutes } from "@/routes/saas/testimonial/testimonial.route";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [current, setCurrent] = useState({
    _id: "",
    author: "",
    role: "",
    hotel: "",
    rating: 5,
    content: "",
    status: "Pending",
    submittedOn: new Date().toISOString().split("T")[0],
    avatar: "",
    avatarPreview: "",
  });

  // Fetch all testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await TestimonialRoutes.getAllTestimonials();
        if (response.data && Array.isArray(response.data)) {
          setTestimonials(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        toast({
          title: "Error",
          description: "Failed to load testimonials",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [toast]);

  const filtered = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    const hotelVal = t.hotel;
    const hotelName = typeof hotelVal === "object" && hotelVal !== null
      ? (hotelVal.name || hotelVal.hotelName || "")
      : (hotelVal || "");
    
    const matchesSearch =
      t.author.toLowerCase().includes(q) ||
      hotelName.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id, status) => {
    try {
      setSubmitting(true);
      const testimony = testimonials.find((t) => t._id === id);
      if (!testimony) return;

      const updatedData = { ...testimony, status };
      await TestimonialRoutes.updateTestimonials(id, updatedData);

      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
      toast({
        title: "Success",
        description: `Testimonial ${status.toLowerCase()}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this testimonial permanently?")) {
      try {
        setSubmitting(true);
        await TestimonialRoutes.deletetestimonials(id);
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
        toast({
          title: "Success",
          description: "Testimonial deleted",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
        toast({
          title: "Error",
          description: "Failed to delete testimonial",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrent({
      _id: "",
      author: "",
      role: "",
      hotel: "",
      rating: 5,
      content: "",
      status: "Pending",
      submittedOn: new Date().toISOString().split("T")[0],
      avatar: "",
      avatarPreview: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (t) => {
    setIsEditMode(true);
    setCurrent({ ...t, avatarPreview: t.avatar || "" });
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!current.author.trim() || !current.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Author and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      // Strip avatarPreview (UI-only field) before sending to backend
      const { avatarPreview, ...entry } = current;

      if (isEditMode) {
        await TestimonialRoutes.updateTestimonials(current._id, entry);
        setTestimonials((prev) =>
          prev.map((t) => (t._id === current._id ? entry : t))
        );
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
          variant: "default",
        });
      } else {
        const response = await TestimonialRoutes.createTestimonials(entry);
        if (response.data) {
          setTestimonials((prev) => [response.data, ...prev]);
        }
        toast({
          title: "Success",
          description: "Testimonial created successfully",
          variant: "default",
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      toast({
        title: "Error",
        description: isEditMode
          ? "Failed to update testimonial"
          : "Failed to create testimonial",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
                  key={t._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
                >
                  {/* Author */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      {t.avatar && t.avatar.startsWith("http") ? (
                        <img
                          src={t.avatar}
                          alt={t.author}
                          className={`w-9 h-9 rounded-xl object-cover shrink-0`}
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                            AVATAR_COLORS[idx % AVATAR_COLORS.length]
                          }`}
                        >
                          {t.author.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                          {t.author}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Building2 size={10} />
                          {typeof t.hotel === "object" && t.hotel !== null
                            ? (t.hotel.name || t.hotel.hotelName || "Unknown Hotel")
                            : (t.hotel || "")}
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
                          disabled={submitting}
                          variant="ghost"
                          onClick={() => updateStatus(t._id, "Approved")}
                          className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-50"
                          title="Approve"
                        >
                          {submitting ? <Loader size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                        </Button>
                      )}
                      {t.status !== "Rejected" && (
                        <Button
                          disabled={submitting}
                          variant="ghost"
                          onClick={() => updateStatus(t._id, "Rejected")}
                          className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-50"
                          title="Reject"
                        >
                          {submitting ? <Loader size={15} className="animate-spin" /> : <XCircle size={15} />}
                        </Button>
                      )}
                      <Button
                        disabled={submitting}
                        variant="ghost"
                        onClick={() => handleOpenEdit(t)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        disabled={submitting}
                        variant="ghost"
                        onClick={() => handleDelete(t._id)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
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
                    {loading ? "Loading testimonials..." : "No testimonials found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal – now in its own dialog component */}
      <TestimonialDialog
        isOpen={isOpen}
        isEditMode={isEditMode}
        current={current}
        submitting={submitting}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        setCurrent={setCurrent}
      />
    </div>
  );
}
