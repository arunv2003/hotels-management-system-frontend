"use client";
import React from "react";
import { useEmployeeContext } from "@/context/employee.contex";

export default function AddressStep() {
  const { formData, updateFormData } = useEmployeeContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Address Line</label>
        <textarea 
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white resize-none"
          placeholder="123 Main St, Apt 4B..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">City</label>
          <input 
            type="text" 
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="New York"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">State / Province</label>
          <input 
            type="text" 
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="NY"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Country</label>
          <input 
            type="text" 
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="United States"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">ZIP / Pincode</label>
          <input 
            type="text" 
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="10001"
          />
        </div>
      </div>
    </div>
  );
}
