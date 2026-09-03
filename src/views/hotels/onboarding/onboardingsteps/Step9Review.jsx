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
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviewItems.map((item, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                  {item.value}
                </p>
              </div>
            </div>
            {setStep && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(item.stepNumber)}
                className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg px-3 h-8"
              >
                Edit
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Review Summary Banner */}
      <div className="p-8 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              All Details Verified!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proceed to the final step to select your subscription plan and activate your hotel property.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={nextStep}
          className="w-full md:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 gap-2 flex-shrink-0"
        >
          <span>Continue to Choose Plan</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
