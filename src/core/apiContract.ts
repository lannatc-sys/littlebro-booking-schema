import { isValidYmd, nightsBetween } from './dateRange';

export function ok(data) {
  return { ok: true, data };
}
export function fail(code, message, extra) {
  return { ok: false, error: { code, message, ...extra ?? {} } };
}
export function parseRequestBody(rawBody) {
  if (!rawBody) {
    return fail("BAD_REQUEST", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E33\u0E02\u0E2D");
  }
  try {
    return ok(JSON.parse(rawBody));
  } catch {
    return fail("BAD_REQUEST", "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07");
  }
}
export var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export var THAI_PHONE_PATTERN = /^(0\d{9}|\+66\d{9})$/;
export function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
export function isFiniteNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}
export function normalizePhone(v) {
  return v.replace(/[\s\-()]/g, "");
}
export function validateAvailabilityRequest(raw) {
  if (!isPlainObject(raw)) {
    return { valid: false, errors: ["\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E21\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 object"] };
  }
  const errors = [];
  const { checkIn, checkOut, guests } = raw;
  const checkInValid = typeof checkIn === "string" && isValidYmd(checkIn);
  const checkOutValid = typeof checkOut === "string" && isValidYmd(checkOut);
  if (!checkInValid) errors.push("checkIn \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A yyyy-mm-dd \u0E17\u0E35\u0E48\u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E08\u0E23\u0E34\u0E07");
  if (!checkOutValid) errors.push("checkOut \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A yyyy-mm-dd \u0E17\u0E35\u0E48\u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E08\u0E23\u0E34\u0E07");
  if (checkInValid && checkOutValid && nightsBetween(checkIn, checkOut) < 1) {
    errors.push("checkOut \u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E2B\u0E25\u0E31\u0E07 checkIn \u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E04\u0E37\u0E19");
  }
  if (!isFiniteNumber(guests) || !Number.isInteger(guests) || guests < 1) {
    errors.push("guests \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0");
  }
  if (errors.length > 0) return { valid: false, errors };
  return {
    valid: true,
    value: { checkIn, checkOut, guests }
  };
}
export function validateBookingRequest(raw) {
  if (!isPlainObject(raw)) {
    return { valid: false, errors: ["\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E21\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 object"] };
  }
  const errors = [];
  const availability = validateAvailabilityRequest(raw);
  if (!availability.valid) errors.push(...availability.errors);
  const {
    roomId,
    customerName,
    customerEmail,
    customerPhone,
    arrivalTime,
    specialRequests,
    selections,
    lang
  } = raw;
  if (typeof roomId !== "string" || roomId.trim() === "") {
    errors.push("roomId \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07");
  }
  if (typeof customerName !== "string" || customerName.trim() === "") {
    errors.push("customerName \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07");
  }
  if (typeof customerEmail !== "string" || !EMAIL_PATTERN.test(customerEmail.trim())) {
    errors.push("customerEmail \u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07");
  }
  let normalizedPhone = "";
  if (typeof customerPhone !== "string") {
    errors.push("customerPhone \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21");
  } else {
    normalizedPhone = normalizePhone(customerPhone);
    if (!THAI_PHONE_PATTERN.test(normalizedPhone)) {
      errors.push("customerPhone \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D 10 \u0E2B\u0E25\u0E31\u0E01 \u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 0 \u0E2B\u0E23\u0E37\u0E2D +66 \u0E15\u0E32\u0E21\u0E14\u0E49\u0E27\u0E22 9 \u0E2B\u0E25\u0E31\u0E01");
    }
  }
  if (arrivalTime !== void 0 && arrivalTime !== "" && (typeof arrivalTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime.trim()))) {
    errors.push("arrivalTime \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E27\u0E25\u0E32\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A HH:mm");
  }
  let normalizedSelections = [];
  if (selections !== void 0) {
    if (!Array.isArray(selections)) {
      errors.push("selections \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 array");
    } else {
      let selectionsOk = true;
      for (let i = 0; i < selections.length; i++) {
        const sel = selections[i];
        const serviceIdOk = isPlainObject(sel) && typeof sel.service_id === "string" && sel.service_id.trim() !== "";
        const qtyOk = isPlainObject(sel) && isFiniteNumber(sel.qty) && Number.isInteger(sel.qty) && sel.qty >= 0;
        if (!serviceIdOk || !qtyOk) {
          selectionsOk = false;
          errors.push(`selections[${i}] \u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 service_id \u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E41\u0E25\u0E30 qty \u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E44\u0E21\u0E48\u0E15\u0E34\u0E14\u0E25\u0E1A`);
        }
      }
      if (selectionsOk) {
        normalizedSelections = selections.map((sel) => ({
          service_id: sel.service_id,
          qty: sel.qty
        }));
      }
    }
  }
  if (lang !== void 0 && lang !== "th" && lang !== "en") {
    errors.push('lang \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 "th" \u0E2B\u0E23\u0E37\u0E2D "en" \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19');
  }
  if (errors.length > 0) return { valid: false, errors };
  const availabilityValue = availability.value;
  return {
    valid: true,
    value: {
      checkIn: availabilityValue.checkIn,
      checkOut: availabilityValue.checkOut,
      guests: availabilityValue.guests,
      roomId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: normalizedPhone,
      arrivalTime: typeof arrivalTime === "string" ? arrivalTime.trim() : "",
      specialRequests: typeof specialRequests === "string" ? specialRequests.trim() : "",
      selections: normalizedSelections,
      lang
    }
  };
}
