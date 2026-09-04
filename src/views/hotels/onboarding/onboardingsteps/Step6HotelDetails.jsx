import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import RoomTypeDialog from "@/components/dilogs/saas/roomtype/RoomType";
import { RoomTypeRoute } from "@/routes/saas/roomType/roomType";

export default function Step6HotelDetails({ formData, updateFormData }) {
  const [isRoomTypeDialogOpen, setIsRoomTypeDialogOpen] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [editingRoomType, setEditingRoomType] = useState(null);


  console.log(roomTypes,"roomTypesroomTypesroomTypes")

  const fetchRoomTypes = async () => {
    try {
      const res = await RoomTypeRoute.getAllRoomstype();
      if (res?.data) {
        setRoomTypes(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch room types", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoomTypes();
  }, []);

  const handleRemoveRoomType = async (index, id) => {
    try {
      if (id) {
        await RoomTypeRoute.deleteRoomsType(id);
      }
      const newRoomTypes = [...roomTypes];
      newRoomTypes.splice(index, 1);
      setRoomTypes(newRoomTypes);
      
      // If deleted from backend, also remove from selected form data if present
      if (id && Array.isArray(formData.roomTypes)) {
        updateFormData({
          roomTypes: formData.roomTypes.filter((selectedId) => selectedId !== id)
        });
      }
      fetchRoomTypes(); // Refresh list from backend
    } catch (error) {
      console.error("Failed to delete room type", error);
    }
  };

  const openAddDialog = () => {
    setEditingRoomType(null);
    setIsRoomTypeDialogOpen(true);
  };

  const openEditDialog = (rt) => {
    setEditingRoomType(rt);
    setIsRoomTypeDialogOpen(true);
  };

  const handleCheckboxChange = (id, isChecked) => {
    let currentSelected = Array.isArray(formData.roomTypes) ? [...formData.roomTypes] : [];
    // Ensure we only have string IDs (cleanup any old data if present)
    currentSelected = currentSelected.filter((item) => typeof item === "string");

    if (isChecked) {
      if (!currentSelected.includes(id)) {
        currentSelected.push(id);
      }
    } else {
      currentSelected = currentSelected.filter((item) => item !== id);
    }
    updateFormData({ roomTypes: currentSelected });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Total Floors <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="e.g. 4"
            className="h-10 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={formData.totalFloors}
            onChange={(e) => updateFormData({ totalFloors: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Total Rooms <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="e.g. 36"
            className="h-10 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={formData.totalRooms}
            onChange={(e) => updateFormData({ totalRooms: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white text-xs sm:text-sm">
              Room Types <span className="text-rose-500">*</span>
            </h4>
            <p className="text-[11px] text-slate-400">Select applicable room configurations</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="text-indigo-400 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 font-bold h-8 rounded-xl flex gap-1.5 text-xs transition-colors cursor-pointer"
            onClick={openAddDialog}
          >
            <Plus className="w-3.5 h-3.5" /> Add Room Type
          </Button>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-52 overflow-y-auto">
            <table className="w-full text-xs sm:text-sm min-w-[360px]">
              <thead className="bg-slate-900/90 border-b border-slate-800 sticky top-0 backdrop-blur-xs">
                <tr>
                  <th className="w-10 p-2.5 text-center"></th>
                  <th className="text-left p-2.5 font-semibold text-slate-400 text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left p-2.5 font-semibold text-slate-400 text-xs uppercase tracking-wider">
                    Count
                  </th>
                  <th className="text-right p-2.5 font-semibold text-slate-400 text-xs uppercase tracking-wider pr-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {roomTypes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-xs text-slate-500">
                      No room types found. Click "+ Add Room Type" to create one.
                    </td>
                  </tr>
                ) : (
                  roomTypes.map((rt, i) => (
                    <tr key={rt._id || i} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                          checked={Array.isArray(formData.roomTypes) && formData.roomTypes.includes(rt._id)}
                          onChange={(e) => handleCheckboxChange(rt._id, e.target.checked)}
                        />
                      </td>
                      <td className="p-2.5 font-semibold text-white">{rt.roomType}</td>
                      <td className="p-2.5 text-slate-400">
                        {rt.numberOfRooms} Rooms
                      </td>
                      <td className="p-2.5 text-right pr-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                            onClick={() => openEditDialog(rt)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            onClick={() => handleRemoveRoomType(i, rt._id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RoomTypeDialog
        key={
          isRoomTypeDialogOpen
            ? editingRoomType
              ? editingRoomType._id
              : "new"
            : "closed"
        }
        isOpen={isRoomTypeDialogOpen}
        onClose={() => {
          setIsRoomTypeDialogOpen(false);
          setEditingRoomType(null);
        }}
        roomTypeToEdit={editingRoomType}
        refreshList={fetchRoomTypes}
      />
    </div>
  );
}
