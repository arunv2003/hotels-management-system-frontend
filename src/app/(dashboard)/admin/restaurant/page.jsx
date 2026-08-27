"use client";

import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  UtensilsCrossed,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  Store,
  SlidersHorizontal,
  Package,
  AlertTriangle,
  ShoppingBag,
  Edit,
  Sparkles,
  Coffee,
  Wine,
  Leaf,
  Layers,
  Receipt,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { PosRoute } from "@/routes/business/posRoute";
import { InventoryRoute } from "@/routes/business/inventoryRoute";
import Link from "next/link";
import Pagination from "@/components/shared/Pagination";

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "food", label: "Food & Dining" },
  { id: "beverages", label: "Beverages" },
  { id: "room_service", label: "Room Service" },
  { id: "bar", label: "Bar & Lounge" },
  { id: "laundry", label: "Laundry" },
  { id: "spa", label: "Spa & Wellness" },
];

const EMOJI_OPTIONS = ["🍽️", "☕", "🍷", "🍕", "🍔", "🥗", "🥩", "🍞", "🍚", "🫒", "🍰", "🧃", "🍜", "🍣", "🍦"];

export default function RestaurantPage() {
  const { user } = useAuthStore();
  const [menuItems, setMenuItems] = useState([]);
  const [kitchenSupplies, setKitchenSupplies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Tabs: "dishes", "supplies", "orders"
  const [activeTab, setActiveTab] = useState("dishes");

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVeg, setFilterVeg] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dishesCurrentPage, setDishesCurrentPage] = useState(1);
  const [dishesPageSize, setDishesPageSize] = useState(5);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(5);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State for Add / Edit Menu Item
  const [formData, setFormData] = useState({
    name: "",
    category: "food",
    price: 150,
    quantity: 20,
    tax: 5,
    description: "",
    image: "🍽️",
    isVeg: true,
    popular: false,
    isAvailable: true,
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [menuRes, ordersRes, invRes] = await Promise.all([
        PosRoute.getMenuItems(),
        PosRoute.getOrders(),
        InventoryRoute.getInventoryItems({ department: "Restaurant" }),
      ]);

      if (menuRes && menuRes.success !== false) {
        setMenuItems(menuRes?.data || (Array.isArray(menuRes) ? menuRes : []));
      } else {
        setMenuItems([]);
      }

      if (ordersRes && ordersRes.success !== false) {
        setOrders(ordersRes?.data || (Array.isArray(ordersRes) ? ordersRes : []));
      } else {
        setOrders([]);
      }

      if (invRes && invRes.success !== false) {
        setKitchenSupplies(invRes?.data || []);
      } else {
        setKitchenSupplies([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load restaurant data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats Calculations
  const totalDishes = menuItems.length;
  const totalStockQuantity = menuItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const lowStockDishes = menuItems.filter(
    (item) => Number(item.quantity) <= 5 || item.isAvailable === false
  );
  const totalOrdersCount = orders.length;

  // Filtered Menu Items
  const filteredDishes = useMemo(() => {
    return menuItems.filter((item) => {
      if (filterCategory !== "all" && item.category !== filterCategory) return false;
      if (filterVeg === "veg" && !item.isVeg) return false;
      if (filterVeg === "nonveg" && item.isVeg) return false;

      const isOutOfStock = Number(item.quantity) <= 0 || item.isAvailable === false;
      const isLow = !isOutOfStock && Number(item.quantity) <= 5;
      if (filterStatus === "out_of_stock" && !isOutOfStock) return false;
      if (filterStatus === "low_stock" && !isLow) return false;
      if (filterStatus === "in_stock" && (isOutOfStock || isLow)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }

      return true;
    });
  }, [menuItems, filterCategory, filterVeg, filterStatus, search]);

  const dishesTotalPages = Math.ceil(filteredDishes.length / dishesPageSize) || 1;
  const paginatedDishes = filteredDishes.slice(
    (dishesCurrentPage - 1) * dishesPageSize,
    dishesCurrentPage * dishesPageSize
  );

  const ordersTotalPages = Math.ceil(orders.length / ordersPageSize) || 1;
  const paginatedOrders = orders.slice(
    (ordersCurrentPage - 1) * ordersPageSize,
    ordersCurrentPage * ordersPageSize
  );

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "food",
      price: 150,
      quantity: 25,
      tax: 5,
      description: "",
      image: "🍽️",
      isVeg: true,
      popular: false,
      isAvailable: true,
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      category: item.category || "food",
      price: item.price ?? 100,
      quantity: item.quantity ?? 0,
      tax: item.tax ?? 5,
      description: item.description || "",
      image: item.image || "🍽️",
      isVeg: item.isVeg ?? true,
      popular: item.popular ?? false,
      isAvailable: item.isAvailable ?? true,
    });
    setIsAddEditModalOpen(true);
  };

  // Save Menu Item
  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Item name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingItem) {
        const res = await PosRoute.updateMenuItem(editingItem._id || editingItem.id, formData);
        if (res && res.success === false) {
          setError(res.message || "Failed to update item.");
        } else {
          setActionSuccess("Menu item updated successfully.");
          setIsAddEditModalOpen(false);
          await loadData();
          setTimeout(() => setActionSuccess(""), 3000);
        }
      } else {
        const res = await PosRoute.createMenuItem(formData);
        if (res && res.success === false) {
          setError(res.message || "Failed to create item.");
        } else {
          setActionSuccess("Menu item created successfully.");
          setIsAddEditModalOpen(false);
          await loadData();
          setTimeout(() => setActionSuccess(""), 3000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save menu item.");
    } finally {
      setSaving(false);
    }
  };

  // Quick Adjust Stock
  const handleSaveAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSaving(true);
    setError("");
    try {
      const res = await PosRoute.updateMenuItem(selectedItem._id || selectedItem.id, {
        quantity: Number(adjustQty),
        isAvailable: Number(adjustQty) > 0,
      });

      if (res && res.success === false) {
        setError(res.message || "Failed to update stock.");
      } else {
        setActionSuccess(`Stock updated to ${adjustQty} for ${selectedItem.name}.`);
        setIsAdjustModalOpen(false);
        await loadData();
        setTimeout(() => setActionSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to adjust stock.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Dish
  const handleDeleteDish = async (id) => {
    setSaving(true);
    try {
      const res = await PosRoute.deleteMenuItem(id);
      if (res && res.success === false) {
        setError(res.message || "Failed to delete item.");
      } else {
        setActionSuccess("Menu item deleted successfully.");
        setDeleteConfirmId(null);
        await loadData();
        setTimeout(() => setActionSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Restaurant & Kitchen Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Manage restaurant dishes, kitchen stock, and live POS menu items for{" "}
              {user?.hotelName || user?.name || "your property"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-semibold shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Plus size={18} />
              Add Menu Dish
            </button>

            <Link
              href="/admin/pos"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/25 transition-all"
            >
              <Store size={18} />
              Open POS Billing
            </Link>
          </div>
        </div>

        {/* Action / Error Banners */}
        {actionSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            {actionSuccess}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-sm font-semibold">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            {error}
          </div>
        )}

        {/* Key Metrics Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Active Dishes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">POS Menu Items</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalDishes} Dishes
              </h3>
            </div>
          </div>

          {/* In-Stock Quantity */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total In-Stock</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalStockQuantity} Servings
              </h3>
            </div>
          </div>

          {/* Low Stock Dishes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Dishes</p>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {lowStockDishes.length} Alerts
              </h3>
            </div>
          </div>

          {/* Recorded POS Orders */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recorded Orders</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalOrdersCount} Orders
              </h3>
            </div>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("dishes")}
              className={`h-10 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "dishes"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <UtensilsCrossed size={16} className="inline mr-1.5" />
              Menu Dishes & Items ({menuItems.length})
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`h-10 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <ShoppingBag size={16} className="inline mr-1.5" />
              POS Orders History ({orders.length})
            </button>
          </div>
        </div>

        {/* Filters and Search Bar for Menu Items */}
        {activeTab === "dishes" && (
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-1">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search dish by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* Veg / Non-Veg Filter */}
              <select
                value={filterVeg}
                onChange={(e) => setFilterVeg(e.target.value)}
                className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Diet Types</option>
                <option value="veg">Veg Only 🟢</option>
                <option value="nonveg">Non-Veg 🔴</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock (Good)</option>
                <option value="low_stock">Low Stock (&le; 5)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>
            </div>
          </div>
        )}

        {/* Table Content */}
        {activeTab === "dishes" ? (
          loading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-semibold">Loading menu items...</p>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 text-slate-500">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Dishes Found</h3>
              <p className="text-sm mt-1">
                {menuItems.length === 0
                  ? 'No dishes added yet. Click "Add Menu Dish" or create items in POS.'
                  : "No dishes match your filter criteria."}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-auto max-h-[480px] relative">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs uppercase font-extrabold tracking-wider text-slate-400">
                      <th className="py-4 px-6">Dish & Name</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Diet Type</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Available Stock</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                    {paginatedDishes.map((dish) => {
                      const isOutOfStock = Number(dish.quantity) <= 0 || dish.isAvailable === false;
                      const isLow = !isOutOfStock && Number(dish.quantity) <= 5;
                      const isImageUrl =
                        dish.image &&
                        typeof dish.image === "string" &&
                        (dish.image.startsWith("http://") ||
                          dish.image.startsWith("https://") ||
                          dish.image.startsWith("/") ||
                          dish.image.startsWith("data:"));

                      return (
                        <tr
                          key={dish._id || dish.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Dish & Name */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg overflow-hidden shrink-0">
                                {isImageUrl ? (
                                  <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  dish.image || "🍽️"
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {dish.name}
                                </p>
                                <p className="text-xs text-slate-400 line-clamp-1">
                                  {dish.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {dish.category}
                            </span>
                          </td>

                          {/* Diet Type */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                dish.isVeg
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${dish.isVeg ? "bg-emerald-500" : "bg-rose-500"}`} />
                              {dish.isVeg ? "Veg" : "Non-Veg"}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-6 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            ₹{dish.price}
                            <span className="text-xs text-slate-400 font-normal ml-1">
                              (+{dish.tax || 5}% tax)
                            </span>
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {dish.quantity ?? 0} servings
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                                isOutOfStock
                                  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                                  : isLow
                                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isOutOfStock
                                    ? "bg-rose-500"
                                    : isLow
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                              />
                              {isOutOfStock ? "Out of Stock" : isLow ? "Low Stock" : "Available"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Adjust Stock */}
                              <button
                                onClick={() => {
                                  setSelectedItem(dish);
                                  setAdjustQty(dish.quantity || 10);
                                  setIsAdjustModalOpen(true);
                                }}
                                className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                                title="Adjust Stock Quantity"
                              >
                                <SlidersHorizontal size={16} />
                              </button>

                              {/* Edit Dish */}
                              <button
                                onClick={() => handleOpenEditModal(dish)}
                                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Dish"
                              >
                                <Edit size={16} />
                              </button>

                              {/* Delete Dish */}
                              {deleteConfirmId === (dish._id || dish.id) ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDeleteDish(dish._id || dish.id)}
                                    disabled={saving}
                                    className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                                    title="Confirm Delete"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(dish._id || dish.id)}
                                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                  title="Delete Dish"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Dishes Pagination */}
              <Pagination
                currentPage={dishesCurrentPage}
                totalPages={dishesTotalPages}
                totalItems={filteredDishes.length}
                pageSize={dishesPageSize}
                onPageChange={setDishesCurrentPage}
                onPageSizeChange={(newSize) => {
                  setDishesPageSize(newSize);
                  setDishesCurrentPage(1);
                }}
              />
            </div>
          )
        ) : (
          /* Orders Tab */
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-auto max-h-[480px] relative">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    <th className="py-4 px-6">Order ID & Date</th>
                    <th className="py-4 px-6">Type & Destination</th>
                    <th className="py-4 px-6">Items Count</th>
                    <th className="py-4 px-6">Grand Total</th>
                    <th className="py-4 px-6">Payment</th>
                    <th className="py-4 px-6">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No POS orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order._id || order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-4 px-6">
                          <p className="font-mono font-bold text-slate-900 dark:text-white">
                            #{order._id ? order._id.slice(-6).toUpperCase() : "ORDER"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleString([], {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                          {order.guestRoom ? `Room ${order.guestRoom}` : order.tableNumber ? `Table ${order.tableNumber}` : "Direct Counter"}
                        </td>
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                          {order.items?.length || 1} items
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                          ₹{order.grandTotal || 0}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {order.paymentMethod || "Paid"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200">
                            {order.orderStatus || "Received"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Orders Pagination */}
            {orders.length > 0 && (
              <Pagination
                currentPage={ordersCurrentPage}
                totalPages={ordersTotalPages}
                totalItems={orders.length}
                pageSize={ordersPageSize}
                onPageChange={setOrdersCurrentPage}
                onPageSizeChange={(newSize) => {
                  setOrdersPageSize(newSize);
                  setOrdersCurrentPage(1);
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT MENU ITEM MODAL ──────────────────────────────────────── */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {editingItem ? "Edit Menu Dish" : "Add New Menu Dish"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingItem
                      ? "Update dish price, stock, and diet preferences"
                      : "Create a new dish for Restaurant & POS dining"}
                  </p>
                </div>
                <button
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dish Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Paneer Butter Masala, Cold Brew Coffee"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none"
                    >
                      <option value="food">Food & Dining</option>
                      <option value="beverages">Beverages</option>
                      <option value="room_service">Room Service</option>
                      <option value="bar">Bar & Lounge</option>
                      <option value="laundry">Laundry</option>
                      <option value="spa">Spa & Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Price (₹) *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Available Stock (Servings)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tax %
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Diet Type (Veg / Non-Veg) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Diet Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isVeg: true })}
                        className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                          formData.isVeg
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-500 shadow-sm"
                            : "border-slate-200 dark:border-slate-700 text-slate-500"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Vegetarian
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isVeg: false })}
                        className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                          !formData.isVeg
                            ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-500 shadow-sm"
                            : "border-slate-200 dark:border-slate-700 text-slate-500"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        Non-Veg
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Availability Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                      className={`w-full py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        formData.isAvailable
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border-indigo-500 shadow-sm"
                          : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-500 shadow-sm"
                      }`}
                    >
                      {formData.isAvailable ? "Available on Live Menu" : "Marked Unavailable"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Icon / Symbol
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setFormData({ ...formData, image: emoji })}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                          formData.image === emoji
                            ? "bg-indigo-600 text-white shadow"
                            : "hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </label>
                  <Input
                    placeholder="Short description of dish, spices, or allergens..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Dish"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── QUICK STOCK ADJUST MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isAdjustModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 max-w-md w-full space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg overflow-hidden shrink-0">
                    {selectedItem.image &&
                    typeof selectedItem.image === "string" &&
                    (selectedItem.image.startsWith("http://") ||
                      selectedItem.image.startsWith("https://") ||
                      selectedItem.image.startsWith("/") ||
                      selectedItem.image.startsWith("data:")) ? (
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      selectedItem.image || "🍽️"
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      Adjust Stock: {selectedItem.name}
                    </h3>
                    <p className="text-xs text-slate-400">Current Stock: {selectedItem.quantity || 0} servings</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveAdjustment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    New Available Stock (Servings) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-base font-bold"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAdjustModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
                  >
                    {saving ? "Updating..." : "Save Stock Count"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
