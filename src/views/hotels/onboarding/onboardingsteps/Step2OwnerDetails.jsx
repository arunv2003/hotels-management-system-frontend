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
} from "lucide-react";

import ImageCropModal from "@/lib/imagecrop/ImageCropModal";
import { CloudinaryImage } from "@/routes/saas/cloudinary/cloudinary.route";

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
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${
                2 * Math.PI * 18 * (1 - progress / 100)
              }`}
              strokeLinecap="round"
              style={{
                transition:
                  "stroke-dashoffset 0.25s ease",
              }}
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
  const [rawName, setRawName] =
    useState("profile.jpg");

  const [cropOpen, setCropOpen] =
    useState(false);

  const [progress, setProgress] =
    useState(null);

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

    // reset input
    e.target.value = "";
  };

  const handleCropDone = async ({
    file,
    previewUrl,
  }) => {
    // instant preview
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
      const res =
        await CloudinaryImage.uploadSingleImage(
          file,
          "owner-profiles",
          (pct) => {
            // Prevent 100 before response
            const safeProgress = Math.min(
              Math.round(pct),
              95
            );

            setProgress(safeProgress);
          }
        );

      console.log(
        "Cloudinary Upload Success:",
        res
      );

      updateFormData({
        ownerProfilePhoto: {
          previewUrl,
          cloudUrl: res.secure_url,
          publicId: res.public_id,
        },
      });

      // response received
      setProgress(100);

      setTimeout(() => {
        setProgress(null);
      }, 800);
    } catch (error) {
      console.error(
        "Cloudinary Upload Error:",
        error
      );

      setError(true);

      setTimeout(() => {
        setError(false);
        setProgress(null);
      }, 3000);
    }
  };

  const previewUrl =
    formData.ownerProfilePhoto?.previewUrl;

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] mb-8">
        {/* Avatar */}
        <div
          className="relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer group"
          onClick={() =>
            progress === null &&
            inputRef.current?.click()
          }
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Owner Profile"
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-full h-full p-6 text-slate-400" />
          )}

          {/* Upload Overlay */}
          <UploadOverlay
            progress={progress}
            error={error}
          />

          {/* Hover Effect */}
          {progress === null && !error && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}

          {/* Bottom Camera Badge */}
          <div className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-800 z-20">
            <Camera className="w-3 h-3" />
          </div>
        </div>

        {/* Text */}
        <p className="mt-4 font-bold text-slate-900 dark:text-white">
          Owner Profile Photo
        </p>

        <p className="text-xs text-slate-400 mt-1">
          {progress === 100
            ? "Upload completed"
            : progress !== null
            ? progress >= 95
              ? "Processing image..."
              : `Uploading… ${progress}%`
            : "Click avatar to upload · Square crop applied"}
        </p>

        {/* File Input */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Owner Full Name <span className="text-red-500">*</span>
          </Label>

          <Input
            value={formData.ownerFullName}
            onChange={(e) =>
              updateFormData({
                ownerFullName: e.target.value,
              })
            }
            placeholder="Enter full name"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Email Address <span className="text-red-500">*</span>
          </Label>

          <Input
            value={formData.ownerEmail}
            onChange={(e) =>
              updateFormData({
                ownerEmail: e.target.value,
              })
            }
            type="email"
            placeholder="Enter email address"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Mobile */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Mobile Number <span className="text-red-500">*</span>
          </Label>

          <div className="flex gap-2">
            <div className="w-20 shrink-0">
              <Input
                defaultValue="+91"
                className="h-12 rounded-xl text-center"
              />
            </div>

            <Input
              value={formData.mobileNumber}
              onChange={(e) =>
                updateFormData({
                  mobileNumber:
                    e.target.value,
                })
              }
              placeholder="Enter mobile number"
              className="h-12 rounded-xl flex-1"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Password <span className="text-red-500">*</span>
          </Label>

          <Input
            value={formData.password}
            onChange={(e) =>
              updateFormData({
                password: e.target.value,
              })
            }
            type="password"
            placeholder="Enter password"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Confirm Password <span className="text-red-500">*</span>
          </Label>

          <Input
            value={formData.confirmPassword}
            onChange={(e) =>
              updateFormData({
                confirmPassword:
                  e.target.value,
              })
            }
            type="password"
            placeholder="Confirm password"
            className="h-12 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}