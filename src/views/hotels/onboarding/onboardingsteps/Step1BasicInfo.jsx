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
} from "lucide-react";
import ImageCropModal from "@/lib/imagecrop/ImageCropModal";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";

function UploadOverlay({ progress, error }) {
  if (progress === null && !error) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl z-10">
      {error ? (
        <div className="flex flex-col items-center gap-1 px-3 text-center">
          <AlertCircle className="w-6 h-6 text-rose-400" />
          <span className="text-xs text-rose-300 font-semibold">
            Upload failed
          </span>
        </div>
      ) : progress === 100 ? (
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      ) : (
        <>
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 44 44">
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
          <span className="text-white font-bold text-sm mt-1">{progress}%</span>
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
  const [progress, setProgress] = useState(null); // null | 0-100
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
      onChange({
        previewUrl,
        cloudUrl: res.secure_url,
        publicId: res.public_id,
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
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase text-slate-400">
        {label}
      </Label>
      {preview ? (
        <div className="relative group">
          <div
            className={cn(
              "overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/30 bg-slate-50 dark:bg-slate-800",
              aspect === 1 ? "w-32 h-32 rounded-2xl" : "w-full rounded-2xl",
            )}
            style={aspect !== 1 ? { aspectRatio: "16/9" } : {}}
          >
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <UploadOverlay progress={progress} error={error} />
          </div>
          {progress === null && !error && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 text-slate-900 text-xs font-bold rounded-xl hover:bg-white transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/50",
            aspect === 1 ? "h-32 w-32" : "w-full py-8",
          )}
        >
          <UploadCloud className="w-7 h-7" />
          <span className="text-xs font-semibold">Upload</span>
        </button>
      )}
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
      onChange(
        newList.map((item, i) =>
          i === idx
            ? { ...item, cloudUrl: res.secure_url, publicId: res.public_id }
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
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase text-slate-400">
        {label}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((img, idx) => {
          const st = states[idx];
          return (
            <div
              key={idx}
              className="relative group rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/30 bg-slate-100 dark:bg-slate-800"
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
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
          className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/50"
          style={{ aspectRatio: "16/9" }}
        >
          <ImageIcon className="w-6 h-6" />
          <span className="text-xs font-semibold">Add Photo</span>
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

export default function Step1BasicInfo({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="w-full md:w-1/3 p-6 bg-indigo-50 rounded-[2rem] flex items-center justify-center border border-indigo-100 dark:border-indigo-500/10">
          <img
            src="https://img.freepik.com/free-vector/hotel-building-concept-illustration_114360-1559.jpg"
            alt="hotel"
            className="w-full h-auto mix-blend-multiply opacity-100"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Hotel Information</h3>
          <p className="text-slate-500 text-sm">
            Tell us about your hotel and its basic details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Hotel Name *
          </Label>
          <Input
            value={formData.hotelName}
            onChange={(e) => updateFormData({ hotelName: e.target.value })}
            placeholder="Enter hotel name"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Hotel Type *
          </Label>
          <select
            value={formData.hotelType}
            onChange={(e) => updateFormData({ hotelType: e.target.value })}
            className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-900 dark:text-white"
          >
            {[
              ["", "Select Hotel Type"],
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
                className="bg-white dark:bg-slate-900 text-black dark:text-white"
              >
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Brand / Chain Name (Optional)
          </Label>
          <Input
            value={formData.brandName}
            onChange={(e) => updateFormData({ brandName: e.target.value })}
            placeholder="Enter brand or chain name"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Star Rating *
          </Label>
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateFormData({ starRating: s.toString() })}
                className={cn(
                  "p-1 transition-colors",
                  Number(formData.starRating) >= s
                    ? "text-amber-400"
                    : "text-slate-200",
                )}
              >
                <Star
                  className={cn(
                    "w-6 h-6",
                    Number(formData.starRating) >= s && "fill-current",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Established Year
          </Label>
          <Input
            value={formData.establishedYear}
            onChange={(e) =>
              updateFormData({ establishedYear: e.target.value })
            }
            placeholder="Select year"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Hotel Description *
          </Label>
          <textarea
            value={formData.hotelDescription}
            onChange={(e) =>
              updateFormData({ hotelDescription: e.target.value })
            }
            className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm resize-none"
            placeholder="Describe your hotel"
          />
        </div>
      </div>

      {/* Hotel Logo */}
      <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
        <CroppableUpload
          label="Hotel Logo *"
          hint="Square (1:1)"
          aspect={1}
          cropShape="rect"
          folder="hotel-logos"
          value={formData.hotelLogo}
          onChange={(val) => updateFormData({ hotelLogo: val })}
        />
      </div>

      {/* Hotel Images */}
      <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
        <MultiImageUpload
          label="Hotel Images * (1600 × 900)"
          hint="16:9"
          folder="hotel-images"
          value={formData.hotelImages || []}
          onChange={(val) => updateFormData({ hotelImages: val })}
        />
      </div>
    </div>
  );
}
