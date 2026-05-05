// Generates simple PNG icons using pure Node.js (no native deps)
// Run: node generate-icons.js
import { createWriteStream } from 'fs';
import { createDeflate } from 'zlib';

function writePNG(path, size, bg, fg) {
  const width = size, height = size;

  // Build raw RGBA pixel data
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const cx = width / 2, cy = height / 2;
      const r = Math.min(width, height) * 0.38;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const color = dist <= r ? fg : bg;
      pixels[i] = color[0];
      pixels[i + 1] = color[1];
      pixels[i + 2] = color[2];
      pixels[i + 3] = 255;
    }
  }

  // Build raw PNG scanlines (filter byte 0 = None per row)
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filter none
    pixels.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; }
  function chunk(type, data) {
    const t = Buffer.from(type);
    const len = u32(data.length);
    const crc = crc32(Buffer.concat([t, data]));
    return Buffer.concat([len, t, data, u32(crc)]);
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    const table = makeCRCTable();
    for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeCRCTable() {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = chunk('IHDR', Buffer.concat([u32(width), u32(height), Buffer.from([8, 2, 0, 0, 0])]));

  const out = createWriteStream(path);
  out.write(signature);
  out.write(ihdr);

  // Compress IDAT
  const deflate = createDeflate({ level: 6 });
  const idatChunks = [];
  deflate.on('data', (d) => idatChunks.push(d));
  deflate.on('end', () => {
    const compressed = Buffer.concat(idatChunks);
    out.write(chunk('IDAT', compressed));
    out.write(chunk('IEND', Buffer.alloc(0)));
    out.end();
    console.log(`Created ${path} (${size}x${size})`);
  });
  deflate.write(raw);
  deflate.end();
}

const bg = [15, 15, 15]; // #0f0f0f
const fg = [79, 142, 247]; // #4f8ef7

writePNG('./public/icons/icon-192.png', 192, bg, fg);
writePNG('./public/icons/icon-512.png', 512, bg, fg);
