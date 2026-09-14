import { clearCache, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';
import { sheetRowsToDelete } from '../core/bookingLogic';

export function confirmBookingByAdmin(bookingCode) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) return { ok: false, reason: "BUSY" };
  try {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("bookings");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(String);
    const codeIdx = headers.indexOf("booking_code");
    const statusIdx = headers.indexOf("status");
    const paymentStatusIdx = headers.indexOf("payment_status");
    if (codeIdx === -1 || statusIdx === -1 || paymentStatusIdx === -1) {
      throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/status/payment_status \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
    }
    let targetRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][codeIdx]) === bookingCode) {
        targetRow = i + 1;
        break;
      }
    }
    if (targetRow === -1) return { ok: false, reason: "NOT_FOUND" };
    const currentStatus = String(data[targetRow - 1][statusIdx]);
    const currentPayment = String(data[targetRow - 1][paymentStatusIdx]);
    if (currentStatus === "confirmed" && currentPayment === "paid") {
      return { ok: false, reason: "ALREADY_CONFIRMED" };
    }
    if (currentStatus !== "pending") return { ok: false, reason: "INVALID_STATUS" };
    sheet.getRange(targetRow, statusIdx + 1).setValue("confirmed");
    sheet.getRange(targetRow, paymentStatusIdx + 1).setValue("paid");
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}
export function cancelBookingByAdmin(bookingCode) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) {
    return { ok: false, reason: "BUSY" };
  }
  try {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("bookings");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(String);
    const codeIdx = headers.indexOf("booking_code");
    const statusIdx = headers.indexOf("status");
    const idIdx = headers.indexOf("id");
    if (codeIdx === -1 || statusIdx === -1 || idIdx === -1) {
      throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/status/id \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
    }
    let targetRow = -1;
    let bookingId = "";
    let currentStatus = "";
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][codeIdx]) === bookingCode) {
        targetRow = i + 1;
        bookingId = String(data[i][idIdx]);
        currentStatus = String(data[i][statusIdx]);
        break;
      }
    }
    if (targetRow === -1) return { ok: false, reason: "NOT_FOUND" };
    if (currentStatus === "cancelled") return { ok: false, reason: "ALREADY_CANCELLED" };
    if (!["pending", "confirmed"].includes(currentStatus)) return { ok: false, reason: "INVALID_STATUS" };
    sheet.getRange(targetRow, statusIdx + 1).setValue("cancelled");
    let freedDates = 0;
    const blockedSheet = spreadsheet.getSheetByName("blocked_dates");
    if (blockedSheet && bookingId !== "") {
      const blockedData = blockedSheet.getDataRange().getValues();
      if (blockedData.length > 1) {
        const blkHeaders = blockedData[0].map(String);
        const blkBookingIdColIdx = blkHeaders.indexOf("booking_id");
        if (blkBookingIdColIdx !== -1) {
          const blockedRowData = blockedData.map((row) => ({
            booking_id: String(row[blkBookingIdColIdx])
          }));
          const indicesToDelete = sheetRowsToDelete(blockedRowData, /* @__PURE__ */ new Set([bookingId]));
          for (const rowIndex of indicesToDelete) {
            blockedSheet.deleteRow(rowIndex);
            freedDates++;
          }
        }
      }
    }
    clearCache("blocked_dates");
    clearCache("blocked_dates_detailed");
    return { ok: true, freed_dates: freedDates };
  } finally {
    lock.releaseLock();
  }
}
