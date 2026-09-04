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

function ProgressRing({ progress }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  return (
    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 48 48">
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
    <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/40 flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-white truncate">
            {label} <span className="text-rose-500">*</span>
          </h4>
          <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
        </div>
        {file && progress === null && !error && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preview / upload area */}
      {file ? (
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
          {isImage ? (
            <div className="relative group">
              <img src={file.previewUrl} alt={label} className="w-full h-24 object-cover" />

              {/* Upload progress overlay */}
              {(progress !== null || error) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs">
                  {error ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-[10px] text-rose-300 font-semibold mt-0.5">Upload failed</span>
                    </>
                  ) : progress === 100 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <>
                      <ProgressRing progress={progress} />
                      <span className="text-white font-bold text-xs mt-0.5">{progress}%</span>
                    </>
                  )}
                </div>
              )}

              {/* Hover preview link */}
              {progress === null && !error && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                  <a
                    href={file.cloudUrl || file.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-white text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          ) : isPdf ? (
            <div className="relative flex items-center gap-2.5 p-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase text-rose-400">PDF Document</span>
                  {(file.cloudUrl || file.previewUrl) && (
                    <a
                      href={file.cloudUrl || file.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold text-indigo-400 hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

              {/* PDF progress badge */}
              {(progress !== null || error) && (
                <div className="flex items-center gap-1">
                  {error ? (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  ) : progress === 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-bold text-indigo-400">{progress}%</span>
                  )}
                </div>
              )}
              {progress === null && !error && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 cursor-pointer"
                >
                  Change
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 text-xs text-slate-400">{file.name}</div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-all bg-slate-950/40 hover:bg-indigo-500/5 group cursor-pointer"
        >
          <UploadCloud className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="text-[11px] font-semibold">Click to upload document</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}

export default function Step8Documents({ formData, updateFormData }) {
  const docs = formData.documents || {};

  const handleDocChange = (id, val) => {
    updateFormData({ documents: { ...docs, [id]: val } });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
