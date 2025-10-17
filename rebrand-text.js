const fs = require('fs');
const path = require('path');

console.log('🎨 Rebranding to CalPro...\n');

const replacements = [
  ['INTERTEK GHANA LIMITED', 'CALPRO CALIBRATION SERVICES'],
  ['INTERTEK CALIBRATION SERVICES', 'CALPRO CALIBRATION SERVICES'],
  ['INTERTEK', 'CALPRO'],
  ['Intertek Ghana Limited', 'CalPro Calibration Services'],
  ['Intertek Calibration Services', 'CalPro Calibration Services'],
  ['Intertek', 'CalPro'],
  ['E\\. Mensah', 'John Doe'],
  ['emensah@intertek\\.com', 'admin@calpro.com'],
  ['I\\. Aggrey', 'Jane Smith'],
  ['G\\. Dinkelman', 'Robert Johnson']
];

const files = [
  'public/index.html',
  'public/app.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`📝 Processing ${file}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(([oldText, newText]) => {
      const regex = new RegExp(oldText, 'g');
      content = content.replace(regex, newText);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ Updated ${file}\n`);
  } else {
    console.log(`   ⚠️  File not found: ${file}\n`);
  }
});

console.log('✅ Rebranding complete!\n');
console.log('📋 Changes made:');
console.log('   • INTERTEK → CALPRO');
console.log('   • E. Mensah → John Doe');
console.log('   • emensah@intertek.com → admin@calpro.com');
console.log('   • I. Aggrey → Jane Smith');
console.log('   • G. Dinkelman → Robert Johnson\n');
