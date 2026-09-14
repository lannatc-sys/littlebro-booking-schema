import { getSpreadsheet, readSheetRows } from './sheetsRepo';
import { ok } from '../core/apiContract';

export function toStr2(v) {
  return v === null || v === void 0 ? "" : String(v).trim();
}
export function toNumber2(v) {
  const n = Number(toStr2(v));
  return Number.isFinite(n) ? n : 0;
}
export function toDateStr(v, formatDate) {
  return v instanceof Date ? formatDate(v) : toStr2(v);
}
export function toAdminBookings(rows, formatDate) {
  const bookings = rows.filter((data) => toStr2(data.id)).map((data) => ({
    id: toStr2(data.id),
    booking_code: toStr2(data.booking_code),
    status: toStr2(data.status),
    hold_expires_at: toDateStr(data.hold_expires_at, formatDate),
    created_at: toDateStr(data.created_at, formatDate),
    check_in: toDateStr(data.check_in, formatDate),
    check_out: toDateStr(data.check_out, formatDate),
    room_id: toStr2(data.room_id),
    guests_count: toNumber2(data.guests_count),
    total_price: toNumber2(data.total_price),
    currency: toStr2(data.currency) || "THB",
    guest_name: toStr2(data.guest_name),
    guest_email: toStr2(data.guest_email),
    phone: toStr2(data.phone),
    arrival_time: toStr2(data.arrival_time),
    special_requests: toStr2(data.special_requests),
    source: toStr2(data.source),
    payment_status: toStr2(data.payment_status)
  }));
  return bookings.sort((a, b) => {
    if (a.created_at === b.created_at) return 0;
    return a.created_at > b.created_at ? -1 : 1;
  });
}
export function listBookingsForAdmin() {
  const spreadsheet = getSpreadsheet();
  const timeZone = spreadsheet.getSpreadsheetTimeZone();
  const rows = readSheetRows(spreadsheet, "bookings").map((r) => r.data);
  return toAdminBookings(rows, (d) => Utilities.formatDate(d, timeZone, "yyyy-MM-dd HH:mm:ss"));
}
export function getSlipForAdmin(bookingCode) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName("bookings");
  if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(String);
  const codeIdx = headers.indexOf("booking_code");
  const slipUrlIdx = headers.indexOf("slip_url");
  if (codeIdx === -1 || slipUrlIdx === -1) {
    throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/slip_url \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
  }
  const row = data.slice(1).find((r) => String(r[codeIdx]) === bookingCode);
  if (!row) return { ok: false, reason: "NOT_FOUND" };
  const slipUrl = String(row[slipUrlIdx] || "").trim();
  if (!slipUrl) return { ok: false, reason: "NO_SLIP" };
  return { ok: true, slip_url: slipUrl };
}
