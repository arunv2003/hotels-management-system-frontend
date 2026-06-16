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
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Total Floors <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Enter total floors"
            className="h-12 rounded-xl"
            value={formData.totalFloors}
            onChange={(e) => updateFormData({ totalFloors: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Total Rooms <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Enter total rooms"
            className="h-12 rounded-xl"
            value={formData.totalRooms}
            onChange={(e) => updateFormData({ totalRooms: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-400">Room Types <span className="text-red-500">*</span></h4>
          <Button
            type="button"
            variant="ghost"
            className="text-indigo-600 font-bold h-8 flex gap-1"
            onClick={openAddDialog}
          >
            <Plus className="w-4 h-4" /> Add Room Type
          </Button>
        </div>
        <div className="border border-slate-100 dark:border-slate-800 rounded-[1rem] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="w-12 p-4 text-center"></th>
                <th className="text-left p-4 font-bold text-slate-400">Type</th>
                <th className="text-left p-4 font-bold text-slate-400">
                  Count
                </th>
                <th className="text-right p-4 font-bold text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {roomTypes.map((rt, i) => (
                <tr key={rt._id || i}>
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={Array.isArray(formData.roomTypes) && formData.roomTypes.includes(rt._id)}
                      onChange={(e) => handleCheckboxChange(rt._id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4 font-bold dark:text-white">{rt.roomType}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {rt.numberOfRooms} Rooms
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg text-slate-400 hover:text-indigo-600"
                        onClick={() => openEditDialog(rt)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-600"
                        onClick={() => handleRemoveRoomType(i, rt._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
