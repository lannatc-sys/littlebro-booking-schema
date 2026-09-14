// src/main.ts
import { dispatchGet, jsonOutput, htmlOutput, icalOutput } from './router/getRouter';
import { dispatchPost } from './router/postRouter';
import { ok, fail, validateAvailabilityRequest, validateBookingRequest } from './core/apiContract';
import { findConflicts } from './core/dateRange';
import { calculateQuote } from './core/pricing';
import {
  getBlockedDates,
  getCatalog,
  getCustomDailyPrices,
  getExtraServices,
  getRooms,
  getSettings,
  getSpreadsheet,
  toBoolean,
  toNumber,
  toStr,
  toYmd,
} from './adapters/sheetsRepo';
import {
  createBooking,
  expirePendingHolds,
  updateBookingDetails,
  addServiceToBooking,
  debugCleanupTestData,
} from './adapters/bookingService';
import {
  sendPaymentRequestEmail,
  sendPaymentConfirmedEmail,
  sendSlipReceivedEmail,
  verifyMailServiceSetup,
} from './adapters/mailService';
import { getPaymentInfo, uploadSlip } from './adapters/paymentService';
import {
  listBookingsForAdmin,
  getSlipForAdmin,
} from './adapters/adminService';
import {
  confirmBookingByAdmin,
  cancelBookingByAdmin,
} from './adapters/adminActions';
import {
  createExtraService,
  updateExtraService,
  deleteExtraService,
} from './adapters/extraServiceAdmin';
import {
  blockDateRange,
  unblockDateRange,
} from './adapters/blockedDateAdmin';
import {
  setDailyPriceRange,
  removeDailyPriceRange,
} from './adapters/dailyPriceAdmin';
import {
  getBookingDetailsForAdmin,
  manageBookingService,
} from './adapters/serviceActions';
import { buildMonthlyReport } from './core/monthlyReport';
import { importOtaCalendars } from './adapters/icalImport';
import { checkOtaUrls } from './adapters/otaDiagnostics';

export const APP_VERSION = '1.0.0';

export function findRoom(roomId: string, rooms: any[]) {
  return rooms.find((r) => r.id === roomId);
}

// --- Request Handlers ---

export function handleAvailability(payload: any) {
  const result = validateAvailabilityRequest(payload);
  if (!result.valid) {
    return fail('BAD_REQUEST', 'ข้อมูลคำขอไม่ถูกต้อง', { errors: result.errors });
  }
  const { checkIn, checkOut } = result.value;
  const conflicts = findConflicts(checkIn, checkOut, getBlockedDates());
  if (conflicts.length > 0) {
    return fail('DATES_UNAVAILABLE', 'ช่วงวันที่เลือกไม่ว่าง', { conflicts });
  }
  return ok({ available: true });
}

export function handleQuote(payload: any) {
  const availability = validateAvailabilityRequest(payload);
  if (!availability.valid) {
    return fail('BAD_REQUEST', 'ข้อมูลคำขอไม่ถูกต้อง', { errors: availability.errors });
  }
  const raw = payload;
  const roomId = raw.roomId;
  if (typeof roomId !== 'string' || roomId.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ roomId');
  }
  const settings = getSettings();
  const room = findRoom(roomId, getRooms());
  if (!room) return fail('NOT_FOUND', 'ไม่พบห้องพักที่ระบุ');

  const selectionsRaw = raw.selections;
  const selections = Array.isArray(selectionsRaw) ? selectionsRaw : [];
  try {
    const quote = calculateQuote({
      checkIn: availability.value.checkIn,
      checkOut: availability.value.checkOut,
      guests: availability.value.guests,
      room,
      settings,
      selections,
      dailyPrices: getCustomDailyPrices(),
      services: getExtraServices(),
      lang: raw.lang === 'en' ? 'en' : settings.default_lang,
    });
    return ok(quote);
  } catch (err) {
    console.error('handleQuote error:', err instanceof Error ? err.message : 'unknown error');
    return fail('BAD_REQUEST', 'ข้อมูลที่ให้มาไม่สามารถคำนวณราคาได้');
  }
}

