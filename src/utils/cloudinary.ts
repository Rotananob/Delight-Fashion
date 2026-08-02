import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary Node SDK (Server-Side)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "delight-fashion-cdn",
  api_key: process.env.CLOUDINARY_API_KEY || "000000000000000",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mock-secret-key",
  secure: true,
});

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  aspectRatio?: string;
  crop?: "fill" | "fit" | "limit" | "scale" | "thumb";
  quality?: string;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

/**
 * Optimizes a Cloudinary image URL for luxury apparel display (3:4 portrait default, WebP/AVIF, f_auto, q_auto).
 */
export const getOptimizedImageUrl = (
  url: string,
  options: CloudinaryTransformOptions = {}
): string => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (crop) transforms.push(`c_${crop}`, `g_auto`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);

  const transformString = transforms.join(",");
  return url.replace("/upload/", `/upload/${transformString}/`);
};

/**
 * Generates a signed upload signature for direct browser-to-Cloudinary uploads.
 * Must be executed server-side only.
 */
export const generateCloudinarySignature = (
  paramsToSign: Record<string, string | number>
): { signature: string; timestamp: number } => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { ...paramsToSign, timestamp },
    process.env.CLOUDINARY_API_SECRET || ""
  );

  return { signature, timestamp };
};

export default cloudinary;
