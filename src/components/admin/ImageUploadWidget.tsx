"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { getUploadSignatureAction } from "@/app/actions/cloudinaryActions";
import { ProductImage } from "@/types";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/Button";

export interface ImageUploadWidgetProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  images,
  onChange,
  maxImages = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setIsUploading(true);

    try {
      const sigData = await getUploadSignatureAction("delight-fashion-products");
      if (!sigData.success) {
        throw new Error(sigData.error || "Failed to generate upload signature.");
      }

      const uploadedImages: ProductImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey as string);
        formData.append("timestamp", sigData.timestamp?.toString() || "");
        formData.append("signature", sigData.signature as string);
        formData.append("folder", sigData.folder as string);

        // Optional optimizations passed to Cloudinary
        formData.append("format", "auto");
        formData.append("quality", "auto");

        const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
        
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Upload failed: ${errText}`);
        }

        const data = await res.json();
        
        uploadedImages.push({
          id: data.public_id,
          url: data.secure_url,
          alt: file.name,
          isPrimary: images.length === 0 && i === 0,
        });
      }

      onChange([...images, ...uploadedImages]);
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (idToRemove: string) => {
    const newImages = images.filter((img) => img.id !== idToRemove);
    // Ensure at least one image is primary if array is not empty
    if (newImages.length > 0 && !newImages.some((img) => img.isPrimary)) {
      newImages[0].isPrimary = true;
    }
    onChange(newImages);
  };

  const setPrimaryImage = (idToPrimary: string) => {
    const newImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === idToPrimary,
    }));
    onChange(newImages);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Dropzone */}
      <div
        className={twMerge(
          "relative border-2 border-dashed rounded-sm p-8 text-center transition-colors flex flex-col items-center justify-center gap-3",
          isUploading
            ? "border-[#D4AF37]/50 bg-[#D4AF37]/5"
            : "border-white/20 hover:border-[#D4AF37]/50 bg-[#111111]"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/jpeg, image/png, image/webp"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={isUploading || images.length >= maxImages}
        />
        
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <span className="text-sm font-semibold text-white/80 uppercase tracking-widest">
              Uploading Assets...
            </span>
          </>
        ) : (
          <>
            <UploadCloud className="w-8 h-8 text-white/40" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                Drag &amp; Drop Product Images
              </span>
              <span className="text-xs text-white/50">
                Supports JPG, PNG, WEBP (Max {maxImages} images)
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 relative z-10 pointer-events-none"
            >
              Browse Files
            </Button>
          </>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
          {images.map((img) => (
            <div
              key={img.id}
              className={twMerge(
                "group relative aspect-[3/4] rounded-sm overflow-hidden bg-[#1A1A1A] border-2",
                img.isPrimary ? "border-[#D4AF37]" : "border-transparent"
              )}
            >
              <img
                src={img.url}
                alt={img.alt || "Product image"}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                {!img.isPrimary && (
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    onClick={() => setPrimaryImage(img.id)}
                    className="w-full text-[10px] h-7"
                    leftIcon={<ImageIcon className="w-3 h-3" />}
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeImage(img.id)}
                  className="w-full text-[10px] h-7"
                  leftIcon={<X className="w-3 h-3" />}
                >
                  Remove
                </Button>
              </div>

              {img.isPrimary && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  Primary Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
