"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  CalendarCheck,
  Plus,
  Search,
  Bed,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Eye,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
  UserCheck,
  RefreshCw,
  Filter,
  Calendar,
  MapPin,
  CreditCard,
  Users,
  ZoomIn,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { BookingRoute } from "@/routes/business/bookingRoute";
import { RoomRoute } from "@/routes/business/roomRoute";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";

export default function BookingsPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Form State for New Booking
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    // Guest info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idProofType: "Aadhar Card",
    idProofNumber: "",
    idProofImage: "",
    address: "",
    city: "",
    state: "",
    // Stay info
    room: "",
    checkInDate: new Date().toISOString().split("T")[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    adultsCount: 1,
    childrenCount: 0,
    specialRequests: "",
    // Financial & status
    totalAmount: "",
    paidAmount: 0,
    paymentStatus: "Unpaid",
    bookingStatus: "Confirmed",
  });

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [bookingRes, roomRes] = await Promise.all([
        BookingRoute.getBookings(),
        RoomRoute.getRooms(),
      ]);

      if (bookingRes && bookingRes.success !== false) {
        setBookings(bookingRes.data || (Array.isArray(bookingRes) ? bookingRes : []));
      } else {
        setErrorMsg(bookingRes?.message || "Failed to load bookings.");
      }

      if (roomRes && roomRes.success !== false) {
        setRooms(roomRes.data || (Array.isArray(roomRes) ? roomRes : []));
      }
    } catch (err) {
      console.error("Failed to load bookings or rooms:", err);
      setErrorMsg("Failed to load booking data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Bookings
  const filteredBookings = bookings.filter((booking) => {
    const guestName = `${booking.guestId?.firstName || ""} ${
      booking.guestId?.lastName || ""
    }`.toLowerCase();
    const guestPhone = (booking.guestId?.phone || "").toLowerCase();
    const roomNum = (booking.room?.roomNumber || "").toLowerCase();
    const idNum = (booking.guestId?.idProofNumber || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      guestName.includes(query) ||
      guestPhone.includes(query) ||
      roomNum.includes(query) ||
      idNum.includes(query);

    const matchesStatus =
      statusFilter === "ALL" || booking.bookingStatus === statusFilter;

    const matchesPayment =
      paymentFilter === "ALL" || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Compute stats
  const totalBookingsCount = bookings.length;
  const activeCheckIns = bookings.filter(
    (b) => b.bookingStatus === "CheckedIn"
  ).length;
  const pendingConfirmed = bookings.filter(
    (b) => b.bookingStatus === "Confirmed" || b.bookingStatus === "Pending"
  ).length;
  const totalRevenue = bookings.reduce(
    (acc, b) => acc + (Number(b.paidAmount) || 0),
    0
  );

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "room" || name === "checkInDate" || name === "checkOutDate") {
        const selectedRoom = rooms.find(
          (r) => r._id === (name === "room" ? value : prev.room)
        );
        const inDate = new Date(
          name === "checkInDate" ? value : prev.checkInDate
        );
        const outDate = new Date(
          name === "checkOutDate" ? value : prev.checkOutDate
        );

        if (
          selectedRoom &&
          selectedRoom.roomType &&
          !isNaN(inDate) &&
          !isNaN(outDate) &&
          outDate > inDate
        ) {
          const nights = Math.max(
            1,
            Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24))
          );
          const pricePerNight = Number(selectedRoom.roomType.pricePerNight) || 0;
          if (pricePerNight > 0) {
            updated.totalAmount = nights * pricePerNight;
          }
        }
      }

      // Enforce Paid Amount cannot be greater than Total Amount
      const totalAmt = Number(updated.totalAmount) || 0;
      let paidAmt = Number(updated.paidAmount) || 0;

      if (totalAmt > 0 && paidAmt > totalAmt) {
        updated.paidAmount = totalAmt;
        paidAmt = totalAmt;
      }

      // Auto update payment status
      if (totalAmt > 0 && paidAmt >= totalAmt) {
        updated.paymentStatus = "Paid";
      } else if (paidAmt > 0) {
        updated.paymentStatus = "PartiallyPaid";
      } else {
        updated.paymentStatus = "Unpaid";
      }

      return updated;
    });
  };

  // Upload Guest ID Proof Photo to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);
    setErrorMsg("");

    try {
      const res = await CloudinaryImage.uploadSingleImage(
        file,
        "guest_id_proofs",
        (progress) => setUploadProgress(progress)
      );

      if (res && res.data && res.data.url) {
        setFormData((prev) => ({ ...prev, idProofImage: res.data.url }));
        setSuccessMsg("ID proof photo uploaded successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else if (res && res.url) {
        setFormData((prev) => ({ ...prev, idProofImage: res.url }));
        setSuccessMsg("ID proof photo uploaded successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        throw new Error("Invalid upload response format");
      }
    } catch (err) {
      console.error("ID Image Upload Error:", err);
      setErrorMsg("Failed to upload ID proof photo. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Create Booking Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.room) {
      setErrorMsg("Please fill in required fields (Guest Name, Phone, Room).");
      return;
    }

    if (
      Number(formData.totalAmount) > 0 &&
      Number(formData.paidAmount) > Number(formData.totalAmount)
    ) {
      setErrorMsg("Paid amount cannot be greater than Total bill amount.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber,
        idProofImage: formData.idProofImage,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        room: formData.room,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        adultsCount: formData.adultsCount,
        childrenCount: formData.childrenCount,
        specialRequests: formData.specialRequests,
        totalAmount: Number(formData.totalAmount) || 0,
        paidAmount: Number(formData.paidAmount) || 0,
        paymentStatus: formData.paymentStatus,
        bookingStatus: formData.bookingStatus,
      };

      const res = await BookingRoute.createBooking(payload);
      if (res.success || res.status === 201) {
        setSuccessMsg("Booking created successfully!");
        setIsCreateModalOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          idProofType: "Aadhar Card",
          idProofNumber: "",
          idProofImage: "",
          address: "",
          city: "",
          state: "",
          room: "",
          checkInDate: new Date().toISOString().split("T")[0],
          checkOutDate: new Date(Date.now() + 86400000)
            .toISOString()
            .split("T")[0],
          adultsCount: 1,
          childrenCount: 0,
          specialRequests: "",
          totalAmount: "",
          paidAmount: 0,
          paymentStatus: "Unpaid",
          bookingStatus: "Confirmed",
        });
        fetchData();
      } else {
        setErrorMsg(res.message || "Failed to create booking.");
      }
    } catch (err) {
      console.error("Create Booking Error:", err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Action: Update Booking Status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const res = await BookingRoute.updateBooking(bookingId, {
        bookingStatus: newStatus,
      });
      if (res.success || res.status === 200) {
        setSuccessMsg(`Booking status updated to ${newStatus}.`);
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchData();
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking(res.data || { ...selectedBooking, bookingStatus: newStatus });
        }
      } else {
        setErrorMsg(res.message || "Failed to update status.");
      }
    } catch (err) {
      setErrorMsg("Failed to update booking status.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking record?")) return;

    try {
      setLoading(true);
      const res = await BookingRoute.deleteBooking(bookingId);
      if (res.success || res.status === 200) {
        setSuccessMsg("Booking deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchData();
        setIsViewModalOpen(false);
      } else {
        setErrorMsg(res.message || "Failed to delete booking.");
      }
    } catch (err) {
      setErrorMsg("Failed to delete booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Booking Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Manage guest check-ins, reservations, and identity proofs for{" "}
              {user?.hotelName || user?.name || "your property"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-semibold shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Plus size={18} />
              New Booking
            </button>
          </div>
        </div>

        {/* Global Action Messages */}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-sm font-semibold">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Key Metrics Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Bookings
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {totalBookingsCount}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">All recorded stays</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CalendarCheck size={24} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Check-Ins
              </p>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {activeCheckIns}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Currently in-house</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck size={24} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Confirmed / Pending
              </p>
              <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {pendingConfirmed}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Upcoming stays</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock size={24} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Collected Revenue
              </p>
              <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                ₹{totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Paid payments</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Guest Name, Phone, Room Number, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="CheckedIn">Checked In</option>
                <option value="CheckedOut">Checked Out</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Payment:
              </span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="ALL">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="PartiallyPaid">Partially Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Loading bookings data...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bed className="h-12 w-12 mx-auto opacity-30 mb-3" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                No bookings found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search query or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <th className="py-4 px-6">Guest Info</th>
                    <th className="py-4 px-6">Guest ID Proof</th>
                    <th className="py-4 px-6">Room</th>
                    <th className="py-4 px-6">Dates</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {filteredBookings.map((b) => {
                    const guest = b.guestId || {};
                    const room = b.room || {};
                    const checkIn = b.checkInDate
                      ? new Date(b.checkInDate).toLocaleDateString()
                      : "N/A";
                    const checkOut = b.checkOutDate
                      ? new Date(b.checkOutDate).toLocaleDateString()
                      : "N/A";

                    return (
                      <tr
                        key={b._id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Guest Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm border border-indigo-500/20">
                              {(guest.firstName?.[0] || "G").toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {guest.firstName} {guest.lastName}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                                <Phone size={12} />
                                {guest.phone || "No Phone"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Guest ID Proof & Image */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {guest.idProofType || "ID Card"}:{" "}
                              <span className="font-mono text-slate-500">
                                {guest.idProofNumber || "N/A"}
                              </span>
                            </div>

                            {guest.idProofImage ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage(guest.idProofImage);
                                  setIsImageModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                              >
                                <ImageIcon size={14} />
                                View ID Photo
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                No ID Photo
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Room details */}
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-black text-slate-900 dark:text-white">
                              Room {room.roomNumber || "N/A"}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">
                              {room.roomType?.roomType || "Standard"}
                            </div>
                          </div>
                        </td>

                        {/* Stay Dates */}
                        <td className="py-4 px-6">
                          <div className="text-xs space-y-0.5">
                            <div>
                              <span className="text-slate-400">In:</span>{" "}
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {checkIn}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Out:</span>{" "}
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {checkOut}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Financial Info */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              ₹{(b.totalAmount || 0).toLocaleString()}
                              <span className="text-slate-400 font-normal ml-1">
                                (Paid: ₹{(b.paidAmount || 0).toLocaleString()})
                              </span>
                            </div>
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                                b.paymentStatus === "Paid"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                  : b.paymentStatus === "PartiallyPaid"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                                  : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                              }`}
                            >
                              {b.paymentStatus || "Unpaid"}
                            </span>
                          </div>
                        </td>

                        {/* Booking Status Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              b.bookingStatus === "CheckedIn"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                : b.bookingStatus === "Confirmed"
                                ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400"
                                : b.bookingStatus === "CheckedOut"
                                ? "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"
                                : b.bookingStatus === "Cancelled"
                                ? "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                            }`}
                          >
                            {b.bookingStatus === "CheckedIn" && (
                              <UserCheck size={14} />
                            )}
                            {b.bookingStatus}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {b.bookingStatus === "Confirmed" && (
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                                onClick={() => handleUpdateStatus(b._id, "CheckedIn")}
                              >
                                Check In
                              </button>
                            )}

                            {b.bookingStatus === "CheckedIn" && (
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                                onClick={() => handleUpdateStatus(b._id, "CheckedOut")}
                              >
                                Check Out
                              </button>
                            )}

                            <button
                              type="button"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="View Details"
                              onClick={() => {
                                setSelectedBooking(b);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Booking"
                              onClick={() => handleDeleteBooking(b._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ---------------- NEW BOOKING MODAL ---------------- */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      New Booking & Guest Entry
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Register stay details and upload guest identity photo.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form Body */}
                <form
                  onSubmit={handleCreateSubmit}
                  className="p-6 overflow-y-auto space-y-6 flex-1 text-sm"
                >
                  {/* Guest Information */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                      <User size={16} />
                      Guest Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="John"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="+91 9876543210"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ID Proof Section */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                      <ShieldCheck size={16} />
                      Identity Document & ID Photo
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          ID Document Type
                        </label>
                        <select
                          name="idProofType"
                          value={formData.idProofType}
                          onChange={handleInputChange}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        >
                          <option value="Aadhar Card">Aadhar Card</option>
                          <option value="PAN Card">PAN Card</option>
                          <option value="Passport">Passport</option>
                          <option value="Driving License">Driving License</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          ID Document Number
                        </label>
                        <input
                          type="text"
                          name="idProofNumber"
                          placeholder="e.g. 1234-5678-9012"
                          value={formData.idProofNumber}
                          onChange={handleInputChange}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* ID Proof Image Uploader */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                        Guest ID Photo Upload (Cloudinary)
                      </label>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {formData.idProofImage ? (
                          <div className="relative group w-32 h-20 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            <img
                              src={formData.idProofImage}
                              alt="Guest ID Proof"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, idProofImage: "" }))}
                              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-32 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-2 shrink-0 font-medium">
                            <ImageIcon size={20} className="mb-1 opacity-50" />
                            No Photo
                          </div>
                        )}

                        <div className="flex-1 space-y-2 w-full">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all">
                            {uploadingImage ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Upload size={14} />
                            )}
                            {uploadingImage ? "Uploading..." : "Upload Photo"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                            />
                          </label>

                          {uploadingImage && (
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room & Stay Details */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                      <Bed size={16} />
                      Room & Dates
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Select Room <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="room"
                          required
                          value={formData.room}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        >
                          <option value="">-- Select Room --</option>
                          {rooms.map((r) => (
                            <option key={r._id} value={r._id}>
                              Room {r.roomNumber} ({r.roomType?.roomType || "Standard"} - ₹
                              {r.roomType?.pricePerNight || 0}/night)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Check-In Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="checkInDate"
                          required
                          value={formData.checkInDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Check-Out Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="checkOutDate"
                          required
                          value={formData.checkOutDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial & Initial Status */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                      <DollarSign size={16} />
                      Billing & Initial Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Total Amount (₹)
                        </label>
                        <input
                          type="number"
                          name="totalAmount"
                          placeholder="0"
                          value={formData.totalAmount}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Paid Amount (₹)
                        </label>
                        <input
                          type="number"
                          name="paidAmount"
                          placeholder="0"
                          min="0"
                          max={formData.totalAmount || undefined}
                          value={formData.paidAmount}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Initial Status
                        </label>
                        <select
                          name="bookingStatus"
                          value={formData.bookingStatus}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 font-medium focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="CheckedIn">Checked In</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || uploadingImage}
                      className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition-all"
                    >
                      {submitting && <Loader2 size={16} className="animate-spin" />}
                      Save Booking
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------------- VIEW DETAILS MODAL ---------------- */}
        <AnimatePresence>
          {isViewModalOpen && selectedBooking && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden my-6"
              >
                {/* Modal Header */}
                <div className="relative p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between border-b border-indigo-900/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        <CalendarCheck size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                          Booking Details
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-indigo-200/90 font-mono bg-indigo-900/60 px-2.5 py-0.5 rounded-md border border-indigo-700/40">
                            ID: #{selectedBooking._id}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedBooking._id);
                              setCopiedId(true);
                              setTimeout(() => setCopiedId(false), 2000);
                            }}
                            className="text-indigo-300 hover:text-white transition-colors p-1"
                            title="Copy ID"
                          >
                            {copiedId ? (
                              <Check size={14} className="text-emerald-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5 text-sm max-h-[78vh] overflow-y-auto">
                  {/* Status Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Booking Status:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                          selectedBooking.bookingStatus === "CheckedIn"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                            : selectedBooking.bookingStatus === "Confirmed"
                            ? "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400"
                            : selectedBooking.bookingStatus === "CheckedOut"
                            ? "bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-400"
                            : selectedBooking.bookingStatus === "Cancelled"
                            ? "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400"
                            : "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400"
                        }`}
                      >
                        {selectedBooking.bookingStatus === "CheckedIn" && (
                          <UserCheck size={14} />
                        )}
                        {selectedBooking.bookingStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Payment:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                          selectedBooking.paymentStatus === "Paid"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                            : selectedBooking.paymentStatus === "PartiallyPaid" ||
                              selectedBooking.paymentStatus === "Partially Paid"
                            ? "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400"
                            : "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400"
                        }`}
                      >
                        {selectedBooking.paymentStatus || "Unpaid"}
                      </span>
                    </div>
                  </div>

                  {/* Guest Profile Banner */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/20 border border-white/20">
                        {(
                          selectedBooking.guestId?.firstName?.[0] || "G"
                        ).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                          {selectedBooking.guestId?.firstName}{" "}
                          {selectedBooking.guestId?.lastName}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/50">
                            <ShieldCheck size={12} /> Verified Guest
                          </span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Phone size={13} className="text-indigo-500" />
                            {selectedBooking.guestId?.phone || "N/A"}
                          </span>
                          {selectedBooking.guestId?.email && (
                            <span className="flex items-center gap-1.5">
                              <Mail size={13} className="text-indigo-500" />
                              {selectedBooking.guestId.email}
                            </span>
                          )}
                          {selectedBooking.guestId?.city && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} className="text-indigo-500" />
                              {selectedBooking.guestId.city}
                              {selectedBooking.guestId.state
                                ? `, ${selectedBooking.guestId.state}`
                                : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stay & Room Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Dates & Duration Card */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                          <Calendar size={15} /> Dates & Stay Duration
                        </span>
                        {selectedBooking.checkInDate &&
                          selectedBooking.checkOutDate && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px]">
                              {Math.max(
                                1,
                                Math.ceil(
                                  (new Date(selectedBooking.checkOutDate) -
                                    new Date(selectedBooking.checkInDate)) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )}{" "}
                              Night(s)
                            </span>
                          )}
                      </div>
                      <div className="flex items-center justify-between pt-1 text-slate-900 dark:text-white">
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase font-semibold">
                            Check-In
                          </p>
                          <p className="font-bold text-sm">
                            {selectedBooking.checkInDate
                              ? new Date(
                                  selectedBooking.checkInDate
                                ).toLocaleDateString(undefined, {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-slate-300 dark:text-slate-600 font-black">
                          →
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-400 uppercase font-semibold">
                            Check-Out
                          </p>
                          <p className="font-bold text-sm">
                            {selectedBooking.checkOutDate
                              ? new Date(
                                  selectedBooking.checkOutDate
                                ).toLocaleDateString(undefined, {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Room & Occupancy Card */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                          <Bed size={15} /> Room & Occupants
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase font-semibold">
                            Assigned Room
                          </p>
                          <p className="font-black text-slate-900 dark:text-white text-base">
                            Room {selectedBooking.room?.roomNumber || "N/A"}
                          </p>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            {selectedBooking.room?.roomType?.roomType ||
                              selectedBooking.room?.roomType?.name ||
                              "Standard Room"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-400 uppercase font-semibold">
                            Guests
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1 justify-end">
                            <Users size={14} className="text-slate-400" />
                            {selectedBooking.adultsCount || 1} Adult(s)
                            {selectedBooking.childrenCount > 0
                              ? `, ${selectedBooking.childrenCount} Child`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown Grid */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                        <CreditCard size={15} /> Financial Summary
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">
                          Total Bill
                        </p>
                        <p className="font-black text-slate-900 dark:text-white text-lg mt-0.5">
                          ₹{(selectedBooking.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">
                          Paid Amount
                        </p>
                        <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg mt-0.5">
                          ₹{(selectedBooking.paidAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">
                          Balance Due
                        </p>
                        <p
                          className={`font-black text-lg mt-0.5 ${
                            (selectedBooking.totalAmount || 0) -
                              (selectedBooking.paidAmount || 0) >
                            0
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          ₹
                          {Math.max(
                            0,
                            (selectedBooking.totalAmount || 0) -
                              (selectedBooking.paidAmount || 0)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ID Proof Box - ENHANCED DOCUMENT DISPLAY */}
                  <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <ShieldCheck size={16} />
                        Guest ID Document
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-500/20">
                          {selectedBooking.guestId?.idProofType || "ID Document"}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                          {selectedBooking.guestId?.idProofNumber || "N/A"}
                        </span>
                      </div>
                    </div>

                    {selectedBooking.guestId?.idProofImage ? (
                      <div className="space-y-2">
                        <div
                          onClick={() => {
                            setPreviewImage(
                              selectedBooking.guestId.idProofImage
                            );
                            setIsImageModalOpen(true);
                          }}
                          className="group relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/90 dark:bg-slate-950 flex items-center justify-center p-2 cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-xl"
                        >
                          <img
                            src={selectedBooking.guestId.idProofImage}
                            alt="Guest Identity Document"
                            className="max-h-36 w-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center gap-2 text-white font-bold text-xs">
                            <span className="px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white shadow-lg flex items-center gap-1.5 backdrop-blur-md text-[11px]">
                              <ZoomIn size={14} /> Enlarge Image
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs px-1">
                          <span className="text-slate-400 font-medium text-[11px]">
                            Click image for full lightbox view
                          </span>
                          <a
                            href={selectedBooking.guestId.idProofImage}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                          >
                            <ExternalLink size={14} />
                            Open Original Photo
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-400 space-y-1">
                        <ImageIcon
                          size={24}
                          className="mx-auto text-slate-300 dark:text-slate-700"
                        />
                        <p className="text-xs italic font-medium">
                          No ID document photo attached for this guest.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Special Requests (if any) */}
                  {selectedBooking.specialRequests && (
                    <div className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-1">
                      <p className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                        Special Requests / Notes
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 italic">
                        "{selectedBooking.specialRequests}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-medium">
                    Booked on:{" "}
                    {selectedBooking.createdAt
                      ? new Date(
                          selectedBooking.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ---------------- ENLARGED IMAGE MODAL ---------------- */}
        <AnimatePresence>
          {isImageModalOpen && previewImage && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setIsImageModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-3 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <a
                    href={previewImage}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors backdrop-blur-md border border-slate-700/50 flex items-center gap-1.5 text-xs font-bold px-3"
                  >
                    <ExternalLink size={14} /> Open Original
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(false)}
                    className="p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors backdrop-blur-md border border-slate-700/50"
                  >
                    <X size={18} />
                  </button>
                </div>
                <img
                  src={previewImage}
                  alt="Enlarged Guest ID Photo"
                  className="w-auto h-auto max-w-full max-h-[82vh] object-contain rounded-2xl border border-slate-800/60 shadow-inner"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
