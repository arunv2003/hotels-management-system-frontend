"use client";
import React from "react";
import { useEmployeeContext } from "@/context/employee.contex";

export default function DocumentStep() {
  const { formData, updateFormData } = useEmployeeContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Aadhar Number</label>
          <input 
            type="text" 
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="XXXX XXXX XXXX"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">PAN Number</label>
          <input 
            type="text" 
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white uppercase"
            placeholder="ABCDE1234F"
          />
        </div>
        
        {/* Placeholder for actual file upload, acting as text field for now since state is string/array */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Document Uploads</label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">Click to upload documents</p>
            <p className="text-slate-400 text-xs">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
