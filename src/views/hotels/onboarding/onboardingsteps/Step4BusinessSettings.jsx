import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step4BusinessSettings({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Currency <span className="text-red-500">*</span>
          </Label>

          <select className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-900 dark:text-white">
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="inr"
            >
              INR (₹) - Indian Rupee
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="inr"
            >
              INR ($) - US Dollar
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="eur"
            >
              EUR (€) - Euro
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="gbp"
            >
              GBP (£) - British Pound
            </option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Tax Type <span className="text-red-500">*</span>
          </Label>

          <select className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-900 dark:text-white">
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="gst"
            >
              GST (Goods & Services Tax)
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="vat"
            >
              VAT (Value Added Tax)
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="sales-tax"
            >
              Sales Tax
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="service-tax"
            >
              Service Tax
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="income-tax"
            >
              Income Tax
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="corporate-tax"
            >
              Corporate Tax
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="custom-duty"
            >
              Custom Duty
            </option>

            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="none"
            >
              No Tax
            </option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Invoice Prefix <span className="text-red-500">*</span>
          </Label>
          <Input defaultValue="INV-" className="h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Invoice Serial <span className="text-red-500">*</span>
          </Label>
          <Input defaultValue="001" className="h-12 rounded-xl" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Financial Year <span className="text-red-500">*</span>
          </Label>

          <select className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-900 dark:text-white">
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="january-february"
            >
              January - February
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="february-march"
            >
              February - March
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="march-april"
            >
              March - April
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="april-may"
            >
              April - May
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="may-june"
            >
              May - June
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="june-july"
            >
              June - July
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="july-august"
            >
              July - August
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="august-september"
            >
              August - September
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="september-october"
            >
              September - October
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="october-november"
            >
              October - November
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="november-december"
            >
              November - December
            </option>
            <option
              className="bg-white dark:bg-slate-900 text-black dark:text-white"
              value="december-january"
            >
              December - January
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
