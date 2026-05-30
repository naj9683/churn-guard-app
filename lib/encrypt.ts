import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGO = 'aes-256-gcm';

function getKey(): Buffer {
  const hex = process.env.POSTMARK_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('POSTMARK_ENCRYPTION_KEY must be a 64-char hex string (32 bytes)');
  }
  return Buffer.from(hex, 'hex');
}

// Returns iv:authTag:ciphertext (all hex)
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

// Handles both encrypted format (iv:tag:cipher) and legacy plaintext
export function decrypt(stored: string): string {
  const parts = stored.split(':');
  if (parts.length !== 3) return stored; // legacy plaintext — return as-is
  const [ivHex, tagHex, encHex] = parts;
  try {
    const key = getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const enc = Buffer.from(encHex, 'hex');
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
  } catch {
    return stored; // decryption failed — return raw (handles migration edge cases)
  }
}
