import { expandNights } from './dateRange';

export function otaNightKey(date, otaUid) {
  return `${date}|${otaUid}`;
}
export function selectOtaRowsForCalendar(rows, otaName) {
  const target = otaName.trim().toLowerCase();
  if (!target) return [];
  return rows.filter((r) => r.source.trim().toLowerCase() === "ota" && r.reason.trim().toLowerCase() === target).map((r) => ({ rowIndex: r.rowIndex, date: r.date, ota_uid: r.ota_uid }));
}
export function planOtaImport(events, existing) {
  const desired = /* @__PURE__ */ new Map();
  for (const ev of events) {
    let nights;
    try {
      nights = expandNights(ev.start, ev.end);
    } catch {
      continue;
    }
    for (const date of nights) {
      desired.set(otaNightKey(date, ev.uid), { date, ota_uid: ev.uid });
    }
  }
  const existingKeys = /* @__PURE__ */ new Set();
  const rowsToDelete = [];
  for (const row of existing) {
    const key = otaNightKey(row.date, row.ota_uid);
    if (desired.has(key) && !existingKeys.has(key)) {
      existingKeys.add(key);
    } else {
      rowsToDelete.push(row.rowIndex);
    }
  }
  const toAdd = [];
  for (const [key, night] of desired) {
    if (!existingKeys.has(key)) toAdd.push(night);
  }
  rowsToDelete.sort((a, b) => b - a);
  return { toAdd, rowsToDelete, desiredNightCount: desired.size };
}
