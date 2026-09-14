// src/core/adminAuth.ts

/**
 * Compute SHA-256 hash of a string.
 * Works seamlessly in Google Apps Script, Node.js, and Browser environments.
 */
export function hashPasswordSha256(str: string): string {
  if (typeof Utilities !== 'undefined' && Utilities.computeDigest) {
    const rawHash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      str,
      Utilities.Charset.UTF_8
    );
    let output = '';
    for (let i = 0; i < rawHash.length; i++) {
      let byte = rawHash[i];
      if (byte < 0) byte += 256;
      let byteStr = byte.toString(16);
      if (byteStr.length === 1) byteStr = '0' + byteStr;
      output += byteStr;
    }
    return output.toLowerCase();
  }

  // Pure JavaScript SHA-256 fallback (works in Node.js & Browser without dependencies)
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i = 0, j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = str[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let strUtf8 = unescape(encodeURIComponent(str));
  for (let idx = 0; idx < strUtf8.length; idx++) {
    const code = strUtf8.charCodeAt(idx);
    words[idx >> 2] |= code << ((3 - (idx % 4)) * 8);
  }
  const utf8BitLength = strUtf8.length * 8;
  words[utf8BitLength >> 2] |= 0x80 << ((3 - (utf8BitLength % 4)) * 8);
  words[(((utf8BitLength + 64) >> 9) << 4) + 15] = utf8BitLength;

  for (let blockStart = 0; blockStart < words.length; blockStart += 16) {
    const w = words.slice(blockStart, blockStart + 16);
    const oldHash = hash.slice(0);

    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const i2 = i + blockStart;
      const w15 = w[i - 15], w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = (i < 16) ? (w[i] | 0) : ((w[i - 16] + s0 + w[i - 7] + s1) | 0);

      const a = hash[0], e = hash[4];
      const s1_e = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & hash[5]) ^ (~e & hash[6]);
      const temp1 = (hash[7] + s1_e + ch + k[i] + w[i]) | 0;
      const s0_a = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0_a + maj) | 0;

      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Verify input password against stored password (supports SHA-256 hash or plain text).
 */
export function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  if (!inputPassword || !storedPassword) return false;
  const trimmedStored = String(storedPassword).trim();
  const trimmedInput = String(inputPassword).trim();

  // If stored password is a 64-char hex string, treat as SHA-256
  if (/^[0-9a-fA-F]{64}$/.test(trimmedStored)) {
    return hashPasswordSha256(trimmedInput).toLowerCase() === trimmedStored.toLowerCase();
  }

  // Otherwise compare plain text
  return trimmedInput === trimmedStored;
}

/**
 * Check if identifier (username or email) belongs to an active admin.
 */
export function isAdmin(identifier: string, adminList: any[]): boolean {
  if (!identifier || typeof identifier !== 'string') return false;
  const normalized = identifier.trim().toLowerCase();
  if (!normalized) return false;

  return adminList.some((admin) => {
    const adminUser = String(admin.username || '').trim().toLowerCase();
    const adminEmail = String(admin.email || '').trim().toLowerCase();
    const isActive = admin.is_active === true || admin.is_active === 'true' || admin.is_active === 1;
    return (adminUser === normalized || adminEmail === normalized) && isActive;
  });
}

/**
 * Validate admin credentials (username + password).
 */
export function validateAdminCredentials(
  username: string,
  password: string,
  adminList: any[]
): { ok: boolean; admin?: any; reason?: string } {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return { ok: false, reason: 'กรุณาระบุ Username' };
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    return { ok: false, reason: 'กรุณาระบุ Password' };
  }

  const normalized = username.trim().toLowerCase();
  const found = adminList.find((admin) => {
    const adminUser = String(admin.username || '').trim().toLowerCase();
    const adminEmail = String(admin.email || '').trim().toLowerCase();
    return adminUser === normalized || adminEmail === normalized;
  });

  if (!found) {
    return { ok: false, reason: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' };
  }

  const isActive = found.is_active === true || found.is_active === 'true' || found.is_active === 1;
  if (!isActive) {
    return { ok: false, reason: 'บัญชีผู้ใช้นี้ถูกระงับการใช้งาน' };
  }

  const storedPassword = found.password || found.password_hash || '';
  if (!storedPassword) {
    return { ok: false, reason: 'บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ' };
  }

  if (!verifyPassword(password, storedPassword)) {
    return { ok: false, reason: 'รหัสผ่านไม่ถูกต้อง' };
  }

  return { ok: true, admin: found };
}