export function handleCreateBooking(payload: any) {
  const result = validateBookingRequest(payload);
  if (!result.valid) {
    return fail('BAD_REQUEST', 'ข้อมูลคำขอไม่ถูกต้อง', { errors: result.errors });
  }
  const room = findRoom(result.value.roomId, getRooms());
  if (!room) return fail('NOT_FOUND', 'ไม่พบห้องพักที่ระบุ');

  const booking = createBooking({
    checkIn: result.value.checkIn,
    checkOut: result.value.checkOut,
    guests: result.value.guests,
    roomId: result.value.roomId,
    selections: result.value.selections,
    customerName: result.value.customerName,
    customerEmail: result.value.customerEmail,
    customerPhone: result.value.customerPhone,
    arrivalTime: result.value.arrivalTime,
    specialRequests: result.value.specialRequests,
    lang: result.value.lang,
  });

  if (!booking.ok) {
    if (booking.reason === 'BUSY') {
      return fail('BUSY', 'ระบบกำลังประมวลผลรายการอื่นอยู่ กรุณาลองใหม่อีกครั้ง');
    }
    return fail('DATES_UNAVAILABLE', 'ช่วงวันที่เลือกเพิ่งถูกจองไปแล้ว', { conflicts: booking.conflicts });
  }

  try {
    sendPaymentRequestEmail(booking.booking_code);
  } catch (err) {
    console.error('sendPaymentRequestEmail error:', err instanceof Error ? err.message : 'unknown error');
  }

  return ok({ booking_code: booking.booking_code, quote: booking.quote });
}

export function handleGetCatalog() {
  return ok(getCatalog());
}

export function handleGetPaymentInfo(payload: any) {
  const raw = payload;
  const bookingCode = raw.bookingCode;
  if (typeof bookingCode !== 'string' || bookingCode.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ bookingCode');
  }
  const result = getPaymentInfo(bookingCode);
  if (!result.ok) {
    if (result.reason === 'HOLD_EXPIRED') {
      return fail('BAD_REQUEST', 'การจองนี้หมดเวลาแล้ว', { reason: 'HOLD_EXPIRED' });
    }
    return fail('NOT_FOUND', 'ไม่พบการจองรหัสนี้');
  }
  return ok(result.data);
}

export function handleConfirmBooking(payload: any) {
  const raw = payload;
  const bookingCode = raw.bookingCode;
  if (typeof bookingCode !== 'string' || bookingCode.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ bookingCode');
  }
  const result = confirmBookingByAdmin(bookingCode);
  if (!result.ok) {
    return fail('NOT_FOUND', 'ไม่พบการจองหรือการจองไม่อยู่ในสถานะที่ยืนยันได้');
  }
  return ok(result.data);
}

export function handleCancelBooking(payload: any) {
  const raw = payload;
  const bookingCode = raw.bookingCode;
  if (typeof bookingCode !== 'string' || bookingCode.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ bookingCode');
  }
  const reason = raw.reason ? String(raw.reason) : '';
  const result = cancelBookingByAdmin(bookingCode, reason);
  if (!result.ok) {
    return fail('NOT_FOUND', 'ไม่พบการจองรหัสนี้');
  }
  return ok(result.data);
}

export function handleEditBookingDetails(payload: any) {
  const raw = payload;
  const bookingCode = raw.bookingCode;
  if (typeof bookingCode !== 'string' || bookingCode.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ bookingCode');
  }
  const fields = raw.fields;
  if (!fields || typeof fields !== 'object') {
    return fail('BAD_REQUEST', 'fields ต้องเป็น object');
  }
  const result = updateBookingDetails(bookingCode, fields);
  if (!result.ok) {
    return fail('NOT_FOUND', 'ไม่พบการจองรหัสนี้');
  }
  return ok(result.data);
}

export function handleGetAdminExtraServices() {
  return ok({ services: getExtraServices() });
}

export function handleCreateExtraService(payload: any) {
  const raw = payload;
  const service = raw.service;
  if (!service || typeof service !== 'object') {
    return fail('BAD_REQUEST', 'ต้องระบุข้อมูลบริการเสริม');
  }
  const result = createExtraService(service);
  if (!result.ok) return fail('BAD_REQUEST', result.message || 'ไม่สามารถสร้างบริการเสริมได้');
  return ok(result.data);
}

export function handleUpdateExtraService(payload: any) {
  const raw = payload;
  const id = raw.id;
  const fields = raw.fields;
  if (typeof id !== 'string' || !fields || typeof fields !== 'object') {
    return fail('BAD_REQUEST', 'ข้อมูลไม่ถูกต้อง');
  }
  const result = updateExtraService(id, fields);
  if (!result.ok) return fail('NOT_FOUND', result.message || 'ไม่พบบริการเสริม');
  return ok(result.data);
}

