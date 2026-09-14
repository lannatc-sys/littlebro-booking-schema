import { ok } from '../core/apiContract';

export function maskIcalUrl(url) {
  return url ? `[iCal URL \u0E16\u0E39\u0E01\u0E1B\u0E34\u0E14\u0E1A\u0E31\u0E07 \u2014 ${url.length} \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23]` : "";
}
export function oneLinePreview(s, maxLen = 150) {
  return String(s).replace(/[\r\n\t]+/g, " ").substring(0, maxLen);
}
export function checkOtaUrls() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("ota_calendars");
  if (!sheet) {
    return [{
      ota_name: "(\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E41\u0E17\u0E47\u0E1A)",
      ok: false,
      summary: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E41\u0E17\u0E47\u0E1A ota_calendars \u0E43\u0E19\u0E0A\u0E35\u0E15\u0E19\u0E35\u0E49",
      details: ["\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E41\u0E17\u0E47\u0E1A ota_calendars \u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C ota_name / ical_url / is_active \u0E01\u0E48\u0E2D\u0E19"]
    }];
  }
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) {
    return [{
      ota_name: "(\u0E27\u0E48\u0E32\u0E07)",
      ok: false,
      summary: "\u0E41\u0E17\u0E47\u0E1A ota_calendars \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
      details: []
    }];
  }
  const range = sheet.getRange(1, 1, lastRow, lastCol);
  const values = range.getValues();
  const formulas = range.getFormulas();
  const richText = range.getRichTextValues();
  const headers = values[0].map(String);
  const nameIdx = headers.indexOf("ota_name");
  const urlIdx = headers.indexOf("ical_url");
  const activeIdx = headers.indexOf("is_active");
  if (nameIdx === -1 || urlIdx === -1) {
    return [{
      ota_name: "(\u0E2B\u0E31\u0E27\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E1C\u0E34\u0E14)",
      ok: false,
      summary: "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C ota_name \u0E41\u0E25\u0E30 ical_url",
      details: [`\u0E2B\u0E31\u0E27\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E17\u0E35\u0E48\u0E40\u0E08\u0E2D: ${headers.join(", ")}`]
    }];
  }
  const results = [];
  for (let i = 1; i < values.length; i++) {
    const name = String(values[i][nameIdx] || "").trim();
    const url = String(values[i][urlIdx] == null ? "" : values[i][urlIdx]);
    if (!name && !url.trim()) continue;
    const details = [];
    const label = name || "(\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E0A\u0E37\u0E48\u0E2D)";
    details.push(`===== ${label} =====`);
    details.push(`is_active = ${activeIdx === -1 ? "(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C)" : JSON.stringify(values[i][activeIdx])}`);
    details.push(`\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27 URL = ${url.length} \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23`);
    details.push(`URL (\u0E1B\u0E34\u0E14\u0E1A\u0E31\u0E07 token) = ${maskIcalUrl(url)}`);
    const formula = formulas[i][urlIdx];
    if (formula) {
      details.push(`\u{1F534} \u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E39\u0E15\u0E23 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 -> \u0E2D\u0E48\u0E32\u0E19\u0E04\u0E48\u0E32\u0E44\u0E14\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E14\u0E07 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 URL \u0E08\u0E23\u0E34\u0E07`);
      details.push(`   \u0E2A\u0E39\u0E15\u0E23: ${oneLinePreview(formula)}`);
      results.push({
        ota_name: label,
        ok: false,
        summary: "\u{1F534} \u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E39\u0E15\u0E23 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 URL \u2014 \u0E41\u0E01\u0E49\u0E17\u0E35\u0E48\u0E0A\u0E35\u0E15",
        details
      });
      continue;
    }
    let hiddenLink = null;
    try {
      const rt = richText[i][urlIdx];
      hiddenLink = rt ? rt.getLinkUrl() : null;
    } catch (_e) {
    }
    if (hiddenLink) {
      details.push("\u{1F534} \u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E40\u0E1B\u0E47\u0E19 hyperlink \u0E17\u0E35\u0E48\u0E0B\u0E48\u0E2D\u0E19 URL \u0E44\u0E27\u0E49\u0E2B\u0E25\u0E31\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21");
      details.push(`   URL \u0E17\u0E35\u0E48\u0E0B\u0E48\u0E2D\u0E19\u0E2D\u0E22\u0E39\u0E48 (\u0E1B\u0E34\u0E14\u0E1A\u0E31\u0E07\u0E41\u0E25\u0E49\u0E27) = ${maskIcalUrl(hiddenLink)}`);
      details.push("   \u0E27\u0E34\u0E18\u0E35\u0E41\u0E01\u0E49: \u0E27\u0E32\u0E07 URL \u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E25\u0E49\u0E27\u0E19 (Paste special > Values only)");
      results.push({
        ota_name: label,
        ok: false,
        summary: "\u{1F534} \u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E40\u0E1B\u0E47\u0E19 hyperlink \u0E0B\u0E48\u0E2D\u0E19 URL \u2014 \u0E41\u0E01\u0E49\u0E17\u0E35\u0E48\u0E0A\u0E35\u0E15",
        details
      });
      continue;
    }
    if (url !== url.trim()) details.push("\u26A0\uFE0F \u0E21\u0E35\u0E0A\u0E48\u0E2D\u0E07\u0E27\u0E48\u0E32\u0E07/\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E43\u0E2B\u0E21\u0E48 \u0E2B\u0E31\u0E27\u0E2B\u0E23\u0E37\u0E2D\u0E17\u0E49\u0E32\u0E22 URL");
    if (/[\r\n]/.test(url)) details.push("\u{1F534} \u0E21\u0E35\u0E01\u0E32\u0E23\u0E02\u0E36\u0E49\u0E19\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E43\u0E2B\u0E21\u0E48\u0E01\u0E25\u0E32\u0E07 URL (copy \u0E21\u0E32\u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A)");
    if (url.indexOf("...") !== -1) details.push('\u{1F534} \u0E21\u0E35 "..." \u0E43\u0E19 URL = copy \u0E21\u0E32\u0E08\u0E32\u0E01\u0E17\u0E35\u0E48\u0E17\u0E35\u0E48\u0E15\u0E31\u0E14\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21');
    if (/^webcal:/i.test(url)) {
      details.push("\u{1F534} \u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 webcal:// \u0E0B\u0E36\u0E48\u0E07 UrlFetchApp \u0E43\u0E0A\u0E49\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49");
      details.push("   \u0E27\u0E34\u0E18\u0E35\u0E41\u0E01\u0E49: \u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19 webcal:// \u0E40\u0E1B\u0E47\u0E19 https:// \u0E15\u0E23\u0E07 \u0E46 \u0E43\u0E0A\u0E49\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22");
      results.push({
        ota_name: label,
        ok: false,
        summary: "\u{1F534} URL \u0E40\u0E1B\u0E47\u0E19 webcal:// \u2014 \u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19 https:// \u0E17\u0E35\u0E48\u0E0A\u0E35\u0E15",
        details
      });
      continue;
    }
    if (!/^https?:\/\//i.test(url)) {
      details.push("\u{1F534} \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 http:// \u0E2B\u0E23\u0E37\u0E2D https:// \u2014 \u0E22\u0E34\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49");
      results.push({
        ota_name: label,
        ok: false,
        summary: "\u{1F534} \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 URL \u0E17\u0E35\u0E48\u0E22\u0E34\u0E07\u0E44\u0E14\u0E49 \u2014 \u0E41\u0E01\u0E49\u0E17\u0E35\u0E48\u0E0A\u0E35\u0E15",
        details
      });
      continue;
    }
    try {
      const res = UrlFetchApp.fetch(url.trim(), {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LittleBroBot/1.0)",
          "Accept": "text/calendar, text/plain, */*"
        }
      });
      const code = res.getResponseCode();
      const body = res.getContentText();
      const isCalendar = body.toUpperCase().indexOf("BEGIN:VCALENDAR") !== -1;
      const eventCount = (body.match(/BEGIN:VEVENT/gi) || []).length;
      const looksHtml = /^\s*<(!DOCTYPE|html)/i.test(body);
      let contentType = "(\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38)";
      try {
        const hs = res.getAllHeaders();
        contentType = hs["Content-Type"] || hs["content-type"] || "(\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38)";
      } catch (_e) {
      }
      details.push(`code = ${code}`);
      details.push(`Content-Type = ${contentType}`);
      details.push(`\u0E02\u0E19\u0E32\u0E14 body = ${body.length} \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23`);
      details.push(`\u0E40\u0E1B\u0E47\u0E19\u0E44\u0E1F\u0E25\u0E4C\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19\u0E44\u0E2B\u0E21 = ${isCalendar ? "\u0E43\u0E0A\u0E48 \u2705" : "\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 \u{1F534}"}`);
      details.push(`\u0E08\u0E33\u0E19\u0E27\u0E19 VEVENT = ${eventCount}`);
      if (looksHtml) details.push("\u{1F534} body \u0E40\u0E1B\u0E47\u0E19 HTML \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 .ics (\u0E19\u0E48\u0E32\u0E08\u0E30\u0E42\u0E14\u0E19\u0E40\u0E14\u0E49\u0E07\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32 login/error)");
      details.push(`150 \u0E15\u0E31\u0E27\u0E41\u0E23\u0E01: ${oneLinePreview(body)}`);
      if (code === 200 && isCalendar) {
        results.push({
          ota_name: label,
          ok: true,
          summary: `\u2705 \u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E44\u0E14\u0E49 (${eventCount} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07)`,
          details
        });
      } else if (code === 200 && looksHtml) {
        results.push({
          ota_name: label,
          ok: false,
          summary: "\u{1F534} code 200 \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 .ics \u2014 \u0E25\u0E34\u0E07\u0E01\u0E4C\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38 \u0E02\u0E2D\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E43\u0E2B\u0E21\u0E48\u0E08\u0E32\u0E01 OTA",
          details
        });
      } else if (code === 401 || code === 403) {
        results.push({
          ota_name: label,
          ok: false,
          summary: `\u{1F534} code ${code} \u2014 token \u0E16\u0E39\u0E01\u0E40\u0E1E\u0E34\u0E01\u0E16\u0E2D\u0E19 \u0E02\u0E2D\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E43\u0E2B\u0E21\u0E48\u0E08\u0E32\u0E01 OTA`,
          details
        });
      } else if (code === 404) {
        results.push({
          ota_name: label,
          ok: false,
          summary: "\u{1F534} code 404 \u2014 \u0E25\u0E34\u0E07\u0E01\u0E4C\u0E1C\u0E34\u0E14\u0E2B\u0E23\u0E37\u0E2D copy \u0E21\u0E32\u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A",
          details
        });
      } else if (code === 429) {
        results.push({
          ota_name: label,
          ok: false,
          summary: "\u{1F534} code 429 \u2014 \u0E42\u0E14\u0E19\u0E08\u0E33\u0E01\u0E31\u0E14\u0E08\u0E33\u0E19\u0E27\u0E19\u0E04\u0E23\u0E31\u0E49\u0E07 \u0E23\u0E2D\u0E2A\u0E31\u0E01\u0E1E\u0E31\u0E01\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48",
          details
        });
      } else {
        results.push({
          ota_name: label,
          ok: false,
          summary: `\u{1F534} code ${code}${isCalendar ? "" : " \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E44\u0E1F\u0E25\u0E4C\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19"}`,
          details
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      details.push(`\u{1F534} fetch \u0E42\u0E22\u0E19 exception (\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 HTTP error): ${msg}`);
      details.push("   \u0E21\u0E31\u0E01\u0E40\u0E01\u0E34\u0E14\u0E08\u0E32\u0E01 scheme \u0E1C\u0E34\u0E14 \u0E42\u0E14\u0E40\u0E21\u0E19\u0E44\u0E21\u0E48\u0E21\u0E35\u0E08\u0E23\u0E34\u0E07 \u0E2B\u0E23\u0E37\u0E2D timeout");
      results.push({
        ota_name: label,
        ok: false,
        summary: `\u{1F534} \u0E22\u0E34\u0E07\u0E44\u0E21\u0E48\u0E2D\u0E2D\u0E01: ${oneLinePreview(msg, 60)}`,
        details
      });
    }
  }
  if (results.length === 0) {
    return [{
      ota_name: "(\u0E27\u0E48\u0E32\u0E07)",
      ok: false,
      summary: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E41\u0E16\u0E27 OTA \u0E17\u0E35\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E25\u0E22",
      details: []
    }];
  }
  return results;
}
