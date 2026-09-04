import React from "react";
import { cn } from "@/lib/utils";
import {
  Check,
  Wifi,
  Car,
  Waves,
  Utensils,
  Dumbbell,
  Sparkles,
  Wind,
  Shirt,
  BellRing,
  ArrowUpDown,
  Zap,
  Briefcase,
} from "lucide-react";

const AMENITY_ICONS = {
  WiFi: Wifi,
  Parking: Car,
  "Swimming Pool": Waves,
  Restaurant: Utensils,
  Gym: Dumbbell,
  Spa: Sparkles,
  AC: Wind,
  Laundry: Shirt,
  "Room Service": BellRing,
  Elevator: ArrowUpDown,
  "Power Backup": Zap,
  "Conference Room": Briefcase,
};

export default function Step7Amenities({ formData, updateFormData }) {
  const amenitiesList = [
    "WiFi",
    "Parking",
    "Swimming Pool",
    "Restaurant",
    "Gym",
    "Spa",
    "AC",
    "Laundry",
    "Room Service",
    "Elevator",
    "Power Backup",
    "Conference Room",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-300">
          Select Available Amenities <span className="text-rose-500">*</span>
        </p>
        <span className="text-[10px] text-slate-500 font-medium">
          {formData.amenities?.length || 0} selected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {amenitiesList.map((amenity) => {
          const isSelected = formData.amenities?.includes(amenity);
          const Icon = AMENITY_ICONS[amenity] || Sparkles;

          return (
            <label
              key={amenity}
              className={cn(
                "p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all select-none group",
                isSelected
                  ? "border-indigo-500/50 bg-indigo-500/15 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                  : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/50"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center transition-all shrink-0",
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-900 text-slate-400 group-hover:text-slate-300 border border-slate-800"
                )}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={(e) => {
                  const newAmenities = e.target.checked
                    ? [...(formData.amenities || []), amenity]
                    : (formData.amenities || []).filter((a) => a !== amenity);
                  updateFormData({ amenities: newAmenities });
                }}
              />

              <span
                className={cn(
                  "text-xs font-semibold truncate transition-colors",
                  isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                )}
              >
                {amenity}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

