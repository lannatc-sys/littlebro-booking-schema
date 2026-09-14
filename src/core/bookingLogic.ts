export function filterEditableFields(fields, whitelist) {
  const out = {};
  for (const key of whitelist) {
    if (!Object.prototype.hasOwnProperty.call(fields, key)) continue;
    const raw = fields[key];
    out[key] = raw == null ? "" : String(raw);
  }
  return out;
}
export function buildBookingRow(headers, values) {
  const row = new Array(headers.length).fill("");
  for (const [colName, val] of Object.entries(values)) {
    const idx = headers.indexOf(colName);
    if (idx !== -1) {
      row[idx] = val;
    } else {
      throw new Error(`\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C "${colName}"`);
    }
  }
  return row;
}
export function formatBookingDateParts(date) {
  return {
    yy: String(date.getFullYear()).slice(-2),
    mm: String(date.getMonth() + 1).padStart(2, "0"),
    // getMonth() เป็น 0-indexed ต้อง +1
    dd: String(date.getDate()).padStart(2, "0")
  };
}
export function nextYearlyBookingCode(existingCodes, yy, mm, dd) {
  const yearPrefix = `LB${yy}`;
  let maxRunning = 0;
  for (const code of existingCodes) {
    if (code.length === 12 && code.startsWith(yearPrefix)) {
      const running = parseInt(code.slice(8), 10);
      if (!isNaN(running) && running > maxRunning) {
        maxRunning = running;
      }
    }
  }
  const nextRunning = String(maxRunning + 1).padStart(4, "0");
  return `LB${yy}${mm}${dd}${nextRunning}`;
}
export function pickExpiredBookings(rows, nowStr, timeZoneFormatter) {
  const expiredIds = [];
  for (const row of rows) {
    if (row.status === "pending" && row.hold_expires_at) {
      let holdStr = "";
      if (row.hold_expires_at instanceof Date) {
        holdStr = timeZoneFormatter ? timeZoneFormatter(row.hold_expires_at) : row.hold_expires_at.toISOString();
      } else {
        holdStr = String(row.hold_expires_at).trim();
      }
      if (holdStr < nowStr) {
        expiredIds.push(row.id);
      }
    }
  }
  return expiredIds;
}
export function sheetRowsToDelete(blockedRows, expiredIds) {
  const indices = [];
  for (let i = blockedRows.length - 1; i >= 1; i--) {
    const bId = String(blockedRows[i].booking_id);
    if (expiredIds.has(bId)) {
      indices.push(i + 1);
    }
  }
  return indices;
}
