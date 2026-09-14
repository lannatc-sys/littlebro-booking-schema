import { writeAuditLog } from './extraServiceAdmin';
import { clearCache, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';
import { expandDateRangeInclusive, isValidYmd } from '../core/dateRange';

export var ADMIN_SOURCE = "admin";
export function safeSheetText4(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
export function readBlockedSheet(spreadsheet) {
  const sheet = spreadsheet.getSheetByName("blocked_dates");
  if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 blocked_dates");
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const dateColIdx = headers.indexOf("date");
  const sourceColIdx = headers.indexOf("source");
  if (dateColIdx === -1) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C date \u0E43\u0E19\u0E0A\u0E35\u0E15 blocked_dates");
  return { sheet, values, headers, dateColIdx, sourceColIdx };
}
export function cellToYmd(cell, timeZone) {
  return cell instanceof Date ? Utilities.formatDate(cell, timeZone, "yyyy-MM-dd") : String(cell).trim();
}
export function blockDateRange(d1, d2, reason) {
  if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
  const targetDates = expandDateRangeInclusive(d1, d2);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
  try {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const { sheet, values, headers, dateColIdx, sourceColIdx } = readBlockedSheet(spreadsheet);
    const alreadyBlocked = /* @__PURE__ */ new Set();
    for (let i = 1; i < values.length; i++) {
      const cell = values[i][dateColIdx];
      if (!cell) continue;
      if (sourceColIdx !== -1 && String(values[i][sourceColIdx]).trim() !== ADMIN_SOURCE) continue;
      alreadyBlocked.add(cellToYmd(cell, timeZone));
    }
    const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
    const newRows = [];
    for (const date of targetDates) {
      if (alreadyBlocked.has(date)) continue;
      newRows.push(headers.map((h) => {
        switch (h) {
          case "id":
            return Utilities.getUuid();
          case "date":
            return date;
          case "source":
            return ADMIN_SOURCE;
          case "reason":
            return safeSheetText4(reason || "");
          case "created_at":
            return now;
          default:
            return "";
        }
      }));
    }
    if (newRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
      clearCache("blocked_dates");
      clearCache("blocked_dates_detailed");
      writeAuditLog("BLOCK_DATE", "blocked_date", `${d1}..${d2}`, `Admin blocked ${newRows.length} day(s) in ${d1}..${d2}${reason ? ` (${reason})` : ""}`);
    }
    return { ok: true, affected: newRows.length };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  } finally {
    lock.releaseLock();
  }
}
export function unblockDateRange(d1, d2) {
  if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
  const targetSet = new Set(expandDateRangeInclusive(d1, d2));
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
  try {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const { sheet, values, dateColIdx, sourceColIdx } = readBlockedSheet(spreadsheet);
    if (sourceColIdx === -1) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C source \u0E43\u0E19\u0E0A\u0E35\u0E15 blocked_dates" };
    const rowsToDelete = [];
    for (let i = 1; i < values.length; i++) {
      const cell = values[i][dateColIdx];
      if (!cell) continue;
      if (!targetSet.has(cellToYmd(cell, timeZone))) continue;
      if (String(values[i][sourceColIdx]).trim() === ADMIN_SOURCE) rowsToDelete.push(i + 1);
    }
    if (rowsToDelete.length === 0) return { ok: true, affected: 0 };
    for (let k = rowsToDelete.length - 1; k >= 0; k--) sheet.deleteRow(rowsToDelete[k]);
    clearCache("blocked_dates");
    clearCache("blocked_dates_detailed");
    writeAuditLog("UNBLOCK_DATE", "blocked_date", `${d1}..${d2}`, `Admin unblocked ${rowsToDelete.length} day(s) in ${d1}..${d2}`);
    return { ok: true, affected: rowsToDelete.length };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  } finally {
    lock.releaseLock();
  }
}
