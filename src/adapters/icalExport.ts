import { getBlockedDates } from './sheetsRepo';
import { consolidateBlockedRanges } from '../core/dateRange';
import { buildICal } from '../core/icalParser';

export function buildBlockedDatesICal(propertyName = "Little Bro Mae Hong Son") {
  const blockedDays = getBlockedDates();
  const ranges = consolidateBlockedRanges(blockedDays);
  const events = ranges.map((r) => ({
    uid: `blocked-${r.start}-${r.end}@littlebro`,
    start: r.start,
    end: r.end,
    // exclusive อยู่แล้วจาก consolidateBlockedRanges — ตรงกับ DTEND ของ iCal
    summary: "Unavailable"
  }));
  return buildICal(events, propertyName);
}
