import { getSettings, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';
import { buildPromptPayPayload } from '../core/promptpay';
import { parseSlipOkResponse } from '../core/slipOkClient';
import { validateSlipUpload } from '../core/slipValidation';

export var MAX_SLIP_IMAGE_BYTES = 5 * 1024 * 1024;
export function safeSheetText2(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
export function isBookingPayable(status) {
  return status === "pending";
}
export function toPaymentInfoResult(bookingCode, row, promptpayPayload, serverNow) {
  if (!isBookingPayable(row.status) || !row.holdExpiresAt || row.holdExpiresAt <= serverNow) {
    return { ok: false, reason: "HOLD_EXPIRED" };
  }
  return {
    ok: true,
    data: {
      booking_code: bookingCode,
      amount: row.amount,
      currency: row.currency,
      promptpay_payload: promptpayPayload,
      hold_expires_at: row.holdExpiresAt,
      server_now: serverNow
    }
  };
}
export var SLIPOK_FAIL_SAFE_RESULT = { verified: false, code: null, amount: null, reason: "\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A" };
export function verifySlipViaSlipOk(rawBase64, amount, endpoint, apiKey) {
  if (!endpoint || !apiKey) return SLIPOK_FAIL_SAFE_RESULT;
  try {
    const response = UrlFetchApp.fetch(endpoint, {
      method: "post",
      contentType: "application/json",
      headers: { "x-authorization": apiKey },
      payload: JSON.stringify({ files: rawBase64, amount, log: true }),
      muteHttpExceptions: true
      // ห้าม throw จาก HTTP status ที่ไม่ใช่ 2xx — parse เองแล้วตัดสินใจ
    });
    const json = JSON.parse(response.getContentText());
    return parseSlipOkResponse(json);
  } catch (err) {
    console.error("verifySlipViaSlipOk error:", err instanceof Error ? err.message : "unknown error");
    return SLIPOK_FAIL_SAFE_RESULT;
  }
}
export function getBookingsSheet(spreadsheet) {
  const sheet = spreadsheet.getSheetByName("bookings");
  if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
  return sheet;
}
export function getPaymentInfo(bookingCode) {
  const spreadsheet = getSpreadsheet();
  const bookingsSheet = getBookingsSheet(spreadsheet);
  const timeZone = spreadsheet.getSpreadsheetTimeZone();
  const data = bookingsSheet.getDataRange().getValues();
  const headers = data[0].map(String);
  const codeIdx = headers.indexOf("booking_code");
  const priceIdx = headers.indexOf("total_price");
  const currencyIdx = headers.indexOf("currency");
  const statusIdx = headers.indexOf("status");
  const holdExpiresIdx = headers.indexOf("hold_expires_at");
  if (codeIdx === -1 || priceIdx === -1 || statusIdx === -1 || holdExpiresIdx === -1) {
    throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/total_price/status/hold_expires_at \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
  }
  const row = data.slice(1).find((r) => String(r[codeIdx]) === bookingCode);
  if (!row) return { ok: false, reason: "NOT_FOUND" };
  const amount = Number(row[priceIdx]);
  const currency = currencyIdx !== -1 && row[currencyIdx] ? String(row[currencyIdx]) : "THB";
  const status = String(row[statusIdx] || "");
  const holdExpiresCell = row[holdExpiresIdx];
  const holdExpiresAt = holdExpiresCell instanceof Date ? Utilities.formatDate(holdExpiresCell, timeZone, "yyyy-MM-dd HH:mm:ss") : String(holdExpiresCell || "").trim();
  const settings = getSettings();
  if (!settings.promptpay_id) {
    throw new Error("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 promptpay_id \u0E43\u0E19\u0E0A\u0E35\u0E15 settings");
  }
  const serverNow = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
  const promptpayPayload = buildPromptPayPayload(settings.promptpay_id, amount);
  return toPaymentInfoResult(bookingCode, { status, amount, currency, holdExpiresAt }, promptpayPayload, serverNow);
}
export function uploadSlip(bookingCode, base64, slipRef) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) return { ok: false, reason: "BUSY" };
  try {
    const spreadsheet = getSpreadsheet();
    const bookingsSheet = getBookingsSheet(spreadsheet);
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const data = bookingsSheet.getDataRange().getValues();
    const headers = data[0].map(String);
    const codeIdx = headers.indexOf("booking_code");
    const slipRefIdx = headers.indexOf("slip_ref");
    const slipUrlIdx = headers.indexOf("slip_url");
    const paymentStatusIdx = headers.indexOf("payment_status");
    const totalPriceIdx = headers.indexOf("total_price");
    const statusIdx = headers.indexOf("status");
    const holdExpiresIdx = headers.indexOf("hold_expires_at");
    if (codeIdx === -1 || slipRefIdx === -1 || slipUrlIdx === -1 || paymentStatusIdx === -1 || totalPriceIdx === -1 || statusIdx === -1 || holdExpiresIdx === -1) {
      throw new Error(
        "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/slip_ref/slip_url/payment_status/total_price/status \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings"
      );
    }
    let targetRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      const existingSlipRef = String(data[i][slipRefIdx] || "");
      if (existingSlipRef && existingSlipRef === slipRef) {
        return { ok: false, reason: "DUPLICATE_SLIP" };
      }
      if (String(data[i][codeIdx]) === bookingCode) {
        targetRowIndex = i + 1;
      }
    }
    if (targetRowIndex === -1) {
      return { ok: false, reason: "BOOKING_NOT_FOUND" };
    }
    const holdCell = data[targetRowIndex - 1][holdExpiresIdx];
    const holdExpiresAt = holdCell instanceof Date ? Utilities.formatDate(holdCell, timeZone, "yyyy-MM-dd HH:mm:ss") : String(holdCell || "").trim();
    const serverNow = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
    if (String(data[targetRowIndex - 1][statusIdx] || "") !== "pending" || !holdExpiresAt || holdExpiresAt <= serverNow) {
      return { ok: false, reason: "HOLD_EXPIRED" };
    }
    const validation = validateSlipUpload(base64, MAX_SLIP_IMAGE_BYTES);
    if (!validation.valid || !validation.type) {
      return { ok: false, reason: "INVALID_FILE", errors: validation.errors };
    }
    const settings = getSettings();
    if (!settings.drive_folder_id) {
      throw new Error("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 drive_folder_id \u0E43\u0E19\u0E0A\u0E35\u0E15 settings");
    }
    const folder = DriveApp.getFolderById(settings.drive_folder_id);
    const extension = validation.type === "jpeg" ? "jpg" : validation.type;
    const contentType = `image/${validation.type}`;
    const rawBase64 = base64.replace(/^data:[^;]*;base64,/, "");
    const bytes = Utilities.base64Decode(rawBase64);
    const blob = Utilities.newBlob(bytes, contentType, `slip_${bookingCode}_${slipRef}.${extension}`);
    const file = folder.createFile(blob);
    const slipUrl = file.getUrl();
    const expectedAmount = Number(data[targetRowIndex - 1][totalPriceIdx]);
    const verifyResult = verifySlipViaSlipOk(
      rawBase64,
      expectedAmount,
      settings.slipok_endpoint,
      settings.slipok_api_key
    );
    const rowValues = data[targetRowIndex - 1].slice();
    rowValues[slipUrlIdx] = slipUrl;
    rowValues[slipRefIdx] = safeSheetText2(slipRef);
    if (verifyResult.verified) {
      rowValues[paymentStatusIdx] = "paid";
      rowValues[statusIdx] = "confirmed";
    } else {
      rowValues[paymentStatusIdx] = "slip_uploaded";
    }
    bookingsSheet.getRange(targetRowIndex, 1, 1, headers.length).setValues([rowValues]);
    return { ok: true, slip_url: slipUrl, verified: verifyResult.verified, reason: verifyResult.reason };
  } finally {
    lock.releaseLock();
  }
}
