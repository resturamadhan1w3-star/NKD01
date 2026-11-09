import fs from 'fs';
import zlib from 'zlib';

function createPngBuffer(width, height, r, g, b, a) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines: width * 4 + 1 filter byte per line
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const lineOffset = y * scanlineLength;
    rawData[lineOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pixelOffset = lineOffset + 1 + x * 4;

      // Draw dark background with neon green inner circle/emblem
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.hypot(x - cx, y - cy);
      const radius = width * 0.42;

      if (dist < radius * 0.2) {
        // Center neon pupil
        rawData[pixelOffset] = 0x39;
        rawData[pixelOffset + 1] = 0xff;
        rawData[pixelOffset + 2] = 0x14;
        rawData[pixelOffset + 3] = 0xff;
      } else if (dist < radius * 0.5) {
        // Dark green eye iris
        rawData[pixelOffset] = 0x09;
        rawData[pixelOffset + 1] = 0x25;
        rawData[pixelOffset + 2] = 0x1a;
        rawData[pixelOffset + 3] = 0xff;
      } else if (dist < radius) {
        // Neon boundary
        const isBorder = Math.abs(dist - radius * 0.8) < 4;
        if (isBorder) {
          rawData[pixelOffset] = 0x39;
          rawData[pixelOffset + 1] = 0xff;
          rawData[pixelOffset + 2] = 0x14;
          rawData[pixelOffset + 3] = 0xff;
        } else {
          rawData[pixelOffset] = 0x0a;
          rawData[pixelOffset + 1] = 0x10;
          rawData[pixelOffset + 2] = 0x0d;
          rawData[pixelOffset + 3] = 0xff;
        }
      } else {
        // Dark horror outer fill
        rawData[pixelOffset] = 0x05;
        rawData[pixelOffset + 1] = 0x07;
        rawData[pixelOffset + 2] = 0x06;
        rawData[pixelOffset + 3] = 0xff;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuffer, data]);

  const crc = crc32(body);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, body, crcBuffer]);
}

// Simple CRC32 for PNG chunks
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', createPngBuffer(192, 192, 5, 7, 6, 255));
fs.writeFileSync('public/pwa-512x512.png', createPngBuffer(512, 512, 5, 7, 6, 255));
fs.writeFileSync('public/apple-touch-icon.png', createPngBuffer(180, 180, 5, 7, 6, 255));
fs.writeFileSync('public/favicon.ico', createPngBuffer(64, 64, 5, 7, 6, 255));

console.log('PWA PNG assets generated successfully.');
