import { writeAuditLog } from './extraServiceAdmin';
import { clearCache, getOtaCalendars, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';
import { planOtaImport, selectOtaRowsForCalendar } from '../core/icalImport';
import { isICalendarDocument, parseICal } from '../core/icalParser';

export var OTA_SOURCE = "ota";
export function readOtaConfigs() {
  try {
    return getOtaCalendars().map((c) => ({ name: c.ota_name, url: c.ical_url }));
  } catch {
    return [];
  }
}
export function cellToYmd3(cell, timeZone) {
  return cell instanceof Date ? Utilities.formatDate(cell, timeZone, "yyyy-MM-dd") : String(cell).trim();
}
export function writeSyncLog(spreadsheet, otaName, status, message, nowStr) {
  const sheet = spreadsheet.getSheetByName("ical_sync_log");
  if (!sheet) return;
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const nameIdx = headers.indexOf("ota_name");
  if (nameIdx === -1) return;
  const setCol = (row, col, val) => {
    const idx = headers.indexOf(col);
    if (idx !== -1) row[idx] = val;
  };
  let targetRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][nameIdx]) === otaName) {
      targetRow = i + 1;
      break;
    }
  }
  if (targetRow === -1) {
    const row = new Array(headers.length).fill("");
    setCol(row, "id", Utilities.getUuid());
    setCol(row, "ota_name", otaName);
    setCol(row, "last_import_at", nowStr);
    setCol(row, "last_sync_at", nowStr);
    setCol(row, "status", status);
    setCol(row, "message", message);
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, headers.length).setValues([row]);
  } else {
    const setCell = (col, val) => {
      const idx = headers.indexOf(col);
      if (idx !== -1) sheet.getRange(targetRow, idx + 1).setValue(val);
    };
    setCell("last_import_at", nowStr);
    setCell("last_sync_at", nowStr);
    setCell("status", status);
    setCell("message", message);
  }
}
export function importOtaCalendars() {
  const configs = readOtaConfigs();
  const result = { ok: true, imported: [] };
  if (configs.length === 0) return result;
  const fetched = [];
  for (const cfg of configs) {
    try {
      const res = UrlFetchApp.fetch(cfg.url, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LittleBroBot/1.0)",
          "Accept": "text/calendar, text/plain, */*"
        }
      });
      const code = res.getResponseCode();
      if (code < 200 || code >= 300) {
        fetched.push({ name: cfg.name, events: null, isCalendar: false, error: `HTTP ${code}` });
        continue;
      }
      const raw = res.getContentText();
      const events = parseICal(raw);
      const rawPreview = raw.length > 0 ? raw.slice(0, 120) : "(\u0E27\u0E48\u0E32\u0E07)";
      fetched.push({ name: cfg.name, events, isCalendar: isICalendarDocument(raw), rawPreview });
    } catch (err) {
      fetched.push({
        name: cfg.name,
        events: null,
        isCalendar: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(3e4)) {
    return { ok: false, imported: [{ ota_name: "(all)", added: 0, removed: 0, status: "error", message: "\u0E23\u0E30\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 (lock)" }] };
  }
  try {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const nowStr = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
    const sheet = spreadsheet.getSheetByName("blocked_dates");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 blocked_dates");
    let touched = false;
    for (const f of fetched) {
      if (f.events === null) {
        const errMsg = f.error || "fetch \u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
        writeSyncLog(spreadsheet, f.name, "error", errMsg, nowStr);
        result.imported.push({ ota_name: f.name, added: 0, removed: 0, status: "error", message: errMsg });
        result.ok = false;
        continue;
      }
      if (f.events.length === 0 && !f.isCalendar) {
        const preview = f.rawPreview || "(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)";
        const warnMsg = `response \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E44\u0E1F\u0E25\u0E4C\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19 \u2014 \u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22: ${preview}`;
        writeSyncLog(spreadsheet, f.name, "error", warnMsg, nowStr);
        result.imported.push({ ota_name: f.name, added: 0, removed: 0, status: "error", message: warnMsg });
        result.ok = false;
        continue;
      }
      const values = sheet.getDataRange().getValues();
      const headers = values[0].map(String);
      const dateIdx = headers.indexOf("date");
      const sourceIdx = headers.indexOf("source");
      const uidIdx = headers.indexOf("ota_uid");
      const reasonIdx = headers.indexOf("reason");
      if (dateIdx === -1 || sourceIdx === -1 || uidIdx === -1 || reasonIdx === -1) {
        throw new Error("blocked_dates \u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C date/source/ota_uid/reason");
      }
      const blockedRows = [];
      for (let i = 1; i < values.length; i++) {
        blockedRows.push({
          rowIndex: i + 1,
          date: cellToYmd3(values[i][dateIdx], timeZone),
          source: String(values[i][sourceIdx]),
          reason: String(values[i][reasonIdx]),
          ota_uid: String(values[i][uidIdx]).trim()
        });
      }
      const existingOta = selectOtaRowsForCalendar(blockedRows, f.name);
      const plan = planOtaImport(f.events, existingOta);
      for (const rowIndex of plan.rowsToDelete) {
        sheet.deleteRow(rowIndex);
      }
      if (plan.toAdd.length > 0) {
        const newRows = plan.toAdd.map((night) => headers.map((h) => {
          switch (h) {
            case "id":
              return Utilities.getUuid();
            case "date":
              return night.date;
            case "source":
              return OTA_SOURCE;
            case "ota_uid":
              return night.ota_uid;
            case "reason":
              return f.name;
            case "created_at":
              return nowStr;
            default:
              return "";
          }
        }));
        sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
      }
      if (plan.toAdd.length > 0 || plan.rowsToDelete.length > 0) touched = true;
      const msg = `\u0E40\u0E1E\u0E34\u0E48\u0E21 ${plan.toAdd.length} / \u0E25\u0E1A ${plan.rowsToDelete.length} \u0E04\u0E37\u0E19 (\u0E23\u0E27\u0E21\u0E04\u0E27\u0E23\u0E1A\u0E25\u0E47\u0E2D\u0E01 ${plan.desiredNightCount})`;
      writeSyncLog(spreadsheet, f.name, "success", msg, nowStr);
      result.imported.push({ ota_name: f.name, added: plan.toAdd.length, removed: plan.rowsToDelete.length, status: "success", message: msg });
    }
    if (touched) {
      clearCache("blocked_dates");
      clearCache("blocked_dates_detailed");
      clearCache("ical_sync_log");
      const summary = result.imported.map((r) => `${r.ota_name}:+${r.added}/-${r.removed}`).join(", ");
      writeAuditLog("IMPORT_OTA", "blocked_date", "ota_import", `OTA import \u2014 ${summary}`);
    } else {
      clearCache("ical_sync_log");
    }
    return result;
  } catch (err) {
    return { ok: false, imported: [{ ota_name: "(all)", added: 0, removed: 0, status: "error", message: err instanceof Error ? err.message : String(err) }] };
  } finally {
    lock.releaseLock();
  }
}
