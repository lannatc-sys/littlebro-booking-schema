// src/router/postRouter.ts
import { ok, fail, parseRequestBody } from '../core/apiContract';
import { validateAdminCredentials } from '../core/adminAuth';
import { getAdminUsers } from '../adapters/sheetsRepo';
import { createSession, destroySession, isValidToken, getSessionEmail } from '../adapters/sessionService';
import { jsonOutput } from './getRouter';

export const MAX_PAYLOAD_BYTES = 100 * 1024;
export const MAX_UPLOAD_SLIP_PAYLOAD_BYTES = 8 * 1024 * 1024;
export const RATE_LIMIT_WINDOW_SECONDS = 600;
export const RATE_LIMIT_MAX_REQUESTS = 20;

export function rateLimitCacheKey(action: string) {
  return `rateLimit:${action}:global`;
}

export function checkRateLimit(action: string) {
  if (typeof CacheService === 'undefined') return false;
  const current = Number(CacheService.getScriptCache().get(rateLimitCacheKey(action)) || '0');
  return current >= RATE_LIMIT_MAX_REQUESTS;
}

export function incrementRateLimit(action: string) {
  if (typeof CacheService === 'undefined') return;
  const cache = CacheService.getScriptCache();
  const key = rateLimitCacheKey(action);
  const current = Number(cache.get(key) || '0');
  cache.put(key, String(current + 1), RATE_LIMIT_WINDOW_SECONDS);
}

/**
 * Middleware to enforce Admin privileges via session token or active user email.
 */
export function requireAdmin(body: any) {
  if (body && typeof body === 'object') {
    const token = body.token;
    const sessionUser = typeof token === 'string' && isValidToken(token) ? getSessionEmail(token) : null;
    if (sessionUser) {
      const activeAdmins = getAdminUsers(true);
      const isAllowed = activeAdmins.some((a: any) => {
        const u = String(a.username || '').trim().toLowerCase();
        const e = String(a.email || '').trim().toLowerCase();
        const s = sessionUser.trim().toLowerCase();
        return (u === s || e === s) && (a.is_active === true || a.is_active === 'true' || a.is_active === 1);
      });
      if (isAllowed) return null;
    }
  }

  // Google Apps Script context fallback
  if (typeof Session !== 'undefined' && Session.getActiveUser) {
    try {
      const email = Session.getActiveUser().getEmail();
      if (email) {
        const activeAdmins = getAdminUsers();
        const isAllowed = activeAdmins.some((a: any) => {
          const e = String(a.email || '').trim().toLowerCase();
          return e === email.trim().toLowerCase() && (a.is_active === true || a.is_active === 'true' || a.is_active === 1);
        });
        if (isAllowed) return null;
      }
    } catch {}
  }

  return fail('FORBIDDEN', 'ไม่มีสิทธิ์เข้าถึงส่วนนี้');
}

/**
 * Handle admin login with Username + Password.
 */
export function handleAdminLogin(payload: any) {
  const raw = payload || {};
  const username = raw.username || raw.user || raw.email || '';
  const password = raw.password || raw.pass || '';

  if (!username || !password) {
    return fail('BAD_REQUEST', 'กรุณาระบุ Username และ Password');
  }

  const adminUsers = getAdminUsers(true);
  const validation = validateAdminCredentials(username, password, adminUsers);
  if (!validation.ok) {
    return fail('FORBIDDEN', validation.reason || 'Username หรือ Password ไม่ถูกต้อง');
  }

  const token = createSession(validation.admin.username || validation.admin.email);
  return ok({
    token,
    user: {
      username: validation.admin.username,
      email: validation.admin.email,
      role: validation.admin.role || 'admin',
    },
  });
}

/**
 * Handle admin logout.
 */
export function handleAdminLogout(payload: any) {
  const token = payload?.token;
  if (token) {
    destroySession(token);
  }
  return ok({ loggedOut: true });
}

/**
 * Dispatch POST requests based on action routing table.
 */
export function dispatchPost(e: any, handlers: Record<string, (payload: any) => any>) {
  try {
    const rawBody = e?.postData?.contents ?? '';

    // 1. Check max slip payload size
    if (rawBody.length > MAX_UPLOAD_SLIP_PAYLOAD_BYTES) {
      return jsonOutput(fail('BAD_REQUEST', 'ข้อมูลที่ส่งมามีขนาดใหญ่เกินไป'));
    }

    // 2. Parse JSON body
    const parsed = parseRequestBody(rawBody);
    if (!parsed.ok) {
      return jsonOutput(parsed);
    }

    const body = parsed.data || {};
    const action = body.action;

    // 3. Check regular payload size
    if (action !== 'uploadSlip' && rawBody.length > MAX_PAYLOAD_BYTES) {
      return jsonOutput(fail('BAD_REQUEST', 'ข้อมูลที่ส่งมามีขนาดใหญ่เกินไป'));
    }

    // 4. Rate-limit createBooking
    if (action === 'createBooking') {
      if (checkRateLimit('createBooking')) {
        return jsonOutput(fail('RATE_LIMITED', 'สร้างการจองบ่อยเกินไป กรุณาลองใหม่อีกครั้งภายหลัง'));
      }
      const handler = handlers['createBooking'];
      if (!handler) return jsonOutput(fail('BAD_REQUEST', 'ไม่พบ handler สำหรับการจอง'));
      const result = handler(body);
      if (result && result.ok) {
        incrementRateLimit('createBooking');
      }
      return jsonOutput(result);
    }

    // 5. Auth routes
    if (action === 'adminLogin') {
      return jsonOutput(handleAdminLogin(body));
    }
    if (action === 'adminLogout') {
      return jsonOutput(handleAdminLogout(body));
    }

    // 6. Admin Guarded Routes List
    const adminGuardedActions = new Set([
      'listBookings',
      'getSlip',
      'confirmBooking',
      'cancelBooking',
      'editBookingDetails',
      'getBookingDetails',
      'manageBookingService',
      'addServiceToBooking',
      'getAdminExtraServices',
      'createExtraService',
      'updateExtraService',
      'deleteExtraService',
      'blockDate',
      'unblockDate',
      'setDailyPrice',
      'removeDailyPrice',
      'getAdminDashboardData',
      'adminReportMonth',
      'listOtaCalendars',
      'getAdminOtaData',
      'syncOta',
    ]);

    if (adminGuardedActions.has(action)) {
      const forbidden = requireAdmin(body);
      if (forbidden) return jsonOutput(forbidden);
    }

    // 7. Route to handler
    const handler = handlers[action];
    if (typeof handler === 'function') {
      return jsonOutput(handler(body));
    }

    return jsonOutput(fail('BAD_REQUEST', `ไม่รู้จัก action "${action}"`));
  } catch (err) {
    console.error('dispatchPost error:', err instanceof Error ? err.message : String(err));
    return jsonOutput(fail('INTERNAL', 'เกิดข้อผิดพลาดในระบบ'));
  }
}
