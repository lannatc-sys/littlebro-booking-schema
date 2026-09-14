import { writeAuditLog } from './extraServiceAdmin';
import { clearCache, getRooms, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';
import { expandDateRangeInclusive, isValidYmd } from '../core/dateRange';

export function safeSheetText5(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
export function resolvePrimaryRoomId() {
  const rooms = getRooms();
  if (rooms.length === 0) return null;
  const active = rooms.find((r) => r.status === "active");
  return (active || rooms[0]).id;
}
export function cellToYmd2(cell, timeZone) {
  return cell instanceof Date ? Utilities.formatDate(cell, timeZone, "yyyy-MM-dd") : String(cell).trim();
}
export function setDailyPriceRange(d1, d2, price, minNights, description) {
  if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
  if (typeof price !== "number" || !isFinite(price) || price <= 0) {
    return { ok: false, reason: "\u0E23\u0E32\u0E04\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0" };
  }
  const minN = typeof minNights === "number" && isFinite(minNights) && minNights > 0 ? Math.floor(minNights) : 0;
  const targetDates = expandDateRangeInclusive(d1, d2);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
  try {
    const roomId = resolvePrimaryRoomId();
    if (!roomId) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" };
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const sheet = spreadsheet.getSheetByName("custom_daily_prices");
    if (!sheet) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 custom_daily_prices" };
    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(String);
    const dateColIdx = headers.indexOf("date");
    const roomColIdx = headers.indexOf("room_id");
    const priceColIdx = headers.indexOf("price");
    const minNightsColIdx = headers.indexOf("min_nights");
    const descColIdx = headers.indexOf("description");
    const updatedColIdx = headers.indexOf("updated_at");
    if (dateColIdx === -1 || roomColIdx === -1 || priceColIdx === -1) {
      return { ok: false, reason: "\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E0A\u0E35\u0E15 custom_daily_prices \u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A" };
    }
    const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
    const targetSet = new Set(targetDates);
    const existingRowByDate = /* @__PURE__ */ new Map();
    for (let i = 1; i < values.length; i++) {
      const cell = values[i][dateColIdx];
      if (!cell || String(values[i][roomColIdx]).trim() !== roomId) continue;
      const ymd2 = cellToYmd2(cell, timeZone);
      if (targetSet.has(ymd2)) existingRowByDate.set(ymd2, i + 1);
    }
    const newRows = [];
    for (const date of targetDates) {
      const existingRow = existingRowByDate.get(date);
      if (existingRow) {
        sheet.getRange(existingRow, priceColIdx + 1).setValue(price);
        if (minNightsColIdx !== -1) sheet.getRange(existingRow, minNightsColIdx + 1).setValue(minN);
        if (descColIdx !== -1) sheet.getRange(existingRow, descColIdx + 1).setValue(safeSheetText5(description || ""));
        if (updatedColIdx !== -1) sheet.getRange(existingRow, updatedColIdx + 1).setValue(now);
      } else {
        newRows.push(headers.map((h) => {
          switch (h) {
            case "date":
              return date;
            case "room_id":
              return roomId;
            case "price":
              return price;
            case "min_nights":
              return minN;
            case "description":
              return safeSheetText5(description || "");
            case "updated_at":
              return now;
            default:
              return "";
          }
        }));
      }
    }
    if (newRows.length > 0) sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
    clearCache("custom_daily_prices");
    writeAuditLog("SET_DAILY_PRICE", "daily_price", `${d1}..${d2}`, `Set price ${price} for ${targetDates.length} day(s) ${d1}..${d2}${minN ? ` (min ${minN} nights)` : ""}${description ? ` \u2014 ${description}` : ""}`);
    return { ok: true, affected: targetDates.length };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  } finally {
    lock.releaseLock();
  }
}
export function removeDailyPriceRange(d1, d2) {
  if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
  const targetSet = new Set(expandDateRangeInclusive(d1, d2));
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
  try {
    const roomId = resolvePrimaryRoomId();
    if (!roomId) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" };
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const sheet = spreadsheet.getSheetByName("custom_daily_prices");
    if (!sheet) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 custom_daily_prices" };
    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(String);
    const dateColIdx = headers.indexOf("date");
    const roomColIdx = headers.indexOf("room_id");
    if (dateColIdx === -1 || roomColIdx === -1) return { ok: false, reason: "\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E0A\u0E35\u0E15 custom_daily_prices \u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A" };
    const rowsToDelete = [];
    for (let i = 1; i < values.length; i++) {
      const cell = values[i][dateColIdx];
      if (!cell || String(values[i][roomColIdx]).trim() !== roomId) continue;
      if (targetSet.has(cellToYmd2(cell, timeZone))) rowsToDelete.push(i + 1);
    }
    if (rowsToDelete.length === 0) return { ok: true, affected: 0 };
    for (let k = rowsToDelete.length - 1; k >= 0; k--) sheet.deleteRow(rowsToDelete[k]);
    clearCache("custom_daily_prices");
    writeAuditLog("REMOVE_DAILY_PRICE", "daily_price", `${d1}..${d2}`, `Removed special price for ${rowsToDelete.length} day(s) ${d1}..${d2}`);
    return { ok: true, affected: rowsToDelete.length };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  } finally {
    lock.releaseLock();
  }
}
