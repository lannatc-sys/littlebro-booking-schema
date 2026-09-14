// src/router/getRouter.ts
import { ok, fail } from '../core/apiContract';
import { buildBlockedDatesICal } from '../adapters/icalExport';
import indexHtml from '../views/index.html?raw';
import adminHtml from '../views/admin.html?raw';

export function jsonOutput(data: any) {
  if (typeof ContentService !== 'undefined' && ContentService.createTextOutput) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
      ContentService.MimeType.JSON
    );
  }
  return { mimeType: 'application/json', content: JSON.stringify(data), data };
}

export function icalOutput(icsContent: string) {
  if (typeof ContentService !== 'undefined' && ContentService.createTextOutput) {
    return ContentService.createTextOutput(icsContent).setMimeType(
      ContentService.MimeType.ICAL
    );
  }
  return { mimeType: 'text/calendar', content: icsContent };
}

export function htmlOutput(html: string, title = 'Little Bro Booking') {
  if (typeof HtmlService !== 'undefined' && HtmlService.createHtmlOutput) {
    return HtmlService.createHtmlOutput(html)
      .setTitle(title)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }
  return { mimeType: 'text/html', title, content: html };
}

export function dispatchGet(e: any, appVersion = '1.0.0') {
  try {
    const params = e?.parameter || {};
    const action = params.action;
    const page = params.page || params.view;

    // 1. Health check endpoint
    if (action === 'health') {
      return jsonOutput(ok({ status: 'ok', version: appVersion }));
    }

    // 2. iCalendar feed export
    if (action === 'ical') {
      if (typeof PropertiesService !== 'undefined' && PropertiesService.getScriptProperties) {
        const requiredToken = PropertiesService.getScriptProperties().getProperty('ICAL_EXPORT_TOKEN');
        if (requiredToken && params.token !== requiredToken) {
          return jsonOutput(fail('FORBIDDEN', 'token ไม่ถูกต้อง'));
        }
      }
      return icalOutput(buildBlockedDatesICal());
    }

    // 3. Admin View
    if (page === 'admin') {
      return htmlOutput(adminHtml, 'Admin Dashboard - Little Bro Booking');
    }

    // 4. Default: Customer Booking View
    return htmlOutput(indexHtml, 'Little Bro Mae Hong Son - จองห้องพักออนไลน์');
  } catch (err) {
    console.error('dispatchGet error:', err instanceof Error ? err.message : String(err));
    return jsonOutput(fail('INTERNAL', 'เกิดข้อผิดพลาดในระบบ'));
  }
}
