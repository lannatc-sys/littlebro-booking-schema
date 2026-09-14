import { isValidYmd } from '../core/dateRange';
import { buildPublicCatalog } from '../core/catalog';
import { round2 } from '../core/pricing';

// src/adapters/sheetsRepo.ts
export var CACHE_SECONDS = 300;
export var CACHE_PREFIX = "sheetsRepo:";
export function toStr(v) {
  return v === null || v === void 0 ? "" : String(v).trim();
}
export function toNumber(v) {
  if (typeof v === "number") return v;
  const n = Number(toStr(v));
  return Number.isFinite(n) ? n : 0;
}
export function toBoolean(v) {
  if (typeof v === "boolean") return v;
  return toStr(v).toUpperCase() === "TRUE";
}
export function toYmd(v, timeZone, sheetName, rowNumber) {
  const ymd2 = v instanceof Date ? Utilities.formatDate(v, timeZone, "yyyy-MM-dd") : toStr(v);
  if (!isValidYmd(ymd2)) {
    throw new RangeError(
      `\u0E0A\u0E35\u0E15 "${sheetName}" \u0E41\u0E16\u0E27\u0E17\u0E35\u0E48 ${rowNumber}: \u0E04\u0E48\u0E32\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 "${ymd2}"`
    );
  }
  return ymd2;
}
export var activeSpreadsheet = null;
export function getSpreadsheet() {
  if (!activeSpreadsheet) {
    activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }
  return activeSpreadsheet;
}
export function readSheetRows(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error(`\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 "${sheetName}"`);
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];
  const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = values[0].map((h) => toStr(h));
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const raw = values[i];
    if (raw.every((cell) => cell === "" || cell === null)) continue;
    const data = {};
    headers.forEach((h, idx) => {
      if (h) data[h] = raw[idx];
    });
    rows.push({ rowNumber: i + 1, data });
  }
  return rows;
}
export function getCached(cacheKey, compute, forceFresh = false) {
  const cache = CacheService.getScriptCache();
  const key = CACHE_PREFIX + cacheKey;
  if (!forceFresh) {
    const hit = cache.get(key);
    if (hit !== null) return JSON.parse(hit);
  }
  const value = compute();
  const ttl = cacheKey === "blocked_dates" ? 30 : CACHE_SECONDS;
  cache.put(key, JSON.stringify(value), ttl);
  return value;
}
export function clearCache(cacheKey) {
  const cache = CacheService.getScriptCache();
  const key = CACHE_PREFIX + cacheKey;
  cache.remove(key);
}
export function getSettings(forceFresh = false) {
  return getCached("settings", () => {
    const rows = readSheetRows(getSpreadsheet(), "settings");
    const map = /* @__PURE__ */ new Map();
    for (const { data } of rows) {
      map.set(toStr(data.key), data.value);
    }
    return {
      base_price: toNumber(map.get("base_price")),
      cleaning_fee: toNumber(map.get("cleaning_fee")),
      min_guests: toNumber(map.get("min_guests")),
      max_guests: toNumber(map.get("max_guests")),
      min_nights: toNumber(map.get("min_nights")),
      hold_minutes: toNumber(map.get("hold_minutes")),
      direct_discount_percent: toNumber(map.get("direct_discount_percent")),
      pricing_strategy: toStr(map.get("pricing_strategy")) || "range_max",
      currency: toStr(map.get("currency")) || "THB",
      default_lang: toStr(map.get("default_lang")) || "th",
      max_advance_days: toNumber(map.get("max_advance_days")) || 365,
      promptpay_id: toStr(map.get("promptpay_id")),
      notify_email: toStr(map.get("notify_email")),
      drive_folder_id: toStr(map.get("drive_folder_id")),
      slipok_endpoint: toStr(map.get("slipok_endpoint")),
      slipok_api_key: toStr(map.get("slipok_api_key")),
      property_name_th: toStr(map.get("property_name_th")),
      property_name_en: toStr(map.get("property_name_en")),
      address_th: toStr(map.get("address_th")),
      latitude: toNumber(map.get("latitude")),
      longitude: toNumber(map.get("longitude")),
      contact_phone: toStr(map.get("contact_phone")),
      whatsapp: toStr(map.get("whatsapp")),
      line_oa_url: toStr(map.get("line_oa_url")),
      facebook_url: toStr(map.get("facebook_url")),
      check_in_time: toStr(map.get("check_in_time")),
      check_out_time: toStr(map.get("check_out_time"))
    };
  }, forceFresh);
}
export function toRooms(rows) {
  return rows.filter((data) => toStr(data.id) && toStr(data.status) === "active" && toNumber(data.base_price) > 0).map((data) => ({
    id: toStr(data.id),
    room_code: toStr(data.room_code),
    name_th: toStr(data.name_th),
    name_en: toStr(data.name_en),
    base_price: toNumber(data.base_price),
    cleaning_fee: toNumber(data.cleaning_fee),
    capacity_min: toNumber(data.capacity_min),
    capacity_max: toNumber(data.capacity_max),
    status: "active"
  }));
}
export function getRooms(forceFresh = false) {
  return getCached("rooms", () => toRooms(readSheetRows(getSpreadsheet(), "rooms").map((r) => r.data)), forceFresh);
}
export function toExtraServices(rows) {
  return rows.filter((data) => toStr(data.id) && toBoolean(data.is_active) === true && toNumber(data.price) > 0).map((data) => ({
    id: toStr(data.id),
    name_th: toStr(data.name_th),
    name_en: toStr(data.name_en),
    description_th: toStr(data.description_th),
    description_en: toStr(data.description_en),
    price: toNumber(data.price),
    multiply_by_nights: toBoolean(data.multiply_by_nights),
    multiply_by_guests: toBoolean(data.multiply_by_guests),
    max_qty: toNumber(data.max_qty),
    is_active: true,
    sort_order: toNumber(data.sort_order)
  }));
}
export function toAllExtraServices(rows) {
  return rows.filter((data) => toStr(data.id)).map((data) => ({
    id: toStr(data.id),
    name_th: toStr(data.name_th),
    name_en: toStr(data.name_en),
    description_th: toStr(data.description_th),
    description_en: toStr(data.description_en),
    price: toNumber(data.price),
    multiply_by_nights: toBoolean(data.multiply_by_nights),
    multiply_by_guests: toBoolean(data.multiply_by_guests),
    max_qty: toNumber(data.max_qty),
    is_active: toBoolean(data.is_active),
    // ค่าจริงจากชีต ไม่ fix เป็น true เหมือน toExtraServices
    sort_order: toNumber(data.sort_order)
  }));
}
export function getAllExtraServicesForAdmin() {
  return toAllExtraServices(readSheetRows(getSpreadsheet(), "extra_services").map((r) => r.data));
}
export function getExtraServices(forceFresh = false) {
  return getCached("extra_services", () => toExtraServices(readSheetRows(getSpreadsheet(), "extra_services").map((r) => r.data)), forceFresh);
}
export function getCustomDailyPrices(forceFresh = false) {
  return getCached("custom_daily_prices", () => {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const rows = readSheetRows(spreadsheet, "custom_daily_prices");
    return rows.filter(({ data }) => data.date && data.room_id).map(({ data, rowNumber }) => ({
      date: toYmd(data.date, timeZone, "custom_daily_prices", rowNumber),
      room_id: toStr(data.room_id),
      price: toNumber(data.price),
      min_nights: toNumber(data.min_nights),
      description: data.description ? toStr(data.description) : void 0
    }));
  }, forceFresh);
}
export function getBlockedDates() {
  return getCached("blocked_dates", () => {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const rows = readSheetRows(spreadsheet, "blocked_dates");
    return rows.filter(({ data }) => data.date).map(({ data, rowNumber }) => toYmd(data.date, timeZone, "blocked_dates", rowNumber));
  });
}
export function getBlockedDatesDetailed() {
  return getCached("blocked_dates_detailed", () => {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const rows = readSheetRows(spreadsheet, "blocked_dates");
    return rows.filter(({ data }) => data.date).map(({ data, rowNumber }) => ({
      date: toYmd(data.date, timeZone, "blocked_dates", rowNumber),
      source: toStr(data.source)
    }));
  });
}
export function getCatalog() {
  return getCached("catalog", () => buildPublicCatalog(getSettings(), getRooms(), getExtraServices()));
}
export function toAdminUsers(rows) {
  return rows.filter((data) => toStr(data.email) && toBoolean(data.is_active) === true).map((data) => ({
    email: toStr(data.email),
    role: toStr(data.role),
    is_active: true
  }));
}
export function getAdminUsers(forceFresh = false) {
  if (forceFresh) {
    return toAdminUsers(readSheetRows(getSpreadsheet(), "admin_users").map((r) => r.data));
  }
  return getCached("admin_users", () => toAdminUsers(readSheetRows(getSpreadsheet(), "admin_users").map((r) => r.data)));
}
export function getICalSyncLog() {
  return getCached("ical_sync_log", () => {
    const rows = readSheetRows(getSpreadsheet(), "ical_sync_log");
    return rows.map(({ data }) => ({
      id: toStr(data.id),
      ota_name: toStr(data.ota_name),
      last_import_at: toStr(data.last_import_at),
      last_export_at: toStr(data.last_export_at),
      last_sync_at: toStr(data.last_sync_at),
      status: toStr(data.status),
      message: toStr(data.message)
    }));
  });
}
export function toOtaCalendars(rows) {
  return rows.filter((data) => toStr(data.ota_name) && toStr(data.ical_url) && toBoolean(data.is_active) === true).map((data) => ({
    ota_name: toStr(data.ota_name),
    ical_url: toStr(data.ical_url),
    is_active: true
  }));
}
export function toAllOtaCalendars(rows) {
  return rows.filter((data) => toStr(data.ota_name)).map((data) => ({
    ota_name: toStr(data.ota_name),
    ical_url: toStr(data.ical_url),
    is_active: toBoolean(data.is_active)
    // ค่าจริงจากชีต ไม่ fix เป็น true
  }));
}
export function getAllOtaCalendarsForAdmin() {
  return toAllOtaCalendars(readSheetRows(getSpreadsheet(), "ota_calendars").map((r) => r.data));
}
export function getOtaCalendars() {
  return getCached("ota_calendars", () => toOtaCalendars(readSheetRows(getSpreadsheet(), "ota_calendars").map((r) => r.data)));
}
export function getAllBookingServices() {
  return getCached("all_booking_services", () => {
    const rows = readSheetRows(getSpreadsheet(), "booking_services");
    return rows.map(({ data }) => ({
      booking_code: toStr(data.booking_code),
      booking_id: toStr(data.booking_id),
      service_id: toStr(data.service_id),
      service_name_snapshot: toStr(data.service_name_snapshot),
      qty: toNumber(data.qty),
      unit_price_snapshot: toNumber(data.unit_price_snapshot),
      nights_applied: toNumber(data.nights_applied),
      guests_applied: toNumber(data.guests_applied),
      line_total: toNumber(data.line_total)
    }));
  });
}

// src/core/bookingLogic.ts