'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { Bed, Search, RefreshCw, Plus, Trash2, Filter, Layers, AlertCircle, CheckCircle2, ShieldAlert, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { RoomRoute } from '@/routes/business/roomRoute';
import AddRoomDialog from '@/components/dilogs/business/AddRoomDialog';

export default function RoomsPage() {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sumRes, roomsRes] = await Promise.all([
        RoomRoute.getRoomSummary(),
        RoomRoute.getRooms(),
      ]);
      if (sumRes && sumRes.success === false) {
        setError(sumRes.message || 'Failed to fetch room types summary.');
      } else {
        setSummary(sumRes?.data || []);
      }

      if (roomsRes && roomsRes.success === false) {
        setError((prev) => prev || roomsRes.message || 'Failed to fetch rooms.');
      } else {
        setRooms(roomsRes?.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch rooms and inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteRoom = async (id) => {
    setDeleting(true);
    try {
      const res = await RoomRoute.deleteRoom(id);
      if (res && res.success === false) {
        setError(res.message || 'Failed to delete room.');
        setDeleting(false);
        return;
      }
      setActionSuccess('Room deleted successfully.');
      setDeleteConfirmId(null);
      await loadData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter logic
  const filteredRooms = rooms.filter((rm) => {
    const matchesSearch = rm.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || (rm.roomType?._id || rm.roomType) === filterType;
    const matchesStatus = filterStatus === 'all' || rm.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const statusColors = {
    Available: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    Booked: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400',
    Maintenance: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    Dirty: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Room Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Manage room allocation and physical rooms for {user?.hotelName || user?.name || 'your property'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-semibold shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Plus size={18} />
              Add Room
            </button>
          </div>
        </div>

        {/* Global Action Banner */}
        {actionSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600" />
            {actionSuccess}
          </div>
        )}

        {/* Room Types Allocation Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers size={20} className="text-indigo-600" />
              Room Type Allocations & Limits
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              Capacity configured during onboarding
            </span>
          </div>

          {summary.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 text-sm font-medium">
              No room types assigned to your hotel yet. Contact administrator to assign room types.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {summary.map((st, idx) => {
                const percent = st.numberOfRooms > 0 ? Math.min(100, Math.round((st.createdCount / st.numberOfRooms) * 100)) : 0;
                const isFull = st.remainingSlots <= 0;

                return (
                  <motion.div
                    key={st._id || idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                          Room Type
                        </span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                          {st.roomType}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isFull ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'}`}>
                        {isFull ? 'Full' : `${st.remainingSlots} Left`}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Rooms Created</span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {st.createdCount} / {st.numberOfRooms} Max
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-rose-500' : 'bg-indigo-600'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Filters & Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by Room Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter by Room Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none"
            >
              <option value="all">All Room Types</option>
              {summary.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.roomType}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Dirty">Dirty</option>
            </select>
          </div>
        </div>

        {/* Main Content / Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold">Loading rooms inventory...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400">
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 text-slate-500">
            <Bed className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Rooms Found</h3>
            <p className="text-sm mt-1">
              {rooms.length === 0 ? 'No rooms added yet. Click "Add Room" to create your first room.' : 'No rooms match your filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    <th className="py-4 px-6">Room Number</th>
                    <th className="py-4 px-6">Room Type</th>
                    <th className="py-4 px-6">Floor</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {filteredRooms.map((room) => {
                    const roomTypeName = room.roomType?.roomType || 'Standard';
                    const isDeleting = deleteConfirmId === room._id;

                    return (
                      <tr key={room._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                            {room.roomNumber}
                          </div>
                          Room {room.roomNumber}
                        </td>

                        <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                          {roomTypeName}
                        </td>

                        <td className="py-4 px-6 text-slate-500">
                          {room.floor || 'N/A'}
                        </td>

                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusColors[room.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {room.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          {isDeleting ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs font-bold text-rose-600 mr-1">Confirm delete?</span>
                              <button
                                onClick={() => handleDeleteRoom(room._id)}
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
                            <button
                              onClick={() => setDeleteConfirmId(room._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                              title="Delete Room"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Room Modal */}
        <AddRoomDialog
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          roomTypesSummary={summary}
          onRoomAdded={() => loadData()}
        />
      </div>
    </DashboardLayout>
  );
}
