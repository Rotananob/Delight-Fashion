import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { regex: /bg-\[#0E0E0E\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#111111\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#111\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#171717\]/g, replacement: 'bg-gray-50' },
  { regex: /text-white/g, replacement: 'text-foreground' },
  { regex: /border-white\/10/g, replacement: 'border-border' },
  { regex: /border-white\/5/g, replacement: 'border-border' },
  { regex: /bg-white\/5/g, replacement: 'bg-black/5' },
  { regex: /bg-white\/10/g, replacement: 'bg-black/10' },
  { regex: /text-white\/([0-9]+)/g, replacement: 'text-foreground/$1' }
];

// files to skip because they either must stay dark or have been manually fixed
const skipFiles = ['Input.tsx', 'Button.tsx', 'page.tsx', 'layout.tsx', 'globals.css'];

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkAndReplace(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (skipFiles.some(skip => fullPath.endsWith(skip))) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

walkAndReplace(directoryPath);
console.log("Theme replacement complete!");