export function handleDeleteExtraService(payload: any) {
  const raw = payload;
  const id = raw.id;
  if (typeof id !== 'string') return fail('BAD_REQUEST', 'ต้องระบุ id');
  const result = deleteExtraService(id);
  if (!result.ok) return fail('NOT_FOUND', result.message || 'ไม่พบบริการเสริม');
  return ok(result.data);
}

export function handleBlockDate(payload: any) {
  const raw = payload;
  const { start, end, note } = raw;
  if (!start || !end) return fail('BAD_REQUEST', 'ต้องระบุ start และ end');
  const result = blockDateRange(start, end, note);
  if (!result.ok) return fail('BAD_REQUEST', result.message || 'เกิดข้อผิดพลาดในการบล็อกวัน');
  return ok(result.data);
}

export function handleUnblockDate(payload: any) {
  const raw = payload;
  const { start, end } = raw;
  if (!start || !end) return fail('BAD_REQUEST', 'ต้องระบุ start และ end');
  const result = unblockDateRange(start, end);
  if (!result.ok) return fail('BAD_REQUEST', result.message || 'เกิดข้อผิดพลาดในการปลดบล็อก');
  return ok(result.data);
}

export function handleSetDailyPrice(payload: any) {
  const raw = payload;
  const { roomId, start, end, price, minNights, description } = raw;
  if (!roomId || !start || !end || price === void 0) {
    return fail('BAD_REQUEST', 'ข้อมูลไม่ครบถ้วน');
  }
  const result = setDailyPriceRange(roomId, start, end, price, minNights, description);
  if (!result.ok) return fail('BAD_REQUEST', result.message || 'เกิดข้อผิดพลาด');
  return ok(result.data);
}

export function handleRemoveDailyPrice(payload: any) {
  const raw = payload;
  const { roomId, start, end } = raw;
  if (!roomId || !start || !end) return fail('BAD_REQUEST', 'ต้องระบุ roomId, start, end');
  const result = removeDailyPriceRange(roomId, start, end);
  if (!result.ok) return fail('BAD_REQUEST', result.message || 'เกิดข้อผิดพลาด');
  return ok(result.data);
}

export function handleGetBookingDetails(payload: any) {
  const raw = payload;
  const bookingCode = raw.bookingCode;
  if (typeof bookingCode !== 'string' || bookingCode.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ bookingCode');
  }
  const details = getBookingDetailsForAdmin(bookingCode);
  if (!details) return fail('NOT_FOUND', 'ไม่พบการจองรหัสนี้');
  return ok(details);
}

export function handleManageBookingService(payload: any) {
  const raw = payload;
  const { bookingCode, operation, serviceId, qty } = raw;
  if (!bookingCode || !operation || !serviceId) {
    return fail('BAD_REQUEST', 'ข้อมูลไม่ครบถ้วน');
  }
  const result = manageBookingService(bookingCode, operation, serviceId, qty);
  if (!result.ok) return fail('BAD_REQUEST', result.message || 'เกิดข้อผิดพลาด');
  return ok(result.data);
}

export function handleAddServiceToBooking(payload: any) {
  const raw = payload;
  const { bookingCode, serviceId, qty } = raw;
  if (!bookingCode || !serviceId || qty === void 0) {
    return fail('BAD_REQUEST', 'ข้อมูลไม่ครบถ้วน');
  }
  const result = addServiceToBooking(bookingCode, serviceId, qty);
  if (!result.ok) return fail('BAD_REQUEST', result.message || 'เกิดข้อผิดพลาด');
  return ok(result.data);
}

export function handleListBookings() {
  const bookings = listBookingsForAdmin();
  return ok({ bookings });
}

export function handleGetAdminDashboardData() {
  const bookings = listBookingsForAdmin();
  const rooms = getRooms();
  const extraServices = getExtraServices();
  const blockedDates = getBlockedDates();
  return ok({ bookings, rooms, extraServices, blockedDates });
}

export function handleAdminReportMonth(payload: any) {
  const raw = payload;
  const yearMonth = raw.yearMonth;
  if (typeof yearMonth !== 'string' || !/^\d{4}-\d{2}$/.test(yearMonth)) {
    return fail('BAD_REQUEST', 'ต้องระบุ yearMonth ในรูปแบบ yyyy-mm');
  }
  const bookings = listBookingsForAdmin();
  const report = buildMonthlyReport(yearMonth, bookings);
  return ok(report);
}

