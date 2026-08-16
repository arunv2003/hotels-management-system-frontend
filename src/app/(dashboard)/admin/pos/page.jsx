"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  X,
  Check,
  Percent,
  User,
  Coffee,
  UtensilsCrossed,
  Bed,
  Shirt,
  Sparkles,
  Car,
  Dumbbell,
  Wine,
  Clock,
  CheckCircle2,
  Printer,
  RotateCcw,
  Loader2,
  ListOrdered,
  PlusCircle,
  RefreshCw,

  Upload,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import { PosRoute } from "@/routes/business/posRoute";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";

// ─── Categories Setup ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Items", icon: Store, color: "indigo" },
  { id: "food", label: "Food & Dining", icon: UtensilsCrossed, color: "amber" },
  { id: "beverages", label: "Beverages", icon: Coffee, color: "emerald" },
  { id: "room_service", label: "Room Service", icon: Bed, color: "violet" },
  { id: "laundry", label: "Laundry", icon: Shirt, color: "rose" },
  { id: "spa", label: "Spa & Wellness", icon: Sparkles, color: "pink" },
  { id: "transport", label: "Transport", icon: Car, color: "sky" },
  { id: "gym", label: "Gym & Sports", icon: Dumbbell, color: "orange" },
  { id: "bar", label: "Bar & Lounge", icon: Wine, color: "red" },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, color: "emerald" },
  { id: "card", label: "Card", icon: CreditCard, color: "indigo" },
  { id: "upi", label: "UPI / QR", icon: QrCode, color: "violet" },
  { id: "room_charge", label: "Room Charge", icon: Bed, color: "amber" },
];

