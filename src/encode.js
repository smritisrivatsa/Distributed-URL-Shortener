import base62 from "base62/lib/ascii.js";

const FEISTEL_KEYS = [0x12f4a3c1, 0x9b3e7d2f, 0x4c8a1e6b];

function feistelRound(value, key) {
  // Simple mixing function
  let x = value ^ key;
  x = ((x >>> 16) ^ x) * 0x45d9f3b | 0;
  x = ((x >>> 16) ^ x);
  return x >>> 0; // keep unsigned
}

function shuffle(id) {
  // Split 32-bit id into two 16-bit halves
  let left  = (id >>> 16) & 0xFFFF;
  let right = id & 0xFFFF;

  for (const key of FEISTEL_KEYS) {
    const newRight = left ^ feistelRound(right, key);
    left = right;
    right = newRight;
  }

  return ((left << 16) | right) >>> 0;
}

export function generateShortCode(count) {
  const shuffled = shuffle(count);
  return base62.encode(shuffled);
}