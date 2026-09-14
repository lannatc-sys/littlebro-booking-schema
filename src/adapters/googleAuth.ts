import { createSession } from './sessionService';
import { getAdminUsers } from './sheetsRepo';
import { isAdmin } from '../core/adminAuth';
import { ok } from '../core/apiContract';

export var CLIENT_ID = "711215510050-b23i110grafr63c5auj7f3du61fst9hb.apps.googleusercontent.com";
export function verifyGoogleCredential(credential) {
  try {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      return { ok: false, reason: "Invalid Google Token" };
    }
    const data = JSON.parse(response.getContentText());
    if (data.aud !== CLIENT_ID) {
      return { ok: false, reason: "Invalid Client ID (aud mismatch)" };
    }
    if (data.email_verified !== "true" && data.email_verified !== true) {
      return { ok: false, reason: "Email not verified by Google" };
    }
    const email = data.email;
    if (!isAdmin(email, getAdminUsers(true))) {
      return { ok: false, reason: "\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E23\u0E30\u0E1A\u0E1A Admin" };
    }
    const token = createSession(email);
    return { ok: true, token };
  } catch (err) {
    return { ok: false, reason: "Error: " + (err instanceof Error ? err.message : String(err)) };
  }
}
