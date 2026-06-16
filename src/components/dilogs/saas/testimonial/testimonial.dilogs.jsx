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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSave} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              {/* Author & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Author Name
                  </label>
                  <Input
                    value={current.author}
                    onChange={(e) =>
                      setCurrent((prev) => ({ ...prev, author: e.target.value }))
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
                      setCurrent((prev) => ({ ...prev, role: e.target.value }))
                    }
                    placeholder="E.g., General Manager"
                    className="mt-1.5 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              {/* Hotel – Searchable Dropdown */}
              <div ref={dropdownRef} className="relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Hotel / Property Name
                </label>

                {/* Trigger input */}
                <div className="relative mt-1.5">
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
                    className="w-full h-11 pl-9 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {hotelsLoading ? (
                      <Loader size={15} className="animate-spin" />
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
                      className="absolute z-50 mt-1.5 w-full max-h-52 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl"
                    >
                      {hotelsLoading ? (
                        <li className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
                          <Loader size={14} className="animate-spin" />
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
                          const isSelected = current.hotel === name;
                          return (
                            <li
                              key={hotel._id || idx}
                              onClick={() => handleHotelSelect(hotel)}
                              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm
                                ${
                                  isSelected
                                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                                <Building2
                                  size={13}
                                  className="text-indigo-600 dark:text-indigo-400"
                                />
                              </div>
                              <div className="min-w-0">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Star Rating
                  </label>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          setCurrent((prev) => ({ ...prev, rating: n }))
                        }
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
                      setCurrent((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approved &amp; Live</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* ── Image Upload ── */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Author Photo
                </label>

                {/* Upload trigger + preview wrapper */}
                <div className="mt-2 flex items-start gap-4">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    id="testimonial-avatar-input"
                  />

                  {/* Preview box */}
                  <div className="relative w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    {/* Loading overlay – shown while uploading */}
                    {imageUploading && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 rounded-xl">
                        <Loader size={22} className="animate-spin text-white" />
                        <span className="text-[9px] text-white/80 mt-1 font-semibold">
                          Uploading…
                        </span>
                      </div>
                    )}

                    {previewSrc && !imageUploading ? (
                      /* Actual image preview */
                      <img
                        src={previewSrc}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : !imageUploading ? (
                      /* Placeholder icon */
                      <ImagePlus size={28} className="text-slate-300 dark:text-slate-600" />
                    ) : null}

                    {/* Success tick when URL is set */}
                    {!imageUploading && current.avatar && (
                      <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-0.5">
                        <CheckCircle2 size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Buttons column */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="testimonial-avatar-input"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all
                        ${
                          imageUploading
                            ? "opacity-50 pointer-events-none border-slate-200 dark:border-slate-700 text-slate-400"
                            : "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/40"
                        }`}
                    >
                      <ImagePlus size={14} />
                      {previewSrc ? "Change Photo" : "Upload Photo"}
                    </label>

                    {previewSrc && !imageUploading && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-800/40 transition-all"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}

                    {/* Status text */}
                    <p className="text-[10px] text-slate-400 mt-1">
                      {imageUploading
                        ? "Uploading image to cloud…"
                        : current.avatar
                        ? "✓ Image ready"
                        : "JPG, PNG, WEBP — max 5 MB"}
                    </p>

                    {/* Error */}
                    {uploadError && (
                      <p className="text-[10px] text-rose-500 font-semibold">
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Testimonial Review Content
                </label>
                <textarea
                  value={current.content}
                  onChange={(e) =>
                    setCurrent((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Enter the guest or partner testimonial review text here..."
                  rows={4}
                  className="w-full mt-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none"
                />
              </div>

              {/* Footer actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Button
                  type="button"
                  disabled={submitting || imageUploading}
                  variant="ghost"
                  onClick={onClose}
                  className="h-11 rounded-xl px-5 text-slate-500 font-semibold cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || imageUploading}
                  className="h-11 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
