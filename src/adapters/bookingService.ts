import { sendPaymentConfirmedEmail, sendPaymentRequestEmail, sendSlipReceivedEmail } from './mailService';
import { clearCache, getCustomDailyPrices, getExtraServices, getRooms, getSettings, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';
import { buildBookingRow, filterEditableFields, formatBookingDateParts, nextYearlyBookingCode, pickExpiredBookings, sheetRowsToDelete } from '../core/bookingLogic';
import { expandNights, findConflicts, isValidYmd } from '../core/dateRange';
import { calculateQuote, round2 } from '../core/pricing';

export function safeSheetText(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
export function createBooking(input) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) {
    return { ok: false, reason: "BUSY" };
  }
  try {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const blockedDatesSheet = spreadsheet.getSheetByName("blocked_dates");
    if (!blockedDatesSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 blocked_dates");
    const blockedDatesData = blockedDatesSheet.getDataRange().getValues();
    const blkHeaders = blockedDatesData[0].map(String);
    const dateColIdx = blkHeaders.indexOf("date");
    if (dateColIdx === -1) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C date \u0E43\u0E19\u0E0A\u0E35\u0E15 blocked_dates");
    const freshBlockedDates = [];
    for (let i = 1; i < blockedDatesData.length; i++) {
      const dateCell = blockedDatesData[i][dateColIdx];
      if (!dateCell) continue;
      const ymd2 = dateCell instanceof Date ? Utilities.formatDate(dateCell, timeZone, "yyyy-MM-dd") : String(dateCell).trim();
      if (isValidYmd(ymd2)) {
        freshBlockedDates.push(ymd2);
      }
    }
    const conflicts = findConflicts(input.checkIn, input.checkOut, freshBlockedDates);
    if (conflicts.length > 0) {
      return { ok: false, reason: "DATES_UNAVAILABLE", conflicts };
    }
    const settings = getSettings();
    const rooms = getRooms();
    const room = rooms.find((r) => r.id === input.roomId);
    if (!room) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38");
    const quote = calculateQuote({
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      selections: input.selections || [],
      room,
      settings,
      dailyPrices: getCustomDailyPrices(),
      services: getExtraServices(),
      lang: input.lang || settings.default_lang || "th"
    });
    const bookingsSheet = spreadsheet.getSheetByName("bookings");
    if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const bookingsData = bookingsSheet.getDataRange().getValues();
    const bHeaders = bookingsData[0].map(String);
    const bookingCodeColIdx = bHeaders.indexOf("booking_code");
    const now = /* @__PURE__ */ new Date();
    const { yy, mm, dd } = formatBookingDateParts(now);
    const existingCodes = [];
    for (let i = 1; i < bookingsData.length; i++) {
      existingCodes.push(String(bookingsData[i][bookingCodeColIdx] || ""));
    }
    const bookingCode = nextYearlyBookingCode(existingCodes, yy, mm, dd);
    const holdExpiresAt = new Date(now.getTime() + settings.hold_minutes * 6e4);
    const holdExpiresAtFormatted = Utilities.formatDate(holdExpiresAt, timeZone, "yyyy-MM-dd HH:mm:ss");
    const createdAtFormatted = Utilities.formatDate(now, timeZone, "yyyy-MM-dd HH:mm:ss");
    const bookingId = Utilities.getUuid();
    const newBookingRow = buildBookingRow(bHeaders, {
      id: bookingId,
      booking_code: bookingCode,
      status: "pending",
      hold_expires_at: holdExpiresAtFormatted,
      created_at: createdAtFormatted,
      check_in: quote.check_in,
      check_out: quote.check_out,
      room_id: room.id,
      guests_count: quote.guests_count,
      total_price: quote.total_price,
      guest_name: safeSheetText(input.customerName),
      guest_email: safeSheetText(input.customerEmail),
      phone: safeSheetText(input.customerPhone),
      arrival_time: safeSheetText(input.arrivalTime),
      special_requests: safeSheetText(input.specialRequests),
      source: "direct",
      payment_status: "unpaid"
    });
    bookingsSheet.getRange(bookingsSheet.getLastRow() + 1, 1, 1, bHeaders.length).setValues([newBookingRow]);
    const servicesSheet = spreadsheet.getSheetByName("booking_services");
    if (servicesSheet && quote.service_lines.length > 0) {
      const svsData = servicesSheet.getDataRange().getValues();
      const svsHeaders = svsData[0].map(String);
      const newSvsRows = [];
      for (const line of quote.service_lines) {
        const newSvsRow = buildBookingRow(svsHeaders, {
          id: Utilities.getUuid(),
          booking_id: bookingId,
          booking_code: bookingCode,
          service_id: line.service_id,
          service_name_snapshot: line.service_name_snapshot,
          qty: line.qty,
          unit_price_snapshot: line.unit_price_snapshot,
          nights_applied: line.nights_applied,
          guests_applied: line.guests_applied,
          line_total: line.line_total
        });
        newSvsRows.push(newSvsRow);
      }
      servicesSheet.getRange(servicesSheet.getLastRow() + 1, 1, newSvsRows.length, svsHeaders.length).setValues(newSvsRows);
    }
    const nights = expandNights(quote.check_in, quote.check_out);
    if (nights.length > 0) {
      const newBlockedRows = [];
      for (const night of nights) {
        const newBlockedRow = buildBookingRow(blkHeaders, {
          id: Utilities.getUuid(),
          date: night,
          booking_id: bookingId,
          source: "direct"
        });
        newBlockedRows.push(newBlockedRow);
      }
      blockedDatesSheet.getRange(blockedDatesSheet.getLastRow() + 1, 1, newBlockedRows.length, blkHeaders.length).setValues(newBlockedRows);
    }
    clearCache("blocked_dates");
    clearCache("blocked_dates_detailed");
    return { ok: true, booking_code: bookingCode, quote };
  } finally {
    lock.releaseLock();
  }
}
export function expirePendingHolds() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) {
    return 0;
  }
  try {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const now = /* @__PURE__ */ new Date();
    const nowStr = Utilities.formatDate(now, timeZone, "yyyy-MM-dd HH:mm:ss");
    const bookingsSheet = spreadsheet.getSheetByName("bookings");
    if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const bookingsData = bookingsSheet.getDataRange().getValues();
    if (bookingsData.length < 2) return 0;
    const bHeaders = bookingsData[0].map(String);
    const bStatusColIdx = bHeaders.indexOf("status");
    const bHoldExpiresColIdx = bHeaders.indexOf("hold_expires_at");
    const bIdColIdx = bHeaders.indexOf("id");
    const rowDataForLogic = [];
    for (let i = 1; i < bookingsData.length; i++) {
      rowDataForLogic.push({
        id: String(bookingsData[i][bIdColIdx]),
        status: String(bookingsData[i][bStatusColIdx]),
        hold_expires_at: bookingsData[i][bHoldExpiresColIdx]
      });
    }
    const expiredBookingIds = pickExpiredBookings(rowDataForLogic, nowStr, (d) => Utilities.formatDate(d, timeZone, "yyyy-MM-dd HH:mm:ss"));
    const expiredIdSet = new Set(expiredBookingIds);
    let count = 0;
    const statusColumn = [];
    for (let i = 1; i < bookingsData.length; i++) {
      const bId = String(bookingsData[i][bIdColIdx]);
      if (expiredIdSet.has(bId)) {
        statusColumn.push(["expired"]);
        count++;
      } else {
        statusColumn.push([String(bookingsData[i][bStatusColIdx])]);
      }
    }
    if (count > 0) {
      bookingsSheet.getRange(2, bStatusColIdx + 1, statusColumn.length, 1).setValues(statusColumn);
    }
    if (count > 0) {
      const blockedDatesSheet = spreadsheet.getSheetByName("blocked_dates");
      if (blockedDatesSheet) {
        const blockedData = blockedDatesSheet.getDataRange().getValues();
        if (blockedData.length > 1) {
          const blkHeaders = blockedData[0].map(String);
          const blkBookingIdColIdx = blkHeaders.indexOf("booking_id");
          const blockedRowData = blockedData.map((row) => ({
            booking_id: String(row[blkBookingIdColIdx])
          }));
          const indicesToDelete = sheetRowsToDelete(blockedRowData, expiredIdSet);
          for (const rowIndex of indicesToDelete) {
            blockedDatesSheet.deleteRow(rowIndex);
          }
        }
      }
      clearCache("blocked_dates");
      clearCache("blocked_dates_detailed");
    }
    return count;
  } finally {
    lock.releaseLock();
  }
}
export function updateBookingDetails(bookingCode, fields) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName("bookings");
  if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(String);
  const codeIdx = headers.indexOf("booking_code");
  if (codeIdx === -1) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
  const editableFields = ["guest_name", "guest_email", "phone", "arrival_time", "special_requests"];
  const safeFields = filterEditableFields(fields, editableFields);
  const targetRow = data.findIndex((row, index) => index > 0 && String(row[codeIdx]) === bookingCode) + 1;
  if (targetRow === 0) return { ok: false, reason: "NOT_FOUND" };
  const toWrite = [];
  const updatedFields = [];
  for (const [key, value] of Object.entries(safeFields)) {
    const colIdx = headers.indexOf(key);
    if (colIdx === -1) continue;
    toWrite.push({ colIdx, value: safeSheetText(value) });
    updatedFields.push(key);
  }
  if (toWrite.length === 0) return { ok: false, reason: "NO_FIELDS" };
  for (const { colIdx, value } of toWrite) sheet.getRange(targetRow, colIdx + 1).setValue(value);
  return { ok: true, updated_fields: updatedFields };
}
export function addServiceToBooking(bookingCode, serviceId, qty) {
  if (!Number.isInteger(qty) || qty <= 0) return { ok: false, reason: "BAD_REQUEST" };
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) return { ok: false, reason: "BUSY" };
  try {
    const spreadsheet = getSpreadsheet();
    const bookingsSheet = spreadsheet.getSheetByName("bookings");
    if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const bookingsData = bookingsSheet.getDataRange().getValues();
    const bHeaders = bookingsData[0].map(String);
    const indexes = {
      code: bHeaders.indexOf("booking_code"),
      id: bHeaders.indexOf("id"),
      status: bHeaders.indexOf("status"),
      checkIn: bHeaders.indexOf("check_in"),
      checkOut: bHeaders.indexOf("check_out"),
      guests: bHeaders.indexOf("guests_count"),
      total: bHeaders.indexOf("total_price")
    };
    if (Object.values(indexes).some((index) => index === -1)) throw new Error("\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C bookings \u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A");
    const rowIndex = bookingsData.findIndex((row, index) => index > 0 && String(row[indexes.code]) === bookingCode);
    if (rowIndex === -1) return { ok: false, reason: "NOT_FOUND" };
    const booking = bookingsData[rowIndex];
    if (String(booking[indexes.status]) !== "confirmed") return { ok: false, reason: "BAD_REQUEST" };
    const service = getExtraServices(true).find((item) => item.id === serviceId);
    if (!service || !service.is_active) return { ok: false, reason: service ? "BAD_REQUEST" : "SERVICE_NOT_FOUND" };
    if (qty > service.max_qty || service.multiply_by_guests && qty > 1) return { ok: false, reason: "BAD_REQUEST" };
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const toYmd2 = (value) => value instanceof Date ? Utilities.formatDate(value, timeZone, "yyyy-MM-dd") : String(value || "").trim().split(/[ T]/)[0];
    let nights;
    try {
      nights = expandNights(toYmd2(booking[indexes.checkIn]), toYmd2(booking[indexes.checkOut])).length;
    } catch (_err) {
      return { ok: false, reason: "BAD_REQUEST" };
    }
    if (nights <= 0) return { ok: false, reason: "BAD_REQUEST" };
    const nightsApplied = service.multiply_by_nights ? nights : 1;
    const guestsApplied = service.multiply_by_guests ? Number(booking[indexes.guests]) || 1 : 1;
    const lineTotal = round2(service.price * qty * nightsApplied * guestsApplied);
    const servicesSheet = spreadsheet.getSheetByName("booking_services");
    if (!servicesSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 booking_services");
    const serviceHeaders = servicesSheet.getDataRange().getValues()[0].map(String);
    const newRow = buildBookingRow(serviceHeaders, {
      id: Utilities.getUuid(),
      booking_id: booking[indexes.id],
      booking_code: bookingCode,
      service_id: service.id,
      service_name_snapshot: safeSheetText(service.name_th),
      qty,
      unit_price_snapshot: service.price,
      nights_applied: nightsApplied,
      guests_applied: guestsApplied,
      line_total: lineTotal
    });
    servicesSheet.getRange(servicesSheet.getLastRow() + 1, 1, 1, serviceHeaders.length).setValues([newRow]);
    const totalPrice = round2(Number(booking[indexes.total]) + lineTotal);
    bookingsSheet.getRange(rowIndex + 1, indexes.total + 1).setValue(totalPrice);
    clearCache("all_booking_services");
    return { ok: true, line_total: lineTotal };
  } finally {
    lock.releaseLock();
  }
}
export function debugCleanupTestData() {
  const deletedCounts = {};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) {
    Logger.log("debugCleanupTestData: lock \u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07");
    return deletedCounts;
  }
  try {
    const spreadsheet = getSpreadsheet();
    const sheetNames = ["bookings", "booking_services", "blocked_dates"];
    for (const sheetName of sheetNames) {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log(`debugCleanupTestData: \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 "${sheetName}"`);
        continue;
      }
      const lastRow = sheet.getLastRow();
      let deletedCount = 0;
      for (let i = lastRow; i >= 2; i--) {
        sheet.deleteRow(i);
        deletedCount++;
      }
      deletedCounts[sheetName] = deletedCount;
      Logger.log(`debugCleanupTestData: \u0E25\u0E1A\u0E0A\u0E35\u0E15 "${sheetName}" \u0E44\u0E1B ${deletedCount} \u0E41\u0E16\u0E27`);
    }
    clearCache("blocked_dates");
    clearCache("blocked_dates_detailed");
    Logger.log("debugCleanupTestData: \u0E25\u0E49\u0E32\u0E07 cache \u0E02\u0E2D\u0E07 blocked_dates \u0E41\u0E25\u0E49\u0E27");
  } finally {
    lock.releaseLock();
  }
  return deletedCounts;
}
export function debugSendTestEmails() {
  const CODE = "LB2607270004";
  Logger.log(`MailApp quota \u0E40\u0E2B\u0E25\u0E37\u0E2D: ${MailApp.getRemainingDailyQuota()}`);
  try {
    Logger.log("--- \u0E17\u0E14\u0E2A\u0E2D\u0E1A payment request ---");
    const sent = sendPaymentRequestEmail(CODE);
    Logger.log(`payment request: ${sent ? "OK (\u0E2A\u0E48\u0E07\u0E08\u0E23\u0E34\u0E07)" : "OK (\u0E02\u0E49\u0E32\u0E21 \u2014 \u0E40\u0E04\u0E22\u0E2A\u0E48\u0E07\u0E41\u0E25\u0E49\u0E27/\u0E42\u0E04\u0E27\u0E15\u0E32\u0E44\u0E21\u0E48\u0E1E\u0E2D)"}`);
  } catch (err) {
    Logger.log(`payment request FAILED: ${err instanceof Error ? err.message : "unknown error"}`);
  }
  try {
    Logger.log("--- \u0E17\u0E14\u0E2A\u0E2D\u0E1A slip received ---");
    const sent = sendSlipReceivedEmail(CODE);
    Logger.log(`slip received: ${sent ? "OK (\u0E2A\u0E48\u0E07\u0E08\u0E23\u0E34\u0E07)" : "OK (\u0E02\u0E49\u0E32\u0E21 \u2014 \u0E40\u0E04\u0E22\u0E2A\u0E48\u0E07\u0E41\u0E25\u0E49\u0E27/\u0E42\u0E04\u0E27\u0E15\u0E32\u0E44\u0E21\u0E48\u0E1E\u0E2D)"}`);
  } catch (err) {
    Logger.log(`slip received FAILED: ${err instanceof Error ? err.message : "unknown error"}`);
  }
  try {
    Logger.log("--- \u0E17\u0E14\u0E2A\u0E2D\u0E1A payment confirmed ---");
    const sent = sendPaymentConfirmedEmail(CODE);
    Logger.log(`payment confirmed: ${sent ? "OK (\u0E2A\u0E48\u0E07\u0E08\u0E23\u0E34\u0E07)" : "OK (\u0E02\u0E49\u0E32\u0E21 \u2014 \u0E40\u0E04\u0E22\u0E2A\u0E48\u0E07\u0E41\u0E25\u0E49\u0E27/\u0E42\u0E04\u0E27\u0E15\u0E32\u0E44\u0E21\u0E48\u0E1E\u0E2D)"}`);
  } catch (err) {
    Logger.log(`payment confirmed FAILED: ${err instanceof Error ? err.message : "unknown error"}`);
  }
}
