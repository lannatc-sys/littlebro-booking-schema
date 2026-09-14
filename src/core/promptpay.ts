export var AID_PROMPTPAY = "A000000677010111";
export function tlv(id, value) {
  const length = String(value.length).padStart(2, "0");
  return `${id}${length}${value}`;
}
export function crc16ccitt(data) {
  let crc = 65535;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 32768) !== 0 ? (crc << 1 ^ 4129) & 65535 : crc << 1 & 65535;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
export function buildProxyField(id) {
  if (id.length === 10) {
    return tlv("01", `0066${id.slice(1)}`);
  }
  if (id.length === 13) {
    return tlv("02", id);
  }
  return tlv("03", id);
}
export function buildPromptPayPayload(id, amount) {
  if (typeof id !== "string" || !/^\d+$/.test(id)) {
    throw new RangeError(`PromptPay ID \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E25\u0E49\u0E27\u0E19 (\u0E44\u0E14\u0E49 "${id}")`);
  }
  if (id.length !== 10 && id.length !== 13 && id.length !== 15) {
    throw new RangeError(
      `PromptPay ID \u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27 10 \u0E2B\u0E25\u0E31\u0E01 (\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D), 13 \u0E2B\u0E25\u0E31\u0E01 (\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19) \u0E2B\u0E23\u0E37\u0E2D 15 \u0E2B\u0E25\u0E31\u0E01 (e-wallet) (\u0E44\u0E14\u0E49 ${id.length} \u0E2B\u0E25\u0E31\u0E01)`
    );
  }
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new RangeError(`\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0 (\u0E44\u0E14\u0E49 ${amount})`);
  }
  if (Math.round(amount * 100) / 100 !== amount) {
    throw new RangeError(`\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E17\u0E28\u0E19\u0E34\u0E22\u0E21\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 2 \u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07 (\u0E44\u0E14\u0E49 ${amount})`);
  }
  const payloadFormat = tlv("00", "01");
  const pointOfInit = tlv("01", "12");
  const merchantInfo = tlv("29", tlv("00", AID_PROMPTPAY) + buildProxyField(id));
  const currency = tlv("53", "764");
  const amountField = tlv("54", amount.toFixed(2));
  const countryCode = tlv("58", "TH");
  const withoutCrc = `${payloadFormat}${pointOfInit}${merchantInfo}${currency}${amountField}${countryCode}6304`;
  return withoutCrc + crc16ccitt(withoutCrc);
}
