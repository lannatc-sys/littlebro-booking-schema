export var MS_PER_DAY = 864e5;
export var YMD_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export function ymdToDayNumber(ymd2) {
  if (typeof ymd2 !== "string" || !YMD_PATTERN.test(ymd2)) {
    throw new RangeError(`\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: "${ymd2}" (\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 yyyy-mm-dd)`);
  }
  const year = Number(ymd2.slice(0, 4));
  const month = Number(ymd2.slice(5, 7));
  const day = Number(ymd2.slice(8, 10));
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
  if (dayNumberToYmd(dayNumber) !== ymd2) {
    throw new RangeError(`\u0E44\u0E21\u0E48\u0E21\u0E35\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E19\u0E35\u0E49\u0E2D\u0E22\u0E39\u0E48\u0E08\u0E23\u0E34\u0E07: "${ymd2}"`);
  }
  return dayNumber;
}
export function dayNumberToYmd(dayNumber) {
  const d = new Date(dayNumber * MS_PER_DAY);
  const yyyy = String(d.getUTCFullYear()).padStart(4, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
export function isValidYmd(ymd2) {
  try {
    ymdToDayNumber(ymd2);
    return true;
  } catch {
    return false;
  }
}
export function nightsBetween(checkIn, checkOut) {
  return ymdToDayNumber(checkOut) - ymdToDayNumber(checkIn);
}
export function expandNights(checkIn, checkOut) {
  const start = ymdToDayNumber(checkIn);
  const end = ymdToDayNumber(checkOut);
  if (end <= start) {
    throw new RangeError(
      `\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C\u0E15\u0E49\u0E2D\u0E07\u0E2B\u0E25\u0E31\u0E07\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19 (\u0E44\u0E14\u0E49 check_in=${checkIn}, check_out=${checkOut})`
    );
  }
  const nights = [];
  for (let d = start; d < end; d++) {
    nights.push(dayNumberToYmd(d));
  }
  return nights;
}
export function findConflicts(checkIn, checkOut, blockedDates) {
  const blocked = new Set(blockedDates);
  return expandNights(checkIn, checkOut).filter((night) => blocked.has(night));
}
export function expandDateRangeInclusive(d1, d2) {
  const a = ymdToDayNumber(d1);
  const b = ymdToDayNumber(d2);
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  const days = [];
  for (let d = start; d <= end; d++) {
    days.push(dayNumberToYmd(d));
  }
  return days;
}
export function consolidateBlockedRanges(blockedDays) {
  const nums = Array.from(
    new Set(
      blockedDays.filter((d) => isValidYmd(d)).map((d) => ymdToDayNumber(d))
    )
  ).sort((a, b) => a - b);
  const ranges = [];
  let rangeStart = null;
  let prev = null;
  for (const n of nums) {
    if (rangeStart === null) {
      rangeStart = n;
      prev = n;
      continue;
    }
    if (n === prev + 1) {
      prev = n;
    } else {
      ranges.push({ start: dayNumberToYmd(rangeStart), end: dayNumberToYmd(prev + 1) });
      rangeStart = n;
      prev = n;
    }
  }
  if (rangeStart !== null && prev !== null) {
    ranges.push({ start: dayNumberToYmd(rangeStart), end: dayNumberToYmd(prev + 1) });
  }
  return ranges;
}
