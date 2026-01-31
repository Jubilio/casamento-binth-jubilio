const fs = require('fs');
const path = require('path');

const files = [
  { src: 'C:/Users/IMPACT - DBO/.gemini/antigravity/brain/054dae46-a043-4864-8c84-6ba562e0798c/uploaded_media_0_1769872421659.jpg', dest: 'src/assets/beach_kiss.jpg' },
  { src: 'C:/Users/IMPACT - DBO/.gemini/antigravity/brain/054dae46-a043-4864-8c84-6ba562e0798c/uploaded_media_1_1769872421659.jpg', dest: 'src/assets/beach_hug.jpg' },
  { src: 'C:/Users/IMPACT - DBO/.gemini/antigravity/brain/054dae46-a043-4864-8c84-6ba562e0798c/uploaded_media_2_1769872421659.jpg', dest: 'src/assets/beach_hold_hands.jpg' },
  { src: 'C:/Users/IMPACT - DBO/.gemini/antigravity/brain/054dae46-a043-4864-8c84-6ba562e0798c/uploaded_media_3_1769872421659.jpg', dest: 'src/assets/beach_smile.jpg' }
];

files.forEach(f => {
  try {
    const destPath = path.resolve(__dirname, f.dest);
    console.log(`Copying from ${f.src} to ${destPath}`);
    fs.copyFileSync(f.src, destPath);
    console.log(`Successfully copied ${f.dest}`);
  } catch (e) {
    console.error(`Failed to copy ${f.dest}:`, e);
  }
});
