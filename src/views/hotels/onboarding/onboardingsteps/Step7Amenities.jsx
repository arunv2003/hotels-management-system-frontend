import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step7Amenities({ formData, updateFormData }) {
  return (
    <div className="space-y-10">
      <h4 className="font-bold text-slate-400">Select available amenities <span className="text-red-500">*</span></h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
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
        ].map((amenity) => (
          <label
            key={amenity}
            className={cn(
              "p-5 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all",
              formData.amenities.includes(amenity)
                ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10 shadow-md"
                : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                formData.amenities.includes(amenity)
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 dark:border-slate-700"
              )}
            >
              {formData.amenities.includes(amenity) && (
                <Check className="w-3 h-3" />
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={formData.amenities.includes(amenity)}
              onChange={(e) => {
                const newAmenities = e.target.checked
                  ? [...formData.amenities, amenity]
                  : formData.amenities.filter((a) => a !== amenity);
                updateFormData({ amenities: newAmenities });
              }}
            />
            <span className="font-bold text-xs dark:text-white">
              {amenity}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