export function handleListOtaCalendars() {
  return ok({ calendars: [] });
}

export function handleGetAdminOtaData() {
  return ok({ calendars: [] });
}

export function handleSyncOta() {
  const result = importOtaCalendars();
  return ok(result);
}

export function handleGetSlip(payload: any) {
  const raw = payload;
  const bookingCode = raw.bookingCode;
  if (typeof bookingCode !== 'string' || bookingCode.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ bookingCode');
  }
  const result = getSlipForAdmin(bookingCode);
  if (!result.ok) {
    return fail('NOT_FOUND', 'ไม่พบการจองรหัสนี้');
  }
  return ok({ slip_url: result.slip_url });
}

export function handleUploadSlip(payload: any) {
  const raw = payload;
  const { bookingCode, base64, slipRef } = raw;
  if (typeof bookingCode !== 'string' || bookingCode.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ bookingCode');
  }
  if (typeof base64 !== 'string' || base64.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องแนบไฟล์สลิป');
  }
  if (typeof slipRef !== 'string' || slipRef.trim() === '') {
    return fail('BAD_REQUEST', 'ต้องระบุ slipRef');
  }
  const result = uploadSlip(bookingCode, base64, slipRef);
  if (!result.ok) {
    if (result.reason === 'BOOKING_NOT_FOUND') return fail('NOT_FOUND', 'ไม่พบการจองรหัสนี้');
    if (result.reason === 'DUPLICATE_SLIP') return fail('BAD_REQUEST', 'สลิปนี้เคยถูกใช้ไปแล้ว', { reason: 'DUPLICATE_SLIP' });
    if (result.reason === 'HOLD_EXPIRED') return fail('BAD_REQUEST', 'การจองนี้หมดเวลาแล้ว', { reason: 'HOLD_EXPIRED' });
    if (result.reason === 'BUSY') return fail('BUSY', 'ระบบกำลังประมวลผลรายการอื่นอยู่ กรุณาลองใหม่');
    return fail('BAD_REQUEST', 'ไฟล์สลิปไม่ถูกต้อง', { errors: result.errors });
  }
  try {
    if (result.verified) {
      sendPaymentConfirmedEmail(bookingCode);
    } else {
      sendSlipReceivedEmail(bookingCode);
    }
  } catch (err) {
    console.error('uploadSlip email error:', err instanceof Error ? err.message : 'unknown error');
  }
  return ok({ slip_url: result.slip_url, verified: result.verified, reason: result.reason });
}

// Action Handlers Registry for POST Router
export const actionHandlers: Record<string, (payload: any) => any> = {
  getCatalog: () => handleGetCatalog(),
  availability: (b) => handleAvailability(b),
  quote: (b) => handleQuote(b),
  createBooking: (b) => handleCreateBooking(b),
  getPaymentInfo: (b) => handleGetPaymentInfo(b),
  uploadSlip: (b) => handleUploadSlip(b),
  listBookings: () => handleListBookings(),
  getSlip: (b) => handleGetSlip(b),
  confirmBooking: (b) => handleConfirmBooking(b),
  cancelBooking: (b) => handleCancelBooking(b),
  editBookingDetails: (b) => handleEditBookingDetails(b),
  getBookingDetails: (b) => handleGetBookingDetails(b),
  manageBookingService: (b) => handleManageBookingService(b),
  addServiceToBooking: (b) => handleAddServiceToBooking(b),
  getAdminExtraServices: () => handleGetAdminExtraServices(),
  createExtraService: (b) => handleCreateExtraService(b),
  updateExtraService: (b) => handleUpdateExtraService(b),
  deleteExtraService: (b) => handleDeleteExtraService(b),
  blockDate: (b) => handleBlockDate(b),
  unblockDate: (b) => handleUnblockDate(b),
  setDailyPrice: (b) => handleSetDailyPrice(b),
  removeDailyPrice: (b) => handleRemoveDailyPrice(b),
  getAdminDashboardData: () => handleGetAdminDashboardData(),
  adminReportMonth: (b) => handleAdminReportMonth(b),
  listOtaCalendars: () => handleListOtaCalendars(),
  getAdminOtaData: () => handleGetAdminOtaData(),
  syncOta: () => handleSyncOta(),
};

// --- Google Apps Script Entry Points ---

export function doPost(e: any) {
  return dispatchPost(e, actionHandlers);
}

