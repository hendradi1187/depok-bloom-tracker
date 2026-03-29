const fs = require('fs');
const path = require('path');

// Baca logo original sebagai base64
const logoPath = path.join(__dirname, '../src/assets/depok-logo.png');
const outputPath = path.join(__dirname, '../src/assets/depok-logo-white.png');

console.log('Creating white version of logo...');
console.log('Input:', logoPath);
console.log('Output:', outputPath);

// Buat HTML untuk canvas manipulation
const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<canvas id="canvas"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();

img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw original
  ctx.drawImage(img, 0, 0);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert all non-transparent pixels to white
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 0) {
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
    }
  }

  // Put back
  ctx.putImageData(imageData, 0, 0);

  // Output base64
  console.log(canvas.toDataURL('image/png'));
};

img.src = 'data:image/png;base64,' + \`${fs.readFileSync(logoPath, 'base64')}\`;
</script>
</body>
</html>
`;

// Gunakan puppeteer atau alternatif lain
console.log('Note: This needs to run in browser. Using alternative approach...');
