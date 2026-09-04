"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  User,
  Camera,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
} from "lucide-react";

import ImageCropModal from "@/lib/imagecrop/ImageCropModal";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";
import { cn } from "@/lib/utils";

function UploadOverlay({ progress, error }) {
  if (progress === null && !error) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full z-10">
      {error ? (
        <AlertCircle className="w-6 h-6 text-rose-400" />
      ) : progress === 100 ? (
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      ) : (
        <>
          <svg
            className="w-14 h-14 -rotate-90"
            viewBox="0 0 44 44"
          >
            {/* Background circle */}
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="4"
            />

            {/* Progress circle */}
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
            />
          </svg>

          <span className="text-white font-bold text-sm mt-1">
            {progress >= 95 && progress < 100
              ? "..."
              : `${progress}%`}
          </span>
        </>
      )}
    </div>
  );
}

export default function Step2OwnerDetails({
  formData,
  updateFormData,
}) {
  const inputRef = useRef(null);

  const [rawSrc, setRawSrc] = useState(null);
  const [rawName, setRawName] = useState("profile.jpg");
  const [cropOpen, setCropOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Touched state to display inline validation
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation checkers
  const isNameValid = (name) => !!name && name.trim().length >= 2;
  const isEmailValid = (email) => !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isMobileValid = (mobile) => !!mobile && /^[0-9]{10}$/.test(String(mobile).replace(/\D/g, ""));
  const isPasswordValid = (pwd) => !pwd || pwd.length >= 6;
  const isConfirmPasswordValid = (confirmPwd, pwd) => !confirmPwd || confirmPwd === pwd;

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
    updateFormData({
      ownerProfilePhoto: {
        previewUrl,
        cloudUrl: null,
        publicId: null,
      },
    });

    setProgress(0);
    setError(false);

    try {
      const res = await CloudinaryImage.uploadSingleImage(
        file,
        "owner-profiles",
        (pct) => {
          const safeProgress = Math.min(Math.round(pct), 95);
          setProgress(safeProgress);
        }
      );

      updateFormData({
        ownerProfilePhoto: {
          previewUrl,
          cloudUrl: res.secure_url,
          publicId: res.public_id,
        },
      });

      setProgress(100);
      setTimeout(() => {
        setProgress(null);
      }, 800);
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      setError(true);
      setTimeout(() => {
        setError(false);
        setProgress(null);
      }, 3000);
    }
  };

  const previewUrl = formData.ownerProfilePhoto?.previewUrl;

  return (
    <div className="space-y-3.5">
      {/* Upload Section - Compact Banner */}
      <div className="flex items-center gap-4 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800/80">
        {/* Avatar */}
        <div
          className="relative w-16 h-16 rounded-full border-2 border-indigo-500/40 shadow-md overflow-hidden bg-slate-900 cursor-pointer group shrink-0"
          onClick={() => progress === null && inputRef.current?.click()}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Owner Profile"
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-full h-full p-3.5 text-slate-500" />
          )}

          <UploadOverlay progress={progress} error={error} />

          {progress === null && !error && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full backdrop-blur-xs">
              <Camera className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full border border-slate-900 z-20 shadow-xs">
            <Camera className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white">
            Owner Profile Photo
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {progress === 100
              ? "Upload completed"
              : progress !== null
              ? progress >= 95
                ? "Processing image..."
                : `Uploading… ${progress}%`
              : "Click avatar to upload · 1:1 Square"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => progress === null && inputRef.current?.click()}
          className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold rounded-xl border border-indigo-500/20 transition-colors shrink-0 cursor-pointer"
        >
          {previewUrl ? "Change" : "Upload"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={cropOpen}
        onClose={() => setCropOpen(false)}
        imageSrc={rawSrc}
        fileName={rawName}
        aspect={1}
        cropShape="round"
        onCropDone={handleCropDone}
      />

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Full Name */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Owner Full Name <span className="text-rose-500">*</span></span>
            {touched.ownerFullName && !isNameValid(formData.ownerFullName) && (
              <span className="text-xs font-medium text-rose-400 normal-case flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Required (min 2 characters)
              </span>
            )}
          </Label>

          <Input
            value={formData.ownerFullName || ""}
            onChange={(e) => {
              updateFormData({ ownerFullName: e.target.value });
              if (!touched.ownerFullName) setTouched((prev) => ({ ...prev, ownerFullName: true }));
            }}
            onBlur={() => handleBlur("ownerFullName")}
            placeholder="e.g. John Doe"
            className={cn(
              "h-10 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
              touched.ownerFullName && !isNameValid(formData.ownerFullName)
                ? "border-rose-500/60 focus-visible:ring-rose-500/20"
                : touched.ownerFullName && isNameValid(formData.ownerFullName)
                ? "border-emerald-500/60 focus-visible:ring-emerald-500/20"
                : ""
            )}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Email Address <span className="text-rose-500">*</span></span>
            {touched.ownerEmail && !isEmailValid(formData.ownerEmail) && (
              <span className="text-xs font-medium text-rose-400 normal-case flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Valid email required
              </span>
            )}
          </Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={formData.ownerEmail || ""}
              onChange={(e) => {
                updateFormData({ ownerEmail: e.target.value });
                if (!touched.ownerEmail) setTouched((prev) => ({ ...prev, ownerEmail: true }));
              }}
              onBlur={() => handleBlur("ownerEmail")}
              type="email"
              inputMode="email"
              placeholder="owner@hotel.com"
              className={cn(
                "h-10 pl-9 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                touched.ownerEmail && !isEmailValid(formData.ownerEmail)
                  ? "border-rose-500/60 focus-visible:ring-rose-500/20"
                  : touched.ownerEmail && isEmailValid(formData.ownerEmail)
                  ? "border-emerald-500/60 focus-visible:ring-emerald-500/20"
                  : ""
              )}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Mobile Number <span className="text-rose-500">*</span></span>
            {touched.mobileNumber && !isMobileValid(formData.mobileNumber) && (
              <span className="text-xs font-medium text-rose-400 normal-case flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Enter 10-digit number
              </span>
            )}
          </Label>

          <div className="flex gap-2">
            <div className="w-16 shrink-0">
              <Input
                defaultValue="+91"
                disabled
                className="h-10 rounded-xl text-center font-semibold bg-slate-900 border-slate-800 text-slate-300 text-xs"
              />
            </div>

            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={formData.mobileNumber || ""}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                  updateFormData({ mobileNumber: onlyNums });
                  if (!touched.mobileNumber) setTouched((prev) => ({ ...prev, mobileNumber: true }));
                }}
                onBlur={() => handleBlur("mobileNumber")}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                className={cn(
                  "h-10 pl-9 rounded-xl text-sm font-medium bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                  touched.mobileNumber && !isMobileValid(formData.mobileNumber)
                    ? "border-rose-500/60 focus-visible:ring-rose-500/20"
                    : touched.mobileNumber && isMobileValid(formData.mobileNumber)
                    ? "border-emerald-500/60 focus-visible:ring-emerald-500/20"
                    : ""
                )}
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Password <span className="text-rose-500">*</span></span>
            {touched.password && formData.password && !isPasswordValid(formData.password) && (
              <span className="text-xs font-medium text-rose-400 normal-case flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Min 6 chars
              </span>
            )}
          </Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={formData.password || ""}
              onChange={(e) => {
                updateFormData({ password: e.target.value });
                if (!touched.password) setTouched((prev) => ({ ...prev, password: true }));
              }}
              onBlur={() => handleBlur("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password (min 6 characters)"
              className={cn(
                "h-10 pl-9 pr-9 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                touched.password && formData.password && !isPasswordValid(formData.password)
                  ? "border-rose-500/60 focus-visible:ring-rose-500/20"
                  : touched.password && formData.password && isPasswordValid(formData.password)
                  ? "border-emerald-500/60 focus-visible:ring-emerald-500/20"
                  : ""
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Confirm Password <span className="text-rose-500">*</span></span>
            {touched.confirmPassword && formData.confirmPassword && !isConfirmPasswordValid(formData.confirmPassword, formData.password) && (
              <span className="text-xs font-medium text-rose-400 normal-case flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Passwords don't match
              </span>
            )}
          </Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={formData.confirmPassword || ""}
              onChange={(e) => {
                updateFormData({ confirmPassword: e.target.value });
                if (!touched.confirmPassword) setTouched((prev) => ({ ...prev, confirmPassword: true }));
              }}
              onBlur={() => handleBlur("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className={cn(
                "h-10 pl-9 pr-9 rounded-xl text-sm bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                touched.confirmPassword && formData.confirmPassword && !isConfirmPasswordValid(formData.confirmPassword, formData.password)
                  ? "border-rose-500/60 focus-visible:ring-rose-500/20"
                  : touched.confirmPassword && formData.confirmPassword && isConfirmPasswordValid(formData.confirmPassword, formData.password)
                  ? "border-emerald-500/60 focus-visible:ring-emerald-500/20"
                  : ""
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}