export function doGet(e: any) {
  return dispatchGet(e, APP_VERSION);
}

export function syncOtaCalendars() {
  importOtaCalendars();
}

export function setupTriggers() {
  const expireName = expirePendingHolds.name;
  const otaName = syncOtaCalendars.name;
  for (const trigger of ScriptApp.getProjectTriggers()) {
    const fn = trigger.getHandlerFunction();
    if (fn === expireName || fn === otaName) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  ScriptApp.newTrigger(expireName).timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger(otaName).timeBased().everyHours(6).create();
}

export function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔧 ระบบจอง')
    .addItem('⏰ ตั้งค่า Trigger (หมดเวลาจอง)', 'setupTriggers')
    .addSeparator()
    .addItem('✉️ ทดสอบส่งอีเมล', 'menuTestEmails')
    .addItem('📊 ดูโควตาอีเมลคงเหลือ', 'menuCheckQuota')
    .addItem('🔍 ตรวจสอบคอลัมน์ครบ', 'menuVerifySetup')
    .addSeparator()
    .addItem('🔄 Sync OTA ทันที', 'menuSyncOta')
    .addItem('🔍 ตรวจ URL OTA', 'menuCheckOtaUrls')
    .addSeparator()
    .addItem('🗑️ ล้างข้อมูลทดสอบ (อันตราย)', 'menuCleanup')
    .addToUi();
}

export function menuTestEmails() {
  const ui = SpreadsheetApp.getUi();
  const email = Session.getActiveUser().getEmail();
  if (!email) {
    ui.alert('ไม่สามารถหาอีเมลของผู้ใช้ปัจจุบันได้');
    return;
  }
  const result = ui.alert('ทดสอบส่งอีเมล', `จะส่งอีเมลทดสอบ 3 ฉบับไปยัง ${email}`, ui.ButtonSet.OK_CANCEL);
  if (result !== ui.Button.OK) return;
  try {
    verifyMailServiceSetup();
    ui.alert('ส่งอีเมลทดสอบเรียบร้อยแล้ว');
  } catch (err) {
    ui.alert('เกิดข้อผิดพลาดในการส่งอีเมล', err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
  }
}

export function menuCheckQuota() {
  const ui = SpreadsheetApp.getUi();
  const quota = MailApp.getRemainingDailyQuota();
  ui.alert('โควตาอีเมลคงเหลือ', `โควตาอีเมลคงเหลือวันนี้: ${quota} ฉบับ`, ui.ButtonSet.OK);
}

export function menuVerifySetup() {
  const ui = SpreadsheetApp.getUi();
  try {
    verifyMailServiceSetup();
    ui.alert('ตั้งค่าถูกต้อง', 'ระบบอีเมลและการตั้งค่าพร้อมใช้งาน', ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('ตรวจสอบพบปัญหา', err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
  }
}

export function menuCleanup() {
  const ui = SpreadsheetApp.getUi();
  const confirm = ui.prompt('ยืนยันการล้างข้อมูล', 'พิมพ์ LBDELETE เพื่อยืนยันการล้างข้อมูลทดสอบทั้งหมด', ui.ButtonSet.OK_CANCEL);
  if (confirm.getSelectedButton() !== ui.Button.OK || confirm.getResponseText().trim() !== 'LBDELETE') {
    ui.alert('ยกเลิกการล้างข้อมูล');
    return;
  }
  const deletedCounts = debugCleanupTestData();
  const summary = Object.entries(deletedCounts)
    .map(([sheetName, count]) => `${sheetName}: ${count} แถว`)
    .join('\n');
  ui.alert('ลบข้อมูลทดสอบเรียบร้อย', summary, ui.ButtonSet.OK);
}

export function menuSyncOta() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    ss.toast('กำลังซิงค์ปฏิทิน OTA...', 'Sync OTA', 30);
    const result = importOtaCalendars();
    ui.alert('ผลการซิงค์ OTA', `นำเข้าเรียบร้อย: ${result.imported?.length || 0} รายการ`, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('ซิงค์ OTA ไม่สำเร็จ', err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
  }
}

export function menuCheckOtaUrls() {
  const ui = SpreadsheetApp.getUi();
  try {
    const checks = checkOtaUrls();
    const okCount = checks.filter((c: any) => c.ok).length;
    ui.alert('ผลตรวจ URL OTA', `ใช้งานได้ ${okCount} / ${checks.length} เจ้า`, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('ตรวจไม่สำเร็จ', err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
  }
}
