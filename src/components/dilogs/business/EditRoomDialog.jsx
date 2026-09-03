'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, CheckCircle2, BedSingle } from 'lucide-react';
import { RoomRoute } from '@/routes/business/roomRoute';

export default function EditRoomDialog({ isOpen, onClose, room, onRoomUpdated }) {
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [price12h, setPrice12h] = useState('');
  const [price24h, setPrice24h] = useState('');
  const [status, setStatus] = useState('Available');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && room) {
      setErrorMsg('');
      setSuccessMsg('');
      setRoomNumber(room.roomNumber || '');
      setFloor(room.floor || '');
      setPrice12h(room.price12h ?? '');
      setPrice24h(room.price24h ?? '');
      setStatus(room.status || 'Available');
    }
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!roomNumber.toString().trim()) {
      setErrorMsg('Please enter a room number.');
      return;
    }

    setLoading(true);

    try {
      const res = await RoomRoute.updateRoom(room._id, {
        roomNumber: roomNumber.toString().trim(),
        floor: floor.toString().trim(),
        price12h: Number(price12h) || 0,
        price24h: Number(price24h) || 0,
        status,
      });

      if (res && res.success === false) {
        setErrorMsg(res.message || 'Failed to update room.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Room updated successfully!');
      setTimeout(() => {
        if (onRoomUpdated) onRoomUpdated(res?.data || { ...room, roomNumber, floor, price12h, price24h, status });
        onClose();
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update room.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const roomTypeName = room.roomType?.roomType || 'Standard';

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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Room {room.roomNumber}</h2>
              <p className="text-xs text-slate-500">Update room details, rates, and operational status</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          {/* Room Type (Read-Only) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Room Category / Type
            </label>
            <div className="w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center text-sm font-semibold">
              {roomTypeName}
            </div>
          </div>

          {/* Room Number & Floor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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

          {/* Pricing for 12 Hours & 24 Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Price for 12h (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  min="0"
                  value={price12h}
                  onChange={(e) => setPrice12h(e.target.value)}
                  className="w-full h-11 pl-8 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Price for 24h (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="e.g. 1800"
                  min="0"
                  value={price24h}
                  onChange={(e) => setPrice24h(e.target.value)}
                  className="w-full h-11 pl-8 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Operational Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Room Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Occupied">Occupied</option>
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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
