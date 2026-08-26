import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local to get keys
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: envVars.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "delight-fashion-cdn",
  api_key: envVars.CLOUDINARY_API_KEY || "000000000000000",
  api_secret: envVars.CLOUDINARY_API_SECRET || "mock-secret-key",
  secure: true,
});

async function uploadDefaultImage() {
  const imagePath = path.join(__dirname, 'public', 'logo.jpg');
  
  if (!fs.existsSync(imagePath)) {
    console.error("Error: public/logo.jpg not found!");
    process.exit(1);
  }

  console.log("Uploading logo.jpg to Cloudinary...");
  
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: 'delight-fashion-default',
      folder: 'delight-fashion',
      overwrite: true,
    });
    
    console.log("Upload successful!");
    console.log("URL:", result.secure_url);
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
  }
}

uploadDefaultImage();
