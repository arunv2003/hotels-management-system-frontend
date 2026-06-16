import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import GoogleMapComponent from "@/lib/googlemap/google.map";

export default function Step3Location({
  formData,
  updateFormData,
  showSearchResults,
  setShowSearchResults,
  searchResults,
  handleAddressSearch,
  handleSelectLocation,
  handleLocationChange,
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl mb-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Country <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.country}
            readOnly
            placeholder="Auto-filled"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            State <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.state}
            readOnly
            placeholder="Auto-filled"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.city}
            readOnly
            placeholder="Auto-filled"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Pincode <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.pincode}
            onChange={(e) => updateFormData({ pincode: e.target.value })}
            placeholder="Enter pincode"
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2 relative">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Full Address <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.fullAddress}
            onChange={(e) => handleAddressSearch(e.target.value)}
            onFocus={() => formData.fullAddress && setShowSearchResults(true)}
            placeholder="Enter or search your location"
            className="h-12 rounded-xl"
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto bg-white dark:bg-slate-900">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {result.formatted_address}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
        <GoogleMapComponent
          onLocationChange={handleLocationChange}
          initialLocation={{
            lat: formData.latitude || 20.5937,
            lng: formData.longitude || 78.9629,
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Latitude <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.latitude || ""}
            readOnly
            placeholder="Auto-filled"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Longitude <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.longitude || ""}
            readOnly
            placeholder="Auto-filled"
            className="h-12 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
