import { clearCache, getExtraServices, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';
import { expandNights } from '../core/dateRange';
import { round2, splitBookingPayment } from '../core/pricing';

export function getBooking(bookingCode) {
  const sheet = getSpreadsheet().getSheetByName("bookings");
  if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return null;
  const headers = data[0].map(String);
  const codeIdx = headers.indexOf("booking_code");
  const rowIdx = data.findIndex((r, i) => i > 0 && String(r[codeIdx]) === bookingCode);
  if (rowIdx === -1) return null;
  const raw = data[rowIdx];
  const booking = {};
  headers.forEach((h, i) => {
    booking[h] = raw[i];
  });
  return { sheet, rowIdx: rowIdx + 1, booking, headers };
}
export function getBookingServices(bookingId) {
  const sheet = getSpreadsheet().getSheetByName("booking_services");
  if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 booking_services");
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return { sheet, services: [], headers: data.length === 1 ? data[0].map(String) : [] };
  const headers = data[0].map(String);
  const bIdIdx = headers.indexOf("booking_id");
  const services = [];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][bIdIdx]) === bookingId) {
      const sv = {};
      headers.forEach((h, j) => {
        sv[h] = data[i][j];
      });
      services.push({ rowIdx: i + 1, data: sv });
    }
  }
  return { sheet, services, headers };
}
export function detailBookingRow(booking, timeZone) {
  const dateValue = (value) => value instanceof Date ? Utilities.formatDate(value, timeZone, "yyyy-MM-dd HH:mm:ss") : String(value || "").trim();
  return {
    id: String(booking.id || ""),
    booking_code: String(booking.booking_code || ""),
    status: String(booking.status || ""),
    hold_expires_at: dateValue(booking.hold_expires_at),
    created_at: dateValue(booking.created_at),
    check_in: dateValue(booking.check_in),
    check_out: dateValue(booking.check_out),
    room_id: String(booking.room_id || ""),
    guests_count: Number(booking.guests_count) || 0,
    total_price: Number(booking.total_price) || 0,
    currency: String(booking.currency || "THB"),
    guest_name: String(booking.guest_name || ""),
    guest_email: String(booking.guest_email || ""),
    phone: String(booking.phone || ""),
    arrival_time: String(booking.arrival_time || ""),
    special_requests: String(booking.special_requests || ""),
    source: String(booking.source || ""),
    payment_status: String(booking.payment_status || "")
  };
}
export function detailServiceRow(service) {
  return {
    id: String(service.id || ""),
    booking_id: String(service.booking_id || ""),
    booking_code: String(service.booking_code || ""),
    service_id: String(service.service_id || ""),
    service_name_snapshot: String(service.service_name_snapshot || ""),
    qty: Number(service.qty) || 0,
    unit_price_snapshot: Number(service.unit_price_snapshot) || 0,
    nights_applied: Number(service.nights_applied) || 0,
    guests_applied: Number(service.guests_applied) || 0,
    line_total: Number(service.line_total) || 0
  };
}
export function bookingDateToYmd(value, timeZone) {
  return value instanceof Date ? Utilities.formatDate(value, timeZone, "yyyy-MM-dd") : String(value || "").trim().split(/[ T]/)[0];
}
export function writeAuditLog2(action, targetType, targetId, detail) {
  const sheet = getSpreadsheet().getSheetByName("audit_log");
  if (!sheet) return;
  const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
  const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
  let email = "system";
  try {
    email = Session.getActiveUser().getEmail() || "system";
  } catch (e) {
  }
  sheet.appendRow([
    Utilities.getUuid(),
    // 1: id
    now,
    // 2: timestamp
    email,
    // 3: admin_email
    action,
    // 4: action
    targetType,
    // 5: target_type
    targetId,
    // 6: target_id
    detail
    // 7: detail
  ]);
}
export function getBookingDetailsForAdmin(bookingCode) {
  const b = getBooking(bookingCode);
  if (!b) return { ok: false, reason: "NOT_FOUND" };
  const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
  const svcs = getBookingServices(b.booking.id);
  const extraServices = getExtraServices(true).filter((s) => s.is_active).map((s) => ({
    id: s.id,
    name_th: s.name_th,
    name_en: s.name_en,
    description_th: s.description_th,
    description_en: s.description_en,
    price: Number(s.price) || 0,
    multiply_by_nights: s.multiply_by_nights === true,
    multiply_by_guests: s.multiply_by_guests === true,
    max_qty: Number(s.max_qty) || 0,
    is_active: true
  }));
  const payment_breakdown = splitBookingPayment(
    Number(b.booking.total_price) || 0,
    svcs.services.map((s) => s.data.line_total)
  );
  return {
    ok: true,
    booking: detailBookingRow(b.booking, timeZone),
    booking_services: svcs.services.map((s) => detailServiceRow(s.data)),
    available_extra_services: extraServices,
    payment_breakdown
  };
}
export function updateBookingTotalPrice(bookingData, oldServices, newServices) {
  if (!bookingData) return;
  const oldTotal = oldServices.reduce((sum, s) => sum + (Number(s.data.line_total) || 0), 0);
  const newTotal = newServices.reduce((sum, s) => sum + (Number(s.line_total) || 0), 0);
  const diff = newTotal - oldTotal;
  if (diff === 0) return;
  const currentPrice = Number(bookingData.booking.total_price) || 0;
  const nextPrice = round2(currentPrice + diff);
  const tpIdx = bookingData.headers.indexOf("total_price");
  bookingData.sheet.getRange(bookingData.rowIdx, tpIdx + 1).setValue(nextPrice);
}
export function manageBookingService(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) {
    return { ok: false, reason: "BUSY" };
  }
  try {
    const { bookingCode, operation, serviceId, qty = 0 } = payload;
    const b = getBooking(bookingCode);
    if (!b) return { ok: false, reason: "NOT_FOUND", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07" };
    const bookingStatus = String(b.booking.status || "");
    if (bookingStatus !== "confirmed") {
      return { ok: false, reason: "BAD_REQUEST", message: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E49\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E19\u0E35\u0E49\u0E44\u0E14\u0E49" };
    }
    const svcs = getBookingServices(b.booking.id);
    if (operation === "add") {
      if (!Number.isInteger(qty) || qty <= 0) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0" };
      const allExtra = getExtraServices(true);
      const extra = allExtra.find((e) => e.id === serviceId);
      if (!extra) return { ok: false, reason: "BAD_REQUEST", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E23\u0E34\u0E21\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49" };
      if (!extra.is_active) return { ok: false, reason: "BAD_REQUEST", message: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E39\u0E48" };
      if (qty > extra.max_qty) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14" };
      if (extra.multiply_by_guests && qty > 1) return { ok: false, reason: "BAD_REQUEST", message: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E04\u0E34\u0E14\u0E15\u0E32\u0E21\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E41\u0E25\u0E49\u0E27" };
      const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
      const checkIn = bookingDateToYmd(b.booking.check_in, timeZone);
      const checkOut = bookingDateToYmd(b.booking.check_out, timeZone);
      let totalNights;
      try {
        totalNights = expandNights(checkIn, checkOut).length;
      } catch (e) {
        return { ok: false, reason: "BAD_REQUEST", message: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
      }
      if (totalNights <= 0) return { ok: false, reason: "BAD_REQUEST", message: "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
      const guestsCount = Number(b.booking.guests_count) || 1;
      const nightsApplied = extra.multiply_by_nights ? totalNights : 1;
      const guestsApplied = extra.multiply_by_guests ? guestsCount : 1;
      const unitPrice = Number(extra.price) || 0;
      const lineTotal = round2(qty * unitPrice * nightsApplied * guestsApplied);
      const newRowData = {
        id: Utilities.getUuid(),
        booking_id: b.booking.id,
        booking_code: bookingCode,
        service_id: extra.id,
        service_name_snapshot: extra.name_th,
        qty,
        unit_price_snapshot: unitPrice,
        nights_applied: nightsApplied,
        guests_applied: guestsApplied,
        line_total: lineTotal
      };
      const rowArr = svcs.headers.map((h) => newRowData[h] !== void 0 ? newRowData[h] : "");
      let appendedRow = 0;
      try {
        svcs.sheet.appendRow(rowArr);
        appendedRow = svcs.sheet.getLastRow();
        updateBookingTotalPrice(b, svcs.services, [...svcs.services.map((s) => s.data), newRowData]);
      } catch (err) {
        if (appendedRow > 1) svcs.sheet.deleteRow(appendedRow);
        throw err;
      }
      clearCache("all_booking_services");
      try {
        writeAuditLog2("ADD_SERVICE", "booking", bookingCode, `Added ${extra.name_th} x${qty} to ${bookingCode} (+${lineTotal} THB)`);
      } catch (err) {
        console.error("manageBookingService audit error:", err instanceof Error ? err.message : "unknown error");
      }
      return { ok: true };
    }
    if (operation === "edit") {
      if (!Number.isInteger(qty) || qty <= 0) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0" };
      const target = svcs.services.find((s) => String(s.data.service_id) === serviceId);
      if (!target) return { ok: false, reason: "NOT_FOUND", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E43\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07" };
      const currentExtra = getExtraServices(true).find((e) => e.id === serviceId);
      if (currentExtra && qty > currentExtra.max_qty) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14" };
      if (currentExtra?.multiply_by_guests && qty > 1) return { ok: false, reason: "BAD_REQUEST", message: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E04\u0E34\u0E14\u0E15\u0E32\u0E21\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E41\u0E25\u0E49\u0E27" };
      const unitPrice = Number(target.data.unit_price_snapshot) || 0;
      const nightsApplied = Number(target.data.nights_applied) || 1;
      const guestsApplied = Number(target.data.guests_applied) || 1;
      const lineTotal = round2(qty * unitPrice * nightsApplied * guestsApplied);
      const updatedData = { ...target.data, qty, line_total: lineTotal };
      const newServices = svcs.services.map((s) => s.rowIdx === target.rowIdx ? updatedData : s.data);
      const qtyIdx = svcs.headers.indexOf("qty");
      const ltIdx = svcs.headers.indexOf("line_total");
      const totalIdx = b.headers.indexOf("total_price");
      try {
        svcs.sheet.getRange(target.rowIdx, qtyIdx + 1).setValue(qty);
        svcs.sheet.getRange(target.rowIdx, ltIdx + 1).setValue(lineTotal);
        updateBookingTotalPrice(b, svcs.services, newServices);
      } catch (err) {
        svcs.sheet.getRange(target.rowIdx, qtyIdx + 1).setValue(target.data.qty);
        svcs.sheet.getRange(target.rowIdx, ltIdx + 1).setValue(target.data.line_total);
        if (totalIdx !== -1) svcs.sheet.getRange(b.rowIdx, totalIdx + 1).setValue(b.booking.total_price);
        throw err;
      }
      clearCache("all_booking_services");
      try {
        writeAuditLog2("UPDATE_SERVICE", "booking", bookingCode, `Updated ${target.data.service_name_snapshot} to x${qty} on ${bookingCode} (New Total: ${lineTotal} THB)`);
      } catch (err) {
        console.error("manageBookingService audit error:", err instanceof Error ? err.message : "unknown error");
      }
      return { ok: true };
    }
    if (operation === "delete") {
      const target = svcs.services.find((s) => String(s.data.service_id) === serviceId);
      if (!target) return { ok: false, reason: "NOT_FOUND", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E43\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07" };
      const newServices = svcs.services.filter((s) => s.rowIdx !== target.rowIdx).map((s) => s.data);
      const deletedRow = svcs.sheet.getRange(target.rowIdx, 1, 1, svcs.headers.length).getValues()[0];
      const totalIdx = b.headers.indexOf("total_price");
      try {
        svcs.sheet.deleteRow(target.rowIdx);
        updateBookingTotalPrice(b, svcs.services, newServices);
      } catch (err) {
        svcs.sheet.insertRowBefore(target.rowIdx);
        svcs.sheet.getRange(target.rowIdx, 1, 1, svcs.headers.length).setValues([deletedRow]);
        if (totalIdx !== -1) svcs.sheet.getRange(b.rowIdx, totalIdx + 1).setValue(b.booking.total_price);
        throw err;
      }
      clearCache("all_booking_services");
      try {
        writeAuditLog2("DELETE_SERVICE", "booking", bookingCode, `Deleted ${target.data.service_name_snapshot} from ${bookingCode}`);
      } catch (err) {
        console.error("manageBookingService audit error:", err instanceof Error ? err.message : "unknown error");
      }
      return { ok: true };
    }
    return { ok: false, reason: "BAD_REQUEST", message: "Operation \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
  } finally {
    lock.releaseLock();
  }
}
