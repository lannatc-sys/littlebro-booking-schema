import { isValidYmd } from './dateRange';

export function unfoldLines(raw) {
  const lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const out = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("	")) && out.length > 0) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}
export function isICalendarDocument(raw) {
  return unfoldLines(raw).some(
    (line) => line.trim().toUpperCase().startsWith("BEGIN:VCALENDAR")
  );
}
export function parseLine(line) {
  const colon = line.indexOf(":");
  if (colon === -1) return null;
  const left = line.slice(0, colon);
  const value = line.slice(colon + 1).trim();
  const name = left.split(";")[0].toUpperCase();
  return { name, value };
}
export function parseICalDate(value) {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(value.trim());
  if (!m) return null;
  const ymd2 = `${m[1]}-${m[2]}-${m[3]}`;
  return isValidYmd(ymd2) ? ymd2 : null;
}
export function parseICal(raw) {
  if (!raw || typeof raw !== "string") return [];
  const lines = unfoldLines(raw);
  const events = [];
  let inEvent = false;
  let uid = "";
  let start = null;
  let end = null;
  let summary = "";
  let cancelled = false;
  const reset = () => {
    uid = "";
    start = null;
    end = null;
    summary = "";
    cancelled = false;
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "BEGIN:VEVENT") {
      inEvent = true;
      reset();
      continue;
    }
    if (trimmed === "END:VEVENT") {
      if (inEvent && uid && start && end && !cancelled) {
        events.push({ uid, start, end, summary });
      }
      inEvent = false;
      reset();
      continue;
    }
    if (!inEvent) continue;
    const parsed = parseLine(trimmed);
    if (!parsed) continue;
    switch (parsed.name) {
      case "UID":
        uid = parsed.value;
        break;
      case "DTSTART":
        start = parseICalDate(parsed.value);
        break;
      case "DTEND":
        end = parseICalDate(parsed.value);
        break;
      case "SUMMARY":
        summary = parsed.value.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1").trim();
        break;
      case "STATUS":
        if (parsed.value.toUpperCase() === "CANCELLED") cancelled = true;
        break;
    }
  }
  return events;
}
export function buildICal(ranges, propertyName = "Little Bro Mae Hong Son") {
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const compact = (ymd2) => ymd2.replace(/-/g, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Little Bro Booking//TH",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${propertyName}`
  ];
  for (const r of ranges) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${r.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(r.start)}`,
      `DTEND;VALUE=DATE:${compact(r.end)}`,
      `SUMMARY:${(r.summary ?? "Unavailable").replace(/([,;\\])/g, "\\$1")}`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
