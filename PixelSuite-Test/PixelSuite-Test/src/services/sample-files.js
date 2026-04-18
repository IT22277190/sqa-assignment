const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { UPLOADS_DIR } = require('../config/paths');

async function createSampleFiles() {
  await fs.ensureDir(UPLOADS_DIR);

  const jpgPath = path.join(UPLOADS_DIR, 'sample.jpg');
  if (!fs.existsSync(jpgPath)) {
    await sharp({
      create: { width: 300, height: 200, channels: 3, background: { r: 220, g: 80, b: 80 } },
    }).jpeg({ quality: 80 }).toFile(jpgPath);
  }

  const pngPath = path.join(UPLOADS_DIR, 'sample.png');
  if (!fs.existsSync(pngPath)) {
    await sharp({
      create: { width: 400, height: 300, channels: 4, background: { r: 60, g: 120, b: 220, alpha: 1 } },
    }).png().toFile(pngPath);
  }

  const webpPath = path.join(UPLOADS_DIR, 'sample.webp');
  if (!fs.existsSync(webpPath)) {
    await sharp({
      create: { width: 300, height: 200, channels: 3, background: { r: 60, g: 180, b: 80 } },
    }).webp({ quality: 80 }).toFile(webpPath);
  }

  const textImgPath = path.join(UPLOADS_DIR, 'text-image.png');
  if (!fs.existsSync(textImgPath)) {
    const svgText = Buffer.from(`
      <svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="100" fill="white"/>
        <text x="10" y="60" font-size="36" fill="black" font-family="Arial">Hello World</text>
      </svg>`);
    await sharp(svgText).png().toFile(textImgPath);
  }

  const gifPath = path.join(UPLOADS_DIR, 'sample.gif');
  if (!fs.existsSync(gifPath)) {
    const gifBytes = Buffer.from(
      '474946383961' +
      '0a000a00' +
      'f00000' +
      'ff0000' +
      'ffffff' +
      '2c00000000' +
      '0a000a000000' +
      '02' +
      '024c01003b',
      'hex'
    );
    fs.writeFileSync(gifPath, gifBytes);
  }

  const pdfPath = path.join(UPLOADS_DIR, 'sample.pdf');
  if (!fs.existsSync(pdfPath)) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText('PixelSuite Test PDF', {
      x: 50,
      y: 780,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText('This is a sample PDF file for testing.', {
      x: 50,
      y: 740,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    const bytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, bytes);
  }
}

module.exports = {
  createSampleFiles,
};
