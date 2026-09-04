"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Users,
  User,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  FileText,
  Eye,
  Edit,
  UserCheck,
  Upload,
  Image as ImageIcon,
  Loader2,
  CalendarDays,
  ExternalLink,
  ZoomIn,
  Building,
  BadgeAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { GuestRoute } from "@/routes/business/guestRoute";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";
import Pagination from "@/components/shared/Pagination";

export default function GuestsPage() {
  const { user } = useAuthStore();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [idTypeFilter, setIdTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGuestDetails, setSelectedGuestDetails] = useState(null);
  const [selectedGuestBookings, setSelectedGuestBookings] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ID Image Lightbox Modal
  const [previewImage, setPreviewImage] = useState(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State for Add / Edit Guest
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    idProofType: "Aadhar Card",
    idProofNumber: "",
    idProofImage: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await GuestRoute.getGuests();
      if (res && res.success === false) {
        setError(res.message || "Failed to fetch guests list.");
        setGuests([]);
      } else {
        setGuests(res?.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load guests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingGuest(null);
    setFormError("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      idProofType: "Aadhar Card",
      idProofNumber: "",
      idProofImage: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (guest) => {
    setEditingGuest(guest);
    setFormError("");
    setFormData({
      firstName: guest.firstName || "",
      lastName: guest.lastName || "",
      email: guest.email || "",
      phone: guest.phone || "",
      alternatePhone: guest.alternatePhone || "",
      idProofType: guest.idProofType || "Aadhar Card",
      idProofNumber: guest.idProofNumber || "",
      idProofImage: guest.idProofImage || "",
      address: guest.address || "",
      city: guest.city || "",
      state: guest.state || "",
      country: guest.country || "India",
      pincode: guest.pincode || "",
    });
    setIsAddEditModalOpen(true);
  };

  // View Guest Details & Booking History
  const handleViewGuestDetails = async (guest) => {
    setSelectedGuestDetails(guest);
    setSelectedGuestBookings([]);
    setIsViewModalOpen(true);
    setLoadingDetails(true);

    try {
      const res = await GuestRoute.getGuestById(guest._id);
      if (res && res.success !== false && res.data) {
        setSelectedGuestDetails(res.data.guest || guest);
        setSelectedGuestBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch guest details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);
    setFormError("");

    try {
      const res = await CloudinaryImage.uploadSingleImage(
        file,
        "guest_id_proofs",
        (progress) => setUploadProgress(progress)
      );

      if (res && (res.data?.url || res.url)) {
        const imageUrl = res.data?.url || res.url;
        setFormData((prev) => ({ ...prev, idProofImage: imageUrl }));
      } else {
        throw new Error("Invalid upload response");
      }
    } catch (err) {
      setFormError("Failed to upload ID proof photo. Please try again.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Submit Add / Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.firstName.trim()) {
      setFormError("First Name is required.");
      return;
    }
    if (!formData.phone.trim()) {
      setFormError("Phone Number is required.");
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (editingGuest) {
        res = await GuestRoute.updateGuest(editingGuest._id, formData);
      } else {
        res = await GuestRoute.createGuest(formData);
      }

      if (res && res.success === false) {
        setFormError(res.message || "Operation failed.");
        setSubmitting(false);
        return;
      }

      setActionSuccess(
        editingGuest ? "Guest updated successfully!" : "Guest added successfully!"
      );
      setIsAddEditModalOpen(false);
      await loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Failed to save guest.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Guest
  const handleDeleteGuest = async (id) => {
    setDeleting(true);
    try {
      const res = await GuestRoute.deleteGuest(id);
      if (res && res.success === false) {
        setError(res.message || "Failed to delete guest.");
        setDeleting(false);
        return;
      }
      setActionSuccess("Guest deleted successfully.");
      setDeleteConfirmId(null);
      await loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete guest.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Guests list
  const filteredGuests = guests.filter((g) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      `${g.firstName || ""} ${g.lastName || ""}`.toLowerCase().includes(term) ||
      (g.phone || "").toLowerCase().includes(term) ||
      (g.alternatePhone || "").toLowerCase().includes(term) ||
      (g.email || "").toLowerCase().includes(term) ||
      (g.idProofNumber || "").toLowerCase().includes(term) ||
      (g.city || "").toLowerCase().includes(term);

    const matchesIdType = idTypeFilter === "ALL" || g.idProofType === idTypeFilter;

    return matchesSearch && matchesIdType;
  });

  const totalPages = Math.ceil(filteredGuests.length / pageSize) || 1;
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate quick stats
  const totalGuestsCount = guests.length;
  const verifiedIdCount = guests.filter((g) => g.idProofImage || g.idProofNumber).length;
  const totalStaysCount = guests.reduce((sum, g) => sum + (g.totalBookings || 0), 0);
  const uniqueCitiesCount = new Set(guests.map((g) => g.city).filter(Boolean)).size;

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 pb-12">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 sm:gap-3">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              Guest Directory & Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm font-medium">
              Comprehensive database of all registered hotel guests, ID verification documents, and stay histories for{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {user?.hotelName || user?.name || "your property"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={loadData}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm font-semibold shadow-sm"
              title="Refresh Directory"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-indigo-600" : ""} />
              Refresh
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
            >
              <Plus size={18} />
              Add Guest
            </button>
          </div>
        </div>

        {/* Global Action Banner */}
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-sm"
          >
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            {actionSuccess}
          </motion.div>
        )}

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Users size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Guests</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalGuestsCount}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <UserCheck size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">ID Verified Guests</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{verifiedIdCount}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold shrink-0">
              <CalendarDays size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Recorded Stays</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalStaysCount}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shrink-0">
              <MapPin size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Cities Represented</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{uniqueCitiesCount}</h3>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search guest by name, phone, email, ID or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 sm:h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium w-full"
            />
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={16} className="text-slate-400" />
              <span className="text-xs font-bold uppercase text-slate-400">ID Proof:</span>
            </div>
            <select
              value={idTypeFilter}
              onChange={(e) => setIdTypeFilter(e.target.value)}
              className="flex-1 sm:flex-none h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All ID Types</option>
              <option value="Aadhar Card">Aadhar Card</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-4 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold">Loading guests directory...</p>
          </div>
        ) : error ? (
          <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 text-slate-500 text-center">
            <Users className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">No Guests Found</h3>
            <p className="text-xs sm:text-sm mt-1">
              {guests.length === 0
                ? 'No guest records found yet. Click "Add Guest" or create a booking to add guests.'
                : "No guests match your current filter parameters."}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto table-scrollbar relative">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm text-[11px] uppercase font-extrabold tracking-wider text-slate-400">
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Guest Info</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Contact Number</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">ID Proof Document</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Location</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Stays History</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Registered On</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {paginatedGuests.map((guest) => {
                    const fullName = `${guest.firstName || ""} ${guest.lastName || ""}`.trim() || "Unnamed Guest";
                    const initials = `${guest.firstName?.[0] || ""}${guest.lastName?.[0] || ""}`.toUpperCase() || "G";
                    const isDeleting = deleteConfirmId === guest._id;

                    return (
                      <tr
                        key={guest._id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Guest Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {fullName}
                              </p>
                              {guest.email ? (
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Mail size={12} className="text-slate-400" />
                                  {guest.email}
                                </p>
                              ) : (
                                <span className="text-xs text-slate-400 italic">No email provided</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact Number */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                              <Phone size={14} className="text-emerald-500" />
                              {guest.phone}
                            </div>
                            {guest.alternatePhone && (
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="font-bold text-[10px] uppercase text-slate-400">Alt:</span>
                                {guest.alternatePhone}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* ID Proof Document */}
                        <td className="py-4 px-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {guest.idProofType || "ID Document"}
                              </span>
                            </div>
                            {guest.idProofNumber ? (
                              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                                #{guest.idProofNumber}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No ID Number</p>
                            )}

                            {guest.idProofImage ? (
                              <button
                                onClick={() => setPreviewImage(guest.idProofImage)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
                              >
                                <Eye size={13} />
                                View ID Photo
                              </button>
                            ) : (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                <BadgeAlert size={12} /> Photo Pending
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-6">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <MapPin size={13} className="text-rose-500" />
                              {guest.city || "N/A"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {[guest.state, guest.country].filter(Boolean).join(", ") || "India"}
                            </p>
                          </div>
                        </td>

                        {/* Stays History */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                              {guest.totalBookings || 0} {guest.totalBookings === 1 ? "Stay" : "Stays"}
                            </span>
                            {guest.lastBooking && (
                              <p className="text-[11px] text-slate-400">
                                Last: {new Date(guest.lastBooking).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Registered On */}
                        <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                          {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString() : "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          {isDeleting ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs font-bold text-rose-600 mr-1">Delete guest?</span>
                              <button
                                onClick={() => handleDeleteGuest(guest._id)}
                                disabled={deleting}
                                className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                                title="Confirm Delete"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleViewGuestDetails(guest)}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                                title="View Details & Bookings"
                              >
                                <Eye size={17} />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(guest)}
                                className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                                title="Edit Guest Info"
                              >
                                <Edit size={17} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(guest._id)}
                                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                title="Delete Guest"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredGuests.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        {/* Add / Edit Guest Modal */}
        <AnimatePresence>
          {isAddEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
                      <User size={18} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {editingGuest ? "Edit Guest Profile" : "Register New Guest"}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">
                        {editingGuest
                          ? "Update guest details and ID verification"
                          : "Fill in guest info, ID proof and address"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Body */}
                <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto">
                  <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">

                    {/* Error Banner */}
                    {formError && (
                      <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 text-sm font-semibold">
                        <AlertCircle size={16} className="shrink-0" />
                        {formError}
                      </div>
                    )}

                    {/* Section 1: Personal Info */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <User size={13} className="text-indigo-500" />
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          Personal Information
                        </span>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            First Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rahul"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            Last Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sharma"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            Phone Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            Alternate Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 9123456789"
                            value={formData.alternatePhone}
                            onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. rahul.sharma@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: ID Proof */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <ShieldCheck size={13} className="text-indigo-500" />
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          Identity Verification
                        </span>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            ID Proof Type
                          </label>
                          <select
                            value={formData.idProofType}
                            onChange={(e) => setFormData({ ...formData, idProofType: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all cursor-pointer"
                          >
                            <option value="Aadhar Card">Aadhar Card</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            ID Number / Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1234 5678 9012"
                            value={formData.idProofNumber}
                            onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>

                        {/* Upload Area */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            ID Document Photo
                          </label>
                          <div className="flex items-stretch gap-3">
                            {/* Thumbnail */}
                            {formData.idProofImage ? (
                              <div className="relative shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 shadow group">
                                <img src={formData.idProofImage} alt="ID Proof" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, idProofImage: "" })}
                                  className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                  title="Remove"
                                >
                                  <X size={16} className="text-white" />
                                </button>
                              </div>
                            ) : (
                              <div className="shrink-0 w-24 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600">
                                <ImageIcon size={20} />
                                <span className="text-[9px] font-bold uppercase tracking-wide">No Photo</span>
                              </div>
                            )}

                            {/* Drop Zone */}
                            <label className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer group min-h-[80px]">
                              {uploadingImage ? (
                                <div className="flex flex-col items-center gap-2 w-full px-4">
                                  <Loader2 size={18} className="text-indigo-500 animate-spin" />
                                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    Uploading {uploadProgress}%…
                                  </span>
                                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                      style={{ width: `${uploadProgress}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Upload size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {formData.idProofImage ? "Replace Photo" : "Click to Upload"}
                                  </span>
                                  <span className="text-[10px] text-slate-400">JPG, PNG, WEBP supported</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Address */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <MapPin size={13} className="text-indigo-500" />
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          Address Details
                        </span>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                            Street Address
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Flat 302, Green Avenue, MG Road"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">City</label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">State</label>
                          <input
                            type="text"
                            placeholder="e.g. Maharashtra"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Country</label>
                          <input
                            type="text"
                            placeholder="e.g. India"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Pincode</label>
                          <input
                            type="text"
                            placeholder="e.g. 400001"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            className="w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Sticky Footer */}
                  <div className="sticky bottom-0 px-4 sm:px-6 py-3.5 sm:py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                    <p className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
                      <span className="text-rose-500 font-bold">*</span> Required fields
                    </p>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsAddEditModalOpen(false)}
                        className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || uploadingImage}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            {editingGuest ? "Update Guest" : "Save Guest"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View Guest Details & Stay History Modal */}
        <AnimatePresence>
          {isViewModalOpen && selectedGuestDetails && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden my-4 sm:my-8"
              >
                {/* Modal Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md shrink-0">
                      {`${selectedGuestDetails.firstName?.[0] || ""}${selectedGuestDetails.lastName?.[0] || ""}`.toUpperCase() || "G"}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {`${selectedGuestDetails.firstName || ""} ${selectedGuestDetails.lastName || ""}`.trim()}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>Phone: {selectedGuestDetails.phone}</span>
                        <span>•</span>
                        <span>Registered: {new Date(selectedGuestDetails.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto">
                  {/* Guest Info Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {/* Contact & Address */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Phone size={14} /> Contact & Address
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-xs text-slate-400 block font-semibold">Primary Phone</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedGuestDetails.phone}</span>
                        </div>
                        {selectedGuestDetails.alternatePhone && (
                          <div>
                            <span className="text-xs text-slate-400 block font-semibold">Alternate Phone</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedGuestDetails.alternatePhone}</span>
                          </div>
                        )}
                        {selectedGuestDetails.email && (
                          <div>
                            <span className="text-xs text-slate-400 block font-semibold">Email</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedGuestDetails.email}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-slate-400 block font-semibold">Address</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {[
                              selectedGuestDetails.address,
                              selectedGuestDetails.city,
                              selectedGuestDetails.state,
                              selectedGuestDetails.country,
                              selectedGuestDetails.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ") || "No full address recorded"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ID Proof Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <ShieldCheck size={14} /> ID Proof Verification
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-xs text-slate-400 block font-semibold">Document Type</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {selectedGuestDetails.idProofType || "Aadhar Card"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block font-semibold">Document Number</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {selectedGuestDetails.idProofNumber || "N/A"}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs text-slate-400 block font-semibold mb-1">ID Photo Attachment</span>
                          {selectedGuestDetails.idProofImage ? (
                            <div className="relative group w-full h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                              <img
                                src={selectedGuestDetails.idProofImage}
                                alt="ID Proof Document"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => setPreviewImage(selectedGuestDetails.idProofImage)}
                                  className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg"
                                >
                                  <ZoomIn size={14} /> Enlarge Photo
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-medium">
                              No ID proof image uploaded for this guest.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking History Section */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <CalendarDays size={18} className="text-indigo-600" />
                      Stay & Booking History ({selectedGuestBookings.length})
                    </h4>

                    {loadingDetails ? (
                      <div className="flex items-center justify-center p-8 text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
                        <span className="text-xs font-semibold">Fetching guest stay history...</span>
                      </div>
                    ) : selectedGuestBookings.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-center text-slate-400 text-xs font-medium">
                        No previous bookings found for this guest.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedGuestBookings.map((bk) => (
                          <div
                            key={bk._id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                  Room {bk.room?.roomNumber || "Unassigned"}
                                </span>
                                {bk.room?.roomType?.roomType && (
                                  <span className="text-xs text-slate-500 font-medium">
                                    ({bk.room.roomType.roomType})
                                  </span>
                                )}
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                  {bk.bookingStatus || "Confirmed"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">
                                Check-in: {new Date(bk.checkInDate).toLocaleDateString()} — Check-out:{" "}
                                {new Date(bk.checkOutDate).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="text-right sm:text-right font-semibold">
                              <p className="text-sm font-black text-slate-900 dark:text-white">
                                ₹{bk.totalAmount || 0}
                              </p>
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {bk.paymentStatus || "Unpaid"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleOpenEditModal(selectedGuestDetails);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Edit size={14} /> Edit Profile
                  </button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Lightbox ID Document Image Modal */}
        <AnimatePresence>
          {previewImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-4xl w-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl p-4 flex flex-col items-center"
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors z-10"
                >
                  <X size={20} />
                </button>

                <div className="w-full flex justify-center items-center py-4 max-h-[80vh] overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Enlarged Guest ID Proof Photo"
                    className="max-h-[75vh] w-auto object-contain rounded-2xl border border-slate-800 shadow-xl"
                  />
                </div>

                <div className="w-full flex justify-between items-center px-4 pt-2">
                  <span className="text-xs font-semibold text-slate-400">Guest Identity Document</span>
                  <a
                    href={previewImage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline"
                  >
                    <ExternalLink size={14} /> Open Full Size
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
