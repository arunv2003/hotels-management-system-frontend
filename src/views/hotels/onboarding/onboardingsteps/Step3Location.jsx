import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Column: Form Fields */}
      <div className="lg:col-span-7 space-y-3">
        {/* Search Address */}
        <div className="space-y-1.5 relative">
          <Label className="text-xs font-semibold text-slate-300">
            Full Address / Search Location <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <Input
              value={formData.fullAddress}
              onChange={(e) => handleAddressSearch(e.target.value)}
              onFocus={() => formData.fullAddress && setShowSearchResults(true)}
              placeholder="Search address or landmark on map..."
              className="h-10 pl-9 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto bg-slate-900 backdrop-blur-xl divide-y divide-slate-800">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <p className="text-xs font-medium text-white truncate">
                    {result.formatted_address}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2x2 Grid for Country, State, City, Pincode */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-300">
              Country <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.country}
              readOnly
              placeholder="Auto-filled"
              className="h-10 rounded-xl text-sm bg-slate-900/60 border-slate-800 text-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-300">
              State <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.state}
              readOnly
              placeholder="Auto-filled"
              className="h-10 rounded-xl text-sm bg-slate-900/60 border-slate-800 text-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-300">
              City <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.city}
              readOnly
              placeholder="Auto-filled"
              className="h-10 rounded-xl text-sm bg-slate-900/60 border-slate-800 text-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-300">
              Pincode <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.pincode}
              onChange={(e) => updateFormData({ pincode: e.target.value })}
              placeholder="e.g. 110001"
              className="h-10 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Lat & Lng in 2-cols */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-300">
              Latitude <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.latitude || ""}
              readOnly
              placeholder="Auto-filled from map"
              className="h-10 rounded-xl text-sm bg-slate-900/60 border-slate-800 text-slate-300 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-300">
              Longitude <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.longitude || ""}
              readOnly
              placeholder="Auto-filled from map"
              className="h-10 rounded-xl text-sm bg-slate-900/60 border-slate-800 text-slate-300 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Google Map */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-indigo-400" />
            Pick on Map
          </Label>
          <span className="text-[10px] text-slate-500">Drag marker to adjust</span>
        </div>
        <div className="flex-1 min-h-[220px] rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative">
          <GoogleMapComponent
            onLocationChange={handleLocationChange}
            initialLocation={{
              lat: parseFloat(formData.latitude) || 20.5937,
              lng: parseFloat(formData.longitude) || 78.9629,
            }}
          />
        </div>
      </div>
    </div>
  );
}
