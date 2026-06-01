import React from "react";
import { Button } from "@/components/ui/button";
import { Hotel, MapPin, CreditCard, Building2, FileText, Users } from "lucide-react";

export default function Step9Review({ formData, nextStep }) {
  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 gap-4">
        {[
          {
            title: "Hotel Information",
            value: "Sunrise Hotel & Resort",
            icon: Hotel,
          },
          {
            title: "Location",
            value: "Mumbai, Maharashtra, India",
            icon: MapPin,
          },
          {
            title: "Plan",
            value: "Premium Plan (Monthly)",
            icon: CreditCard,
          },
          {
            title: "Rooms",
            value: "30 Rooms, 3 Room Types",
            icon: Building2,
          },
          {
            title: "Documents",
            value: "6 Documents Uploaded",
            icon: FileText,
          },
          {
            title: "Staff",
            value: "3 Staff Members",
            icon: Users,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {item.title}
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {item.value}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="text-indigo-600 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl px-6 flex gap-2"
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      <div className="p-8 bg-indigo-600 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40">
        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-3xl font-black mb-2 tracking-tight">
            You&apos;re all set!
          </h3>
          <p className="text-indigo-100 max-w-md">
            Click the button below to create your hotel account and start your
            journey with HotelFlow.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <Button
            type="button"
            onClick={nextStep}
            className="w-full md:h-16 md:px-12 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 text-lg font-black shadow-xl"
          >
            Create Account
          </Button>
        </div>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-2 border-slate-200 dark:border-slate-800 text-indigo-600"
        />
        <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
          I agree to the{" "}
          <a href="#" className="text-indigo-600 underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 underline">
            Privacy Policy
          </a>
        </label>
      </div>
    </div>
  );
}
