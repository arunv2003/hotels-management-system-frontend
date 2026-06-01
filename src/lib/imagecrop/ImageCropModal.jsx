"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, CropIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getCroppedImg(imageSrc, pixelCrop, fileName = "cropped.jpg") {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], fileName, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      resolve({ file, previewUrl });
    }, "image/jpeg", 0.92);
  });
}

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  fileName = "cropped.jpg",
  aspect = 1,
  cropShape = "rect",
  onCropDone,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const result = await getCroppedImg(imageSrc, croppedAreaPixels, fileName);
      onCropDone(result);
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  const aspectLabel =
    aspect === 1
      ? "Square (1:1)"
      : aspect === 16 / 9
      ? "Landscape (16:9)"
      : `${aspect.toFixed(2)}:1`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <CropIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Crop Image
              </h3>
              <p className="text-xs text-slate-400">{aspectLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full bg-black" style={{ height: 380 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 rounded-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleDone}
            disabled={processing}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <Check className="w-4 h-4" />
            {processing ? "Processing..." : "Apply Crop"}
          </Button>
        </div>
      </div>
    </div>
  );
}
