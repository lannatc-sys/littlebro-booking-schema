import { clearCache, getSpreadsheet } from './sheetsRepo';
import { ok } from '../core/apiContract';

export function safeSheetText3(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
export function writeAuditLog(action, targetType, targetId, detail) {
  const sheet = getSpreadsheet().getSheetByName("audit_log");
  if (!sheet) return;
  const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
  const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
  let email = "system";
  try {
    email = Session.getActiveUser().getEmail() || "system";
  } catch (_e) {
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
export function createExtraService(data) {
  try {
    if (data.price !== void 0 && (!Number.isFinite(Number(data.price)) || Number(data.price) < 0)) {
      return { ok: false, reason: "Invalid service price" };
    }
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("extra_services");
    if (!sheet) return { ok: false, reason: "Sheet extra_services not found" };
    const newId = Utilities.getUuid();
    const row = [
      newId,
      // 1: id
      safeSheetText3(data.name_th || ""),
      // 2: name_th
      safeSheetText3(data.name_en || data.name_th || ""),
      // 3: name_en
      safeSheetText3(data.description_th || ""),
      // 4: description_th
      safeSheetText3(data.description_en || data.description_th || ""),
      // 5: description_en
      data.price || 0,
      // 6: price
      data.multiply_by_nights === true,
      // 7: multiply_by_nights
      data.multiply_by_guests === true,
      // 8: multiply_by_guests
      "",
      // 9: unit_label_th
      "",
      // 10: unit_label_en
      typeof data.max_qty === "number" && data.max_qty > 0 ? data.max_qty : 10,
      // 11: max_qty
      "",
      // 12: icon
      data.is_active !== void 0 ? data.is_active : true,
      // 13: is_active
      data.sort_order || 0
      // 14: sort_order
    ];
    sheet.appendRow(row);
    writeAuditLog("CREATE_EXTRA_SERVICE", "extra_service", newId, `Created service: ${data.name_th}`);
    clearCache("extra_services");
    clearCache("catalog");
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}
export function updateExtraService(id, data) {
  try {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("extra_services");
    if (!sheet) return { ok: false, reason: "Sheet extra_services not found" };
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2) return { ok: false, reason: "No data" };
    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map((h) => String(h));
    const idIdx = headers.indexOf("id");
    const nameThIdx = headers.indexOf("name_th");
    const nameEnIdx = headers.indexOf("name_en");
    const descThIdx = headers.indexOf("description_th");
    const descEnIdx = headers.indexOf("description_en");
    const priceIdx = headers.indexOf("price");
    const multiplyByNightsIdx = headers.indexOf("multiply_by_nights");
    const multiplyByGuestsIdx = headers.indexOf("multiply_by_guests");
    const isActiveIdx = headers.indexOf("is_active");
    const sortOrderIdx = headers.indexOf("sort_order");
    let targetRow = -1;
    let oldName = "";
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][idIdx]) === id) {
        targetRow = i + 1;
        oldName = String(values[i][nameThIdx]);
        break;
      }
    }
    if (targetRow === -1) return { ok: false, reason: "Service not found" };
    if (data.name_th !== void 0) {
      sheet.getRange(targetRow, nameThIdx + 1).setValue(safeSheetText3(data.name_th));
    }
    if (data.name_en !== void 0) {
      sheet.getRange(targetRow, nameEnIdx + 1).setValue(safeSheetText3(data.name_en));
    }
    if (data.description_th !== void 0) {
      sheet.getRange(targetRow, descThIdx + 1).setValue(safeSheetText3(data.description_th));
    }
    if (data.description_en !== void 0) {
      sheet.getRange(targetRow, descEnIdx + 1).setValue(safeSheetText3(data.description_en));
    }
    if (data.price !== void 0) {
      if (!Number.isFinite(Number(data.price)) || Number(data.price) < 0) {
        return { ok: false, reason: "Invalid service price" };
      }
      sheet.getRange(targetRow, priceIdx + 1).setValue(data.price);
    }
    if (data.multiply_by_nights !== void 0) {
      sheet.getRange(targetRow, multiplyByNightsIdx + 1).setValue(data.multiply_by_nights === true);
    }
    if (data.multiply_by_guests !== void 0) {
      sheet.getRange(targetRow, multiplyByGuestsIdx + 1).setValue(data.multiply_by_guests === true);
    }
    if (data.is_active !== void 0) {
      sheet.getRange(targetRow, isActiveIdx + 1).setValue(data.is_active);
    }
    if (data.sort_order !== void 0) {
      sheet.getRange(targetRow, sortOrderIdx + 1).setValue(data.sort_order);
    }
    writeAuditLog("UPDATE_EXTRA_SERVICE", "extra_service", id, `Updated service: ${oldName} (${id})`);
    clearCache("extra_services");
    clearCache("catalog");
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}
export function deleteExtraService(id) {
  try {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("extra_services");
    if (!sheet) return { ok: false, reason: "Sheet extra_services not found" };
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return { ok: false, reason: "No data" };
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const idIdx = headers.indexOf("id");
    const allRows = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
    let targetRow = -1;
    let serviceName = "";
    for (let i = 1; i < allRows.length; i++) {
      if (String(allRows[i][idIdx]) === id) {
        targetRow = i + 1;
        serviceName = String(allRows[i][headers.indexOf("name_th")]);
        break;
      }
    }
    if (targetRow === -1) return { ok: false, reason: "Service not found" };
    sheet.deleteRow(targetRow);
    writeAuditLog("DELETE_EXTRA_SERVICE", "extra_service", id, `Deleted service: ${serviceName} (${id})`);
    clearCache("extra_services");
    clearCache("catalog");
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}
