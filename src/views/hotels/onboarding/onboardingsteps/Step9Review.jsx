"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Hotel,
  MapPin,
  Building2,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Edit2,
} from "lucide-react";

export default function Step9Review({ formData, nextStep, setStep, isSubmitting }) {
  const reviewItems = [
    {
      stepNumber: 1,
      title: "Hotel Information",
      value: formData.hotelName ? `${formData.hotelName} (${formData.hotelType || "Hotel"})` : "Not Provided",
      icon: Hotel,
    },
    {
      stepNumber: 2,
      title: "Owner & Contact",
      value: formData.ownerFullName ? `${formData.ownerFullName} • ${formData.ownerEmail || formData.mobileNumber}` : "Not Provided",
      icon: Users,
    },
    {
      stepNumber: 3,
      title: "Location",
      value: formData.city ? `${formData.city}, ${formData.state || ""}, ${formData.country || "India"}` : "Not Provided",
      icon: MapPin,
    },
    {
      stepNumber: 5,
      title: "Inventory & Rooms",
      value: `${formData.totalRooms || 0} Total Rooms, ${formData.roomTypes?.length || 0} Room Types`,
      icon: Building2,
    },
    {
      stepNumber: 6,
      title: "Hotel Amenities",
      value: formData.amenities?.length ? `${formData.amenities.length} Amenities Selected` : "None Selected",
      icon: CheckCircle2,
    },
    {
      stepNumber: 7,
      title: "Verification Documents",
      value: formData.documents?.gstCertificate ? "Required documents attached" : "Pending Upload",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reviewItems.map((item, i) => (
          <div
            key={i}
            className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/40 flex items-center justify-between hover:border-slate-700/80 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">
                  {item.value}
                </p>
              </div>
            </div>
            {setStep && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(item.stepNumber)}
                className="text-xs font-semibold text-indigo-400 hover:text-white hover:bg-indigo-500/10 rounded-xl px-2.5 h-7 shrink-0 ml-2 gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Review Summary Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-950/50 via-slate-900/60 to-purple-950/50 border border-indigo-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              All Details Verified!
            </h3>
            <p className="text-xs text-slate-400">
              Proceed to select your subscription plan and activate your hotel.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={nextStep}
          className="w-full md:w-auto h-9 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Continue to Choose Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
