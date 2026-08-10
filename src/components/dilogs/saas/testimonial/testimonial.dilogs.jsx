"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Loader,
  ImagePlus,
  Trash2,
  CheckCircle2,
  Building2,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";
import { HotelRoute } from "@/routes/saas/hotels/hotels.route";

// ─────────────────────────────────────────────
// TestimonialDialog – self-contained modal
// Props:
//   isOpen        : boolean
//   isEditMode    : boolean
//   current       : testimonial object
//   submitting    : boolean
//   onClose       : () => void
//   onSave        : (e) => void
//   setCurrent    : (updater) => void
// ─────────────────────────────────────────────
export function TestimonialDialog({
  isOpen,
  isEditMode,
  current,
  submitting,
  onClose,
  onSave,
  setCurrent,
}) {
  const fileInputRef = useRef(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // ── Hotel searchable dropdown state ──
  const dropdownRef = useRef(null);
  const [hotelQuery, setHotelQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch hotels from API
  const fetchHotels = useCallback(async () => {
    setHotelsLoading(true);
    try {
      const res = await HotelRoute.getAllHotels();
      // Defensively extract array from any response shape:
      // [], { data: [] }, { data: { data: [] } }, { hotels: [] }
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.hotels)) {
        list = res.hotels;
      } else if (Array.isArray(res?.data?.hotels)) {
        list = res.data.hotels;
      }
      setHotels(list);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
      setHotels([]);
    } finally {
      setHotelsLoading(false);
    }
  }, []);

  // Fetch once when dropdown first opens
  useEffect(() => {
    if (dropdownOpen && hotels.length === 0) {
      fetchHotels();
    }
  }, [dropdownOpen, hotels.length, fetchHotels]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync display name when hotel id/value changes (edit mode)
  // Use hotels.length as a stable primitive dep — avoids "array size changed" error
  useEffect(() => {
    if (!current.hotel) {
      setHotelQuery("");
      return;
    }
    
    // If current.hotel is an object (populated from backend)
    if (typeof current.hotel === "object" && current.hotel !== null) {
      const hotelId = current.hotel._id;
      const hotelName = current.hotel.name || current.hotel.hotelName || "";
      setHotelQuery(hotelName);
      setCurrent((prev) => ({ ...prev, hotel: hotelId }));
      return;
    }

    // If it does NOT look like a 24-char ObjectId, treat as plain name string
    const isObjectId = /^[a-f\d]{24}$/i.test(current.hotel);
    if (!isObjectId) {
      setHotelQuery(current.hotel);
      return;
    }
    // ObjectId — look up the display name from loaded hotels
    if (hotels.length > 0) {
      const matched = hotels.find((h) => h._id === current.hotel);
      if (matched) {
        setHotelQuery(matched.name || matched.hotelName || "");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.hotel, hotels.length]);

  const filteredHotels = Array.isArray(hotels)
    ? hotels.filter((h) => {
        const name = h.name || h.hotelName || "";
        return name.toLowerCase().includes(hotelQuery.toLowerCase());
      })
    : [];

  const handleHotelSelect = (hotel) => {
    const name = hotel.name || hotel.hotelName || "";
    // Store the ObjectId in current.hotel (what backend expects)
    setCurrent((prev) => ({ ...prev, hotel: hotel._id }));
    // Show the hotel name in the search input (display only)
    setHotelQuery(name);
    setDropdownOpen(false);
  };

  // Handle file selection → upload to Cloudinary
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately using object URL
    const localPreview = URL.createObjectURL(file);
    setCurrent((prev) => ({ ...prev, avatarPreview: localPreview, avatar: "" }));

    setImageUploading(true);
    setUploadError("");

    try {
      const result = await CloudinaryImage.uploadSingleImage(
        file,
        "testimonials"
      );
      // result.data.url or result.url depending on backend shape
      const url =
        result?.data?.url || result?.url || result?.data?.secure_url || result?.secure_url || "";

      setCurrent((prev) => ({ ...prev, avatar: url, avatarPreview: url }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError("Image upload failed. Please try again.");
      // revert preview on failure
      setCurrent((prev) => ({ ...prev, avatarPreview: "", avatar: "" }));
    } finally {
      setImageUploading(false);
      // reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setCurrent((prev) => ({ ...prev, avatar: "", avatarPreview: "" }));
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Decide which preview src to use
  const previewSrc = current.avatarPreview || current.avatar || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {isEditMode ? "Update guest testimonial details & status" : "Create a new testimonial review highlight"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content - Scrollable with no-scrollbar */}
            <form
              id="testimonial-modal-form"
              onSubmit={onSave}
              className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1"
            >
              {/* Author & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Author Name
                  </label>
                  <Input
                    value={current.author}
                    onChange={(e) =>
                      setCurrent((prev) => ({ ...prev, author: e.target.value }))
                    }
                    placeholder="E.g., Rajesh Mehta"
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Job Title / Role
                  </label>
                  <Input
                    value={current.role}
                    onChange={(e) =>
                      setCurrent((prev) => ({ ...prev, role: e.target.value }))
                    }
                    placeholder="E.g., General Manager"
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Hotel – Searchable Dropdown */}
              <div ref={dropdownRef} className="relative space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Hotel / Property Name
                </label>

                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={hotelQuery}
                    onFocus={() => setDropdownOpen(true)}
                    onChange={(e) => {
                      setHotelQuery(e.target.value);
                      setCurrent((prev) => ({ ...prev, hotel: e.target.value }));
                      setDropdownOpen(true);
                    }}
                    placeholder="Search hotel name…"
                    className="w-full h-11 pl-9 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {hotelsLoading ? (
                      <Loader size={15} className="animate-spin text-indigo-500" />
                    ) : (
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>

                {/* Dropdown list */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.14 }}
                      className="absolute z-50 mt-1.5 w-full max-h-52 overflow-y-auto no-scrollbar rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl py-1"
                    >
                      {hotelsLoading ? (
                        <li className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
                          <Loader size={14} className="animate-spin text-indigo-500" />
                          Loading hotels…
                        </li>
                      ) : filteredHotels.length === 0 ? (
                        <li className="py-4 text-center text-xs text-slate-400">
                          No hotels found
                        </li>
                      ) : (
                        filteredHotels.map((hotel, idx) => {
                          const name = hotel.name || hotel.hotelName || "";
                          const location =
                            hotel.location ||
                            hotel.city ||
                            hotel.address?.city ||
                            "";
                          const isSelected = current.hotel === hotel._id || current.hotel === name;
                          return (
                            <li
                              key={hotel._id || idx}
                              onClick={() => handleHotelSelect(hotel)}
                              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm
                                ${
                                  isSelected
                                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                                <Building2
                                  size={13}
                                  className="text-indigo-600 dark:text-indigo-400"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold leading-tight truncate">
                                  {name}
                                </p>
                                {location && (
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                    {location}
                                  </p>
                                )}
                              </div>
                              {isSelected && (
                                <CheckCircle2
                                  size={14}
                                  className="ml-auto shrink-0 text-indigo-600 dark:text-indigo-400"
                                />
                              )}
                            </li>
                          );
                        })
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Star Rating & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Star Rating
                  </label>
                  <div className="mt-1 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-11 px-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          setCurrent((prev) => ({ ...prev, rating: n }))
                        }
                        className="focus:outline-none transition-transform hover:scale-110 p-0.5"
                      >
                        <Star
                          size={20}
                          className={
                            n <= current.rating
                              ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                              : "text-slate-300 dark:text-slate-700"
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-auto text-xs font-bold text-slate-500 dark:text-slate-400">
                      {current.rating || 5} / 5
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Publication Status
                  </label>
                  <select
                    value={current.status}
                    onChange={(e) =>
                      setCurrent((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Pending Review</option>
                    <option value="Approved" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Approved &amp; Live</option>
                    <option value="Rejected" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Author Photo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Author Photo
                </label>

                <div className="mt-1 flex items-center gap-4 p-3 bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 rounded-xl">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    id="testimonial-avatar-input"
                  />

                  <div className="relative w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden shrink-0 bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs">
                    {imageUploading && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/70 rounded-xl">
                        <Loader size={20} className="animate-spin text-white" />
                      </div>
                    )}

                    {previewSrc && !imageUploading ? (
                      <img
                        src={previewSrc}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : !imageUploading ? (
                      <ImagePlus size={24} className="text-slate-400 dark:text-slate-600" />
                    ) : null}

                    {!imageUploading && current.avatar && (
                      <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-0.5 shadow-xs">
                        <CheckCircle2 size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="testimonial-avatar-input"
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                          imageUploading
                            ? "opacity-50 pointer-events-none border-slate-200 dark:border-slate-700 text-slate-400"
                            : "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/40"
                        }`}
                      >
                        <ImagePlus size={13} />
                        {previewSrc ? "Change Photo" : "Upload Photo"}
                      </label>

                      {previewSrc && !imageUploading && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-800/40 transition-all"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium truncate">
                      {imageUploading
                        ? "Uploading image to cloud…"
                        : current.avatar
                        ? "✓ Image uploaded successfully"
                        : "JPG, PNG, WEBP — max 5 MB"}
                    </p>

                    {uploadError && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-0.5">
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Testimonial Review Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Testimonial Review Content
                </label>
                <textarea
                  value={current.content}
                  onChange={(e) =>
                    setCurrent((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Enter the guest or partner testimonial review text here..."
                  rows={4}
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </form>

            {/* Footer actions - Fixed outside scroll container */}
            <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/90 backdrop-blur-sm flex justify-end gap-3 shrink-0">
              <Button
                type="button"
                disabled={submitting || imageUploading}
                variant="ghost"
                onClick={onClose}
                className="h-11 rounded-xl px-5 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer disabled:opacity-50 hover:bg-slate-200/50 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="testimonial-modal-form"
                disabled={submitting || imageUploading}
                className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-500/20"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Saving…
                  </>
                ) : imageUploading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Uploading…
                  </>
                ) : isEditMode ? (
                  "Update Testimonial"
                ) : (
                  "Add Testimonial"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
