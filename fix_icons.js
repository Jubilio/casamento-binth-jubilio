const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\IMPACT - DBO\\.gemini\\antigravity\\brain\\054dae46-a043-4864-8c84-6ba562e0798c\\wedding_icon_192_1769891857554.png";
const destDir = path.resolve(__dirname, 'public', 'icons');

console.log('Source:', src);
console.log('Dest Dir:', destDir);

if (!fs.existsSync(src)) {
    console.error('ERROR: Source file does not exist!');
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    console.log('Creating dest dir...');
    fs.mkdirSync(destDir, { recursive: true });
}

try {
    const d1 = path.join(destDir, 'icon-192.png');
    const d2 = path.join(destDir, 'icon-512.png');
    fs.copyFileSync(src, d1);
    fs.copyFileSync(src, d2);
    console.log('SUCCESS: Copied to ' + d1 + ' and ' + d2);
} catch (err) {
    console.error('COPY ERROR:', err.message);
    process.exit(1);
}
