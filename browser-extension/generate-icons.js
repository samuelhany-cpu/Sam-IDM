// Simple icon generator for browser extension
// Creates basic PNG icons with "SDM" text

const fs = require('fs');
const path = require('path');

// Create SVG icons (can be converted to PNG later)
function createSVGIcon(size) {
  const fontSize = Math.floor(size * 0.4);
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#357ABD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad1)" rx="4"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle">SDM</text>
</svg>`;
  return svg;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const filename = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ SVG icons created successfully!');
console.log('\n📝 Note: These are SVG files. For production, convert them to PNG using:');
console.log('   - Online tool: https://cloudconvert.com/svg-to-png');
console.log('   - Or install: npm install -g svg2png-cli');
console.log('   - Then run: svg2png browser-extension/icons/*.svg');
console.log('\n💡 For now, update manifest.json to use .svg extension');
console.log('   Chrome supports SVG icons in extensions!');
