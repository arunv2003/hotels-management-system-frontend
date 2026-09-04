"use client";

import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Box,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  Edit,
  SlidersHorizontal,
  Package,
  Layers,
  Sparkles,
  UtensilsCrossed,
  AlertTriangle,
  History,
  Download,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { InventoryRoute } from "@/routes/business/inventoryRoute";
import Pagination from "@/components/shared/Pagination";

const UNITS = [
  "pcs",
  "kg",
  "liters",
  "boxes",
  "bottles",
  "packs",
  "rolls",
  "cans",
  "sets",
  "pairs",
  "meters",
];

const EMOJI_OPTIONS = [
  "📦",
  "🛏️",
  "🛁",
  "🧴",
  "🧼",
  "🧹",
  "🪥",
  "☕",
  "🍚",
  "🫒",
  "🍽️",
  "🔪",
  "🍷",
  "🧻",
  "🧺",
  "🥩",
  "🍞",
  "🥛",
];

export default function InventoryPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Filters & Tabs
  const [search, setSearch] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeView, setActiveView] = useState("table"); // "table" or "logs"
  const [itemsCurrentPage, setItemsCurrentPage] = useState(1);
  const [itemsPageSize, setItemsPageSize] = useState(5);
  const [logsCurrentPage, setLogsCurrentPage] = useState(1);
  const [logsPageSize, setLogsPageSize] = useState(5);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustTargetItem, setAdjustTargetItem] = useState(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    department: "Housekeeping",
    category: "Linen",
    quantity: 10,
    minStockLevel: 5,
    unitPrice: 100,
    unit: "pcs",
    location: "Main Housekeeping Store",
    supplier: "",
    description: "",
    image: "📦",
  });

  // Form State for Stock Adjustment
  const [adjustData, setAdjustData] = useState({
    type: "Stock In",
    amount: 1,
    reason: "",
    reference: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsRes, statsRes, logsRes] = await Promise.all([
        InventoryRoute.getInventoryItems(),
        InventoryRoute.getInventoryStats(),
        InventoryRoute.getInventoryLogs({ limit: 50 }),
      ]);

      if (itemsRes && itemsRes.success === false) {
        setError(itemsRes.message || "Failed to fetch inventory items.");
        setItems([]);
      } else {
        setItems(itemsRes?.data || []);
      }

      if (statsRes && statsRes.success !== false) {
        setStats(statsRes?.data || null);
      }

      if (logsRes && logsRes.success !== false) {
        setLogs(logsRes?.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load inventory data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Categories dynamically
  const availableCategories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return Array.from(cats);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Department Filter
      if (activeDepartment === "Housekeeping") {
        if (!["Housekeeping", "Linen", "Amenities"].includes(item.department)) return false;
      } else if (activeDepartment === "Restaurant") {
        if (!["Restaurant", "Kitchen"].includes(item.department)) return false;
      } else if (activeDepartment !== "all") {
        if (item.department !== activeDepartment) return false;
      }

      // Category Filter
      if (filterCategory !== "all" && item.category !== filterCategory) return false;

      // Status Filter
      if (filterStatus === "out_of_stock" && item.quantity > 0) return false;
      if (filterStatus === "low_stock" && (item.quantity <= 0 || item.quantity > item.minStockLevel))
        return false;
      if (filterStatus === "in_stock" && item.quantity <= item.minStockLevel) return false;

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesSku = item.sku?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesLoc = item.location?.toLowerCase().includes(q);
        const matchesSup = item.supplier?.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat && !matchesLoc && !matchesSup) return false;
      }

      return true;
    });
  }, [items, activeDepartment, filterCategory, filterStatus, search]);

  const itemsTotalPages = Math.ceil(filteredItems.length / itemsPageSize) || 1;
  const paginatedItems = filteredItems.slice(
    (itemsCurrentPage - 1) * itemsPageSize,
    itemsCurrentPage * itemsPageSize
  );

  const logsTotalPages = Math.ceil(logs.length / logsPageSize) || 1;
  const paginatedLogs = logs.slice(
    (logsCurrentPage - 1) * logsPageSize,
    logsCurrentPage * logsPageSize
  );

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: activeDepartment === "Restaurant" ? "Restaurant" : "Housekeeping",
      category: activeDepartment === "Restaurant" ? "Kitchen Ingredients" : "Linen",
      quantity: 10,
      minStockLevel: 5,
      unitPrice: 100,
      unit: "pcs",
      location: activeDepartment === "Restaurant" ? "Kitchen Pantry" : "Housekeeping Store Floor 1",
      supplier: "",
      description: "",
      image: "📦",
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      sku: item.sku || "",
      department: item.department || "Housekeeping",
      category: item.category || "General",
      quantity: item.quantity ?? 0,
      minStockLevel: item.minStockLevel ?? 5,
      unitPrice: item.unitPrice ?? 0,
      unit: item.unit || "pcs",
      location: item.location || "",
      supplier: item.supplier || "",
      description: item.description || "",
      image: item.image || "📦",
    });
    setIsAddEditModalOpen(true);
  };

  // Save Item
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Item name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingItem) {
        const res = await InventoryRoute.updateInventoryItem(editingItem._id || editingItem.id, formData);
        if (res && res.success === false) {
          setError(res.message || "Failed to update item.");
        } else {
          setActionSuccess("Inventory item updated successfully.");
          setIsAddEditModalOpen(false);
          await loadData();
          setTimeout(() => setActionSuccess(""), 3000);
        }
      } else {
        const res = await InventoryRoute.createInventoryItem(formData);
        if (res && res.success === false) {
          setError(res.message || "Failed to create item.");
        } else {
          setActionSuccess("Inventory item created successfully.");
          setIsAddEditModalOpen(false);
          await loadData();
          setTimeout(() => setActionSuccess(""), 3000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save inventory item.");
    } finally {
      setSaving(false);
    }
  };

  // Open Stock Adjustment Modal
  const handleOpenAdjustModal = (item) => {
    setAdjustTargetItem(item);
    setAdjustData({
      type: "Stock In",
      amount: 1,
      reason: "",
      reference: "",
    });
    setIsAdjustModalOpen(true);
  };

  // Save Stock Adjustment
  const handleSaveAdjustment = async (e) => {
    e.preventDefault();
    if (!adjustTargetItem) return;
    if (!adjustData.amount || Number(adjustData.amount) <= 0) {
      setError("Please enter a valid positive adjustment amount.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await InventoryRoute.adjustStock(
        adjustTargetItem._id || adjustTargetItem.id,
        adjustData
      );

      if (res && res.success === false) {
        setError(res.message || "Failed to adjust stock.");
      } else {
        setActionSuccess(res.message || "Stock adjusted successfully.");
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

  // Delete Item
  const handleDeleteItem = async (id) => {
    setSaving(true);
    try {
      const res = await InventoryRoute.deleteInventoryItem(id);
      if (res && res.success === false) {
        setError(res.message || "Failed to delete item.");
      } else {
        setActionSuccess("Inventory item deleted successfully.");
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

  // Seed Demo Catalog
  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      const res = await InventoryRoute.seedDemoItems();
      if (res && res.success === false) {
        setError(res.message || "Failed to seed demo items.");
      } else {
        setActionSuccess("Demo inventory catalog seeded successfully.");
        await loadData();
        setTimeout(() => setActionSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to seed demo inventory.");
    } finally {
      setLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!items.length) return;
    const headers = [
      "SKU",
      "Name",
      "Department",
      "Category",
      "Quantity",
      "Unit",
      "Min Stock Level",
      "Unit Price (INR)",
      "Total Value (INR)",
      "Location",
      "Supplier",
      "Status",
    ];

    const rows = items.map((i) => [
      `"${i.sku || ""}"`,
      `"${i.name || ""}"`,
      `"${i.department || ""}"`,
      `"${i.category || ""}"`,
      i.quantity || 0,
      `"${i.unit || "pcs"}"`,
      i.minStockLevel || 0,
      i.unitPrice || 0,
      ((i.quantity || 0) * (i.unitPrice || 0)).toFixed(2),
      `"${i.location || ""}"`,
      `"${i.supplier || ""}"`,
      `"${i.quantity <= 0 ? "Out of Stock" : i.quantity <= i.minStockLevel ? "Low Stock" : "In Stock"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hotel_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Inventory Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm font-medium">
              Manage restaurant ingredients, housekeeping linen, toiletries, and hotel supplies for{" "}
              {user?.hotelName || user?.name || "your property"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={loadData}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm font-semibold shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={handleExportCSV}
              disabled={!items.length}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm font-semibold shadow-sm disabled:opacity-50"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>
        </div>

        {/* Action / Error Banners */}
        {actionSuccess && (
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            {actionSuccess}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            {error}
          </div>
        )}

        {/* KPI Metrics Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total Items */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Box size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Items</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {stats?.totalItems ?? items.length}
              </h3>
            </div>
          </div>

          {/* Housekeeping Items */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              <Sparkles size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Housekeeping Stock</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {stats?.housekeepingCount ?? items.filter((i) => ["Housekeeping", "Linen"].includes(i.department)).length}
              </h3>
            </div>
          </div>

          {/* Restaurant & Kitchen Items */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
              <UtensilsCrossed size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Restaurant & Kitchen</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {stats?.restaurantCount ?? items.filter((i) => ["Restaurant", "Kitchen"].includes(i.department)).length}
              </h3>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0">
              <AlertTriangle size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Alerts</p>
              <h3 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {(stats?.lowStockCount || 0) + (stats?.outOfStockCount || 0)}
              </h3>
            </div>
          </div>
        </div>

        {/* Department Switcher Tabs & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto table-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => {
                setActiveDepartment("all");
                setActiveView("table");
              }}
              className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeDepartment === "all" && activeView === "table"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              All Items ({items.length})
            </button>

            <button
              onClick={() => {
                setActiveDepartment("Housekeeping");
                setActiveView("table");
              }}
              className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeDepartment === "Housekeeping" && activeView === "table"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              Housekeeping & Linen (
              {items.filter((i) => ["Housekeeping", "Linen", "Amenities"].includes(i.department)).length})
            </button>

            <button
              onClick={() => {
                setActiveDepartment("Restaurant");
                setActiveView("table");
              }}
              className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeDepartment === "Restaurant" && activeView === "table"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              Restaurant & Kitchen (
              {items.filter((i) => ["Restaurant", "Kitchen"].includes(i.department)).length})
            </button>

            <button
              onClick={() => setActiveView("logs")}
              className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeView === "logs"
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <History size={16} className="inline mr-1.5" />
              Stock Movement Logs ({logs.length})
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        {activeView === "table" && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between pt-1">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by item name, SKU, location, or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 sm:h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock (Alert)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        )}

        {/* Table Content / Main List */}
        {activeView === "table" ? (
          loading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-4 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-semibold">Loading inventory...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 text-slate-500 text-center">
              <Package className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">No Inventory Items Found</h3>
              <p className="text-xs sm:text-sm mt-1">
                {items.length === 0
                  ? 'No inventory items registered yet. Click "Add Item" to add a new item.'
                  : "No items match your search and filter criteria."}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto table-scrollbar relative">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
                  <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm text-[11px] uppercase font-extrabold tracking-wider text-slate-400">
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Item & SKU</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Department</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Category</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Quantity</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Unit Price</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Location</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Status</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                    {paginatedItems.map((item) => {
                      const isOutOfStock = item.quantity <= 0;
                      const isLowStock = !isOutOfStock && item.quantity <= item.minStockLevel;

                      return (
                        <tr
                          key={item._id || item.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Item & SKU */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                                {item.image &&
                                typeof item.image === "string" &&
                                (item.image.startsWith("http://") ||
                                  item.image.startsWith("https://") ||
                                  item.image.startsWith("/") ||
                                  item.image.startsWith("data:")) ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  item.image || "📦"
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {item.name}
                                </p>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                  {item.sku || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                                item.department === "Housekeeping"
                                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                  : item.department === "Restaurant" || item.department === "Kitchen"
                                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                  : item.department === "Linen"
                                  ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {item.department}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-6 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {item.category || "General"}
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {item.quantity} {item.unit}
                            </div>
                            <span className="text-xs text-slate-400">Min: {item.minStockLevel}</span>
                          </td>

                          {/* Unit Price */}
                          <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            ₹{(item.unitPrice || 0).toLocaleString()}
                          </td>

                          {/* Location */}
                          <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} className="text-slate-400 shrink-0" />
                              <span>{item.location || "Central Store"}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                                isOutOfStock
                                  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                                  : isLowStock
                                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isOutOfStock
                                    ? "bg-rose-500"
                                    : isLowStock
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                              />
                              {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Adjust */}
                              <button
                                onClick={() => handleOpenAdjustModal(item)}
                                className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                                title="Adjust Stock"
                              >
                                <SlidersHorizontal size={16} />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Item"
                              >
                                <Edit size={16} />
                              </button>

                              {/* Delete */}
                              {deleteConfirmId === (item._id || item.id) ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDeleteItem(item._id || item.id)}
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
                                  onClick={() => setDeleteConfirmId(item._id || item.id)}
                                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                  title="Delete Item"
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

              {/* Items Pagination */}
              <Pagination
                currentPage={itemsCurrentPage}
                totalPages={itemsTotalPages}
                totalItems={filteredItems.length}
                pageSize={itemsPageSize}
                onPageChange={setItemsCurrentPage}
                onPageSizeChange={(newSize) => {
                  setItemsPageSize(newSize);
                  setItemsCurrentPage(1);
                }}
              />
            </div>
          )
        ) : (
          /* Logs View */
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto table-scrollbar relative">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm text-[11px] uppercase font-extrabold tracking-wider text-slate-400">
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Date & Time</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Item Name</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Department</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Type</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Quantity Changed</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">New Balance</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Reason / Notes</th>
                    <th className="py-3.5 sm:py-4 px-4 sm:px-6">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No stock movement logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => {
                      const isPositive = log.quantityChanged > 0;
                      return (
                        <tr key={log._id || log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs text-slate-400 font-mono">
                            {new Date(log.createdAt).toLocaleString([], {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </td>
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                            {log.itemName}
                          </td>
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs text-slate-500">{log.department}</td>
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                log.type === "Stock In" || log.type === "Initial"
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : log.type === "Damaged"
                                  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                                  : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                              }`}
                            >
                              {log.type}
                            </span>
                          </td>
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-bold font-mono">
                            <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
                              {isPositive ? `+${log.quantityChanged}` : log.quantityChanged} {log.unit}
                            </span>
                          </td>
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                            {log.newQuantity} {log.unit}
                          </td>
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs text-slate-500">{log.reason || "—"}</td>
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs text-slate-500">{log.performedByName || "Admin"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Logs Pagination */}
            {logs.length > 0 && (
              <Pagination
                currentPage={logsCurrentPage}
                totalPages={logsTotalPages}
                totalItems={logs.length}
                pageSize={logsPageSize}
                onPageChange={setLogsCurrentPage}
                onPageSizeChange={(newSize) => {
                  setLogsPageSize(newSize);
                  setLogsCurrentPage(1);
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full my-4 sm:my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingItem
                      ? "Update item information and inventory thresholds"
                      : "Add a new stock supply to your property inventory"}
                  </p>
                </div>
                <button
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Item Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. King Bed Sheets, Arabica Coffee Beans"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      SKU / Code
                    </label>
                    <Input
                      placeholder="e.g. HK-LIN-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none"
                    >
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Linen">Linen & Bedding</option>
                      <option value="Amenities">Guest Amenities</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="General">General Store</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </label>
                    <Input
                      placeholder="e.g. Cleaning Supplies, Beverages"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Low Stock Alert Level
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.minStockLevel}
                      onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Unit Cost (₹)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Storage Location
                    </label>
                    <Input
                      placeholder="e.g. Floor 2 Linen Closet"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Supplier / Vendor
                    </label>
                    <Input
                      placeholder="e.g. Royal Fabrics Ltd"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Icon
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
                    {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Item"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── QUICK STOCK ADJUST MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isAdjustModalOpen && adjustTargetItem && (
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
                    {adjustTargetItem.image &&
                    typeof adjustTargetItem.image === "string" &&
                    (adjustTargetItem.image.startsWith("http://") ||
                      adjustTargetItem.image.startsWith("https://") ||
                      adjustTargetItem.image.startsWith("/") ||
                      adjustTargetItem.image.startsWith("data:")) ? (
                      <img
                        src={adjustTargetItem.image}
                        alt={adjustTargetItem.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      adjustTargetItem.image || "📦"
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      Adjust Stock: {adjustTargetItem.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Current Stock: {adjustTargetItem.quantity} {adjustTargetItem.unit}
                    </p>
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
                    Adjustment Type
                  </label>
                  <select
                    value={adjustData.type}
                    onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none"
                  >
                    <option value="Stock In">Stock In (Purchase / Restock)</option>
                    <option value="Consumed">Consumed (Used in Rooms / Kitchen)</option>
                    <option value="Damaged">Damaged / Expired</option>
                    <option value="Adjustment">Set Exact Count</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quantity ({adjustTargetItem.unit}) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={adjustData.amount}
                    onChange={(e) => setAdjustData({ ...adjustData, amount: Number(e.target.value) })}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-base font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reason / Notes
                  </label>
                  <Input
                    placeholder="e.g. Room 204 Service, Vendor Restock"
                    value={adjustData.reason}
                    onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
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
                    {saving ? "Updating..." : "Confirm Adjustment"}
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
