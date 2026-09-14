export var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export function stripDataUrlPrefix(base64) {
  return base64.replace(/^data:[^;]*;base64,/, "");
}
export function decodeFirstBytes(base64, n) {
  const clean = stripDataUrlPrefix(base64).replace(/[\r\n\s]/g, "");
  const bytes = [];
  let buffer = 0;
  let bitsCollected = 0;
  for (let i = 0; i < clean.length && bytes.length < n; i++) {
    const char = clean[i];
    if (char === "=") break;
    const value = BASE64_CHARS.indexOf(char);
    if (value === -1) continue;
    buffer = buffer << 6 | value;
    bitsCollected += 6;
    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      bytes.push(buffer >> bitsCollected & 255);
    }
  }
  return bytes;
}
export function base64ByteLength(base64) {
  const clean = stripDataUrlPrefix(base64).replace(/[\r\n\s]/g, "");
  if (!clean) return 0;
  const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.floor(clean.length * 3 / 4) - padding;
}
export function detectImageType(base64) {
  if (typeof base64 !== "string" || !base64) return null;
  const bytes = decodeFirstBytes(base64, 12);
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    return "jpeg";
  }
  if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) {
    return "png";
  }
  if (bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) {
    return "webp";
  }
  return null;
}
export function validateSlipUpload(base64, maxBytes) {
  const errors = [];
  if (typeof base64 !== "string" || base64.trim() === "") {
    return { valid: false, type: null, sizeBytes: 0, errors: ["\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E1F\u0E25\u0E4C\u0E2A\u0E25\u0E34\u0E1B"] };
  }
  const sizeBytes = base64ByteLength(base64);
  const type = detectImageType(base64);
  if (!type) {
    errors.push("\u0E44\u0E1F\u0E25\u0E4C\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A (JPEG/PNG/WEBP \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19)");
  }
  if (sizeBytes <= 0) {
    errors.push("\u0E44\u0E1F\u0E25\u0E4C\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1B\u0E25\u0E48\u0E32");
  } else if (sizeBytes > maxBytes) {
    errors.push(`\u0E44\u0E1F\u0E25\u0E4C\u0E21\u0E35\u0E02\u0E19\u0E32\u0E14 ${sizeBytes} \u0E44\u0E1A\u0E15\u0E4C \u0E40\u0E01\u0E34\u0E19\u0E02\u0E19\u0E32\u0E14\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ${maxBytes} \u0E44\u0E1A\u0E15\u0E4C`);
  }
  return { valid: errors.length === 0, type, sizeBytes, errors };
}
