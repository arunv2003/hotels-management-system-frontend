"use client";
import React, { useState } from "react";
import { useEmployeeContext } from "@/context/employee.contex";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";

const DOCS = [
  { key: "aadhar", label: "Aadhar Document", accept: "image/*,.pdf", description: "Upload your Aadhar image or PDF" },
  { key: "panCard", label: "PAN Document", accept: "image/*,.pdf", description: "Upload your PAN card image or PDF" },
];

export default function DocumentStep() {
  const { formData, updateFormData } = useEmployeeContext();
  const [uploading, setUploading] = useState({});
  const [progress, setProgress] = useState({});
  const [uploadError, setUploadError] = useState({});

  const documents = formData.documents || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleFileChange = async (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setUploading((prev) => ({ ...prev, [key]: true }));
    setProgress((prev) => ({ ...prev, [key]: 0 }));
    setUploadError((prev) => ({ ...prev, [key]: "" }));

    try {
      const result = await CloudinaryImage.uploadSingleImage(file, "employeeDocuments", (pct) => {
        setProgress((prev) => ({ ...prev, [key]: pct }));
      });

      const cloudUrl =
        result?.data?.secure_url || result?.secure_url || result?.data?.url || result?.url || "";
      const publicId = result?.data?.public_id || result?.public_id || "";

      updateFormData({
        documents: {
          ...documents,
          [key]: {
            name: file.name,
            type: file.type,
            cloudUrl,
            publicId,
          },
        },
      });
    } catch (error) {
      console.error("Document upload failed:", error);
      setUploadError((prev) => ({ ...prev, [key]: "Upload failed. Please try again." }));
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRemoveDocument = (key) => {
    const updated = { ...documents };
    delete updated[key];
    updateFormData({ documents: updated });
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

        {DOCS.map((doc) => {
          const fileData = documents[doc.key];
          const isUploading = uploading[doc.key];
          return (
            <div key={doc.key} className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{doc.label}</label>

              <label htmlFor={`upload-${doc.key}`} className="block cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">{doc.description}</p>
                <p className="text-slate-400 text-xs">PDF, JPG, PNG up to 10MB</p>
              </label>
              <input
                id={`upload-${doc.key}`}
                type="file"
                accept={doc.accept}
                className="hidden"
                onChange={(e) => handleFileChange(doc.key, e)}
              />

              {isUploading && (
                <p className="text-sm text-indigo-600">Uploading... {progress[doc.key] || 0}%</p>
              )}
              {uploadError[doc.key] && (
                <p className="text-sm text-rose-500">{uploadError[doc.key]}</p>
              )}

              {fileData && (
                <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{fileData.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {fileData.type} • Uploaded
                    </p>
                    {fileData.cloudUrl && (
                      <a href={fileData.cloudUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                        View file
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.key)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
