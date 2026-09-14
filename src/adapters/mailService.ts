import { getRooms, getSettings, getSpreadsheet } from './sheetsRepo';
import { buildPromptPayPayload } from '../core/promptpay';

export var SLIP_RECEIVED_SENT_COLUMN = "confirmation_email_sent_at";
export var PAYMENT_CONFIRMED_SENT_COLUMN = "payment_confirmed_email_sent_at";
export var PAYMENT_REQUEST_SENT_COLUMN = "payment_request_email_sent_at";
export var MIN_REMAINING_QUOTA = 5;
export var QR_IMAGE_SIZE = 300;
export var EMAIL_STYLE = `
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; background-color: #f9f9f9; margin: 0; padding: 20px; }
    .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 8px; border: 1px solid #eeeeee; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #2c3e50; padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 500; }
    .content { padding: 30px; }
    .status-badge-pending { background-color: #f39c12; color: white; padding: 6px 15px; border-radius: 20px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
    .status-badge { background-color: #2ecc71; color: white; padding: 6px 15px; border-radius: 20px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
    .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
    .details-table td { padding: 10px; border-bottom: 1px solid #eeeeee; }
    .details-table td.label { font-weight: bold; color: #555555; width: 40%; }
    .price-box { background-color: #f8f9fa; border-left: 4px solid #f39c12; padding: 20px; margin-top: 20px; border-radius: 0 4px 4px 0; }
    .price-box.confirmed { border-left-color: #2c3e50; padding: 15px; }
    .qr-container { text-align: center; margin-top: 15px; }
    .qr-code { width: 220px; max-width: 100%; height: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px; background-color: #ffffff; margin: 10px auto; display: block; }
    .contact-box { background-color: #f5f6fa; border: 1px dashed #cbd5e1; padding: 15px; margin-top: 25px; border-radius: 6px; }
    .contact-title { font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 14px; }
    .contact-item { font-size: 13px; color: #475569; margin: 4px 0; }
    .footer { background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777777; }
`;
export function findBookingRow(bookingsSheet, requiredColumns, bookingCode) {
  const data = bookingsSheet.getDataRange().getValues();
  const headers = data[0].map(String);
  const colIdx = {};
  for (const col of requiredColumns) {
    const idx = headers.indexOf(col);
    if (idx === -1) {
      throw new Error(
        col.endsWith("_sent_at") ? `\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C "${col}" \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings \u2014 \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E19\u0E35\u0E49\u0E40\u0E2D\u0E07\u0E01\u0E48\u0E2D\u0E19\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 (\u0E40\u0E01\u0E47\u0E1A timestamp \u0E15\u0E2D\u0E19\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25 \u0E43\u0E0A\u0E49\u0E01\u0E31\u0E19\u0E2A\u0E48\u0E07\u0E0B\u0E49\u0E33)` : `\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C "${col}" \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings`
      );
    }
    colIdx[col] = idx;
  }
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][colIdx.booking_code]) === bookingCode) {
      return { rowNumber: i + 1, row: data[i], colIdx };
    }
  }
  return null;
}
export function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
export function formatMoney(n) {
  return n.toLocaleString("en-US");
}
export function getRoomName(roomId, lang) {
  const room = getRooms().find((r) => r.id === roomId);
  if (!room) return roomId;
  return lang === "en" ? room.name_en : room.name_th;
}
export function getServiceLinesText(bookingId) {
  const sheet = getSpreadsheet().getSheetByName("booking_services");
  if (!sheet) return "";
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return "";
  const data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = data[0].map(String);
  const bookingIdIdx = headers.indexOf("booking_id");
  const nameIdx = headers.indexOf("service_name_snapshot");
  const qtyIdx = headers.indexOf("qty");
  if (bookingIdIdx === -1 || nameIdx === -1 || qtyIdx === -1) return "";
  const lines = [];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][bookingIdIdx]) === bookingId) {
      const name = String(data[i][nameIdx] || "");
      const qty = Number(data[i][qtyIdx]) || 1;
      if (name) lines.push(qty > 1 ? `${name} x${qty}` : name);
    }
  }
  return lines.join(", ");
}
export function buildStayDescription(roomId, bookingId, lang) {
  const roomName = getRoomName(roomId, lang);
  const addons = getServiceLinesText(bookingId);
  return addons ? `${roomName} + ${addons}` : roomName;
}
export function maskPromptPayPayloadForLog(payload) {
  return payload.replace(/\d{9,}/g, (digits) => "*".repeat(digits.length));
}
export function generateQrPngBlob(promptpayPayload) {
  try {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${QR_IMAGE_SIZE}x${QR_IMAGE_SIZE}&data=${encodeURIComponent(promptpayPayload)}`;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      console.error(
        `generateQrPngBlob: qrserver \u0E15\u0E2D\u0E1A HTTP ${response.getResponseCode()} \u2014 payload (\u0E1B\u0E34\u0E14\u0E1A\u0E31\u0E07 ID \u0E41\u0E25\u0E49\u0E27): ${maskPromptPayPayloadForLog(promptpayPayload)}`
      );
      return null;
    }
    return response.getBlob().setName("promptpay-qr.png");
  } catch (err) {
    console.error(
      "generateQrPngBlob error:",
      err instanceof Error ? err.message : "unknown error",
      "\u2014 payload (\u0E1B\u0E34\u0E14\u0E1A\u0E31\u0E07 ID \u0E41\u0E25\u0E49\u0E27):",
      maskPromptPayPayloadForLog(promptpayPayload)
    );
    return null;
  }
}
export function buildContactBoxHtml(settings, lang, includeGps) {
  const lines = [];
  if (settings.contact_phone) {
    lines.push(`<div class="contact-item"><strong>${lang === "en" ? "Phone" : "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C"}:</strong> ${escapeHtml(settings.contact_phone)}</div>`);
  }
  if (settings.facebook_url) {
    lines.push(`<div class="contact-item"><strong>Facebook:</strong> ${escapeHtml(settings.facebook_url)}</div>`);
  }
  if (includeGps && settings.latitude && settings.longitude) {
    lines.push(`<div class="contact-item"><strong>${lang === "en" ? "GPS" : "\u0E1E\u0E34\u0E01\u0E31\u0E14 GPS"}:</strong> ${settings.latitude}, ${settings.longitude}</div>`);
  }
  if (lines.length === 0) return "";
  return `<div class="contact-box"><div class="contact-title">${lang === "en" ? "Contact Us" : "\u0E0A\u0E48\u0E2D\u0E07\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D (Contact Us)"}</div>${lines.join("")}</div>`;
}
export function sendPaymentRequestEmail(bookingCode) {
  const spreadsheet = getSpreadsheet();
  const bookingsSheet = spreadsheet.getSheetByName("bookings");
  if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
  const found = findBookingRow(
    bookingsSheet,
    [
      "booking_code",
      "guest_email",
      "guest_name",
      "check_in",
      "check_out",
      "room_id",
      "total_price",
      "currency",
      "lang",
      PAYMENT_REQUEST_SENT_COLUMN
    ],
    bookingCode
  );
  if (!found) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
  const { rowNumber, row, colIdx } = found;
  if (row[colIdx[PAYMENT_REQUEST_SENT_COLUMN]]) {
    return false;
  }
  if (MailApp.getRemainingDailyQuota() < MIN_REMAINING_QUOTA) {
    console.error(`sendPaymentRequestEmail: \u0E42\u0E04\u0E27\u0E15\u0E32\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32 ${MIN_REMAINING_QUOTA} \u0E09\u0E1A\u0E31\u0E1A \u0E02\u0E49\u0E32\u0E21\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E43\u0E2B\u0E49 booking_code=${bookingCode}`);
    return false;
  }
  const timeZone = spreadsheet.getSpreadsheetTimeZone();
  const settings = getSettings();
  const guestEmail = String(row[colIdx.guest_email] || "");
  const guestName = escapeHtml(String(row[colIdx.guest_name] || ""));
  const checkIn = String(row[colIdx.check_in]);
  const checkOut = String(row[colIdx.check_out]);
  const roomId = String(row[colIdx.room_id] || "");
  const totalPrice = Number(row[colIdx.total_price]);
  const currency = String(row[colIdx.currency] || settings.currency);
  const lang = row[colIdx.lang] === "en" ? "en" : "th";
  const roomName = escapeHtml(getRoomName(roomId, lang));
  const subject = lang === "en" ? `Booking ${bookingCode} \u2014 please complete payment` : `\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07 ${bookingCode} \u2014 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19`;
  let qrPayload = null;
  try {
    qrPayload = buildPromptPayPayload(settings.promptpay_id, totalPrice);
  } catch (err) {
    console.error("sendPaymentRequestEmail: buildPromptPayPayload error:", err instanceof Error ? err.message : "unknown error");
  }
  const qrBlob = qrPayload ? generateQrPngBlob(qrPayload) : null;
  const qrImageTag = qrBlob ? '<img src="cid:promptpayQr" alt="PromptPay QR" class="qr-code">' : lang === "en" ? '<p style="color:#999;font-size:13px;">(QR code unavailable right now \u2014 please contact us for payment details)</p>' : '<p style="color:#999;font-size:13px;">(\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E41\u0E2A\u0E14\u0E07 QR \u0E44\u0E14\u0E49\u0E43\u0E19\u0E02\u0E13\u0E30\u0E19\u0E35\u0E49 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19)</p>';
  const plainBody = lang === "en" ? `Dear ${row[colIdx.guest_name]},

Your booking is held. Please complete payment to confirm it.

Booking code: ${bookingCode}
Check-in: ${checkIn} (14:00)
Check-out: ${checkOut} (12:00)
Room: ${roomId ? getRoomName(roomId, "en") : ""}
Total: ${formatMoney(totalPrice)} ${currency}

PromptPay: ${settings.promptpay_id}

After payment, please upload your slip on our website or contact us via Facebook to confirm your booking.

Thank you.` : `\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E04\u0E38\u0E13${row[colIdx.guest_name]}

\u0E02\u0E2D\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E17\u0E48\u0E32\u0E19\u0E43\u0E2B\u0E49\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E19\u0E43\u0E08\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E01\u0E31\u0E1A\u0E40\u0E23\u0E32 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E17\u0E48\u0E32\u0E19\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C \u0E23\u0E1A\u0E01\u0E27\u0E19\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E15\u0E32\u0E21\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E14\u0E31\u0E07\u0E19\u0E35\u0E49:

\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07: ${bookingCode}
\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19: ${checkIn} (14:00 \u0E19.)
\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C: ${checkOut} (12:00 \u0E19.)
\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14: ${getRoomName(roomId, "th")}
\u0E22\u0E2D\u0E14\u0E40\u0E07\u0E34\u0E19\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E0A\u0E33\u0E23\u0E30: ${formatMoney(totalPrice)} \u0E1A\u0E32\u0E17

\u0E2A\u0E41\u0E01\u0E19\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E1C\u0E48\u0E32\u0E19\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C (PromptPay)
\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C: ${settings.promptpay_id}

\u0E2B\u0E25\u0E31\u0E07\u0E08\u0E32\u0E01\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27 \u0E23\u0E1A\u0E01\u0E27\u0E19\u0E2A\u0E48\u0E07\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19 (\u0E2A\u0E25\u0E34\u0E1B) \u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49 \u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E48\u0E07\u0E17\u0E32\u0E07 Facebook \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E04\u0E23\u0E31\u0E1A

\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E04\u0E23\u0E31\u0E1A`;
  const htmlBody = lang === "en" ? `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${EMAIL_STYLE}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Little Bro Mae Hong Son</h1></div>
    <div class="content">
      <div class="status-badge-pending">\u23F3 Awaiting Payment to Confirm Booking</div>
      <p>Dear <strong>${guestName}</strong>,</p>
      <p>Thank you for choosing us. To complete your booking, please make payment using the details below:</p>
      <table class="details-table">
        <tr><td class="label">Booking Code:</td><td style="font-weight:bold;color:#e74c3c">${bookingCode}</td></tr>
        <tr><td class="label">Check-in:</td><td>${checkIn} (14:00)</td></tr>
        <tr><td class="label">Check-out:</td><td>${checkOut} (12:00)</td></tr>
        <tr><td class="label">Details:</td><td>${roomName}</td></tr>
      </table>
      <div class="price-box">
        <span style="font-size:14px;color:#666">Amount Due:</span><br>
        <span style="font-size:22px;font-weight:bold;color:#2c3e50">${formatMoney(totalPrice)} ${currency}</span>
        <hr style="border:0; border-top:1px solid #ddd; margin: 15px 0;">
        <div style="text-align:center;">
          <span style="font-size:15px;color:#2c3e50;font-weight:bold;">Scan to pay via PromptPay (any banking app)</span>
          <div class="qr-container">
            ${qrImageTag}
            <span style="font-size:14px;color:#333;font-weight:bold;">PromptPay: ${settings.promptpay_id}</span>
          </div>
        </div>
      </div>
      <p style="margin-top:20px;font-size:14px;color:#333;">After payment, please upload your slip on our website, or send it to us via Facebook to confirm your booking.</p>
      ${buildContactBoxHtml(settings, "en", false)}
    </div>
    <div class="footer"><p>This is an automated notification \u2014 please do not reply directly to this email.</p></div>
  </div>
</body></html>` : `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${EMAIL_STYLE}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Little Bro Mae Hong Son</h1></div>
    <div class="content">
      <div class="status-badge-pending">\u23F3 \u0E23\u0E2D\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07</div>
      <p>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E04\u0E38\u0E13 <strong>${guestName}</strong>,</p>
      <p>\u0E02\u0E2D\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E17\u0E48\u0E32\u0E19\u0E43\u0E2B\u0E49\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E19\u0E43\u0E08\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E01\u0E31\u0E1A\u0E40\u0E23\u0E32 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E17\u0E48\u0E32\u0E19\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C \u0E23\u0E1A\u0E01\u0E27\u0E19\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E15\u0E32\u0E21\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E14\u0E31\u0E07\u0E19\u0E35\u0E49:</p>
      <table class="details-table">
        <tr><td class="label">\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07:</td><td style="font-weight:bold;color:#e74c3c">${bookingCode}</td></tr>
        <tr><td class="label">\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19:</td><td>${checkIn} (14:00 \u0E19.)</td></tr>
        <tr><td class="label">\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C:</td><td>${checkOut} (12:00 \u0E19.)</td></tr>
        <tr><td class="label">\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14:</td><td>${roomName}</td></tr>
      </table>
      <div class="price-box">
        <span style="font-size:14px;color:#666">\u0E22\u0E2D\u0E14\u0E40\u0E07\u0E34\u0E19\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E0A\u0E33\u0E23\u0E30:</span><br>
        <span style="font-size:22px;font-weight:bold;color:#2c3e50">${formatMoney(totalPrice)} \u0E1A\u0E32\u0E17</span>
        <hr style="border:0; border-top:1px solid #ddd; margin: 15px 0;">
        <div style="text-align:center;">
          <span style="font-size:15px;color:#2c3e50;font-weight:bold;">\u0E2A\u0E41\u0E01\u0E19\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E1C\u0E48\u0E32\u0E19\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C (PromptPay)</span>
          <div class="qr-container">
            ${qrImageTag}
            <span style="font-size:14px;color:#333;font-weight:bold;">\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C: ${settings.promptpay_id}</span>
          </div>
        </div>
      </div>
      <p style="margin-top:20px;font-size:14px;color:#333;">\u0E2B\u0E25\u0E31\u0E07\u0E08\u0E32\u0E01\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27 \u0E23\u0E1A\u0E01\u0E27\u0E19\u0E2A\u0E48\u0E07\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19 (\u0E2A\u0E25\u0E34\u0E1B) \u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49 \u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E48\u0E07\u0E17\u0E32\u0E07 Facebook \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E04\u0E23\u0E31\u0E1A</p>
      ${buildContactBoxHtml(settings, "th", false)}
    </div>
    <div class="footer"><p>\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E09\u0E1A\u0E31\u0E1A\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A</p></div>
  </div>
</body></html>`;
  const mailOptions = {
    htmlBody,
    name: "Little Bro Mae Hong Son",
    replyTo: "littlebromhs@gmail.com",
    cc: settings.notify_email ? `${settings.notify_email},lanntc@gmail.com` : "lanntc@gmail.com"
  };
  if (qrBlob) {
    mailOptions.inlineImages = { promptpayQr: qrBlob };
  }
  MailApp.sendEmail(guestEmail, subject, plainBody, mailOptions);
  const sentAt = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
  bookingsSheet.getRange(rowNumber, colIdx[PAYMENT_REQUEST_SENT_COLUMN] + 1).setValue(sentAt);
  return true;
}
export function sendSlipReceivedEmail(bookingCode) {
  const spreadsheet = getSpreadsheet();
  const bookingsSheet = spreadsheet.getSheetByName("bookings");
  if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
  const found = findBookingRow(
    bookingsSheet,
    ["booking_code", "guest_email", "guest_name", "check_in", "check_out", "total_price", "currency", "lang", SLIP_RECEIVED_SENT_COLUMN],
    bookingCode
  );
  if (!found) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
  const { rowNumber, row, colIdx } = found;
  if (row[colIdx[SLIP_RECEIVED_SENT_COLUMN]]) {
    return false;
  }
  if (MailApp.getRemainingDailyQuota() < MIN_REMAINING_QUOTA) {
    console.error(`sendSlipReceivedEmail: \u0E42\u0E04\u0E27\u0E15\u0E32\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32 ${MIN_REMAINING_QUOTA} \u0E09\u0E1A\u0E31\u0E1A \u0E02\u0E49\u0E32\u0E21\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E43\u0E2B\u0E49 booking_code=${bookingCode}`);
    return false;
  }
  const settings = getSettings();
  const guestEmail = String(row[colIdx.guest_email] || "");
  const guestName = String(row[colIdx.guest_name] || "");
  const checkIn = String(row[colIdx.check_in]);
  const checkOut = String(row[colIdx.check_out]);
  const totalPrice = Number(row[colIdx.total_price]);
  const currency = String(row[colIdx.currency] || settings.currency);
  const lang = row[colIdx.lang] === "en" ? "en" : "th";
  const subject = lang === "en" ? `Booking ${bookingCode} \u2014 payment slip received` : `\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07 ${bookingCode} \u2014 \u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2A\u0E25\u0E34\u0E1B\u0E41\u0E25\u0E49\u0E27`;
  const body = lang === "en" ? `Dear ${guestName},

We have received your payment slip. We will confirm within 1 hour.

Booking code: ${bookingCode}
Check-in: ${checkIn}
Check-out: ${checkOut}
Total: ${totalPrice} ${currency}

Thank you.` : `\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E38\u0E13${guestName}

\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2A\u0E25\u0E34\u0E1B\u0E41\u0E25\u0E49\u0E27 \u0E08\u0E30\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E20\u0E32\u0E22\u0E43\u0E19 1 \u0E0A\u0E21.

\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07: ${bookingCode}
\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19: ${checkIn}
\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C: ${checkOut}
\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21: ${totalPrice} ${currency}

\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E04\u0E48\u0E30`;
  MailApp.sendEmail(guestEmail, subject, body, {
    name: "Little Bro Mae Hong Son",
    replyTo: "littlebromhs@gmail.com",
    cc: settings.notify_email ? `${settings.notify_email},lanntc@gmail.com` : "lanntc@gmail.com"
  });
  const timeZone = spreadsheet.getSpreadsheetTimeZone();
  const sentAt = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
  bookingsSheet.getRange(rowNumber, colIdx[SLIP_RECEIVED_SENT_COLUMN] + 1).setValue(sentAt);
  return true;
}
export function sendPaymentConfirmedEmail(bookingCode) {
  const spreadsheet = getSpreadsheet();
  const bookingsSheet = spreadsheet.getSheetByName("bookings");
  if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
  const found = findBookingRow(
    bookingsSheet,
    [
      "booking_code",
      "guest_email",
      "guest_name",
      "check_in",
      "check_out",
      "room_id",
      "id",
      "total_price",
      "currency",
      "lang",
      PAYMENT_CONFIRMED_SENT_COLUMN
    ],
    bookingCode
  );
  if (!found) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
  const { rowNumber, row, colIdx } = found;
  if (row[colIdx[PAYMENT_CONFIRMED_SENT_COLUMN]]) {
    return false;
  }
  if (MailApp.getRemainingDailyQuota() < MIN_REMAINING_QUOTA) {
    console.error(`sendPaymentConfirmedEmail: \u0E42\u0E04\u0E27\u0E15\u0E32\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32 ${MIN_REMAINING_QUOTA} \u0E09\u0E1A\u0E31\u0E1A \u0E02\u0E49\u0E32\u0E21\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E43\u0E2B\u0E49 booking_code=${bookingCode}`);
    return false;
  }
  const settings = getSettings();
  const guestEmail = String(row[colIdx.guest_email] || "");
  const guestName = escapeHtml(String(row[colIdx.guest_name] || ""));
  const checkIn = String(row[colIdx.check_in]);
  const checkOut = String(row[colIdx.check_out]);
  const roomId = String(row[colIdx.room_id] || "");
  const bookingId = String(row[colIdx.id] || "");
  const totalPrice = Number(row[colIdx.total_price]);
  const currency = String(row[colIdx.currency] || settings.currency);
  const lang = row[colIdx.lang] === "en" ? "en" : "th";
  const stayDescription = escapeHtml(buildStayDescription(roomId, bookingId, lang));
  const subject = lang === "en" ? `Booking ${bookingCode} \u2014 payment confirmed` : `\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07 ${bookingCode} \u2014 \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08`;
  const plainBody = lang === "en" ? `Dear ${row[colIdx.guest_name]},

Your payment has been verified. Your booking is confirmed!

Booking code: ${bookingCode}
Check-in: ${checkIn} (after 14:00)
Check-out: ${checkOut} (before 12:00)
Details: ${buildStayDescription(roomId, bookingId, "en")}
Total paid: ${formatMoney(totalPrice)} ${currency}

We look forward to hosting you. Thank you.` : `\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E04\u0E38\u0E13${row[colIdx.guest_name]}

\u0E17\u0E32\u0E07\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27 \u0E19\u0E35\u0E48\u0E04\u0E37\u0E2D\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13:

\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07: ${bookingCode}
\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19: ${checkIn} (\u0E2B\u0E25\u0E31\u0E07 14:00 \u0E19.)
\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C: ${checkOut} (\u0E01\u0E48\u0E2D\u0E19 12:00 \u0E19.)
\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14: ${buildStayDescription(roomId, bookingId, "th")}
\u0E22\u0E2D\u0E14\u0E40\u0E07\u0E34\u0E19\u0E17\u0E35\u0E48\u0E0A\u0E33\u0E23\u0E30\u0E41\u0E25\u0E49\u0E27: ${formatMoney(totalPrice)} \u0E1A\u0E32\u0E17

* \u0E42\u0E1B\u0E23\u0E14\u0E41\u0E2A\u0E14\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49\u0E15\u0E48\u0E2D\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E17\u0E33\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19 \u0E41\u0E25\u0E49\u0E27\u0E1E\u0E1A\u0E01\u0E31\u0E19\u0E27\u0E31\u0E19\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E19\u0E30\u0E04\u0E23\u0E31\u0E1A!`;
  const htmlBody = lang === "en" ? `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${EMAIL_STYLE}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Little Bro Mae Hong Son</h1></div>
    <div class="content">
      <div class="status-badge">\u2713 Booking Confirmed</div>
      <p>Dear <strong>${guestName}</strong>,</p>
      <p>We have verified your payment. Here are your booking details:</p>
      <table class="details-table">
        <tr><td class="label">Booking Code:</td><td style="font-weight:bold;color:#e74c3c">${bookingCode}</td></tr>
        <tr><td class="label">Check-in:</td><td>${checkIn} (after 14:00)</td></tr>
        <tr><td class="label">Check-out:</td><td>${checkOut} (before 12:00)</td></tr>
        <tr><td class="label">Details:</td><td>${stayDescription}</td></tr>
      </table>
      <div class="price-box confirmed">
        <span style="font-size:14px;color:#666">Amount Paid:</span><br>
        <span style="font-size:22px;font-weight:bold;color:#2c3e50">${formatMoney(totalPrice)} ${currency}</span>
      </div>
      ${buildContactBoxHtml(settings, "en", true)}
      <p style="margin-top:25px;font-size:13px;color:#7f8c8d">* Please keep this email as proof of booking. See you on check-in day!</p>
    </div>
    <div class="footer"><p>This is an automated notification \u2014 please do not reply directly to this email.</p></div>
  </div>
</body></html>` : `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${EMAIL_STYLE}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Little Bro Mae Hong Son</h1></div>
    <div class="content">
      <div class="status-badge">\u2714 \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27</div>
      <p>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E04\u0E38\u0E13 <strong>${guestName}</strong>,</p>
      <p>\u0E17\u0E32\u0E07\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27 \u0E19\u0E35\u0E48\u0E04\u0E37\u0E2D\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13:</p>
      <table class="details-table">
        <tr><td class="label">\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07:</td><td style="font-weight:bold;color:#e74c3c">${bookingCode}</td></tr>
        <tr><td class="label">\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19:</td><td>${checkIn} (\u0E2B\u0E25\u0E31\u0E07 14:00 \u0E19.)</td></tr>
        <tr><td class="label">\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C:</td><td>${checkOut} (\u0E01\u0E48\u0E2D\u0E19 12:00 \u0E19.)</td></tr>
        <tr><td class="label">\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14:</td><td>${stayDescription}</td></tr>
      </table>
      <div class="price-box confirmed">
        <span style="font-size:14px;color:#666">\u0E22\u0E2D\u0E14\u0E40\u0E07\u0E34\u0E19\u0E17\u0E35\u0E48\u0E0A\u0E33\u0E23\u0E30\u0E41\u0E25\u0E49\u0E27:</span><br>
        <span style="font-size:22px;font-weight:bold;color:#2c3e50">${formatMoney(totalPrice)} \u0E1A\u0E32\u0E17</span>
      </div>
      ${buildContactBoxHtml(settings, "th", true)}
      <p style="margin-top:25px;font-size:13px;color:#7f8c8d">* \u0E42\u0E1B\u0E23\u0E14\u0E41\u0E2A\u0E14\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49\u0E15\u0E48\u0E2D\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E17\u0E33\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19 \u0E41\u0E25\u0E49\u0E27\u0E1E\u0E1A\u0E01\u0E31\u0E19\u0E27\u0E31\u0E19\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E19\u0E30\u0E04\u0E23\u0E31\u0E1A!</p>
    </div>
    <div class="footer"><p>\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E09\u0E1A\u0E31\u0E1A\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A</p></div>
  </div>
</body></html>`;
  MailApp.sendEmail(guestEmail, subject, plainBody, {
    htmlBody,
    name: "Little Bro Mae Hong Son",
    replyTo: "littlebromhs@gmail.com",
    cc: settings.notify_email ? `${settings.notify_email},lanntc@gmail.com` : "lanntc@gmail.com"
  });
  const timeZone = spreadsheet.getSpreadsheetTimeZone();
  const sentAt = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
  bookingsSheet.getRange(rowNumber, colIdx[PAYMENT_CONFIRMED_SENT_COLUMN] + 1).setValue(sentAt);
  return true;
}
export function verifyMailServiceSetup() {
  const spreadsheet = getSpreadsheet();
  const bookingsSheet = spreadsheet.getSheetByName("bookings");
  if (!bookingsSheet) {
    throw new Error('verifyMailServiceSetup: \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 "bookings" \u2014 \u0E15\u0E23\u0E27\u0E08\u0E27\u0E48\u0E32\u0E40\u0E1B\u0E34\u0E14 spreadsheet \u0E16\u0E39\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07');
  }
  const lastColumn = bookingsSheet.getLastColumn();
  const headers = lastColumn > 0 ? bookingsSheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String) : [];
  const requiredColumns = [
    "booking_code",
    "guest_email",
    "guest_name",
    "check_in",
    "check_out",
    "room_id",
    "id",
    "total_price",
    "currency",
    "lang",
    SLIP_RECEIVED_SENT_COLUMN,
    PAYMENT_CONFIRMED_SENT_COLUMN,
    PAYMENT_REQUEST_SENT_COLUMN
  ];
  const missing = requiredColumns.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(
      `verifyMailServiceSetup: \u0E23\u0E30\u0E1A\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u2014 \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E15\u0E48\u0E2D\u0E44\u0E1B\u0E19\u0E35\u0E49\u0E43\u0E19\u0E0A\u0E35\u0E15 "bookings": ${missing.join(", ")}
\u0E27\u0E34\u0E18\u0E35\u0E41\u0E01\u0E49: \u0E40\u0E1B\u0E34\u0E14\u0E0A\u0E35\u0E15 bookings \u0E41\u0E25\u0E49\u0E27\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E17\u0E35\u0E48\u0E02\u0E32\u0E14\u0E40\u0E1B\u0E47\u0E19 header \u0E43\u0E19\u0E41\u0E16\u0E27\u0E1A\u0E19\u0E2A\u0E38\u0E14 (\u0E0A\u0E37\u0E48\u0E2D\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E15\u0E31\u0E27\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E40\u0E25\u0E47\u0E01-\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E1B\u0E4A\u0E30) \u0E08\u0E32\u0E01\u0E19\u0E31\u0E49\u0E19\u0E23\u0E31\u0E19\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E19\u0E35\u0E49\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E27\u0E48\u0E32\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27`
    );
  }
  Logger.log("verifyMailServiceSetup: \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E21\u0E35\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E15\u0E31\u0E27\u0E43\u0E19\u0E0A\u0E35\u0E15 bookings \u2705");
}
