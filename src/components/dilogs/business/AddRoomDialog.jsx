'use client';
import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, CheckCircle2, BedSingle, Layers, ShieldAlert } from 'lucide-react';
import { RoomRoute } from '@/routes/business/roomRoute';

export default function AddRoomDialog({ isOpen, onClose, roomTypesSummary = [], onRoomAdded }) {
  const [roomType, setRoomType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [status, setStatus] = useState('Available');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setRoomNumber('');
      setFloor('');
      setStatus('Available');
      // Pre-select first available room type that has remaining slots
      const availableType = roomTypesSummary.find((rt) => rt.remainingSlots > 0) || roomTypesSummary[0];
      if (availableType) {
        setRoomType(availableType._id);
      } else {
        setRoomType('');
      }
    }
  }, [isOpen, roomTypesSummary]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!roomType) {
      setErrorMsg('Please select a valid room type.');
      return;
    }
    if (!roomNumber.trim()) {
      setErrorMsg('Please enter a room number.');
      return;
    }

    const selectedType = roomTypesSummary.find((rt) => rt._id === roomType);
    if (selectedType && selectedType.remainingSlots <= 0) {
      setErrorMsg(`Maximum capacity of ${selectedType.numberOfRooms} rooms reached for '${selectedType.roomType}'. Cannot add more.`);
      return;
    }

    setLoading(true);

    try {
      const res = await RoomRoute.createRoom({
        roomType,
        roomNumber: roomNumber.trim(),
        floor: floor.trim(),
        status,
      });

      if (res && res.success === false) {
        setErrorMsg(res.message || 'Failed to add room.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Room created successfully!');
      setTimeout(() => {
        if (onRoomAdded) onRoomAdded(res?.data);
        onClose();
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add room.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedSummary = roomTypesSummary.find((rt) => rt._id === roomType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <BedSingle size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Room</h2>
              <p className="text-xs text-slate-500">Configure physical room unit for your property</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error alert */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Success alert */}
          {successMsg && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Room Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Room Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
              required
            >
              {roomTypesSummary.length === 0 ? (
                <option value="" disabled>No room types assigned</option>
              ) : (
                roomTypesSummary.map((rt) => {
                  const isFull = rt.remainingSlots <= 0;
                  return (
                    <option key={rt._id} value={rt._id} disabled={isFull}>
                      {rt.roomType} — ({rt.createdCount}/{rt.numberOfRooms} Added) {isFull ? '[LIMIT REACHED]' : `[${rt.remainingSlots} Left]`}
                    </option>
                  );
                })
              )}
            </select>

            {selectedSummary && (
              <div className="mt-2 flex items-center justify-between text-xs px-1">
                <span className="text-slate-500">Max Capacity: <strong className="text-slate-700 dark:text-slate-300">{selectedSummary.numberOfRooms} Rooms</strong></span>
                <span className={`font-bold ${selectedSummary.remainingSlots > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedSummary.remainingSlots > 0 ? `${selectedSummary.remainingSlots} Slots Available` : 'Limit Reached (Cannot add more)'}
                </span>
              </div>
            )}
          </div>

          {/* Room Number & Floor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Room Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Floor (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 1st Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Dirty">Dirty</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (selectedSummary && selectedSummary.remainingSlots <= 0)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
