export var REASON_BY_CODE = {
  "1012": "\u0E2A\u0E25\u0E34\u0E1B\u0E0B\u0E49\u0E33",
  "1013": "\u0E22\u0E2D\u0E14\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07",
  "1014": "\u0E42\u0E2D\u0E19\u0E1C\u0E34\u0E14\u0E1A\u0E31\u0E0D\u0E0A\u0E35",
  "1010": "\u0E2A\u0E25\u0E34\u0E1B\u0E25\u0E48\u0E32\u0E0A\u0E49\u0E32"
};
export var DEFAULT_FAIL_REASON = "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19";
export function parseSlipOkResponse(json) {
  if (typeof json !== "object" || json === null) {
    return { verified: false, code: null, amount: null, reason: DEFAULT_FAIL_REASON };
  }
  const obj = json;
  if (obj.success === true) {
    const data = typeof obj.data === "object" && obj.data !== null ? obj.data : {};
    const amount = typeof data.amount === "number" ? data.amount : null;
    return { verified: true, code: null, amount, reason: "" };
  }
  const code = obj.code !== void 0 && obj.code !== null ? String(obj.code) : null;
  const reason = code && REASON_BY_CODE[code] || DEFAULT_FAIL_REASON;
  return { verified: false, code, amount: null, reason };
}