const COLOR_MAP = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", active: "bg-indigo-600 text-white" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", active: "bg-amber-500 text-white" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", active: "bg-emerald-600 text-white" },
  violet: { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", active: "bg-violet-600 text-white" },
  rose: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", active: "bg-rose-600 text-white" },
  pink: { bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", active: "bg-pink-600 text-white" },
  sky: { bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", active: "bg-sky-600 text-white" },
  orange: { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", active: "bg-orange-600 text-white" },
  red: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", active: "bg-red-600 text-white" },
};

const getCategoryUnitText = (category) => {
  switch (category) {
    case "food":
    case "beverages":
    case "laundry":
    case "bar":
      return "per piece";
    case "room_service":
      return "per room";
    case "spa":
    case "gym":
    case "transport":
      return "per day";
    default:
      return "per piece";
  }
};

// ─── Product Card Component ───────────────────────────────────────────────────
function ProductCard({ product, onAdd, onDelete, onEdit, quantity }) {
  const cat = CATEGORIES.find((c) => c.id === product.category) || CATEGORIES[0];
  const color = COLOR_MAP[cat?.color || "indigo"];
  const itemId = product._id || product.id;

  const isImageUrl =
    product.image &&
    (product.image.startsWith("http://") || product.image.startsWith("https://"));

  const unitText = getCategoryUnitText(product.category);
  const isOutOfStock = product.quantity !== undefined && Number(product.quantity) <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={isOutOfStock ? {} : { y: -3 }}
      className={`relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 ${
        isOutOfStock
          ? "border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 cursor-not-allowed"
          : "border-slate-200 dark:border-slate-800 cursor-pointer group shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700"
      }`}
      onClick={() => !isOutOfStock && onAdd(product)}
    >
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
        {isOutOfStock ? (
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-lg shadow-md border border-red-700">
            Out of Stock
          </span>
        ) : (
          product.quantity !== undefined && (
            <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-0.5 rounded-lg shadow-md border border-emerald-700" title="Total Stock Quantity">
              Stock: {product.quantity}
            </span>
          )
        )}
        {product.popular && !isOutOfStock && (
          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full shadow-sm">
            Popular
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          title="Edit Item"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(itemId);
          }}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          title="Delete Item"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className={`w-full h-28 ${color.bg} rounded-xl flex items-center justify-center text-3xl mb-3 overflow-hidden relative ${isOutOfStock ? "" : "group-hover:scale-[1.02]"} transition-transform duration-200`}>
        {isImageUrl ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover rounded-xl ${isOutOfStock ? "grayscale-[50%]" : ""}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = "🍽️";
            }}
          />
        ) : (
          product.image || "🍽️"
        )}
      </div>

      <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 pr-6">
        {product.name}
      </h4>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 line-clamp-1">
        {product.description || "No description"}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-sm block leading-none">
            {product.price === 0 ? "Free" : `₹${product.price}`}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {unitText}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {quantity > 0 && !isOutOfStock && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${color.bg} ${color.text}`}>
              {quantity}
            </span>
          )}
          {isOutOfStock ? (
            <button
              disabled
              className="w-7 h-7 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center cursor-not-allowed"
              title="Out of Stock"
            >
              <X size={13} />
            </button>
          ) : (
            <div className="w-7 h-7 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm shadow-indigo-500/30">
              <Plus size={14} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Cart Item Component ──────────────────────────────────────────────────────
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const itemId = item._id || item.id;
  const isImageUrl =
    item.image && (item.image.startsWith("http://") || item.image.startsWith("https://"));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-none group"
    >
      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden">
        {isImageUrl ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          item.image || "🍽️"
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
        <p className="text-xs text-slate-400">₹{item.price} × {item.qty}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onDecrease(itemId)}
          className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-colors"
        >
          <Minus size={11} />
        </button>
        <span className="w-5 text-center text-sm font-bold text-slate-900 dark:text-white">{item.qty}</span>
        <button
          onClick={() => onIncrease(itemId)}
          className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 flex items-center justify-center transition-colors"
        >
          <Plus size={11} />
        </button>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white w-16 text-right shrink-0">
        ₹{item.price * item.qty}
      </span>
      <button
        onClick={() => onRemove(itemId)}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center transition-all ml-1"
      >
        <Trash2 size={12} />
      </button>
    </motion.div>
  );
}

// ─── Add Item Modal with Image Upload ──────────────────────────────────────────
function AddItemModal({ isOpen, onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "food",
    price: "",
    quantity: "100",
    tax: "5",
    description: "",
    image: "",
    popular: false,
    isVeg: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    setUploadingImage(true);
    setUploadProgress(0);
    setError("");

    try {
      const res = await CloudinaryImage.uploadSingleImage(file, "posMenuItems", (pct) => {
        setUploadProgress(pct);
      });
      const uploadedUrl =
        res.url || res.secure_url || res.data?.url || res.data?.secure_url;

      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        setImagePreview(uploadedUrl);
      } else {
        setError("Failed to get image URL from response.");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError("Please fill required fields (Name & Price).");
      return;
    }
    if (uploadingImage) {
      setError("Please wait for image upload to complete.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      ...formData,
      image: formData.image || "🍽️",
    };

    const res = await PosRoute.createMenuItem(payload);
    setLoading(false);

    if (res.success) {
      onAddSuccess(res.data);
      onClose();
      setFormData({
        name: "",
        category: "food",
        price: "",
        quantity: "100",
        tax: "5",
        description: "",
        image: "",
        popular: false,
        isVeg: true,
      });
      setImagePreview("");
    } else {
      setError(res.message || "Failed to create item.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" /> Add Product to Database
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {error && <p className="text-xs text-red-500 mb-3 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Image Upload Input */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Upload Product Image *
            </label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 group">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <ImageIcon size={22} className="text-slate-400" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px]">
                    <Loader2 size={16} className="animate-spin mb-1" />
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>

              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 py-3 px-4 border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold transition-all">
                  <Upload size={15} />
                  {uploadingImage ? `Uploading (${uploadProgress}%)...` : imagePreview ? "Change Image" : "Choose Image File"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Shahi Paneer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Price ({getCategoryUnitText(formData.category)}) (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="250"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Quantity (Stock)</label>
              <input
                type="number"
                min="0"
                placeholder="100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">GST Tax (%)</label>
              <select
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              >
                <option value="0">0% (GST Exempted)</option>
                <option value="5">5% (Food / Standard GST)</option>
                <option value="12">12% (12% GST)</option>
                <option value="18">18% (Services / Drinks 18%)</option>
                <option value="28">28% (Luxury 28%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Description</label>
            <input
              type="text"
              placeholder="Short description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="rounded text-indigo-600"
              />
              Mark as Popular
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVeg}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                className="rounded text-emerald-600"
              />
              Vegetarian
            </label>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Edit Item Modal ──────────────────────────────────────────────────────────
function EditItemModal({ isOpen, product, onClose, onEditSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "food",
    price: "",
    quantity: "",
    tax: "5",
    description: "",
    image: "",
    popular: false,
    isVeg: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "food",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
        tax: product.tax ?? "5",
        description: product.description || "",
        image: product.image || "",
        popular: product.popular || false,
        isVeg: product.isVeg !== undefined ? product.isVeg : true,
      });
      setImagePreview(
        product.image && (product.image.startsWith("http") ? product.image : "")
      );
      setError("");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadingImage(true);
    setUploadProgress(0);
    setError("");
    try {
      const res = await CloudinaryImage.uploadSingleImage(file, "posMenuItems", (pct) => {
        setUploadProgress(pct);
      });
      const uploadedUrl = res.url || res.secure_url || res.data?.url || res.data?.secure_url;
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        setImagePreview(uploadedUrl);
      } else {
        setError("Failed to get image URL from response.");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.price === "") {
      setError("Please fill required fields (Name & Price).");
      return;
    }
    if (uploadingImage) {
      setError("Please wait for image upload to complete.");
      return;
    }
    setLoading(true);
    setError("");
    const itemId = product._id || product.id;
    const res = await PosRoute.updateMenuItem(itemId, {
      ...formData,
      image: formData.image || "🍽️",
    });
    setLoading(false);
    if (res.success) {
      onEditSuccess(res.data);
      onClose();
    } else {
      setError(res.message || "Failed to update item.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Pencil className="w-5 h-5 text-indigo-600" /> Edit Product
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {error && <p className="text-xs text-red-500 mb-3 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Image Upload */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Product Image
            </label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-3xl">{formData.image && !formData.image.startsWith("http") ? formData.image : "🍽️"}</span>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px]">
                    <Loader2 size={16} className="animate-spin mb-1" />
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 py-3 px-4 border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold transition-all">
                  <Upload size={15} />
                  {uploadingImage ? `Uploading (${uploadProgress}%)...` : imagePreview ? "Change Image" : "Choose Image File"}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Shahi Paneer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="250"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Quantity (Stock)</label>
              <input
                type="number"
                min="0"
                placeholder="100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">GST Tax (%)</label>
              <select
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
              >
                <option value="0">0% (GST Exempted)</option>
                <option value="5">5% (Food / Standard GST)</option>
                <option value="12">12% (12% GST)</option>
                <option value="18">18% (Services / Drinks 18%)</option>
                <option value="28">28% (Luxury 28%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Description</label>
            <input
              type="text"
              placeholder="Short description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="rounded text-indigo-600"
              />
              Mark as Popular
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVeg}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                className="rounded text-emerald-600"
              />
              Vegetarian
            </label>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const STATUS_STYLES = {
  Received: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Preparing: "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Served: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  Delivered: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  Cancelled: "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
};

// ─── Orders History Drawer / Modal ────────────────────────────────────────────
function OrdersHistoryModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await PosRoute.getOrders();
    setLoading(false);
    if (res.success) {
      setOrders(res.data);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchOrders();
  }, [isOpen, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await PosRoute.updateOrderStatus(orderId, { orderStatus: newStatus });
    if (res.success) {
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="bg-white dark:bg-slate-900 h-full w-full max-w-xl shadow-2xl p-6 overflow-y-auto flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <ListOrdered className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">POS Orders History</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOrders} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <RefreshCw size={16} />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p className="text-sm">Loading order records from DB...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Receipt size={40} className="opacity-20 mb-2" />
            <p className="font-medium text-sm">No orders recorded in DB yet</p>
          </div>
        ) : (
          <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
            {orders.map((order) => {
              const currentStatus = order.orderStatus || "Received";
              const statusStyle = STATUS_STYLES[currentStatus] || STATUS_STYLES.Received;

              return (
                <div
                  key={order._id}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        Order #{order._id?.slice(-6)?.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        {order.paymentMethod}
                      </span>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer transition-all ${statusStyle}`}
                      >
                        <option value="Received" className="bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold py-1">Received</option>
                        <option value="Preparing" className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-semibold py-1">Preparing</option>
                        <option value="Served" className="bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 font-semibold py-1">Served</option>
                        <option value="Delivered" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-semibold py-1">Delivered</option>
                        <option value="Cancelled" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-semibold py-1">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {order.guestRoom && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Guest/Room: {order.guestRoom}
                    </p>
                  )}

                  <div className="space-y-1.5 pt-1">
                    {order.items?.map((item, idx) => {
                      const isImg = item.image && (item.image.startsWith("http://") || item.image.startsWith("https://"));
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            {isImg ? (
                              <img src={item.image} alt={item.name} className="w-5 h-5 object-cover rounded-md" />
                            ) : (
                              <span>{item.image || "🍽️"}</span>
                            )}
                            {item.name} × {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                    <span>Grand Total</span>
                    <span className="text-indigo-600 dark:text-indigo-400">₹{order.grandTotal?.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Success Order Modal ──────────────────────────────────────────────────────
function SuccessModal({ order, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Completed!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-1">
          Order #{order.id} • {order.paymentLabel}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          ₹{order.total.toFixed(2)}
        </p>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left space-y-2 max-h-48 overflow-y-auto">
          {order.items.map((i) => (
            <div key={i._id || i.id} className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{i.name} × {i.qty}</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{i.price * i.qty}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs text-slate-400">
            <span>Tax</span>
            <span>₹{order.tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-colors"
          >
            <Printer size={16} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            New Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main POS Page Component ─────────────────────────────────────────────────
export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [guestRoom, setGuestRoom] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [orderCounter, setOrderCounter] = useState(1001);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // ── Fetch Menu Items from Database ──────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await PosRoute.getMenuItems();
    setLoading(false);
    if (res.success && Array.isArray(res.data)) {
      setProducts(res.data);
    } else {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);



  // ── Edit Item ──────────────────────────────────────────────────────────────
  const handleEditSuccess = (updatedItem) => {
    setProducts((prev) =>
      prev.map((p) => (p._id || p.id) === (updatedItem._id || updatedItem.id) ? updatedItem : p)
    );
  };

  // ── Delete Item from DB ────────────────────────────────────────────────────
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item from Database?")) return;
    const res = await PosRoute.deleteMenuItem(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // ── Cart Operations ────────────────────────────────────────────────────────
  const addToCart = (product) => {
    if (product.quantity !== undefined && Number(product.quantity) <= 0) return;
    const pId = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((i) => (i._id || i.id) === pId);
      if (existing) {
        const maxStock = product.quantity !== undefined ? Number(product.quantity) : Infinity;
        if (existing.qty >= maxStock) return prev;
        return prev.map((i) => ((i._id || i.id) === pId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increase = (id) =>
    setCart((prev) =>
      prev.map((i) => {
        if ((i._id || i.id) === id) {
          const maxStock = i.quantity !== undefined ? Number(i.quantity) : Infinity;
          if (i.qty >= maxStock) return i;
          return { ...i, qty: i.qty + 1 };
        }
        return i;
      })
    );
  const decrease = (id) =>
    setCart((prev) => {
      const item = prev.find((i) => (i._id || i.id) === id);
      if (item && item.qty === 1) return prev.filter((i) => (i._id || i.id) !== id);
      return prev.map((i) => ((i._id || i.id) === id ? { ...i, qty: i.qty - 1 } : i));
    });
  const remove = (id) => setCart((prev) => prev.filter((i) => (i._id || i.id) !== id));
  const clearCart = () => setCart([]);

  const getQty = (id) => cart.find((i) => (i._id || i.id) === id)?.qty || 0;

  // ── Billing Calculations ────────────────────────────────────────────────────
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxAmount = cart.reduce((sum, i) => sum + i.price * i.qty * ((i.tax || 5) / 100), 0);
  const discountAmount = ((subtotal + taxAmount) * discountPercent) / 100;
  const total = subtotal + taxAmount - discountAmount;

  // ── Checkout & Save Order to DB ──────────────────────────────────────────────
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);

    const pm = PAYMENT_METHODS.find((p) => p.id === paymentMethod);

    const orderPayload = {
      items: cart,
      subTotal: subtotal,
      tax: taxAmount,
      discount: discountAmount,
      grandTotal: total,
      guestRoom,
      paymentMethod,
      orderType: paymentMethod === "room_charge" ? "RoomService" : "Direct",
    };

    const res = await PosRoute.createOrder(orderPayload);
    setCheckoutLoading(false);

    if (res.success) {
      // Re-fetch products from DB to reflect reduced stock quantities
      fetchProducts();
    }

    setLastOrder({
      id: res.data?._id?.slice(-6)?.toUpperCase() || orderCounter,
      items: [...cart],
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      paymentLabel: pm?.label,
    });

    setOrderCounter((c) => c + 1);
    setShowSuccess(true);
  };

  const handleNewOrder = () => {
    setShowSuccess(false);
    setCart([]);
    setDiscountPercent(0);
    setGuestRoom("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-8">
        {/* ── Top Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Point of Sale</h1>
              <p className="text-xs text-slate-400 mt-0.5">MongoDB Connected POS Catalog ({products.length} Products)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">


            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <PlusCircle size={15} />
              Add Product
            </button>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              <ListOrdered size={15} />
              Orders History
            </button>

            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-full font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              DB Live
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* ── Left: Product Catalog ──────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Search + Category Bar */}
            <div className="px-6 pt-5 pb-3 shrink-0">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products in database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = activeCategory === cat.id;
                  const c = COLOR_MAP[cat.color];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        active
                          ? c.active + " shadow-md"
                          : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={13} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Loader2 size={32} className="animate-spin mb-2 text-indigo-600" />
                  <p className="text-sm font-medium">Fetching dynamic items from MongoDB...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Store size={48} className="mb-3 opacity-30" />
                  <p className="font-medium">No items found</p>
                  <p className="text-sm mb-4">Add products using the "Add Product" button above</p>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                        onAdd={addToCart}
                        onDelete={handleDeleteProduct}
                        onEdit={setEditProduct}
                        quantity={getQty(product._id || product.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Right: Cart & Billing Panel ───────────────────────────── */}
          <div className="w-[380px] shrink-0 flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
            {/* Cart Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cart.reduce((s, i) => s + i.qty, 0)}
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-900 dark:text-white">Current Order</span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  <RotateCcw size={12} />
                  Clear
                </button>
              )}
            </div>

            {/* Guest / Room Input */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Guest name or Room no. (optional)"
                  value={guestRoom}
                  onChange={(e) => setGuestRoom(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-slate-400 py-12"
                  >
                    <ShoppingCart size={44} className="mb-3 opacity-25" />
                    <p className="font-medium text-sm">Cart is empty</p>
                    <p className="text-xs mt-1">Click on any product to add to order</p>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <CartItem
                      key={item._id || item.id}
                      item={item}
                      onIncrease={increase}
                      onDecrease={decrease}
                      onRemove={remove}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Billing Summary */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 shrink-0 space-y-4">
                {/* Discount options */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Percent size={14} />
                    <span className="text-xs font-medium">Discount</span>
                  </div>
                  <div className="flex gap-1.5 ml-auto">
                    {[0, 5, 10, 15, 20].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDiscountPercent(d)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          discountPercent === d
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {d === 0 ? "None" : `${d}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Tax (GST)</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Payment Method
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((pm) => {
                      const Icon = pm.icon;
                      const active = paymentMethod === pm.id;
                      const c = COLOR_MAP[pm.color];
                      return (
                        <button
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all ${
                            active
                              ? `${c.bg} ${c.text} border-current`
                              : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <Icon size={16} />
                          {pm.label}
                          {active && <Check size={13} className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-500/30 transition-all"
                >
                  {checkoutLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Receipt size={18} />
                      Charge ₹{total.toFixed(2)}
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSuccess={(newItem) => setProducts((prev) => [newItem, ...prev])}
      />

      <EditItemModal
        isOpen={!!editProduct}
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onEditSuccess={handleEditSuccess}
      />

      <OrdersHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />

      <AnimatePresence>
        {showSuccess && lastOrder && (
          <SuccessModal order={lastOrder} onClose={handleNewOrder} />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
