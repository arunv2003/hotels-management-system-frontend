import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step4BusinessSettings({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Currency */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Currency <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={formData.currency || "INR"}
              onChange={(e) => updateFormData({ currency: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              <option className="bg-slate-900 text-white" value="INR">
                INR (₹) - Indian Rupee
              </option>
              <option className="bg-slate-900 text-white" value="USD">
                USD ($) - US Dollar
              </option>
              <option className="bg-slate-900 text-white" value="EUR">
                EUR (€) - Euro
              </option>
              <option className="bg-slate-900 text-white" value="GBP">
                GBP (£) - British Pound
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tax Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Tax Type <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={formData.taxType || "GST"}
              onChange={(e) => updateFormData({ taxType: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              <option className="bg-slate-900 text-white" value="GST">
                GST (Goods & Services Tax)
              </option>
              <option className="bg-slate-900 text-white" value="VAT">
                VAT (Value Added Tax)
              </option>
              <option className="bg-slate-900 text-white" value="Sales-Tax">
                Sales Tax
              </option>
              <option className="bg-slate-900 text-white" value="None">
                No Tax
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Invoice Prefix */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Invoice Prefix <span className="text-rose-500">*</span>
          </Label>
          <Input
            value={formData.invoicePrefix || "INV-"}
            onChange={(e) => updateFormData({ invoicePrefix: e.target.value })}
            placeholder="INV-"
            className="h-10 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 uppercase"
          />
        </div>

        {/* Financial Year */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Financial Year <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={formData.financialYear || "April-March (FY)"}
              onChange={(e) => updateFormData({ financialYear: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              <option className="bg-slate-900 text-white" value="April-March (FY)">
                April - March (FY)
              </option>
              <option className="bg-slate-900 text-white" value="January-December (CY)">
                January - December (CY)
              </option>
              <option className="bg-slate-900 text-white" value="July-June">
                July - June
              </option>
              <option className="bg-slate-900 text-white" value="October-September">
                October - September
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Format */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Date Format <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={formData.dateFormat || "DD-MM-YYYY"}
              onChange={(e) => updateFormData({ dateFormat: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              <option className="bg-slate-900 text-white" value="DD-MM-YYYY">
                DD-MM-YYYY (e.g. 31-12-2026)
              </option>
              <option className="bg-slate-900 text-white" value="MM-DD-YYYY">
                MM-DD-YYYY (e.g. 12-31-2026)
              </option>
              <option className="bg-slate-900 text-white" value="YYYY-MM-DD">
                YYYY-MM-DD (e.g. 2026-12-31)
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Timezone <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={formData.timezone || "Asia/Kolkata"}
              onChange={(e) => updateFormData({ timezone: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              <option className="bg-slate-900 text-white" value="Asia/Kolkata">
                Asia/Kolkata (GMT +5:30)
              </option>
              <option className="bg-slate-900 text-white" value="UTC">
                UTC (GMT +0:00)
              </option>
              <option className="bg-slate-900 text-white" value="America/New_York">
                America/New_York (EST)
              </option>
              <option className="bg-slate-900 text-white" value="Europe/London">
                Europe/London (BST)
              </option>
              <option className="bg-slate-900 text-white" value="Asia/Dubai">
                Asia/Dubai (GST)
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
