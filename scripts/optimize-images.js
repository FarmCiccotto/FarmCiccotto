/**
 * Simple image optimizer using sharp:
 * - Produces _small (800px) and _large (1800px) JPEG, WEBP and AVIF
 * - Put original JPEG/PNG files into assets/images-source/
 * - Outputs into assets/images/
 *
 * Usage:
 *   npm run images:optimize
 *
 * Notes:
 * - Sharp handles conversion; tune quality values as needed.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'assets', 'images-source');
const outDir = path.join(__dirname, '..', 'assets', 'images');

if (!fs.existsSync(srcDir)) {
  console.error('Source images directory not found:', srcDir);
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png)$/i.test(f));
(async () => {
  for (const file of files) {
    const infile = path.join(srcDir, file);
    const basename = path.parse(file).name;
    // small (800px)
    await sharp(infile).resize({ width: 800 }).jpeg({ quality: 82 }).toFile(path.join(outDir, `${basename}_small.jpg`));
    await sharp(infile).resize({ width: 800 }).webp({ quality: 80 }).toFile(path.join(outDir, `${basename}_small.webp`));
    await sharp(infile).resize({ width: 800 }).avif({ quality: 45 }).toFile(path.join(outDir, `${basename}_small.avif`));
    // large (1800px)
    await sharp(infile).resize({ width: 1800 }).jpeg({ quality: 82 }).toFile(path.join(outDir, `${basename}_large.jpg`));
    await sharp(infile).resize({ width: 1800 }).webp({ quality: 80 }).toFile(path.join(outDir, `${basename}_large.webp`));
    await sharp(infile).resize({ width: 1800 }).avif({ quality: 45 }).toFile(path.join(outDir, `${basename}_large.avif`));
    console.log('Optimized', file);
  }
  console.log('Done optimizing images to', outDir);
})();
