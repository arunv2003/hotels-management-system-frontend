"use client";
import React, { useRef, useState } from "react";
import { FileText, UploadCloud, X, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";

const DOCS = [
  { id: "gstCertificate", label: "GST Certificate", accept: "image/*,.pdf", folder: "hotelDocumentImage" },
  { id: "panCard",         label: "PAN Card",         accept: "image/*,.pdf", folder: "hotelDocumentImage" },
  { id: "hotelLicense",   label: "Hotel License",    accept: "image/*,.pdf", folder: "hotelDocumentImage" },
  { id: "ownerId",        label: "Owner ID Proof",   accept: "image/*,.pdf", folder: "hotelsStaffDocumentImage" },
];

/* ─── Circular progress ring ──────────────────────────────────────── */
function ProgressRing({ progress }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  return (
    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke="#6366f1" strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress / 100)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
    </svg>
  );
}


function DocUploadCard({ label, accept, folder, file, onChange }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null); 
  const [error, setError] = useState(false);

  const isImage = file?.type?.startsWith("image/");
  const isPdf   = file?.type === "application/pdf";

  const handleChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    e.target.value = "";
    const previewUrl = f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
    onChange({ file: f, previewUrl, cloudUrl: null, type: f.type, name: f.name });
    setProgress(0);
    setError(false);
    try {
      const res = await CloudinaryImage.uploadSingleImage(f, folder, (pct) => setProgress(pct));
      const secure_url = res?.data?.secure_url || res?.secure_url;
      const public_id = res?.data?.public_id || res?.public_id;
      onChange({ file: f, previewUrl, cloudUrl: secure_url, publicId: public_id, type: f.type, name: f.name });
      setProgress(100);
      setTimeout(() => setProgress(null), 800);
    } catch {
      setError(true);
      setTimeout(() => { setError(false); setProgress(null); }, 3000);
    }
  };

  const handleRemove = () => { onChange(null); setProgress(null); setError(false); };

  return (
    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {label} <span className="text-rose-500">*</span>
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG accepted</p>
        </div>
        {file && progress === null && !error && (
          <button type="button" onClick={handleRemove}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-300 hover:text-rose-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preview / upload area */}
      {file ? (
        <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          {isImage ? (
            <div className="relative group">
              <img src={file.previewUrl} alt={label} className="w-full h-40 object-cover" />

              {/* Upload progress overlay */}
              {(progress !== null || error) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                  {error ? (
                    <>
                      <AlertCircle className="w-8 h-8 text-rose-400" />
                      <span className="text-xs text-rose-300 font-semibold mt-1">Upload failed</span>
                    </>
                  ) : progress === 100 ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <>
                      <ProgressRing progress={progress} />
                      <span className="text-white font-bold text-sm mt-1">{progress}%</span>
                    </>
                  )}
                </div>
              )}

              {/* Hover preview link — only when idle */}
              {progress === null && !error && (
                <a href={file.cloudUrl || file.previewUrl} target="_blank" rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5 bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </div>
                </a>
              )}
            </div>
          ) : isPdf ? (
            <div className="relative flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400">PDF Document</p>
              </div>

              {/* PDF progress badge */}
              {(progress !== null || error) && (
                <div className="flex items-center gap-1.5">
                  {error ? (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  ) : progress === 100 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="12" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                          <circle cx="16" cy="16" r="12" fill="none" stroke="#6366f1" strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 12}`}
                            strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.3s ease" }} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                          {progress}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-xs text-slate-400">{file.name}</div>
          )}

          {/* Replace button */}
          {progress === null && !error && (
            <div className="px-3 pb-3">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="w-full py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors">
                Replace File
              </button>
            </div>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/50">
          <UploadCloud className="w-7 h-7" />
          <span className="text-xs font-semibold">Click to upload</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}

/* ─── Main Step ──────────────────────────────────────────────────── */
export default function Step8Documents({ formData, updateFormData }) {
  const docs = formData.documents || {};

  const handleDocChange = (id, val) => {
    updateFormData({ documents: { ...docs, [id]: val } });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Upload required documents to verify your business. Supported formats: PDF, JPG, PNG.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCS.map((doc) => (
          <DocUploadCard
            key={doc.id}
            label={doc.label}
            accept={doc.accept}
            folder={doc.folder}
            file={docs[doc.id] || null}
            onChange={(val) => handleDocChange(doc.id, val)}
          />
        ))}
      </div>
    </div>
  );
}
