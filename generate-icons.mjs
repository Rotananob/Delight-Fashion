import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputImage = path.join(__dirname, 'public', 'logo.jpg');
const sizes = [192, 512, 180]; // 180 is for apple-touch-icon

async function generateIcons() {
  if (!fs.existsSync(inputImage)) {
    console.error('Source logo.jpg not found in public directory.');
    process.exit(1);
  }

  for (const size of sizes) {
    const outputName = size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`;
    const outputPath = path.join(__dirname, 'public', outputName);
    
    await sharp(inputImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 10, alpha: 1 } // Dark background matching brand
      })
      .toFormat('png')
      .toFile(outputPath);
      
    console.log(`Generated ${outputName}`);
  }
}

generateIcons().catch(console.error);
