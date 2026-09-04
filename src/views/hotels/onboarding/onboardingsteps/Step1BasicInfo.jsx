"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Star,
  UploadCloud,
  X,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import ImageCropModal from "@/lib/imagecrop/ImageCropModal";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";

function UploadOverlay({ progress, error }) {
  if (progress === null && !error) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs rounded-xl z-10">
      {error ? (
        <div className="flex flex-col items-center gap-1 px-3 text-center">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] text-rose-300 font-semibold">
            Upload failed
          </span>
        </div>
      ) : progress === 100 ? (
        <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-in zoom-in-50" />
      ) : (
        <>
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="4"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>
          <span className="text-white font-bold text-xs mt-0.5">{progress}%</span>
        </>
      )}
    </div>
  );
}

function CroppableUpload({
  label,
  aspect,
  cropShape = "rect",
  folder,
  value,
  onChange,
}) {
  const inputRef = useRef(null);
  const [rawSrc, setRawSrc] = useState(null);
  const [rawName, setRawName] = useState("image.jpg");
  const [cropOpen, setCropOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRawName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropDone = async ({ file, previewUrl }) => {
    onChange({ previewUrl, cloudUrl: null });
    setProgress(0);
    setError(false);
    try {
      const res = await CloudinaryImage.uploadSingleImage(file, folder, (pct) =>
        setProgress(pct),
      );
      const secure_url = res?.data?.secure_url || res?.secure_url;
      const public_id = res?.data?.public_id || res?.public_id;
      onChange({
        previewUrl,
        cloudUrl: secure_url,
        publicId: public_id,
      });
      setProgress(100);
      setTimeout(() => setProgress(null), 800);
    } catch {
      setError(true);
      setTimeout(() => {
        setError(false);
        setProgress(null);
      }, 3000);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setProgress(null);
    setError(false);
  };

  const preview = value?.previewUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-slate-300">
          {label}
        </Label>
        <span className="text-[10px] font-medium text-slate-500">1:1 Square</span>
      </div>

      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-500/40 bg-slate-900 shadow-md">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <UploadOverlay progress={progress} error={error} />
            </div>
            {progress === null && !error && (
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-2 py-0.5 bg-white text-slate-900 text-[10px] font-bold rounded hover:bg-slate-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 shrink-0 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-400 transition-all bg-slate-950/40 hover:bg-indigo-500/5 group cursor-pointer"
          >
            <UploadCloud className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-semibold">Upload</span>
          </button>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white">
            {preview ? "Logo Uploaded" : "Upload Brand Logo"}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            PNG, JPG or WebP. Recommend 500x500px square format.
          </p>
          {preview && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Replace Logo
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <ImageCropModal
        isOpen={cropOpen}
        onClose={() => setCropOpen(false)}
        imageSrc={rawSrc}
        fileName={rawName}
        aspect={aspect}
        cropShape={cropShape}
        onCropDone={handleCropDone}
      />
    </div>
  );
}

function MultiImageUpload({ label, folder, value = [], onChange }) {
  const inputRef = useRef(null);
  const [rawSrc, setRawSrc] = useState(null);
  const [rawName, setRawName] = useState("image.jpg");
  const [cropOpen, setCropOpen] = useState(false);
  const [states, setStates] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRawName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropDone = async ({ file, previewUrl }) => {
    const idx = value.length;
    const newList = [...value, { previewUrl, cloudUrl: null }];
    onChange(newList);
    setStates((s) => ({ ...s, [idx]: { progress: 0, error: false } }));
    try {
      const res = await CloudinaryImage.uploadSingleImage(file, folder, (pct) =>
        setStates((s) => ({ ...s, [idx]: { progress: pct, error: false } })),
      );
      const secure_url = res?.data?.secure_url || res?.secure_url;
      const public_id = res?.data?.public_id || res?.public_id;
      onChange(
        newList.map((item, i) =>
          i === idx
            ? { ...item, cloudUrl: secure_url, publicId: public_id }
            : item,
        ),
      );
      setStates((s) => ({ ...s, [idx]: { progress: 100, error: false } }));
      setTimeout(
        () =>
          setStates((s) => {
            const n = { ...s };
            delete n[idx];
            return n;
          }),
        800,
      );
    } catch {
      setStates((s) => ({ ...s, [idx]: { progress: null, error: true } }));
      setTimeout(
        () =>
          setStates((s) => {
            const n = { ...s };
            delete n[idx];
            return n;
          }),
        3000,
      );
    }
  };

  const handleRemove = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
    setStates((s) => {
      const n = { ...s };
      delete n[idx];
      return n;
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-slate-300">
          {label}
        </Label>
        <span className="text-[10px] font-medium text-slate-500">
          {value.length} photo{value.length === 1 ? "" : "s"} added (16:9)
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {value.map((img, idx) => {
          const st = states[idx];
          return (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-indigo-500/30 bg-slate-900 shadow-sm"
              style={{ aspectRatio: "16/9" }}
            >
              <img
                src={img.previewUrl}
                alt={`hotel-${idx}`}
                className="w-full h-full object-cover"
              />
              <UploadOverlay
                progress={st?.progress ?? null}
                error={st?.error ?? false}
              />
              {!st && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-400 transition-all bg-slate-950/40 hover:bg-indigo-500/5 cursor-pointer group"
          style={{ aspectRatio: "16/9" }}
        >
          <ImageIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-semibold">+ Add Photo</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <ImageCropModal
        isOpen={cropOpen}
        onClose={() => setCropOpen(false)}
        imageSrc={rawSrc}
        fileName={rawName}
        aspect={16 / 9}
        cropShape="rect"
        onCropDone={handleCropDone}
      />
    </div>
  );
}

const RATING_LABELS = {
  1: "1-Star Budget",
  2: "2-Star Standard",
  3: "3-Star Comfort",
  4: "4-Star Premium",
  5: "5-Star Luxury",
};

export default function Step1BasicInfo({ formData, updateFormData }) {
  const currentRating = Number(formData.starRating) || 3;

  return (
    <div className="space-y-4">
      {/* Primary Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Hotel Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Hotel Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            value={formData.hotelName}
            onChange={(e) => updateFormData({ hotelName: e.target.value })}
            placeholder="e.g. Grand Palace Resort"
            className="h-10 rounded-xl bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Hotel Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Property Type <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              value={formData.hotelType}
              onChange={(e) => updateFormData({ hotelType: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
            >
              {[
                ["", "Select Property Type"],
                ["hotel", "Hotel"],
                ["resort", "Resort"],
                ["hostel", "Hostel"],
                ["apartment", "Apartment"],
                ["guest-house", "Guest House"],
                ["homestay", "Homestay"],
                ["villa", "Villa"],
                ["boutique-hotel", "Boutique Hotel"],
                ["business-hotel", "Business Hotel"],
                ["extended-stay", "Extended Stay"],
                ["residence-hotel", "Residence Hotel"],
                ["resort-hotel", "Resort Hotel"],
              ].map(([v, l]) => (
                <option
                  key={v}
                  value={v}
                  className="bg-slate-900 text-white"
                >
                  {l}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-semibold text-slate-300">
            Brand / Chain Name <span className="text-[11px] text-slate-500 font-normal">(Optional)</span>
          </Label>
          <Input
            value={formData.brandName}
            onChange={(e) => updateFormData({ brandName: e.target.value })}
            placeholder="e.g. Marriott International, Taj Group, or standalone"
            className="h-10 rounded-xl bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Star Rating */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Star Rating <span className="text-rose-500">*</span>
          </Label>
          <div className="flex items-center gap-3 h-10 px-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateFormData({ starRating: s.toString() })}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={cn(
                      "w-5 h-5 transition-colors",
                      currentRating >= s
                        ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                        : "text-slate-700 hover:text-slate-500",
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-400/90 pl-1 border-l border-slate-800">
              {RATING_LABELS[currentRating] || `${currentRating} Stars`}
            </span>
          </div>
        </div>

        {/* Established Year */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300">
            Established Year
          </Label>
          <Input
            value={formData.establishedYear}
            onChange={(e) =>
              updateFormData({ establishedYear: e.target.value })
            }
            placeholder="e.g. 2018"
            className="h-10 rounded-xl bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Hotel Description */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-semibold text-slate-300">
            Hotel Description <span className="text-rose-500">*</span>
          </Label>
          <textarea
            value={formData.hotelDescription}
            onChange={(e) =>
              updateFormData({ hotelDescription: e.target.value })
            }
            rows={2}
            className="w-full min-h-[64px] p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
            placeholder="Provide a brief summary of your property, atmosphere, and key highlights..."
          />
        </div>
      </div>

      {/* Media Upload Area (Logo & Photos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {/* Hotel Logo Card */}
        <div className="p-3.5 border border-slate-800/80 rounded-2xl bg-slate-950/40 backdrop-blur-xs">
          <CroppableUpload
            label={<>Hotel Logo <span className="text-rose-500">*</span></>}
            aspect={1}
            cropShape="rect"
            folder="hotel-logos"
            value={formData.hotelLogo}
            onChange={(val) => updateFormData({ hotelLogo: val })}
          />
        </div>

        {/* Hotel Images Card */}
        <div className="p-3.5 border border-slate-800/80 rounded-2xl bg-slate-950/40 backdrop-blur-xs">
          <MultiImageUpload
            label={<>Hotel Images <span className="text-rose-500">*</span></>}
            folder="hotel-images"
            value={formData.hotelImages || []}
            onChange={(val) => updateFormData({ hotelImages: val })}
          />
        </div>
      </div>
    </div>
  );
}
