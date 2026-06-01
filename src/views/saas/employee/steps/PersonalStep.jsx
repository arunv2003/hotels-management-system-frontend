"use client";
import React, { useEffect, useState } from "react";
import { useEmployeeContext } from "@/context/employee.contex";
import { UploadCloud, X } from "lucide-react";

export default function PersonalStep() {
  const { formData, updateFormData } = useEmployeeContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Updating form data:", { [name]: value });
    updateFormData({ [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateFormData({ profileImage: file, profileImagePreview: url });
    }
  };


  const removeImage = () => {
    updateFormData({ profileImage: null, profileImagePreview: null });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Gender</label>
          <select 
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
          <input 
            type="date" 
            name="dob"
            value={formData.dob || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Alternate Phone</label>
          <input 
            type="text" 
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            placeholder="e.g. 123-456-7890"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Profile Image</label>
          
          {!formData.profileImagePreview ? (
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 dark:hover:bg-slate-800/80 dark:bg-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  name="profileImage"
                  className="hidden" 
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          ) : (
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg group">
              <img 
                src={formData.profileImagePreview} 
                alt="Profile Preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={removeImage}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
