"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomTypeRoute } from "@/routes/saas/roomType/roomType";

export default function RoomTypeDialog({
  isOpen,
  onClose,
  roomTypeToEdit,
  refreshList,
}) {
  const [roomData, setRoomData] = useState({
    roomType: roomTypeToEdit?.roomType || "",
    numberOfRooms: roomTypeToEdit?.numberOfRooms || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const numericValue = cleanedValue === "" ? "" : parseInt(cleanedValue, 10);
    setRoomData((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomData.roomType || !roomData.numberOfRooms) return;

    try {
      if (roomTypeToEdit && roomTypeToEdit._id) {
        await RoomTypeRoute.updateRoomsType(roomTypeToEdit._id, {
          roomType: roomData.roomType,
          numberOfRooms: Number(roomData.numberOfRooms),
        });
      } else {
        await RoomTypeRoute.createRoomsType({
          roomType: roomData.roomType,
          numberOfRooms: Number(roomData.numberOfRooms),
        });
      }
      refreshList && refreshList();
    } catch (error) {
      console.error("Failed to save room type", error);
    }

    setRoomData({ roomType: "", numberOfRooms: "" }); // Reset form
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[0.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {roomTypeToEdit ? "Edit Room Type" : "Add Room Type"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Define a new room type and its total count.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar flex-1">
            <form
              id="add-room-type-form"
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Room Type Name
                </label>
                <input
                  type="text"
                  name="roomType"
                  value={roomData.roomType}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Deluxe Room"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Number of Rooms
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="numberOfRooms"
                  value={roomData.numberOfRooms}
                  onChange={handleNumberChange}
                  required
                  placeholder="e.g. 10"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-room-type-form"
              className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20"
            >
              {roomTypeToEdit ? "Save Changes" : "Add Room"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
