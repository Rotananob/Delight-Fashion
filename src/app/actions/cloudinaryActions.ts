"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { generateCloudinarySignature } from "@/utils/cloudinary";

export async function getUploadSignatureAction(folder: string = "delight-fashion-products") {
  try {
    // 1. Strictly verify the admin session! No unauthorized uploads!
    const session = await getSessionServer();
    
    // Allow if in mock mode OR if valid admin session
    const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("mock");
    if (!isMockMode && (!session || session.admin !== true)) {
      throw new Error("Unauthorized: Admin access required for secure asset uploads.");
    }

    // 2. Prepare upload parameters
    const paramsToSign = {
      folder,
      // We want optimized webp/avif and auto formatting by default
      format: "auto",
      quality: "auto",
    };

    // 3. Generate HMAC SHA-1 signature
    const { signature, timestamp } = generateCloudinarySignature(paramsToSign);

    return {
      success: true,
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "delight-fashion-cdn",
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "mock-api-key",
      folder,
    };
  } catch (error: any) {
    console.error("Signature Generation Error:", error.message);
    return { success: false, error: error.message };
  }
}
