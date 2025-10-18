#!/usr/bin/env node
/**
 * Production Build Script for CalPro
 * Removes demo mode and prepares for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Building CalPro for Production...\n');

const publicDir = path.join(__dirname, '../public');
const buildDir = path.join(__dirname, '../dist');

// Files to process for production
const filesToProcess = [
  'index.html',
  'login.html', 
  'profile.html',
  'clients.html',
  'equipment.html',
  'converter.html',
  'integrations.html'
];

// Create dist directory
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy all files from public to dist
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('📁 Copying files to dist...');
copyRecursiveSync(publicDir, buildDir);

// Process each HTML file to remove demo mode
filesToProcess.forEach(fileName => {
  const filePath = path.join(buildDir, fileName);
  
  if (fs.existsSync(filePath)) {
    console.log(`🔧 Processing ${fileName}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove demo mode detection
    content = content.replace(
      /\/\/ Demo mode detection[\s\S]*?window\.location\.hostname !== 'localhost';/g,
      '// Production mode - demo mode disabled\n    const isDemoMode = false;'
    );
    
    // Remove demo banners
    content = content.replace(
      /<!-- Demo Mode Banner -->[\s\S]*?<\/div>\s*\n/g,
      ''
    );
    
    // Remove fetch overrides
    content = content.replace(
      /\/\/ Override fetch for demo mode[\s\S]*?};[\s\S]*?}/g,
      '// Production mode - using real API calls'
    );
    
    // Remove mock response functions
    content = content.replace(
      /\/\/ Mock.*responses.*[\s\S]*?function getMock.*[\s\S]*?return.*demo response.*;\s*}/g,
      ''
    );
    
    // Update page titles to remove demo indicator
    content = content.replace(
      /document\.title = '🧪 CalPro Demo - '.*$/gm,
      '// Production mode - standard titles'
    );
    
    fs.writeFileSync(filePath, content);
  }
});

// Create production environment config
const envConfig = `
// Production Environment Configuration
window.CALPRO_CONFIG = {
  API_URL: process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app',
  ENV: 'production',
  VERSION: '2.0.0',
  DEMO_MODE: false
};
`;

fs.writeFileSync(path.join(buildDir, 'config.js'), envConfig);

// Update index.html to include config
const indexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  indexContent = indexContent.replace(
    '<head>',
    '<head>\n  <script src="/config.js"></script>'
  );
  fs.writeFileSync(indexPath, indexContent);
}

console.log('\n✅ Production build completed!');
console.log(`📦 Build output: ${buildDir}`);
console.log('\n🚀 Next steps:');
console.log('1. Deploy backend to Railway/Heroku');
console.log('2. Update netlify.toml with backend URL');
console.log('3. Deploy to Netlify using: npm run deploy');
console.log('\n📖 See PRODUCTION_GUIDE.md for detailed instructions');