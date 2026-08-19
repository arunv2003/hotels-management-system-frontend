"use client";

import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Sparkles,
  Bed,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  Clock,
  Shirt,
  Package,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { RoomRoute } from "@/routes/business/roomRoute";
import { InventoryRoute } from "@/routes/business/inventoryRoute";
import Link from "next/link";
import Pagination from "@/components/shared/Pagination";

export default function HousekeepingPage() {
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState([]);
  const [hkSupplies, setHkSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal for Dispatch
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchItem, setDispatchItem] = useState(null);
  const [dispatchQty, setDispatchQty] = useState(1);
  const [dispatchRoomNumber, setDispatchRoomNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [roomsRes, invRes] = await Promise.all([
        RoomRoute.getRooms(),
        InventoryRoute.getInventoryItems({ department: "Housekeeping" }),
      ]);

      if (roomsRes && roomsRes.success !== false) {
        setRooms(roomsRes?.data || []);
      }
      if (invRes && invRes.success !== false) {
        setHkSupplies(invRes?.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load housekeeping data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Counts
  const cleanCount = rooms.filter((r) => r.status === "Available").length;
  const dirtyCount = rooms.filter((r) => r.status === "Dirty" || r.status === "Cleaning").length;
  const occupiedCount = rooms.filter((r) => r.status === "Occupied").length;
  const lowStockCount = hkSupplies.filter((i) => i.quantity <= i.minStockLevel).length;

  // Filtered rooms
  const filteredRooms = rooms.filter((rm) => {
    const matchesSearch = rm.roomNumber?.toString().toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || rm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRooms.length / pageSize) || 1;
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle Dispatch
  const handleDispatchSupply = async (e) => {
    e.preventDefault();
    if (!dispatchItem) return;

    setSaving(true);
    setError("");
    try {
      const res = await InventoryRoute.adjustStock(dispatchItem._id || dispatchItem.id, {
        type: "Consumed",
        amount: Number(dispatchQty) || 1,
        reason: `Room ${dispatchRoomNumber || "General"} Housekeeping Service`,
        reference: dispatchRoomNumber ? `Room ${dispatchRoomNumber}` : "Housekeeping Cart",
      });

      if (res && res.success === false) {
        setError(res.message || "Failed to dispatch supply.");
      } else {
        setActionSuccess(`Dispatched ${dispatchQty} ${dispatchItem.unit} of ${dispatchItem.name}.`);
        setIsDispatchModalOpen(false);
        await loadData();
        setTimeout(() => setActionSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to dispatch supply.");
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
              Housekeeping Operations
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Monitor room turnovers, cleaning statuses, and housekeeping linen supplies for{" "}
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
            <Link
              href="/admin/inventory"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Package size={18} />
              Inventory Hub
            </Link>
          </div>
        </div>

        {/* Global Action Messages */}
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
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Clean & Ready</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{cleanCount} Rooms</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Needs Cleaning</p>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{dirtyCount} Rooms</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Bed size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupied Stays</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{occupiedCount} Rooms</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Shirt size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Linen & Supplies</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {hkSupplies.length} Items
              </h3>
            </div>
          </div>
        </div>

        {/* Housekeeping Supplies Quick Dispatch Section */}
        {hkSupplies.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Shirt size={20} className="text-indigo-600" />
                Housekeeping Supplies & Amenities Dispatch
              </h2>
              <Link
                href="/admin/inventory"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                View all inventory →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hkSupplies.slice(0, 4).map((item) => {
                const isLow = item.quantity <= item.minStockLevel;
                return (
                  <div
                    key={item._id || item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.image || "🛏️"}</span>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      {isLow && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200 dark:border-amber-800">
                          Low
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {item.quantity} {item.unit} available
                      </span>
                      <button
                        onClick={() => {
                          setDispatchItem(item);
                          setDispatchQty(1);
                          setDispatchRoomNumber("");
                          setIsDispatchModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow"
                      >
                        Dispatch
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by Room Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Room Statuses</option>
              <option value="Available">Clean & Ready</option>
              <option value="Occupied">Occupied</option>
              <option value="Dirty">Dirty</option>
              <option value="Cleaning">In Progress</option>
            </select>
          </div>
        </div>

        {/* Room Turnover Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold">Loading housekeeping status...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-lg border-dashed border-2 border-slate-200 dark:border-slate-800 text-slate-500">
            <Bed className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Rooms Found</h3>
            <p className="text-sm mt-1">No rooms match your filter parameters.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-auto max-h-[480px] relative">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-sm">
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    <th className="py-4 px-6">Room Number</th>
                    <th className="py-4 px-6">Room Type</th>
                    <th className="py-4 px-6">Floor Level</th>
                    <th className="py-4 px-6">Cleaning Status</th>
                    <th className="py-4 px-6 text-right">Quick Supply Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {paginatedRooms.map((rm) => (
                    <tr
                      key={rm._id || rm.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-base text-slate-900 dark:text-white">
                        Room #{rm.roomNumber}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                        {rm.roomType?.roomType || "Standard Room"}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-semibold">
                        Floor {rm.floor || 1}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            rm.status === "Available"
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : rm.status === "Occupied"
                              ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                              : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                          }`}
                        >
                          {rm.status === "Available" ? "Clean & Ready" : rm.status || "Dirty"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            const defaultLinen = hkSupplies[0] || null;
                            if (defaultLinen) {
                              setDispatchItem(defaultLinen);
                              setDispatchQty(1);
                              setDispatchRoomNumber(rm.roomNumber);
                              setIsDispatchModalOpen(true);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          + Refill Supplies
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRooms.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* ─── DISPATCH MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isDispatchModalOpen && dispatchItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 max-w-md w-full space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{dispatchItem.image || "🛏️"}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Dispatch Housekeeping Supply
                    </h3>
                    <p className="text-xs text-slate-400">{dispatchItem.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleDispatchSupply} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Room Number / Cart
                  </label>
                  <Input
                    placeholder="e.g. 204 or Main Floor Cart"
                    value={dispatchRoomNumber}
                    onChange={(e) => setDispatchRoomNumber(e.target.value)}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quantity ({dispatchItem.unit}) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={dispatchItem.quantity}
                    required
                    value={dispatchQty}
                    onChange={(e) => setDispatchQty(Number(e.target.value))}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-base font-bold"
                  />
                  <p className="text-xs text-slate-400">Available: {dispatchItem.quantity} {dispatchItem.unit}</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
                  >
                    {saving ? "Dispatching..." : "Confirm Dispatch"}
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
