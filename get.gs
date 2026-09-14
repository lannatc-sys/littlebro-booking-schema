// สร้างอัตโนมัติจาก src/ — ห้ามแก้ไฟล์นี้โดยตรง

var _App = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    APP_VERSION: () => APP_VERSION,
    actionHandlers: () => actionHandlers,
    doGet: () => doGet,
    doPost: () => doPost,
    findRoom: () => findRoom,
    handleAddServiceToBooking: () => handleAddServiceToBooking,
    handleAdminReportMonth: () => handleAdminReportMonth,
    handleAvailability: () => handleAvailability,
    handleBlockDate: () => handleBlockDate,
    handleCancelBooking: () => handleCancelBooking,
    handleConfirmBooking: () => handleConfirmBooking,
    handleCreateBooking: () => handleCreateBooking,
    handleCreateExtraService: () => handleCreateExtraService,
    handleDeleteExtraService: () => handleDeleteExtraService,
    handleEditBookingDetails: () => handleEditBookingDetails,
    handleGetAdminDashboardData: () => handleGetAdminDashboardData,
    handleGetAdminExtraServices: () => handleGetAdminExtraServices,
    handleGetAdminOtaData: () => handleGetAdminOtaData,
    handleGetBookingDetails: () => handleGetBookingDetails,
    handleGetCatalog: () => handleGetCatalog,
    handleGetPaymentInfo: () => handleGetPaymentInfo,
    handleGetSlip: () => handleGetSlip,
    handleListBookings: () => handleListBookings,
    handleListOtaCalendars: () => handleListOtaCalendars,
    handleManageBookingService: () => handleManageBookingService,
    handleQuote: () => handleQuote,
    handleRemoveDailyPrice: () => handleRemoveDailyPrice,
    handleSetDailyPrice: () => handleSetDailyPrice,
    handleSyncOta: () => handleSyncOta,
    handleUnblockDate: () => handleUnblockDate,
    handleUpdateExtraService: () => handleUpdateExtraService,
    handleUploadSlip: () => handleUploadSlip,
    menuCheckOtaUrls: () => menuCheckOtaUrls,
    menuCheckQuota: () => menuCheckQuota,
    menuCleanup: () => menuCleanup,
    menuSyncOta: () => menuSyncOta,
    menuTestEmails: () => menuTestEmails,
    menuVerifySetup: () => menuVerifySetup,
    onOpen: () => onOpen,
    setupTriggers: () => setupTriggers,
    syncOtaCalendars: () => syncOtaCalendars
  });

  // src/core/dateRange.ts
  var MS_PER_DAY = 864e5;
  var YMD_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  function ymdToDayNumber(ymd2) {
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
  function dayNumberToYmd(dayNumber) {
    const d = new Date(dayNumber * MS_PER_DAY);
    const yyyy = String(d.getUTCFullYear()).padStart(4, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  function isValidYmd(ymd2) {
    try {
      ymdToDayNumber(ymd2);
      return true;
    } catch {
      return false;
    }
  }
  function nightsBetween(checkIn, checkOut) {
    return ymdToDayNumber(checkOut) - ymdToDayNumber(checkIn);
  }
  function expandNights(checkIn, checkOut) {
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
  function findConflicts(checkIn, checkOut, blockedDates) {
    const blocked = new Set(blockedDates);
    return expandNights(checkIn, checkOut).filter((night) => blocked.has(night));
  }
  function expandDateRangeInclusive(d1, d2) {
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
  function consolidateBlockedRanges(blockedDays) {
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

  // src/core/apiContract.ts
  function ok(data) {
    return { ok: true, data };
  }
  function fail(code, message, extra) {
    return { ok: false, error: { code, message, ...extra ?? {} } };
  }
  function parseRequestBody(rawBody) {
    if (!rawBody) {
      return fail("BAD_REQUEST", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E33\u0E02\u0E2D");
    }
    try {
      return ok(JSON.parse(rawBody));
    } catch {
      return fail("BAD_REQUEST", "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07");
    }
  }
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var THAI_PHONE_PATTERN = /^(0\d{9}|\+66\d{9})$/;
  function isPlainObject(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
  }
  function isFiniteNumber(v) {
    return typeof v === "number" && Number.isFinite(v);
  }
  function normalizePhone(v) {
    return v.replace(/[\s\-()]/g, "");
  }
  function validateAvailabilityRequest(raw) {
    if (!isPlainObject(raw)) {
      return { valid: false, errors: ["\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E21\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 object"] };
    }
    const errors = [];
    const { checkIn, checkOut, guests } = raw;
    const checkInValid = typeof checkIn === "string" && isValidYmd(checkIn);
    const checkOutValid = typeof checkOut === "string" && isValidYmd(checkOut);
    if (!checkInValid) errors.push("checkIn \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A yyyy-mm-dd \u0E17\u0E35\u0E48\u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E08\u0E23\u0E34\u0E07");
    if (!checkOutValid) errors.push("checkOut \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A yyyy-mm-dd \u0E17\u0E35\u0E48\u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E08\u0E23\u0E34\u0E07");
    if (checkInValid && checkOutValid && nightsBetween(checkIn, checkOut) < 1) {
      errors.push("checkOut \u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E2B\u0E25\u0E31\u0E07 checkIn \u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E04\u0E37\u0E19");
    }
    if (!isFiniteNumber(guests) || !Number.isInteger(guests) || guests < 1) {
      errors.push("guests \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0");
    }
    if (errors.length > 0) return { valid: false, errors };
    return {
      valid: true,
      value: { checkIn, checkOut, guests }
    };
  }
  function validateBookingRequest(raw) {
    if (!isPlainObject(raw)) {
      return { valid: false, errors: ["\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E21\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 object"] };
    }
    const errors = [];
    const availability = validateAvailabilityRequest(raw);
    if (!availability.valid) errors.push(...availability.errors);
    const {
      roomId,
      customerName,
      customerEmail,
      customerPhone,
      arrivalTime,
      specialRequests,
      selections,
      lang
    } = raw;
    if (typeof roomId !== "string" || roomId.trim() === "") {
      errors.push("roomId \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07");
    }
    if (typeof customerName !== "string" || customerName.trim() === "") {
      errors.push("customerName \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07");
    }
    if (typeof customerEmail !== "string" || !EMAIL_PATTERN.test(customerEmail.trim())) {
      errors.push("customerEmail \u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07");
    }
    let normalizedPhone = "";
    if (typeof customerPhone !== "string") {
      errors.push("customerPhone \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21");
    } else {
      normalizedPhone = normalizePhone(customerPhone);
      if (!THAI_PHONE_PATTERN.test(normalizedPhone)) {
        errors.push("customerPhone \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D 10 \u0E2B\u0E25\u0E31\u0E01 \u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 0 \u0E2B\u0E23\u0E37\u0E2D +66 \u0E15\u0E32\u0E21\u0E14\u0E49\u0E27\u0E22 9 \u0E2B\u0E25\u0E31\u0E01");
      }
    }
    if (arrivalTime !== void 0 && arrivalTime !== "" && (typeof arrivalTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime.trim()))) {
      errors.push("arrivalTime \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E27\u0E25\u0E32\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A HH:mm");
    }
    let normalizedSelections = [];
    if (selections !== void 0) {
      if (!Array.isArray(selections)) {
        errors.push("selections \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 array");
      } else {
        let selectionsOk = true;
        for (let i = 0; i < selections.length; i++) {
          const sel = selections[i];
          const serviceIdOk = isPlainObject(sel) && typeof sel.service_id === "string" && sel.service_id.trim() !== "";
          const qtyOk = isPlainObject(sel) && isFiniteNumber(sel.qty) && Number.isInteger(sel.qty) && sel.qty >= 0;
          if (!serviceIdOk || !qtyOk) {
            selectionsOk = false;
            errors.push(`selections[${i}] \u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 service_id \u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E41\u0E25\u0E30 qty \u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E44\u0E21\u0E48\u0E15\u0E34\u0E14\u0E25\u0E1A`);
          }
        }
        if (selectionsOk) {
          normalizedSelections = selections.map((sel) => ({
            service_id: sel.service_id,
            qty: sel.qty
          }));
        }
      }
    }
    if (lang !== void 0 && lang !== "th" && lang !== "en") {
      errors.push('lang \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 "th" \u0E2B\u0E23\u0E37\u0E2D "en" \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19');
    }
    if (errors.length > 0) return { valid: false, errors };
    const availabilityValue = availability.value;
    return {
      valid: true,
      value: {
        checkIn: availabilityValue.checkIn,
        checkOut: availabilityValue.checkOut,
        guests: availabilityValue.guests,
        roomId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: normalizedPhone,
        arrivalTime: typeof arrivalTime === "string" ? arrivalTime.trim() : "",
        specialRequests: typeof specialRequests === "string" ? specialRequests.trim() : "",
        selections: normalizedSelections,
        lang
      }
    };
  }

  // src/core/catalog.ts
  function toPublicRoom(r) {
    return {
      id: r.id,
      name_th: r.name_th,
      name_en: r.name_en,
      capacity_min: r.capacity_min,
      capacity_max: r.capacity_max,
      base_price: r.base_price
    };
  }
  function toPublicService(s) {
    return {
      id: s.id,
      name_th: s.name_th,
      name_en: s.name_en,
      description_th: s.description_th,
      description_en: s.description_en,
      price: s.price,
      multiply_by_nights: s.multiply_by_nights,
      multiply_by_guests: s.multiply_by_guests,
      max_qty: s.max_qty,
      sort_order: s.sort_order
    };
  }
  function toPublicSettings(settings) {
    return {
      property_name_th: settings.property_name_th,
      property_name_en: settings.property_name_en,
      address_th: settings.address_th,
      latitude: settings.latitude,
      longitude: settings.longitude,
      contact_phone: settings.contact_phone,
      whatsapp: settings.whatsapp,
      line_oa_url: settings.line_oa_url,
      facebook_url: settings.facebook_url,
      min_guests: settings.min_guests,
      max_guests: settings.max_guests,
      min_nights: settings.min_nights,
      currency: settings.currency,
      check_in_time: settings.check_in_time,
      check_out_time: settings.check_out_time,
      hold_minutes: settings.hold_minutes,
      max_advance_days: settings.max_advance_days
    };
  }
  function buildPublicCatalog(settings, rooms, services) {
    return {
      rooms: rooms.filter((r) => r.status === "active").map(toPublicRoom),
      services: services.filter((s) => s.is_active).slice().sort((a, b) => a.sort_order - b.sort_order).map(toPublicService),
      settings: toPublicSettings(settings)
    };
  }

  // src/adapters/sheetsRepo.ts
  var CACHE_SECONDS = 300;
  var CACHE_PREFIX = "sheetsRepo:";
  function toStr(v) {
    return v === null || v === void 0 ? "" : String(v).trim();
  }
  function toNumber(v) {
    if (typeof v === "number") return v;
    const n = Number(toStr(v));
    return Number.isFinite(n) ? n : 0;
  }
  function toBoolean(v) {
    if (typeof v === "boolean") return v;
    return toStr(v).toUpperCase() === "TRUE";
  }
  function toYmd(v, timeZone, sheetName, rowNumber) {
    const ymd2 = v instanceof Date ? Utilities.formatDate(v, timeZone, "yyyy-MM-dd") : toStr(v);
    if (!isValidYmd(ymd2)) {
      throw new RangeError(
        `\u0E0A\u0E35\u0E15 "${sheetName}" \u0E41\u0E16\u0E27\u0E17\u0E35\u0E48 ${rowNumber}: \u0E04\u0E48\u0E32\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 "${ymd2}"`
      );
    }
    return ymd2;
  }
  var activeSpreadsheet = null;
  function getSpreadsheet() {
    if (!activeSpreadsheet) {
      activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    return activeSpreadsheet;
  }
  function readSheetRows(spreadsheet, sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error(`\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 "${sheetName}"`);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2 || lastCol < 1) return [];
    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map((h) => toStr(h));
    const rows = [];
    for (let i = 1; i < values.length; i++) {
      const raw = values[i];
      if (raw.every((cell) => cell === "" || cell === null)) continue;
      const data = {};
      headers.forEach((h, idx) => {
        if (h) data[h] = raw[idx];
      });
      rows.push({ rowNumber: i + 1, data });
    }
    return rows;
  }
  function getCached(cacheKey, compute, forceFresh = false) {
    const cache = CacheService.getScriptCache();
    const key = CACHE_PREFIX + cacheKey;
    if (!forceFresh) {
      const hit = cache.get(key);
      if (hit !== null) return JSON.parse(hit);
    }
    const value = compute();
    const ttl = cacheKey === "blocked_dates" ? 30 : CACHE_SECONDS;
    cache.put(key, JSON.stringify(value), ttl);
    return value;
  }
  function clearCache(cacheKey) {
    const cache = CacheService.getScriptCache();
    const key = CACHE_PREFIX + cacheKey;
    cache.remove(key);
  }
  function getSettings(forceFresh = false) {
    return getCached("settings", () => {
      const rows = readSheetRows(getSpreadsheet(), "settings");
      const map = /* @__PURE__ */ new Map();
      for (const { data } of rows) {
        map.set(toStr(data.key), data.value);
      }
      return {
        base_price: toNumber(map.get("base_price")),
        cleaning_fee: toNumber(map.get("cleaning_fee")),
        min_guests: toNumber(map.get("min_guests")),
        max_guests: toNumber(map.get("max_guests")),
        min_nights: toNumber(map.get("min_nights")),
        hold_minutes: toNumber(map.get("hold_minutes")),
        direct_discount_percent: toNumber(map.get("direct_discount_percent")),
        pricing_strategy: toStr(map.get("pricing_strategy")) || "range_max",
        currency: toStr(map.get("currency")) || "THB",
        default_lang: toStr(map.get("default_lang")) || "th",
        max_advance_days: toNumber(map.get("max_advance_days")) || 365,
        promptpay_id: toStr(map.get("promptpay_id")),
        notify_email: toStr(map.get("notify_email")),
        drive_folder_id: toStr(map.get("drive_folder_id")),
        slipok_endpoint: toStr(map.get("slipok_endpoint")),
        slipok_api_key: toStr(map.get("slipok_api_key")),
        property_name_th: toStr(map.get("property_name_th")),
        property_name_en: toStr(map.get("property_name_en")),
        address_th: toStr(map.get("address_th")),
        latitude: toNumber(map.get("latitude")),
        longitude: toNumber(map.get("longitude")),
        contact_phone: toStr(map.get("contact_phone")),
        whatsapp: toStr(map.get("whatsapp")),
        line_oa_url: toStr(map.get("line_oa_url")),
        facebook_url: toStr(map.get("facebook_url")),
        check_in_time: toStr(map.get("check_in_time")),
        check_out_time: toStr(map.get("check_out_time"))
      };
    }, forceFresh);
  }
  function toRooms(rows) {
    return rows.filter((data) => toStr(data.id) && toStr(data.status) === "active" && toNumber(data.base_price) > 0).map((data) => ({
      id: toStr(data.id),
      room_code: toStr(data.room_code),
      name_th: toStr(data.name_th),
      name_en: toStr(data.name_en),
      base_price: toNumber(data.base_price),
      cleaning_fee: toNumber(data.cleaning_fee),
      capacity_min: toNumber(data.capacity_min),
      capacity_max: toNumber(data.capacity_max),
      status: "active"
    }));
  }
  function getRooms(forceFresh = false) {
    return getCached("rooms", () => toRooms(readSheetRows(getSpreadsheet(), "rooms").map((r) => r.data)), forceFresh);
  }
  function toExtraServices(rows) {
    return rows.filter((data) => toStr(data.id) && toBoolean(data.is_active) === true && toNumber(data.price) > 0).map((data) => ({
      id: toStr(data.id),
      name_th: toStr(data.name_th),
      name_en: toStr(data.name_en),
      description_th: toStr(data.description_th),
      description_en: toStr(data.description_en),
      price: toNumber(data.price),
      multiply_by_nights: toBoolean(data.multiply_by_nights),
      multiply_by_guests: toBoolean(data.multiply_by_guests),
      max_qty: toNumber(data.max_qty),
      is_active: true,
      sort_order: toNumber(data.sort_order)
    }));
  }
  function getExtraServices(forceFresh = false) {
    return getCached("extra_services", () => toExtraServices(readSheetRows(getSpreadsheet(), "extra_services").map((r) => r.data)), forceFresh);
  }
  function getCustomDailyPrices(forceFresh = false) {
    return getCached("custom_daily_prices", () => {
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const rows = readSheetRows(spreadsheet, "custom_daily_prices");
      return rows.filter(({ data }) => data.date && data.room_id).map(({ data, rowNumber }) => ({
        date: toYmd(data.date, timeZone, "custom_daily_prices", rowNumber),
        room_id: toStr(data.room_id),
        price: toNumber(data.price),
        min_nights: toNumber(data.min_nights),
        description: data.description ? toStr(data.description) : void 0
      }));
    }, forceFresh);
  }
  function getBlockedDates() {
    return getCached("blocked_dates", () => {
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const rows = readSheetRows(spreadsheet, "blocked_dates");
      return rows.filter(({ data }) => data.date).map(({ data, rowNumber }) => toYmd(data.date, timeZone, "blocked_dates", rowNumber));
    });
  }
  function getCatalog() {
    return getCached("catalog", () => buildPublicCatalog(getSettings(), getRooms(), getExtraServices()));
  }
  function toAdminUsers(rows) {
    return rows.filter((data) => toStr(data.email) && toBoolean(data.is_active) === true).map((data) => ({
      email: toStr(data.email),
      role: toStr(data.role),
      is_active: true
    }));
  }
  function getAdminUsers(forceFresh = false) {
    if (forceFresh) {
      return toAdminUsers(readSheetRows(getSpreadsheet(), "admin_users").map((r) => r.data));
    }
    return getCached("admin_users", () => toAdminUsers(readSheetRows(getSpreadsheet(), "admin_users").map((r) => r.data)));
  }
  function toOtaCalendars(rows) {
    return rows.filter((data) => toStr(data.ota_name) && toStr(data.ical_url) && toBoolean(data.is_active) === true).map((data) => ({
      ota_name: toStr(data.ota_name),
      ical_url: toStr(data.ical_url),
      is_active: true
    }));
  }
  function getOtaCalendars() {
    return getCached("ota_calendars", () => toOtaCalendars(readSheetRows(getSpreadsheet(), "ota_calendars").map((r) => r.data)));
  }

  // src/core/icalParser.ts
  function unfoldLines(raw) {
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
  function isICalendarDocument(raw) {
    return unfoldLines(raw).some(
      (line) => line.trim().toUpperCase().startsWith("BEGIN:VCALENDAR")
    );
  }
  function parseLine(line) {
    const colon = line.indexOf(":");
    if (colon === -1) return null;
    const left = line.slice(0, colon);
    const value = line.slice(colon + 1).trim();
    const name = left.split(";")[0].toUpperCase();
    return { name, value };
  }
  function parseICalDate(value) {
    const m = /^(\d{4})(\d{2})(\d{2})/.exec(value.trim());
    if (!m) return null;
    const ymd2 = `${m[1]}-${m[2]}-${m[3]}`;
    return isValidYmd(ymd2) ? ymd2 : null;
  }
  function parseICal(raw) {
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
  function buildICal(ranges, propertyName = "Little Bro Mae Hong Son") {
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

  // src/adapters/icalExport.ts
  function buildBlockedDatesICal(propertyName = "Little Bro Mae Hong Son") {
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

  // html-raw:D:\system make\little bro booking\src\views\index.html
  var views_default = `<!DOCTYPE html>\r
<html lang="th">\r
<head>\r
  <meta charset="UTF-8">\r
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
  <title>Little Bro Mae Hong Son - \u0E08\u0E2D\u0E07\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C</title>\r
  <link rel="preconnect" href="https://fonts.googleapis.com">\r
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\r
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">\r
  <style>\r
    :root {\r
      --primary: #10b981;\r
      --primary-hover: #059669;\r
      --primary-light: #d1fae5;\r
      --dark: #0f172a;\r
      --surface: #ffffff;\r
      --surface-subtle: #f8fafc;\r
      --border: #e2e8f0;\r
      --text: #1e293b;\r
      --text-muted: #64748b;\r
      --radius: 16px;\r
      --radius-sm: 8px;\r
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);\r
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\r
    }\r
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Prompt', sans-serif; }\r
    body { background-color: #f1f5f9; color: var(--text); line-height: 1.6; min-height: 100vh; }\r
    \r
    .navbar {\r
      background: rgba(255, 255, 255, 0.9);\r
      backdrop-filter: blur(12px);\r
      position: sticky;\r
      top: 0;\r
      z-index: 50;\r
      border-bottom: 1px solid var(--border);\r
      padding: 1rem 2rem;\r
      display: flex;\r
      justify-content: space-between;\r
      align-items: center;\r
    }\r
    .brand { font-size: 1.35rem; font-weight: 700; color: var(--dark); display: flex; align-items: center; gap: 0.5rem; }\r
    .brand span { color: var(--primary); }\r
    .nav-actions a {\r
      text-decoration: none;\r
      color: var(--text-muted);\r
      font-size: 0.9rem;\r
      font-weight: 500;\r
      padding: 0.5rem 1rem;\r
      border-radius: var(--radius-sm);\r
      transition: all 0.2s;\r
    }\r
    .nav-actions a:hover { color: var(--primary); background: var(--primary-light); }\r
\r
    .hero {\r
      background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%);\r
      color: white;\r
      padding: 4rem 2rem 5rem;\r
      text-align: center;\r
      position: relative;\r
    }\r
    .hero h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.5px; }\r
    .hero p { font-size: 1.15rem; color: #cbd5e1; max-width: 600px; margin: 0 auto; font-weight: 300; }\r
\r
    .container { max-width: 1100px; margin: -3rem auto 4rem; padding: 0 1.5rem; position: relative; z-index: 10; }\r
\r
    .card {\r
      background: var(--surface);\r
      border-radius: var(--radius);\r
      box-shadow: var(--shadow-lg);\r
      border: 1px solid var(--border);\r
      padding: 2rem;\r
      margin-bottom: 2rem;\r
    }\r
\r
    .form-grid {\r
      display: grid;\r
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\r
      gap: 1.25rem;\r
      margin-bottom: 1.5rem;\r
    }\r
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }\r
    .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }\r
    .form-control {\r
      padding: 0.75rem 1rem;\r
      border-radius: var(--radius-sm);\r
      border: 1px solid var(--border);\r
      font-size: 0.95rem;\r
      outline: none;\r
      transition: border-color 0.2s, box-shadow 0.2s;\r
      background: var(--surface-subtle);\r
    }\r
    .form-control:focus {\r
      border-color: var(--primary);\r
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);\r
      background: var(--surface);\r
    }\r
\r
    .btn {\r
      display: inline-flex;\r
      align-items: center;\r
      justify-content: center;\r
      gap: 0.5rem;\r
      padding: 0.85rem 1.75rem;\r
      border-radius: var(--radius-sm);\r
      font-size: 1rem;\r
      font-weight: 600;\r
      cursor: pointer;\r
      border: none;\r
      transition: all 0.2s;\r
    }\r
    .btn-primary { background: var(--primary); color: white; }\r
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }\r
    .btn-block { width: 100%; }\r
\r
    .rooms-grid {\r
      display: grid;\r
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\r
      gap: 1.5rem;\r
      margin-top: 1.5rem;\r
    }\r
    .room-card {\r
      border: 2px solid var(--border);\r
      border-radius: var(--radius);\r
      padding: 1.5rem;\r
      cursor: pointer;\r
      transition: all 0.2s ease;\r
      background: var(--surface);\r
      display: flex;\r
      flex-direction: column;\r
      justify-content: space-between;\r
    }\r
    .room-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow); }\r
    .room-card.selected { border-color: var(--primary); background: #f0fdf4; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25); }\r
    .room-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark); }\r
    .room-price { font-size: 1.4rem; font-weight: 700; color: var(--primary); margin: 0.5rem 0; }\r
    .room-price small { font-size: 0.85rem; font-weight: 400; color: var(--text-muted); }\r
\r
    .summary-box {\r
      background: var(--surface-subtle);\r
      border-radius: var(--radius-sm);\r
      padding: 1.5rem;\r
      margin-top: 1.5rem;\r
      border: 1px solid var(--border);\r
    }\r
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem; }\r
    .summary-row.total { font-size: 1.3rem; font-weight: 700; color: var(--primary); border-top: 1px dashed var(--border); padding-top: 0.75rem; margin-top: 0.75rem; }\r
\r
    .modal {\r
      display: none;\r
      position: fixed;\r
      top: 0; left: 0; width: 100%; height: 100%;\r
      background: rgba(0, 0, 0, 0.6);\r
      backdrop-filter: blur(4px);\r
      z-index: 100;\r
      align-items: center;\r
      justify-content: center;\r
      padding: 1rem;\r
    }\r
    .modal.active { display: flex; }\r
    .modal-content {\r
      background: white;\r
      border-radius: var(--radius);\r
      padding: 2rem;\r
      max-width: 480px;\r
      width: 100%;\r
      text-align: center;\r
      box-shadow: var(--shadow-lg);\r
    }\r
    .qr-img { width: 220px; height: 220px; margin: 1rem auto; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.5rem; }\r
  </style>\r
</head>\r
<body>\r
\r
  <nav class="navbar">\r
    <div class="brand">\r
      \u{1F3E1} <span>Little Bro</span> Booking\r
    </div>\r
    <div class="nav-actions">\r
      <a href="?page=admin" id="nav-admin-link">\u{1F510} \u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25\u0E23\u0E30\u0E1A\u0E1A</a>\r
    </div>\r
  </nav>\r
\r
  <header class="hero">\r
    <h1>\u0E1E\u0E31\u0E01\u0E1C\u0E48\u0E2D\u0E19\u0E17\u0E48\u0E32\u0E21\u0E01\u0E25\u0E32\u0E07\u0E2A\u0E32\u0E22\u0E2B\u0E21\u0E2D\u0E01</h1>\r
    <p>\u0E2A\u0E31\u0E21\u0E1C\u0E31\u0E2A\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E1A\u0E23\u0E34\u0E2A\u0E38\u0E17\u0E18\u0E34\u0E4C\u0E41\u0E25\u0E30\u0E27\u0E34\u0E16\u0E35\u0E0A\u0E38\u0E21\u0E0A\u0E19\u0E17\u0E35\u0E48\u0E41\u0E21\u0E48\u0E2E\u0E48\u0E2D\u0E07\u0E2A\u0E2D\u0E19 \u0E08\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E23\u0E32\u0E04\u0E32\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E17\u0E31\u0E19\u0E17\u0E35</p>\r
  </header>\r
\r
  <main class="container">\r
    <!-- Step 1: Search & Date Selection -->\r
    <section class="card" id="search-section">\r
      <h2 style="margin-bottom: 1.25rem;">\u{1F50D} 1. \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01</h2>\r
      <div class="form-grid">\r
        <div class="form-group">\r
          <label for="check-in-date">\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19 (Check-in)</label>\r
          <input type="date" id="check-in-date" class="form-control" required>\r
        </div>\r
        <div class="form-group">\r
          <label for="check-out-date">\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C (Check-out)</label>\r
          <input type="date" id="check-out-date" class="form-control" required>\r
        </div>\r
        <div class="form-group">\r
          <label for="guest-count">\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01</label>\r
          <select id="guest-count" class="form-control">\r
            <option value="1">1 \u0E17\u0E48\u0E32\u0E19</option>\r
            <option value="2" selected>2 \u0E17\u0E48\u0E32\u0E19</option>\r
            <option value="3">3 \u0E17\u0E48\u0E32\u0E19</option>\r
            <option value="4">4 \u0E17\u0E48\u0E32\u0E19</option>\r
          </select>\r
        </div>\r
      </div>\r
      <button type="button" id="btn-check-availability" class="btn btn-primary btn-block">\r
        \u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E27\u0E48\u0E32\u0E07\u0E41\u0E25\u0E30\u0E23\u0E32\u0E04\u0E32\r
      </button>\r
    </section>\r
\r
    <!-- Step 2: Room Selection -->\r
    <section class="card" id="rooms-section" style="display: none;">\r
      <h2>\u{1F6CF}\uFE0F 2. \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01</h2>\r
      <div id="rooms-container" class="rooms-grid">\r
        <!-- Room cards rendered dynamically -->\r
      </div>\r
    </section>\r
\r
    <!-- Step 3: Booking Form & Confirmation -->\r
    <section class="card" id="booking-section" style="display: none;">\r
      <h2>\u{1F4DD} 3. \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E08\u0E2D\u0E07\u0E41\u0E25\u0E30\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19</h2>\r
      <div class="form-grid">\r
        <div class="form-group">\r
          <label for="guest-name">\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25 *</label>\r
          <input type="text" id="guest-name" class="form-control" placeholder="\u0E40\u0E0A\u0E48\u0E19 \u0E2A\u0E21\u0E0A\u0E32\u0E22 \u0E43\u0E08\u0E14\u0E35" required>\r
        </div>\r
        <div class="form-group">\r
          <label for="guest-phone">\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D *</label>\r
          <input type="tel" id="guest-phone" class="form-control" placeholder="08XXXXXXXX" required>\r
        </div>\r
        <div class="form-group">\r
          <label for="guest-email">\u0E2D\u0E35\u0E40\u0E21\u0E25 (\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E43\u0E1A\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07) *</label>\r
          <input type="email" id="guest-email" class="form-control" placeholder="name@example.com" required>\r
        </div>\r
      </div>\r
\r
      <div class="summary-box" id="quote-summary">\r
        <div class="summary-row">\r
          <span>\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01:</span>\r
          <span id="summary-room-name">-</span>\r
        </div>\r
        <div class="summary-row">\r
          <span>\u0E23\u0E30\u0E22\u0E30\u0E40\u0E27\u0E25\u0E32:</span>\r
          <span id="summary-nights">-</span>\r
        </div>\r
        <div class="summary-row total">\r
          <span>\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21\u0E0A\u0E33\u0E23\u0E30:</span>\r
          <span id="summary-total-price">0 \u0E1A\u0E32\u0E17</span>\r
        </div>\r
      </div>\r
\r
      <button type="button" id="btn-submit-booking" class="btn btn-primary btn-block" style="margin-top: 1.5rem;">\r
        \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E41\u0E25\u0E30\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\r
      </button>\r
    </section>\r
  </main>\r
\r
  <!-- Payment Modal -->\r
  <div class="modal" id="payment-modal">\r
    <div class="modal-content">\r
      <h3>\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E1C\u0E48\u0E32\u0E19 PromptPay</h3>\r
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">\r
        \u0E2A\u0E41\u0E01\u0E19 QR Code \u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E21\u0E31\u0E14\u0E08\u0E33\r
      </p>\r
      <img id="qr-image" class="qr-img" src="" alt="PromptPay QR Code">\r
      <div style="font-size: 1.4rem; font-weight: 700; color: var(--primary);" id="modal-amount">0.00 THB</div>\r
      <p style="font-size: 0.85rem; color: #dc2626; margin: 0.5rem 0;" id="qr-expiry-text">\u0E01\u0E23\u0E38\u0E13\u0E32\u0E0A\u0E33\u0E23\u0E30\u0E20\u0E32\u0E22\u0E43\u0E19 15 \u0E19\u0E32\u0E17\u0E35</p>\r
      \r
      <div style="margin-top: 1rem; text-align: left;">\r
        <label style="font-size: 0.85rem; font-weight: 600;">\u0E41\u0E19\u0E1A\u0E2A\u0E25\u0E34\u0E1B\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19 (Slip):</label>\r
        <input type="file" id="slip-file" accept="image/*" class="form-control" style="margin-top: 0.4rem;">\r
      </div>\r
\r
      <button type="button" id="btn-upload-slip" class="btn btn-primary btn-block" style="margin-top: 1rem;">\r
        \u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E2A\u0E25\u0E34\u0E1B\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\r
      </button>\r
    </div>\r
  </div>\r
\r
  <script>\r
    let selectedRoomId = null;\r
    let currentBookingCode = null;\r
\r
    // Set default dates: today + 1 and today + 2\r
    const today = new Date();\r
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);\r
    const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2);\r
\r
    const fmt = (d) => d.toISOString().split('T')[0];\r
    document.getElementById('check-in-date').value = fmt(tomorrow);\r
    document.getElementById('check-out-date').value = fmt(dayAfter);\r
\r
    async function apiCall(action, payload = {}) {\r
      const res = await fetch('', {\r
        method: 'POST',\r
        headers: { 'Content-Type': 'text/plain' },\r
        body: JSON.stringify({ action, ...payload })\r
      });\r
      return await res.json();\r
    }\r
\r
    document.getElementById('btn-check-availability').addEventListener('click', async () => {\r
      const checkIn = document.getElementById('check-in-date').value;\r
      const checkOut = document.getElementById('check-out-date').value;\r
\r
      if (!checkIn || !checkOut || checkIn >= checkOut) {\r
        alert('\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19\u0E41\u0E25\u0E30\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C\u0E43\u0E2B\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07');\r
        return;\r
      }\r
\r
      const btn = document.getElementById('btn-check-availability');\r
      btn.innerText = '\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E27\u0E48\u0E32\u0E07...';\r
      btn.disabled = true;\r
\r
      try {\r
        const catalogRes = await apiCall('getCatalog');\r
        if (catalogRes.ok) {\r
          renderRooms(catalogRes.data.rooms || []);\r
          document.getElementById('rooms-section').style.display = 'block';\r
          document.getElementById('rooms-section').scrollIntoView({ behavior: 'smooth' });\r
        } else {\r
          alert('\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E44\u0E14\u0E49: ' + (catalogRes.error?.message || ''));\r
        }\r
      } catch (err) {\r
        alert('\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D');\r
      } finally {\r
        btn.innerText = '\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E27\u0E48\u0E32\u0E07\u0E41\u0E25\u0E30\u0E23\u0E32\u0E04\u0E32';\r
        btn.disabled = false;\r
      }\r
    });\r
\r
    function renderRooms(rooms) {\r
      const container = document.getElementById('rooms-container');\r
      container.innerHTML = '';\r
\r
      rooms.forEach((room) => {\r
        const card = document.createElement('div');\r
        card.className = 'room-card';\r
        card.id = \`room-\${room.id}\`;\r
        card.innerHTML = \`\r
          <div>\r
            <div class="room-name">\${room.name_th || room.name_en || room.id}</div>\r
            <p style="color: var(--text-muted); font-size: 0.9rem;">\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01 \${room.max_guests || 2} \u0E17\u0E48\u0E32\u0E19</p>\r
          </div>\r
          <div class="room-price">\r
            \u0E3F\${(room.base_price || 0).toLocaleString()} <small>/ \u0E04\u0E37\u0E19</small>\r
          </div>\r
        \`;\r
        card.addEventListener('click', () => selectRoom(room));\r
        container.appendChild(card);\r
      });\r
    }\r
\r
    async function selectRoom(room) {\r
      selectedRoomId = room.id;\r
      document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));\r
      document.getElementById(\`room-\${room.id}\`)?.classList.add('selected');\r
\r
      const checkIn = document.getElementById('check-in-date').value;\r
      const checkOut = document.getElementById('check-out-date').value;\r
      const guests = Number(document.getElementById('guest-count').value);\r
\r
      const quoteRes = await apiCall('quote', { roomId: room.id, checkIn, checkOut, guests });\r
      if (quoteRes.ok) {\r
        document.getElementById('summary-room-name').innerText = room.name_th || room.id;\r
        document.getElementById('summary-nights').innerText = \`\${checkIn} \u0E16\u0E36\u0E07 \${checkOut} (\${quoteRes.data.nights} \u0E04\u0E37\u0E19)\`;\r
        document.getElementById('summary-total-price').innerText = \`\u0E3F\${quoteRes.data.total_price.toLocaleString()}\`;\r
\r
        document.getElementById('booking-section').style.display = 'block';\r
        document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });\r
      } else {\r
        alert('\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07\u0E43\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14');\r
      }\r
    }\r
\r
    document.getElementById('btn-submit-booking').addEventListener('click', async () => {\r
      const name = document.getElementById('guest-name').value.trim();\r
      const phone = document.getElementById('guest-phone').value.trim();\r
      const email = document.getElementById('guest-email').value.trim();\r
\r
      if (!name || !phone || !email) {\r
        alert('\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E08\u0E2D\u0E07\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19');\r
        return;\r
      }\r
\r
      const payload = {\r
        roomId: selectedRoomId,\r
        checkIn: document.getElementById('check-in-date').value,\r
        checkOut: document.getElementById('check-out-date').value,\r
        guests: Number(document.getElementById('guest-count').value),\r
        guest: { name, phone, email }\r
      };\r
\r
      const res = await apiCall('createBooking', payload);\r
      if (res.ok) {\r
        currentBookingCode = res.data.booking_code;\r
        showPaymentModal(res.data);\r
      } else {\r
        alert('\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E44\u0E14\u0E49: ' + (res.error?.message || '\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E2D\u0E32\u0E08\u0E16\u0E39\u0E01\u0E08\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27'));\r
      }\r
    });\r
\r
    function showPaymentModal(data) {\r
      const modal = document.getElementById('payment-modal');\r
      document.getElementById('modal-amount').innerText = \`\u0E3F\${(data.amount_to_pay || data.total_price || 0).toLocaleString()}\`;\r
      if (data.qr_image_url) {\r
        document.getElementById('qr-image').src = data.qr_image_url;\r
      }\r
      modal.classList.add('active');\r
    }\r
  <\/script>\r
</body>\r
</html>\r
`;

  // html-raw:D:\system make\little bro booking\src\views\admin.html
  var admin_default = `<!DOCTYPE html>\r
<html lang="th">\r
<head>\r
  <meta charset="UTF-8">\r
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
  <title>Admin Dashboard - Little Bro Booking</title>\r
  <link rel="preconnect" href="https://fonts.googleapis.com">\r
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\r
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">\r
  <style>\r
    :root {\r
      --primary: #3b82f6;\r
      --primary-hover: #2563eb;\r
      --success: #10b981;\r
      --danger: #ef4444;\r
      --warning: #f59e0b;\r
      --dark: #0f172a;\r
      --surface: #ffffff;\r
      --surface-subtle: #f8fafc;\r
      --border: #e2e8f0;\r
      --text: #1e293b;\r
      --text-muted: #64748b;\r
      --radius: 12px;\r
      --radius-sm: 8px;\r
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);\r
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\r
    }\r
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Prompt', sans-serif; }\r
    body { background-color: #f8fafc; color: var(--text); min-height: 100vh; }\r
\r
    /* Login Screen */\r
    .login-wrapper {\r
      min-height: 100vh;\r
      display: flex;\r
      align-items: center;\r
      justify-content: center;\r
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);\r
      padding: 1.5rem;\r
    }\r
    .login-card {\r
      background: white;\r
      border-radius: var(--radius);\r
      padding: 2.5rem;\r
      width: 100%;\r
      max-width: 420px;\r
      box-shadow: var(--shadow-lg);\r
      text-align: center;\r
    }\r
    .login-title { font-size: 1.5rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }\r
    .login-desc { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 2rem; }\r
\r
    /* Dashboard Layout */\r
    .dashboard-wrapper { display: none; min-height: 100vh; flex-direction: column; }\r
    .dashboard-wrapper.active { display: flex; }\r
\r
    .dash-nav {\r
      background: white;\r
      border-bottom: 1px solid var(--border);\r
      padding: 1rem 2rem;\r
      display: flex;\r
      justify-content: space-between;\r
      align-items: center;\r
      position: sticky;\r
      top: 0;\r
      z-index: 50;\r
    }\r
    .dash-brand { font-size: 1.25rem; font-weight: 700; color: var(--dark); display: flex; align-items: center; gap: 0.5rem; }\r
    .user-badge { font-size: 0.85rem; background: var(--surface-subtle); padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border); }\r
\r
    .dash-content { max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem; width: 100%; }\r
\r
    .stats-grid {\r
      display: grid;\r
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\r
      gap: 1.25rem;\r
      margin-bottom: 2rem;\r
    }\r
    .stat-card {\r
      background: white;\r
      border-radius: var(--radius);\r
      border: 1px solid var(--border);\r
      padding: 1.5rem;\r
      box-shadow: var(--shadow);\r
    }\r
    .stat-val { font-size: 1.8rem; font-weight: 700; margin-top: 0.5rem; color: var(--dark); }\r
\r
    .card {\r
      background: white;\r
      border-radius: var(--radius);\r
      border: 1px solid var(--border);\r
      box-shadow: var(--shadow);\r
      padding: 1.5rem;\r
      margin-bottom: 2rem;\r
    }\r
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }\r
    .card-title { font-size: 1.15rem; font-weight: 700; color: var(--dark); }\r
\r
    .table-responsive { overflow-x: auto; }\r
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left; }\r
    th { background: var(--surface-subtle); padding: 0.75rem 1rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); }\r
    td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }\r
    tr:hover { background: #f1f5f9; }\r
\r
    .badge {\r
      display: inline-block;\r
      padding: 0.25rem 0.6rem;\r
      border-radius: 9999px;\r
      font-size: 0.75rem;\r
      font-weight: 600;\r
    }\r
    .badge-pending { background: #fef3c7; color: #b45309; }\r
    .badge-confirmed { background: #d1fae5; color: #065f46; }\r
    .badge-cancelled { background: #fee2e2; color: #991b1b; }\r
\r
    .btn {\r
      display: inline-flex;\r
      align-items: center;\r
      justify-content: center;\r
      padding: 0.5rem 1rem;\r
      border-radius: var(--radius-sm);\r
      font-size: 0.85rem;\r
      font-weight: 600;\r
      cursor: pointer;\r
      border: none;\r
      transition: all 0.15s;\r
    }\r
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }\r
    .btn-primary { background: var(--primary); color: white; }\r
    .btn-primary:hover { background: var(--primary-hover); }\r
    .btn-success { background: var(--success); color: white; }\r
    .btn-danger { background: var(--danger); color: white; }\r
    .btn-secondary { background: #e2e8f0; color: var(--text); }\r
    .btn-block { width: 100%; }\r
\r
    .form-group { margin-bottom: 1.25rem; text-align: left; }\r
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted); }\r
    .form-control {\r
      width: 100%;\r
      padding: 0.75rem 1rem;\r
      border: 1px solid var(--border);\r
      border-radius: var(--radius-sm);\r
      font-size: 0.95rem;\r
      outline: none;\r
      background: var(--surface-subtle);\r
    }\r
    .form-control:focus { border-color: var(--primary); background: white; }\r
\r
    /* Modal */\r
    .modal {\r
      display: none;\r
      position: fixed;\r
      top: 0; left: 0; width: 100%; height: 100%;\r
      background: rgba(0, 0, 0, 0.6);\r
      backdrop-filter: blur(4px);\r
      z-index: 100;\r
      align-items: center;\r
      justify-content: center;\r
      padding: 1rem;\r
    }\r
    .modal.active { display: flex; }\r
    .modal-content {\r
      background: white;\r
      border-radius: var(--radius);\r
      padding: 2rem;\r
      max-width: 500px;\r
      width: 100%;\r
      max-height: 90vh;\r
      overflow-y: auto;\r
    }\r
  </style>\r
</head>\r
<body>\r
\r
  <!-- 1. Login View -->\r
  <div class="login-wrapper" id="login-view">\r
    <div class="login-card">\r
      <div class="login-title">\u{1F510} \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25</div>\r
      <div class="login-desc">\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07 Little Bro Mae Hong Son</div>\r
\r
      <div id="login-error" style="display: none; background: #fee2e2; color: #dc2626; padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.85rem;"></div>\r
\r
      <form id="admin-login-form">\r
        <div class="form-group">\r
          <label for="admin-username">\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 (Username / Email)</label>\r
          <input type="text" id="admin-username" class="form-control" placeholder="\u0E40\u0E0A\u0E48\u0E19 admin" required autofocus>\r
        </div>\r
        <div class="form-group">\r
          <label for="admin-password">\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19 (Password)</label>\r
          <input type="password" id="admin-password" class="form-control" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required>\r
        </div>\r
        <button type="submit" id="btn-login-submit" class="btn btn-primary btn-block" style="padding: 0.85rem;">\r
          \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\r
        </button>\r
      </form>\r
    </div>\r
  </div>\r
\r
  <!-- 2. Main Dashboard View -->\r
  <div class="dashboard-wrapper" id="dashboard-view">\r
    <nav class="dash-nav">\r
      <div class="dash-brand">\r
        \u{1F4CA} <span>Little Bro Admin</span>\r
      </div>\r
      <div style="display: flex; align-items: center; gap: 1rem;">\r
        <span class="user-badge" id="current-user-display">\u{1F464} Admin</span>\r
        <button class="btn btn-secondary btn-sm" id="btn-logout">\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A</button>\r
      </div>\r
    </nav>\r
\r
    <main class="dash-content">\r
      <!-- Stats Overview -->\r
      <section class="stats-grid">\r
        <div class="stat-card">\r
          <div style="color: var(--text-muted); font-size: 0.85rem;">\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</div>\r
          <div class="stat-val" id="stat-total-bookings">0</div>\r
        </div>\r
        <div class="stat-card">\r
          <div style="color: #b45309; font-size: 0.85rem;">\u0E23\u0E2D\u0E0A\u0E33\u0E23\u0E30 / \u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E25\u0E34\u0E1B</div>\r
          <div class="stat-val" id="stat-pending-bookings" style="color: #b45309;">0</div>\r
        </div>\r
        <div class="stat-card">\r
          <div style="color: var(--success); font-size: 0.85rem;">\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27 (Confirmed)</div>\r
          <div class="stat-val" id="stat-confirmed-bookings" style="color: var(--success);">0</div>\r
        </div>\r
      </section>\r
\r
      <!-- Bookings Table -->\r
      <section class="card">\r
        <div class="card-header">\r
          <div class="card-title">\u{1F4CB} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14</div>\r
          <button class="btn btn-secondary btn-sm" id="btn-refresh-bookings">\u{1F504} \u0E23\u0E35\u0E40\u0E1F\u0E23\u0E0A</button>\r
        </div>\r
        <div class="table-responsive">\r
          <table>\r
            <thead>\r
              <tr>\r
                <th>\u0E23\u0E2B\u0E31\u0E2A\u0E08\u0E2D\u0E07</th>\r
                <th>\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01</th>\r
                <th>\u0E40\u0E0A\u0E47\u0E04\u0E2D\u0E34\u0E19 - \u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2D\u0E32\u0E15\u0E4C</th>\r
                <th>\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21</th>\r
                <th>\u0E2A\u0E16\u0E32\u0E19\u0E30</th>\r
                <th>\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23</th>\r
              </tr>\r
            </thead>\r
            <tbody id="bookings-table-body">\r
              <tr>\r
                <td colspan="6" style="text-align: center; color: var(--text-muted);">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25...</td>\r
              </tr>\r
            </tbody>\r
          </table>\r
        </div>\r
      </section>\r
    </main>\r
  </div>\r
\r
  <!-- Slip Viewer Modal -->\r
  <div class="modal" id="slip-modal">\r
    <div class="modal-content" style="text-align: center;">\r
      <h3 style="margin-bottom: 1rem;">\u0E2A\u0E25\u0E34\u0E1B\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19</h3>\r
      <div id="slip-image-container" style="min-height: 200px; display: flex; align-items: center; justify-content: center;">\r
        <img id="slip-img" src="" alt="Slip Image" style="max-width: 100%; max-height: 450px; border-radius: var(--radius-sm);">\r
      </div>\r
      <button class="btn btn-secondary btn-block" id="btn-close-slip-modal" style="margin-top: 1.5rem;">\u0E1B\u0E34\u0E14</button>\r
    </div>\r
  </div>\r
\r
  <script>\r
    let authToken = localStorage.getItem('littlebro_admin_token');\r
\r
    async function apiCall(action, payload = {}) {\r
      const res = await fetch('', {\r
        method: 'POST',\r
        headers: { 'Content-Type': 'text/plain' },\r
        body: JSON.stringify({ action, token: authToken, ...payload })\r
      });\r
      return await res.json();\r
    }\r
\r
    // Check existing session\r
    if (authToken) {\r
      showDashboard();\r
    }\r
\r
    // Handle Login\r
    document.getElementById('admin-login-form').addEventListener('submit', async (e) => {\r
      e.preventDefault();\r
      const username = document.getElementById('admin-username').value.trim();\r
      const password = document.getElementById('admin-password').value.trim();\r
      const errorDiv = document.getElementById('login-error');\r
      const submitBtn = document.getElementById('btn-login-submit');\r
\r
      errorDiv.style.display = 'none';\r
      submitBtn.innerText = '\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A...';\r
      submitBtn.disabled = true;\r
\r
      try {\r
        const res = await apiCall('adminLogin', { username, password });\r
        if (res.ok && res.data?.token) {\r
          authToken = res.data.token;\r
          localStorage.setItem('littlebro_admin_token', authToken);\r
          localStorage.setItem('littlebro_admin_user', res.data.user?.username || username);\r
          showDashboard();\r
        } else {\r
          errorDiv.innerText = res.error?.message || '\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07';\r
          errorDiv.style.display = 'block';\r
        }\r
      } catch (err) {\r
        errorDiv.innerText = '\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E40\u0E0B\u0E34\u0E23\u0E4C\u0E1F\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E44\u0E14\u0E49';\r
        errorDiv.style.display = 'block';\r
      } finally {\r
        submitBtn.innerText = '\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A';\r
        submitBtn.disabled = false;\r
      }\r
    });\r
\r
    // Handle Logout\r
    document.getElementById('btn-logout').addEventListener('click', async () => {\r
      try { await apiCall('adminLogout'); } catch {}\r
      authToken = null;\r
      localStorage.removeItem('littlebro_admin_token');\r
      localStorage.removeItem('littlebro_admin_user');\r
      location.reload();\r
    });\r
\r
    function showDashboard() {\r
      document.getElementById('login-view').style.display = 'none';\r
      document.getElementById('dashboard-view').classList.add('active');\r
      const savedUser = localStorage.getItem('littlebro_admin_user') || 'Admin';\r
      document.getElementById('current-user-display').innerText = \`\u{1F464} \${savedUser}\`;\r
      loadBookings();\r
    }\r
\r
    async function loadBookings() {\r
      const tbody = document.getElementById('bookings-table-body');\r
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25...</td></tr>';\r
\r
      try {\r
        const res = await apiCall('listBookings');\r
        if (res.ok) {\r
          const bookings = res.data?.bookings || [];\r
          renderBookings(bookings);\r
          updateStats(bookings);\r
        } else {\r
          if (res.error?.code === 'FORBIDDEN') {\r
            alert('Session \u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E43\u0E2B\u0E21\u0E48');\r
            document.getElementById('btn-logout').click();\r
            return;\r
          }\r
          tbody.innerHTML = \`<tr><td colspan="6" style="text-align: center; color: red;">\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14: \${res.error?.message || ''}</td></tr>\`;\r
        }\r
      } catch (err) {\r
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E40\u0E0B\u0E34\u0E23\u0E4C\u0E1F\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E25\u0E49\u0E21\u0E40\u0E2B\u0E25\u0E27</td></tr>';\r
      }\r
    }\r
\r
    function updateStats(bookings) {\r
      document.getElementById('stat-total-bookings').innerText = bookings.length;\r
      document.getElementById('stat-pending-bookings').innerText = bookings.filter(b => b.status === 'PENDING').length;\r
      document.getElementById('stat-confirmed-bookings').innerText = bookings.filter(b => b.status === 'CONFIRMED').length;\r
    }\r
\r
    function renderBookings(bookings) {\r
      const tbody = document.getElementById('bookings-table-body');\r
      tbody.innerHTML = '';\r
\r
      if (bookings.length === 0) {\r
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E43\u0E19\u0E02\u0E13\u0E30\u0E19\u0E35\u0E49</td></tr>';\r
        return;\r
      }\r
\r
      bookings.forEach(b => {\r
        const tr = document.createElement('tr');\r
        const badgeClass = b.status === 'CONFIRMED' ? 'badge-confirmed' : b.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-pending';\r
        \r
        tr.innerHTML = \`\r
          <td><strong>\${b.code || b.booking_code || '-'}</strong></td>\r
          <td>\${b.guest_name || '-'}<br><small style="color: var(--text-muted);">\${b.guest_phone || ''}</small></td>\r
          <td>\${b.check_in} \u0E16\u0E36\u0E07 \${b.check_out}</td>\r
          <td>\u0E3F\${(Number(b.total_price) || 0).toLocaleString()}</td>\r
          <td><span class="badge \${badgeClass}">\${b.status}</span></td>\r
          <td>\r
            <div style="display: flex; gap: 0.35rem;">\r
              \${b.has_slip ? \`<button class="btn btn-secondary btn-sm" onclick="viewSlip('\${b.code || b.booking_code}')">\u0E14\u0E39\u0E2A\u0E25\u0E34\u0E1B</button>\` : ''}\r
              \${b.status !== 'CONFIRMED' ? \`<button class="btn btn-success btn-sm" onclick="confirmBooking('\${b.code || b.booking_code}')">\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19</button>\` : ''}\r
              \${b.status !== 'CANCELLED' ? \`<button class="btn btn-danger btn-sm" onclick="cancelBooking('\${b.code || b.booking_code}')">\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01</button>\` : ''}\r
            </div>\r
          </td>\r
        \`;\r
        tbody.appendChild(tr);\r
      });\r
    }\r
\r
    window.viewSlip = async (bookingCode) => {\r
      const res = await apiCall('getSlip', { bookingCode });\r
      if (res.ok && res.data?.slip_url) {\r
        document.getElementById('slip-img').src = res.data.slip_url;\r
        document.getElementById('slip-modal').classList.add('active');\r
      } else {\r
        alert('\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E39\u0E1B\u0E2A\u0E25\u0E34\u0E1B\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49');\r
      }\r
    };\r
\r
    window.confirmBooking = async (bookingCode) => {\r
      if (!confirm(\`\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07 \${bookingCode} \u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?\`)) return;\r
      const res = await apiCall('confirmBooking', { bookingCode });\r
      if (res.ok) {\r
        alert('\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08');\r
        loadBookings();\r
      } else {\r
        alert('\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14: ' + (res.error?.message || ''));\r
      }\r
    };\r
\r
    window.cancelBooking = async (bookingCode) => {\r
      if (!confirm(\`\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07 \${bookingCode} \u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?\`)) return;\r
      const res = await apiCall('cancelBooking', { bookingCode, reason: 'Admin cancelled' });\r
      if (res.ok) {\r
        alert('\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08');\r
        loadBookings();\r
      } else {\r
        alert('\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14: ' + (res.error?.message || ''));\r
      }\r
    };\r
\r
    document.getElementById('btn-close-slip-modal').addEventListener('click', () => {\r
      document.getElementById('slip-modal').classList.remove('active');\r
    });\r
\r
    document.getElementById('btn-refresh-bookings').addEventListener('click', loadBookings);\r
  <\/script>\r
</body>\r
</html>\r
`;

  // src/router/getRouter.ts
  function jsonOutput(data) {
    if (typeof ContentService !== "undefined" && ContentService.createTextOutput) {
      return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
        ContentService.MimeType.JSON
      );
    }
    return { mimeType: "application/json", content: JSON.stringify(data), data };
  }
  function icalOutput(icsContent) {
    if (typeof ContentService !== "undefined" && ContentService.createTextOutput) {
      return ContentService.createTextOutput(icsContent).setMimeType(
        ContentService.MimeType.ICAL
      );
    }
    return { mimeType: "text/calendar", content: icsContent };
  }
  function htmlOutput(html, title = "Little Bro Booking") {
    if (typeof HtmlService !== "undefined" && HtmlService.createHtmlOutput) {
      return HtmlService.createHtmlOutput(html).setTitle(title).addMetaTag("viewport", "width=device-width, initial-scale=1.0");
    }
    return { mimeType: "text/html", title, content: html };
  }
  function dispatchGet(e, appVersion = "1.0.0") {
    try {
      const params = e?.parameter || {};
      const action = params.action;
      const page = params.page || params.view;
      if (action === "health") {
        return jsonOutput(ok({ status: "ok", version: appVersion }));
      }
      if (action === "ical") {
        if (typeof PropertiesService !== "undefined" && PropertiesService.getScriptProperties) {
          const requiredToken = PropertiesService.getScriptProperties().getProperty("ICAL_EXPORT_TOKEN");
          if (requiredToken && params.token !== requiredToken) {
            return jsonOutput(fail("FORBIDDEN", "token \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"));
          }
        }
        return icalOutput(buildBlockedDatesICal());
      }
      if (page === "admin") {
        return htmlOutput(admin_default, "Admin Dashboard - Little Bro Booking");
      }
      return htmlOutput(views_default, "Little Bro Mae Hong Son - \u0E08\u0E2D\u0E07\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C");
    } catch (err) {
      console.error("dispatchGet error:", err instanceof Error ? err.message : String(err));
      return jsonOutput(fail("INTERNAL", "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A"));
    }
  }

  // src/core/adminAuth.ts
  function hashPasswordSha256(str) {
    if (typeof Utilities !== "undefined" && Utilities.computeDigest) {
      const rawHash = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        str,
        Utilities.Charset.UTF_8
      );
      let output = "";
      for (let i2 = 0; i2 < rawHash.length; i2++) {
        let byte = rawHash[i2];
        if (byte < 0) byte += 256;
        let byteStr = byte.toString(16);
        if (byteStr.length === 1) byteStr = "0" + byteStr;
        output += byteStr;
      }
      return output.toLowerCase();
    }
    function rightRotate(value, amount) {
      return value >>> amount | value << 32 - amount;
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let lengthProperty = "length";
    let i = 0, j = 0;
    let result = "";
    const words = [];
    const asciiBitLength = str[lengthProperty] * 8;
    let hash = [
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ];
    const k = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ];
    let strUtf8 = unescape(encodeURIComponent(str));
    for (let idx = 0; idx < strUtf8.length; idx++) {
      const code = strUtf8.charCodeAt(idx);
      words[idx >> 2] |= code << (3 - idx % 4) * 8;
    }
    const utf8BitLength = strUtf8.length * 8;
    words[utf8BitLength >> 2] |= 128 << (3 - utf8BitLength % 4) * 8;
    words[(utf8BitLength + 64 >> 9 << 4) + 15] = utf8BitLength;
    for (let blockStart = 0; blockStart < words.length; blockStart += 16) {
      const w = words.slice(blockStart, blockStart + 16);
      const oldHash = hash.slice(0);
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        const i2 = i + blockStart;
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ w15 >>> 3;
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ w2 >>> 10;
        w[i] = i < 16 ? w[i] | 0 : w[i - 16] + s0 + w[i - 7] + s1 | 0;
        const a = hash[0], e = hash[4];
        const s1_e = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = e & hash[5] ^ ~e & hash[6];
        const temp1 = hash[7] + s1_e + ch + k[i] + w[i] | 0;
        const s0_a = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = a & hash[1] ^ a & hash[2] ^ hash[1] & hash[2];
        const temp2 = s0_a + maj | 0;
        hash = [temp1 + temp2 | 0, hash[0], hash[1], hash[2], hash[3] + temp1 | 0, hash[4], hash[5], hash[6]];
      }
      for (i = 0; i < 8; i++) {
        hash[i] = hash[i] + oldHash[i] | 0;
      }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        const b = hash[i] >> 8 * j & 255;
        result += (b < 16 ? "0" : "") + b.toString(16);
      }
    }
    return result;
  }
  function verifyPassword(inputPassword, storedPassword) {
    if (!inputPassword || !storedPassword) return false;
    const trimmedStored = String(storedPassword).trim();
    const trimmedInput = String(inputPassword).trim();
    if (/^[0-9a-fA-F]{64}$/.test(trimmedStored)) {
      return hashPasswordSha256(trimmedInput).toLowerCase() === trimmedStored.toLowerCase();
    }
    return trimmedInput === trimmedStored;
  }
  function validateAdminCredentials(username, password, adminList) {
    if (!username || typeof username !== "string" || !username.trim()) {
      return { ok: false, reason: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 Username" };
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      return { ok: false, reason: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 Password" };
    }
    const normalized = username.trim().toLowerCase();
    const found = adminList.find((admin) => {
      const adminUser = String(admin.username || "").trim().toLowerCase();
      const adminEmail = String(admin.email || "").trim().toLowerCase();
      return adminUser === normalized || adminEmail === normalized;
    });
    if (!found) {
      return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E19\u0E35\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" };
    }
    const isActive = found.is_active === true || found.is_active === "true" || found.is_active === 1;
    if (!isActive) {
      return { ok: false, reason: "\u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E19\u0E35\u0E49\u0E16\u0E39\u0E01\u0E23\u0E30\u0E07\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" };
    }
    const storedPassword = found.password || found.password_hash || "";
    if (!storedPassword) {
      return { ok: false, reason: "\u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25\u0E23\u0E30\u0E1A\u0E1A" };
    }
    if (!verifyPassword(password, storedPassword)) {
      return { ok: false, reason: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
    }
    return { ok: true, admin: found };
  }

  // src/adapters/sessionService.ts
  var SESSION_PREFIX = "SESSION:";
  var SESSION_EXPIRE_SECONDS = 21600;
  function createSession(email) {
    const cache = CacheService.getScriptCache();
    const token = Utilities.getUuid();
    cache.put(SESSION_PREFIX + token, email.toLowerCase(), SESSION_EXPIRE_SECONDS);
    return token;
  }
  function destroySession(token) {
    if (!token) return;
    CacheService.getScriptCache().remove(SESSION_PREFIX + token);
  }
  function isValidToken(token) {
    return getSessionEmail(token) !== null;
  }
  function getSessionEmail(token) {
    if (!token) return null;
    return CacheService.getScriptCache().get(SESSION_PREFIX + token);
  }

  // src/router/postRouter.ts
  var MAX_PAYLOAD_BYTES = 100 * 1024;
  var MAX_UPLOAD_SLIP_PAYLOAD_BYTES = 8 * 1024 * 1024;
  var RATE_LIMIT_WINDOW_SECONDS = 600;
  var RATE_LIMIT_MAX_REQUESTS = 20;
  function rateLimitCacheKey(action) {
    return `rateLimit:${action}:global`;
  }
  function checkRateLimit(action) {
    if (typeof CacheService === "undefined") return false;
    const current = Number(CacheService.getScriptCache().get(rateLimitCacheKey(action)) || "0");
    return current >= RATE_LIMIT_MAX_REQUESTS;
  }
  function incrementRateLimit(action) {
    if (typeof CacheService === "undefined") return;
    const cache = CacheService.getScriptCache();
    const key = rateLimitCacheKey(action);
    const current = Number(cache.get(key) || "0");
    cache.put(key, String(current + 1), RATE_LIMIT_WINDOW_SECONDS);
  }
  function requireAdmin(body) {
    if (body && typeof body === "object") {
      const token = body.token;
      const sessionUser = typeof token === "string" && isValidToken(token) ? getSessionEmail(token) : null;
      if (sessionUser) {
        const activeAdmins = getAdminUsers(true);
        const isAllowed = activeAdmins.some((a) => {
          const u = String(a.username || "").trim().toLowerCase();
          const e = String(a.email || "").trim().toLowerCase();
          const s = sessionUser.trim().toLowerCase();
          return (u === s || e === s) && (a.is_active === true || a.is_active === "true" || a.is_active === 1);
        });
        if (isAllowed) return null;
      }
    }
    if (typeof Session !== "undefined" && Session.getActiveUser) {
      try {
        const email = Session.getActiveUser().getEmail();
        if (email) {
          const activeAdmins = getAdminUsers();
          const isAllowed = activeAdmins.some((a) => {
            const e = String(a.email || "").trim().toLowerCase();
            return e === email.trim().toLowerCase() && (a.is_active === true || a.is_active === "true" || a.is_active === 1);
          });
          if (isAllowed) return null;
        }
      } catch {
      }
    }
    return fail("FORBIDDEN", "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E2A\u0E48\u0E27\u0E19\u0E19\u0E35\u0E49");
  }
  function handleAdminLogin(payload) {
    const raw = payload || {};
    const username = raw.username || raw.user || raw.email || "";
    const password = raw.password || raw.pass || "";
    if (!username || !password) {
      return fail("BAD_REQUEST", "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 Username \u0E41\u0E25\u0E30 Password");
    }
    const adminUsers = getAdminUsers(true);
    const validation = validateAdminCredentials(username, password, adminUsers);
    if (!validation.ok) {
      return fail("FORBIDDEN", validation.reason || "Username \u0E2B\u0E23\u0E37\u0E2D Password \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07");
    }
    const token = createSession(validation.admin.username || validation.admin.email);
    return ok({
      token,
      user: {
        username: validation.admin.username,
        email: validation.admin.email,
        role: validation.admin.role || "admin"
      }
    });
  }
  function handleAdminLogout(payload) {
    const token = payload?.token;
    if (token) {
      destroySession(token);
    }
    return ok({ loggedOut: true });
  }
  function dispatchPost(e, handlers) {
    try {
      const rawBody = e?.postData?.contents ?? "";
      if (rawBody.length > MAX_UPLOAD_SLIP_PAYLOAD_BYTES) {
        return jsonOutput(fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E21\u0E32\u0E21\u0E35\u0E02\u0E19\u0E32\u0E14\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B"));
      }
      const parsed = parseRequestBody(rawBody);
      if (!parsed.ok) {
        return jsonOutput(parsed);
      }
      const body = parsed.data || {};
      const action = body.action;
      if (action !== "uploadSlip" && rawBody.length > MAX_PAYLOAD_BYTES) {
        return jsonOutput(fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E21\u0E32\u0E21\u0E35\u0E02\u0E19\u0E32\u0E14\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B"));
      }
      if (action === "createBooking") {
        if (checkRateLimit("createBooking")) {
          return jsonOutput(fail("RATE_LIMITED", "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E1A\u0E48\u0E2D\u0E22\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07"));
        }
        const handler2 = handlers["createBooking"];
        if (!handler2) return jsonOutput(fail("BAD_REQUEST", "\u0E44\u0E21\u0E48\u0E1E\u0E1A handler \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07"));
        const result = handler2(body);
        if (result && result.ok) {
          incrementRateLimit("createBooking");
        }
        return jsonOutput(result);
      }
      if (action === "adminLogin") {
        return jsonOutput(handleAdminLogin(body));
      }
      if (action === "adminLogout") {
        return jsonOutput(handleAdminLogout(body));
      }
      const adminGuardedActions = /* @__PURE__ */ new Set([
        "listBookings",
        "getSlip",
        "confirmBooking",
        "cancelBooking",
        "editBookingDetails",
        "getBookingDetails",
        "manageBookingService",
        "addServiceToBooking",
        "getAdminExtraServices",
        "createExtraService",
        "updateExtraService",
        "deleteExtraService",
        "blockDate",
        "unblockDate",
        "setDailyPrice",
        "removeDailyPrice",
        "getAdminDashboardData",
        "adminReportMonth",
        "listOtaCalendars",
        "getAdminOtaData",
        "syncOta"
      ]);
      if (adminGuardedActions.has(action)) {
        const forbidden = requireAdmin(body);
        if (forbidden) return jsonOutput(forbidden);
      }
      const handler = handlers[action];
      if (typeof handler === "function") {
        return jsonOutput(handler(body));
      }
      return jsonOutput(fail("BAD_REQUEST", `\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01 action "${action}"`));
    } catch (err) {
      console.error("dispatchPost error:", err instanceof Error ? err.message : String(err));
      return jsonOutput(fail("INTERNAL", "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A"));
    }
  }

  // src/core/pricing.ts
  function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }
  function getRawNightlyRates(checkIn, checkOut, dailyPrices, room, settings) {
    const custom = /* @__PURE__ */ new Map();
    for (const dp of dailyPrices) {
      if (dp.room_id === room.id) custom.set(dp.date, dp);
    }
    const fallback = room.base_price > 0 ? room.base_price : settings.base_price;
    return expandNights(checkIn, checkOut).map((date) => {
      const hit = custom.get(date);
      return hit ? { date, price: hit.price, is_custom: true } : { date, price: fallback, is_custom: false };
    });
  }
  function applyPricingStrategy(rates, strategy) {
    if (strategy === "per_night") return rates.map((r) => ({ ...r }));
    const hasCustom = rates.some((r) => r.is_custom);
    if (!hasCustom) return rates.map((r) => ({ ...r }));
    const maxPrice = Math.max(...rates.map((r) => r.price));
    return rates.map((r) => ({ ...r, price: maxPrice, is_custom: true }));
  }
  function getRequiredMinNights(checkIn, checkOut, dailyPrices, roomId, settings) {
    const nights = new Set(expandNights(checkIn, checkOut));
    let required = settings.min_nights || 1;
    for (const dp of dailyPrices) {
      if (dp.room_id === roomId && nights.has(dp.date) && dp.min_nights > required) {
        required = dp.min_nights;
      }
    }
    return required;
  }
  function calculateServiceLine(service, qty, nights, guests, lang = "th") {
    if (!Number.isInteger(qty) || qty < 0) {
      throw new RangeError(`\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23 "${service.id}" \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E44\u0E21\u0E48\u0E15\u0E34\u0E14\u0E25\u0E1A (\u0E44\u0E14\u0E49 ${qty})`);
    }
    if (qty > service.max_qty) {
      throw new RangeError(
        `\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23 "${service.id}" \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E14\u0E49\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 ${service.max_qty} (\u0E02\u0E2D\u0E21\u0E32 ${qty})`
      );
    }
    if (service.multiply_by_guests && qty > 1) {
      throw new RangeError(
        `\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23 "${service.id}" \u0E04\u0E34\u0E14\u0E15\u0E32\u0E21\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E41\u0E25\u0E49\u0E27 \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E48\u0E07 qty \u0E40\u0E1B\u0E47\u0E19 0 \u0E2B\u0E23\u0E37\u0E2D 1 \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 (\u0E44\u0E14\u0E49 ${qty})`
      );
    }
    const nightsApplied = service.multiply_by_nights ? nights : 1;
    const guestsApplied = service.multiply_by_guests ? guests : 1;
    return {
      service_id: service.id,
      service_name_snapshot: lang === "en" ? service.name_en : service.name_th,
      qty,
      unit_price_snapshot: service.price,
      nights_applied: nightsApplied,
      guests_applied: guestsApplied,
      line_total: round2(service.price * qty * nightsApplied * guestsApplied)
    };
  }
  function splitBookingPayment(totalPrice, lineTotals) {
    const total = Number(totalPrice) || 0;
    const servicesSubtotal = round2(
      lineTotals.reduce((sum, lt) => sum + (Number(lt) || 0), 0)
    );
    return {
      services_subtotal: servicesSubtotal,
      accommodation_subtotal: round2(total - servicesSubtotal),
      total_price: round2(total)
    };
  }
  function calculateQuote(input) {
    const {
      checkIn,
      checkOut,
      guests,
      room,
      settings,
      selections = [],
      dailyPrices = [],
      services = [],
      lang = settings.default_lang ?? "th"
    } = input;
    const totalNights = nightsBetween(checkIn, checkOut);
    if (totalNights < 1) {
      throw new RangeError("\u0E15\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E04\u0E37\u0E19");
    }
    if (!Number.isInteger(guests) || guests < settings.min_guests || guests > room.capacity_max) {
      throw new RangeError(
        `\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 ${settings.min_guests}-${room.capacity_max} \u0E04\u0E19 (\u0E44\u0E14\u0E49 ${guests})`
      );
    }
    const minNightsRequired = getRequiredMinNights(
      checkIn,
      checkOut,
      dailyPrices,
      room.id,
      settings
    );
    if (totalNights < minNightsRequired) {
      throw new RangeError(
        `\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 ${minNightsRequired} \u0E04\u0E37\u0E19 (\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E21\u0E32 ${totalNights} \u0E04\u0E37\u0E19)`
      );
    }
    const rawRates = getRawNightlyRates(checkIn, checkOut, dailyPrices, room, settings);
    const nightlyRates = applyPricingStrategy(rawRates, settings.pricing_strategy);
    const roomSubtotal = round2(nightlyRates.reduce((sum, r) => sum + r.price, 0));
    const serviceById = new Map(services.map((s) => [s.id, s]));
    const serviceLines = [];
    for (const sel of selections) {
      if (sel.qty <= 0) continue;
      const svc = serviceById.get(sel.service_id);
      if (!svc) {
        throw new RangeError(`\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E23\u0E34\u0E21\u0E23\u0E2B\u0E31\u0E2A "${sel.service_id}"`);
      }
      if (!svc.is_active) {
        throw new RangeError(`\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23 "${svc.name_th}" \u0E1B\u0E34\u0E14\u0E43\u0E2B\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E2D\u0E22\u0E39\u0E48`);
      }
      serviceLines.push(calculateServiceLine(svc, sel.qty, totalNights, guests, lang));
    }
    const servicesSubtotal = round2(
      serviceLines.reduce((sum, l) => sum + l.line_total, 0)
    );
    const cleaningFee = room.cleaning_fee > 0 ? room.cleaning_fee : settings.cleaning_fee;
    const discountPercent = settings.direct_discount_percent || 0;
    const discount = round2(roomSubtotal * (discountPercent / 100));
    const totalPrice = round2(roomSubtotal + servicesSubtotal + cleaningFee - discount);
    return {
      check_in: checkIn,
      check_out: checkOut,
      total_nights: totalNights,
      guests_count: guests,
      nightly_rates: nightlyRates,
      room_subtotal: roomSubtotal,
      service_lines: serviceLines,
      services_subtotal: servicesSubtotal,
      cleaning_fee: cleaningFee,
      discount,
      total_price: totalPrice,
      currency: settings.currency,
      min_nights_required: minNightsRequired,
      pricing_strategy: settings.pricing_strategy
    };
  }

  // src/core/promptpay.ts
  var AID_PROMPTPAY = "A000000677010111";
  function tlv(id, value) {
    const length = String(value.length).padStart(2, "0");
    return `${id}${length}${value}`;
  }
  function crc16ccitt(data) {
    let crc = 65535;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let bit = 0; bit < 8; bit++) {
        crc = (crc & 32768) !== 0 ? (crc << 1 ^ 4129) & 65535 : crc << 1 & 65535;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }
  function buildProxyField(id) {
    if (id.length === 10) {
      return tlv("01", `0066${id.slice(1)}`);
    }
    if (id.length === 13) {
      return tlv("02", id);
    }
    return tlv("03", id);
  }
  function buildPromptPayPayload(id, amount) {
    if (typeof id !== "string" || !/^\d+$/.test(id)) {
      throw new RangeError(`PromptPay ID \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E25\u0E49\u0E27\u0E19 (\u0E44\u0E14\u0E49 "${id}")`);
    }
    if (id.length !== 10 && id.length !== 13 && id.length !== 15) {
      throw new RangeError(
        `PromptPay ID \u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27 10 \u0E2B\u0E25\u0E31\u0E01 (\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D), 13 \u0E2B\u0E25\u0E31\u0E01 (\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19) \u0E2B\u0E23\u0E37\u0E2D 15 \u0E2B\u0E25\u0E31\u0E01 (e-wallet) (\u0E44\u0E14\u0E49 ${id.length} \u0E2B\u0E25\u0E31\u0E01)`
      );
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      throw new RangeError(`\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0 (\u0E44\u0E14\u0E49 ${amount})`);
    }
    if (Math.round(amount * 100) / 100 !== amount) {
      throw new RangeError(`\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E17\u0E28\u0E19\u0E34\u0E22\u0E21\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 2 \u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07 (\u0E44\u0E14\u0E49 ${amount})`);
    }
    const payloadFormat = tlv("00", "01");
    const pointOfInit = tlv("01", "12");
    const merchantInfo = tlv("29", tlv("00", AID_PROMPTPAY) + buildProxyField(id));
    const currency = tlv("53", "764");
    const amountField = tlv("54", amount.toFixed(2));
    const countryCode = tlv("58", "TH");
    const withoutCrc = `${payloadFormat}${pointOfInit}${merchantInfo}${currency}${amountField}${countryCode}6304`;
    return withoutCrc + crc16ccitt(withoutCrc);
  }

  // src/adapters/mailService.ts
  var SLIP_RECEIVED_SENT_COLUMN = "confirmation_email_sent_at";
  var PAYMENT_CONFIRMED_SENT_COLUMN = "payment_confirmed_email_sent_at";
  var PAYMENT_REQUEST_SENT_COLUMN = "payment_request_email_sent_at";
  var MIN_REMAINING_QUOTA = 5;
  var QR_IMAGE_SIZE = 300;
  var EMAIL_STYLE = `
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
  function findBookingRow(bookingsSheet, requiredColumns, bookingCode) {
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
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function formatMoney(n) {
    return n.toLocaleString("en-US");
  }
  function getRoomName(roomId, lang) {
    const room = getRooms().find((r) => r.id === roomId);
    if (!room) return roomId;
    return lang === "en" ? room.name_en : room.name_th;
  }
  function getServiceLinesText(bookingId) {
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
  function buildStayDescription(roomId, bookingId, lang) {
    const roomName = getRoomName(roomId, lang);
    const addons = getServiceLinesText(bookingId);
    return addons ? `${roomName} + ${addons}` : roomName;
  }
  function maskPromptPayPayloadForLog(payload) {
    return payload.replace(/\d{9,}/g, (digits) => "*".repeat(digits.length));
  }
  function generateQrPngBlob(promptpayPayload) {
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
  function buildContactBoxHtml(settings, lang, includeGps) {
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
  function sendPaymentRequestEmail(bookingCode) {
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
  function sendSlipReceivedEmail(bookingCode) {
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
  function sendPaymentConfirmedEmail(bookingCode) {
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
  function verifyMailServiceSetup() {
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

  // src/core/bookingLogic.ts
  function filterEditableFields(fields, whitelist) {
    const out = {};
    for (const key of whitelist) {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) continue;
      const raw = fields[key];
      out[key] = raw == null ? "" : String(raw);
    }
    return out;
  }
  function buildBookingRow(headers, values) {
    const row = new Array(headers.length).fill("");
    for (const [colName, val] of Object.entries(values)) {
      const idx = headers.indexOf(colName);
      if (idx !== -1) {
        row[idx] = val;
      } else {
        throw new Error(`\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C "${colName}"`);
      }
    }
    return row;
  }
  function formatBookingDateParts(date) {
    return {
      yy: String(date.getFullYear()).slice(-2),
      mm: String(date.getMonth() + 1).padStart(2, "0"),
      // getMonth() เป็น 0-indexed ต้อง +1
      dd: String(date.getDate()).padStart(2, "0")
    };
  }
  function nextYearlyBookingCode(existingCodes, yy, mm, dd) {
    const yearPrefix = `LB${yy}`;
    let maxRunning = 0;
    for (const code of existingCodes) {
      if (code.length === 12 && code.startsWith(yearPrefix)) {
        const running = parseInt(code.slice(8), 10);
        if (!isNaN(running) && running > maxRunning) {
          maxRunning = running;
        }
      }
    }
    const nextRunning = String(maxRunning + 1).padStart(4, "0");
    return `LB${yy}${mm}${dd}${nextRunning}`;
  }
  function pickExpiredBookings(rows, nowStr, timeZoneFormatter) {
    const expiredIds = [];
    for (const row of rows) {
      if (row.status === "pending" && row.hold_expires_at) {
        let holdStr = "";
        if (row.hold_expires_at instanceof Date) {
          holdStr = timeZoneFormatter ? timeZoneFormatter(row.hold_expires_at) : row.hold_expires_at.toISOString();
        } else {
          holdStr = String(row.hold_expires_at).trim();
        }
        if (holdStr < nowStr) {
          expiredIds.push(row.id);
        }
      }
    }
    return expiredIds;
  }
  function sheetRowsToDelete(blockedRows, expiredIds) {
    const indices = [];
    for (let i = blockedRows.length - 1; i >= 1; i--) {
      const bId = String(blockedRows[i].booking_id);
      if (expiredIds.has(bId)) {
        indices.push(i + 1);
      }
    }
    return indices;
  }

  // src/adapters/bookingService.ts
  function safeSheetText(value) {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }
  function createBooking(input) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) {
      return { ok: false, reason: "BUSY" };
    }
    try {
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const blockedDatesSheet = spreadsheet.getSheetByName("blocked_dates");
      if (!blockedDatesSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 blocked_dates");
      const blockedDatesData = blockedDatesSheet.getDataRange().getValues();
      const blkHeaders = blockedDatesData[0].map(String);
      const dateColIdx = blkHeaders.indexOf("date");
      if (dateColIdx === -1) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C date \u0E43\u0E19\u0E0A\u0E35\u0E15 blocked_dates");
      const freshBlockedDates = [];
      for (let i = 1; i < blockedDatesData.length; i++) {
        const dateCell = blockedDatesData[i][dateColIdx];
        if (!dateCell) continue;
        const ymd2 = dateCell instanceof Date ? Utilities.formatDate(dateCell, timeZone, "yyyy-MM-dd") : String(dateCell).trim();
        if (isValidYmd(ymd2)) {
          freshBlockedDates.push(ymd2);
        }
      }
      const conflicts = findConflicts(input.checkIn, input.checkOut, freshBlockedDates);
      if (conflicts.length > 0) {
        return { ok: false, reason: "DATES_UNAVAILABLE", conflicts };
      }
      const settings = getSettings();
      const rooms = getRooms();
      const room = rooms.find((r) => r.id === input.roomId);
      if (!room) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38");
      const quote = calculateQuote({
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        selections: input.selections || [],
        room,
        settings,
        dailyPrices: getCustomDailyPrices(),
        services: getExtraServices(),
        lang: input.lang || settings.default_lang || "th"
      });
      const bookingsSheet = spreadsheet.getSheetByName("bookings");
      if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
      const bookingsData = bookingsSheet.getDataRange().getValues();
      const bHeaders = bookingsData[0].map(String);
      const bookingCodeColIdx = bHeaders.indexOf("booking_code");
      const now = /* @__PURE__ */ new Date();
      const { yy, mm, dd } = formatBookingDateParts(now);
      const existingCodes = [];
      for (let i = 1; i < bookingsData.length; i++) {
        existingCodes.push(String(bookingsData[i][bookingCodeColIdx] || ""));
      }
      const bookingCode = nextYearlyBookingCode(existingCodes, yy, mm, dd);
      const holdExpiresAt = new Date(now.getTime() + settings.hold_minutes * 6e4);
      const holdExpiresAtFormatted = Utilities.formatDate(holdExpiresAt, timeZone, "yyyy-MM-dd HH:mm:ss");
      const createdAtFormatted = Utilities.formatDate(now, timeZone, "yyyy-MM-dd HH:mm:ss");
      const bookingId = Utilities.getUuid();
      const newBookingRow = buildBookingRow(bHeaders, {
        id: bookingId,
        booking_code: bookingCode,
        status: "pending",
        hold_expires_at: holdExpiresAtFormatted,
        created_at: createdAtFormatted,
        check_in: quote.check_in,
        check_out: quote.check_out,
        room_id: room.id,
        guests_count: quote.guests_count,
        total_price: quote.total_price,
        guest_name: safeSheetText(input.customerName),
        guest_email: safeSheetText(input.customerEmail),
        phone: safeSheetText(input.customerPhone),
        arrival_time: safeSheetText(input.arrivalTime),
        special_requests: safeSheetText(input.specialRequests),
        source: "direct",
        payment_status: "unpaid"
      });
      bookingsSheet.getRange(bookingsSheet.getLastRow() + 1, 1, 1, bHeaders.length).setValues([newBookingRow]);
      const servicesSheet = spreadsheet.getSheetByName("booking_services");
      if (servicesSheet && quote.service_lines.length > 0) {
        const svsData = servicesSheet.getDataRange().getValues();
        const svsHeaders = svsData[0].map(String);
        const newSvsRows = [];
        for (const line of quote.service_lines) {
          const newSvsRow = buildBookingRow(svsHeaders, {
            id: Utilities.getUuid(),
            booking_id: bookingId,
            booking_code: bookingCode,
            service_id: line.service_id,
            service_name_snapshot: line.service_name_snapshot,
            qty: line.qty,
            unit_price_snapshot: line.unit_price_snapshot,
            nights_applied: line.nights_applied,
            guests_applied: line.guests_applied,
            line_total: line.line_total
          });
          newSvsRows.push(newSvsRow);
        }
        servicesSheet.getRange(servicesSheet.getLastRow() + 1, 1, newSvsRows.length, svsHeaders.length).setValues(newSvsRows);
      }
      const nights = expandNights(quote.check_in, quote.check_out);
      if (nights.length > 0) {
        const newBlockedRows = [];
        for (const night of nights) {
          const newBlockedRow = buildBookingRow(blkHeaders, {
            id: Utilities.getUuid(),
            date: night,
            booking_id: bookingId,
            source: "direct"
          });
          newBlockedRows.push(newBlockedRow);
        }
        blockedDatesSheet.getRange(blockedDatesSheet.getLastRow() + 1, 1, newBlockedRows.length, blkHeaders.length).setValues(newBlockedRows);
      }
      clearCache("blocked_dates");
      clearCache("blocked_dates_detailed");
      return { ok: true, booking_code: bookingCode, quote };
    } finally {
      lock.releaseLock();
    }
  }
  function expirePendingHolds() {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) {
      return 0;
    }
    try {
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const now = /* @__PURE__ */ new Date();
      const nowStr = Utilities.formatDate(now, timeZone, "yyyy-MM-dd HH:mm:ss");
      const bookingsSheet = spreadsheet.getSheetByName("bookings");
      if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
      const bookingsData = bookingsSheet.getDataRange().getValues();
      if (bookingsData.length < 2) return 0;
      const bHeaders = bookingsData[0].map(String);
      const bStatusColIdx = bHeaders.indexOf("status");
      const bHoldExpiresColIdx = bHeaders.indexOf("hold_expires_at");
      const bIdColIdx = bHeaders.indexOf("id");
      const rowDataForLogic = [];
      for (let i = 1; i < bookingsData.length; i++) {
        rowDataForLogic.push({
          id: String(bookingsData[i][bIdColIdx]),
          status: String(bookingsData[i][bStatusColIdx]),
          hold_expires_at: bookingsData[i][bHoldExpiresColIdx]
        });
      }
      const expiredBookingIds = pickExpiredBookings(rowDataForLogic, nowStr, (d) => Utilities.formatDate(d, timeZone, "yyyy-MM-dd HH:mm:ss"));
      const expiredIdSet = new Set(expiredBookingIds);
      let count = 0;
      const statusColumn = [];
      for (let i = 1; i < bookingsData.length; i++) {
        const bId = String(bookingsData[i][bIdColIdx]);
        if (expiredIdSet.has(bId)) {
          statusColumn.push(["expired"]);
          count++;
        } else {
          statusColumn.push([String(bookingsData[i][bStatusColIdx])]);
        }
      }
      if (count > 0) {
        bookingsSheet.getRange(2, bStatusColIdx + 1, statusColumn.length, 1).setValues(statusColumn);
      }
      if (count > 0) {
        const blockedDatesSheet = spreadsheet.getSheetByName("blocked_dates");
        if (blockedDatesSheet) {
          const blockedData = blockedDatesSheet.getDataRange().getValues();
          if (blockedData.length > 1) {
            const blkHeaders = blockedData[0].map(String);
            const blkBookingIdColIdx = blkHeaders.indexOf("booking_id");
            const blockedRowData = blockedData.map((row) => ({
              booking_id: String(row[blkBookingIdColIdx])
            }));
            const indicesToDelete = sheetRowsToDelete(blockedRowData, expiredIdSet);
            for (const rowIndex of indicesToDelete) {
              blockedDatesSheet.deleteRow(rowIndex);
            }
          }
        }
        clearCache("blocked_dates");
        clearCache("blocked_dates_detailed");
      }
      return count;
    } finally {
      lock.releaseLock();
    }
  }
  function updateBookingDetails(bookingCode, fields) {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("bookings");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(String);
    const codeIdx = headers.indexOf("booking_code");
    if (codeIdx === -1) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
    const editableFields = ["guest_name", "guest_email", "phone", "arrival_time", "special_requests"];
    const safeFields = filterEditableFields(fields, editableFields);
    const targetRow = data.findIndex((row, index) => index > 0 && String(row[codeIdx]) === bookingCode) + 1;
    if (targetRow === 0) return { ok: false, reason: "NOT_FOUND" };
    const toWrite = [];
    const updatedFields = [];
    for (const [key, value] of Object.entries(safeFields)) {
      const colIdx = headers.indexOf(key);
      if (colIdx === -1) continue;
      toWrite.push({ colIdx, value: safeSheetText(value) });
      updatedFields.push(key);
    }
    if (toWrite.length === 0) return { ok: false, reason: "NO_FIELDS" };
    for (const { colIdx, value } of toWrite) sheet.getRange(targetRow, colIdx + 1).setValue(value);
    return { ok: true, updated_fields: updatedFields };
  }
  function addServiceToBooking(bookingCode, serviceId, qty) {
    if (!Number.isInteger(qty) || qty <= 0) return { ok: false, reason: "BAD_REQUEST" };
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) return { ok: false, reason: "BUSY" };
    try {
      const spreadsheet = getSpreadsheet();
      const bookingsSheet = spreadsheet.getSheetByName("bookings");
      if (!bookingsSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
      const bookingsData = bookingsSheet.getDataRange().getValues();
      const bHeaders = bookingsData[0].map(String);
      const indexes = {
        code: bHeaders.indexOf("booking_code"),
        id: bHeaders.indexOf("id"),
        status: bHeaders.indexOf("status"),
        checkIn: bHeaders.indexOf("check_in"),
        checkOut: bHeaders.indexOf("check_out"),
        guests: bHeaders.indexOf("guests_count"),
        total: bHeaders.indexOf("total_price")
      };
      if (Object.values(indexes).some((index) => index === -1)) throw new Error("\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C bookings \u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A");
      const rowIndex = bookingsData.findIndex((row, index) => index > 0 && String(row[indexes.code]) === bookingCode);
      if (rowIndex === -1) return { ok: false, reason: "NOT_FOUND" };
      const booking = bookingsData[rowIndex];
      if (String(booking[indexes.status]) !== "confirmed") return { ok: false, reason: "BAD_REQUEST" };
      const service = getExtraServices(true).find((item) => item.id === serviceId);
      if (!service || !service.is_active) return { ok: false, reason: service ? "BAD_REQUEST" : "SERVICE_NOT_FOUND" };
      if (qty > service.max_qty || service.multiply_by_guests && qty > 1) return { ok: false, reason: "BAD_REQUEST" };
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const toYmd22 = (value) => value instanceof Date ? Utilities.formatDate(value, timeZone, "yyyy-MM-dd") : String(value || "").trim().split(/[ T]/)[0];
      let nights;
      try {
        nights = expandNights(toYmd22(booking[indexes.checkIn]), toYmd22(booking[indexes.checkOut])).length;
      } catch (_err) {
        return { ok: false, reason: "BAD_REQUEST" };
      }
      if (nights <= 0) return { ok: false, reason: "BAD_REQUEST" };
      const nightsApplied = service.multiply_by_nights ? nights : 1;
      const guestsApplied = service.multiply_by_guests ? Number(booking[indexes.guests]) || 1 : 1;
      const lineTotal = round2(service.price * qty * nightsApplied * guestsApplied);
      const servicesSheet = spreadsheet.getSheetByName("booking_services");
      if (!servicesSheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 booking_services");
      const serviceHeaders = servicesSheet.getDataRange().getValues()[0].map(String);
      const newRow = buildBookingRow(serviceHeaders, {
        id: Utilities.getUuid(),
        booking_id: booking[indexes.id],
        booking_code: bookingCode,
        service_id: service.id,
        service_name_snapshot: safeSheetText(service.name_th),
        qty,
        unit_price_snapshot: service.price,
        nights_applied: nightsApplied,
        guests_applied: guestsApplied,
        line_total: lineTotal
      });
      servicesSheet.getRange(servicesSheet.getLastRow() + 1, 1, 1, serviceHeaders.length).setValues([newRow]);
      const totalPrice = round2(Number(booking[indexes.total]) + lineTotal);
      bookingsSheet.getRange(rowIndex + 1, indexes.total + 1).setValue(totalPrice);
      clearCache("all_booking_services");
      return { ok: true, line_total: lineTotal };
    } finally {
      lock.releaseLock();
    }
  }
  function debugCleanupTestData() {
    const deletedCounts = {};
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) {
      Logger.log("debugCleanupTestData: lock \u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07");
      return deletedCounts;
    }
    try {
      const spreadsheet = getSpreadsheet();
      const sheetNames = ["bookings", "booking_services", "blocked_dates"];
      for (const sheetName of sheetNames) {
        const sheet = spreadsheet.getSheetByName(sheetName);
        if (!sheet) {
          Logger.log(`debugCleanupTestData: \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 "${sheetName}"`);
          continue;
        }
        const lastRow = sheet.getLastRow();
        let deletedCount = 0;
        for (let i = lastRow; i >= 2; i--) {
          sheet.deleteRow(i);
          deletedCount++;
        }
        deletedCounts[sheetName] = deletedCount;
        Logger.log(`debugCleanupTestData: \u0E25\u0E1A\u0E0A\u0E35\u0E15 "${sheetName}" \u0E44\u0E1B ${deletedCount} \u0E41\u0E16\u0E27`);
      }
      clearCache("blocked_dates");
      clearCache("blocked_dates_detailed");
      Logger.log("debugCleanupTestData: \u0E25\u0E49\u0E32\u0E07 cache \u0E02\u0E2D\u0E07 blocked_dates \u0E41\u0E25\u0E49\u0E27");
    } finally {
      lock.releaseLock();
    }
    return deletedCounts;
  }

  // src/core/slipOkClient.ts
  var REASON_BY_CODE = {
    "1012": "\u0E2A\u0E25\u0E34\u0E1B\u0E0B\u0E49\u0E33",
    "1013": "\u0E22\u0E2D\u0E14\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07",
    "1014": "\u0E42\u0E2D\u0E19\u0E1C\u0E34\u0E14\u0E1A\u0E31\u0E0D\u0E0A\u0E35",
    "1010": "\u0E2A\u0E25\u0E34\u0E1B\u0E25\u0E48\u0E32\u0E0A\u0E49\u0E32"
  };
  var DEFAULT_FAIL_REASON = "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19";
  function parseSlipOkResponse(json) {
    if (typeof json !== "object" || json === null) {
      return { verified: false, code: null, amount: null, reason: DEFAULT_FAIL_REASON };
    }
    const obj = json;
    if (obj.success === true) {
      const data = typeof obj.data === "object" && obj.data !== null ? obj.data : {};
      const amount = typeof data.amount === "number" ? data.amount : null;
      return { verified: true, code: null, amount, reason: "" };
    }
    const code = obj.code !== void 0 && obj.code !== null ? String(obj.code) : null;
    const reason = code && REASON_BY_CODE[code] || DEFAULT_FAIL_REASON;
    return { verified: false, code, amount: null, reason };
  }

  // src/core/slipValidation.ts
  var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function stripDataUrlPrefix(base64) {
    return base64.replace(/^data:[^;]*;base64,/, "");
  }
  function decodeFirstBytes(base64, n) {
    const clean = stripDataUrlPrefix(base64).replace(/[\r\n\s]/g, "");
    const bytes = [];
    let buffer = 0;
    let bitsCollected = 0;
    for (let i = 0; i < clean.length && bytes.length < n; i++) {
      const char = clean[i];
      if (char === "=") break;
      const value = BASE64_CHARS.indexOf(char);
      if (value === -1) continue;
      buffer = buffer << 6 | value;
      bitsCollected += 6;
      if (bitsCollected >= 8) {
        bitsCollected -= 8;
        bytes.push(buffer >> bitsCollected & 255);
      }
    }
    return bytes;
  }
  function base64ByteLength(base64) {
    const clean = stripDataUrlPrefix(base64).replace(/[\r\n\s]/g, "");
    if (!clean) return 0;
    const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
    return Math.floor(clean.length * 3 / 4) - padding;
  }
  function detectImageType(base64) {
    if (typeof base64 !== "string" || !base64) return null;
    const bytes = decodeFirstBytes(base64, 12);
    if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
      return "jpeg";
    }
    if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) {
      return "png";
    }
    if (bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) {
      return "webp";
    }
    return null;
  }
  function validateSlipUpload(base64, maxBytes) {
    const errors = [];
    if (typeof base64 !== "string" || base64.trim() === "") {
      return { valid: false, type: null, sizeBytes: 0, errors: ["\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E1F\u0E25\u0E4C\u0E2A\u0E25\u0E34\u0E1B"] };
    }
    const sizeBytes = base64ByteLength(base64);
    const type = detectImageType(base64);
    if (!type) {
      errors.push("\u0E44\u0E1F\u0E25\u0E4C\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A (JPEG/PNG/WEBP \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19)");
    }
    if (sizeBytes <= 0) {
      errors.push("\u0E44\u0E1F\u0E25\u0E4C\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1B\u0E25\u0E48\u0E32");
    } else if (sizeBytes > maxBytes) {
      errors.push(`\u0E44\u0E1F\u0E25\u0E4C\u0E21\u0E35\u0E02\u0E19\u0E32\u0E14 ${sizeBytes} \u0E44\u0E1A\u0E15\u0E4C \u0E40\u0E01\u0E34\u0E19\u0E02\u0E19\u0E32\u0E14\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ${maxBytes} \u0E44\u0E1A\u0E15\u0E4C`);
    }
    return { valid: errors.length === 0, type, sizeBytes, errors };
  }

  // src/adapters/paymentService.ts
  var MAX_SLIP_IMAGE_BYTES = 5 * 1024 * 1024;
  function safeSheetText2(value) {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }
  function isBookingPayable(status) {
    return status === "pending";
  }
  function toPaymentInfoResult(bookingCode, row, promptpayPayload, serverNow) {
    if (!isBookingPayable(row.status) || !row.holdExpiresAt || row.holdExpiresAt <= serverNow) {
      return { ok: false, reason: "HOLD_EXPIRED" };
    }
    return {
      ok: true,
      data: {
        booking_code: bookingCode,
        amount: row.amount,
        currency: row.currency,
        promptpay_payload: promptpayPayload,
        hold_expires_at: row.holdExpiresAt,
        server_now: serverNow
      }
    };
  }
  var SLIPOK_FAIL_SAFE_RESULT = { verified: false, code: null, amount: null, reason: "\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A" };
  function verifySlipViaSlipOk(rawBase64, amount, endpoint, apiKey) {
    if (!endpoint || !apiKey) return SLIPOK_FAIL_SAFE_RESULT;
    try {
      const response = UrlFetchApp.fetch(endpoint, {
        method: "post",
        contentType: "application/json",
        headers: { "x-authorization": apiKey },
        payload: JSON.stringify({ files: rawBase64, amount, log: true }),
        muteHttpExceptions: true
        // ห้าม throw จาก HTTP status ที่ไม่ใช่ 2xx — parse เองแล้วตัดสินใจ
      });
      const json = JSON.parse(response.getContentText());
      return parseSlipOkResponse(json);
    } catch (err) {
      console.error("verifySlipViaSlipOk error:", err instanceof Error ? err.message : "unknown error");
      return SLIPOK_FAIL_SAFE_RESULT;
    }
  }
  function getBookingsSheet(spreadsheet) {
    const sheet = spreadsheet.getSheetByName("bookings");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    return sheet;
  }
  function getPaymentInfo(bookingCode) {
    const spreadsheet = getSpreadsheet();
    const bookingsSheet = getBookingsSheet(spreadsheet);
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const data = bookingsSheet.getDataRange().getValues();
    const headers = data[0].map(String);
    const codeIdx = headers.indexOf("booking_code");
    const priceIdx = headers.indexOf("total_price");
    const currencyIdx = headers.indexOf("currency");
    const statusIdx = headers.indexOf("status");
    const holdExpiresIdx = headers.indexOf("hold_expires_at");
    if (codeIdx === -1 || priceIdx === -1 || statusIdx === -1 || holdExpiresIdx === -1) {
      throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/total_price/status/hold_expires_at \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
    }
    const row = data.slice(1).find((r) => String(r[codeIdx]) === bookingCode);
    if (!row) return { ok: false, reason: "NOT_FOUND" };
    const amount = Number(row[priceIdx]);
    const currency = currencyIdx !== -1 && row[currencyIdx] ? String(row[currencyIdx]) : "THB";
    const status = String(row[statusIdx] || "");
    const holdExpiresCell = row[holdExpiresIdx];
    const holdExpiresAt = holdExpiresCell instanceof Date ? Utilities.formatDate(holdExpiresCell, timeZone, "yyyy-MM-dd HH:mm:ss") : String(holdExpiresCell || "").trim();
    const settings = getSettings();
    if (!settings.promptpay_id) {
      throw new Error("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 promptpay_id \u0E43\u0E19\u0E0A\u0E35\u0E15 settings");
    }
    const serverNow = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
    const promptpayPayload = buildPromptPayPayload(settings.promptpay_id, amount);
    return toPaymentInfoResult(bookingCode, { status, amount, currency, holdExpiresAt }, promptpayPayload, serverNow);
  }
  function uploadSlip(bookingCode, base64, slipRef) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) return { ok: false, reason: "BUSY" };
    try {
      const spreadsheet = getSpreadsheet();
      const bookingsSheet = getBookingsSheet(spreadsheet);
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const data = bookingsSheet.getDataRange().getValues();
      const headers = data[0].map(String);
      const codeIdx = headers.indexOf("booking_code");
      const slipRefIdx = headers.indexOf("slip_ref");
      const slipUrlIdx = headers.indexOf("slip_url");
      const paymentStatusIdx = headers.indexOf("payment_status");
      const totalPriceIdx = headers.indexOf("total_price");
      const statusIdx = headers.indexOf("status");
      const holdExpiresIdx = headers.indexOf("hold_expires_at");
      if (codeIdx === -1 || slipRefIdx === -1 || slipUrlIdx === -1 || paymentStatusIdx === -1 || totalPriceIdx === -1 || statusIdx === -1 || holdExpiresIdx === -1) {
        throw new Error(
          "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/slip_ref/slip_url/payment_status/total_price/status \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings"
        );
      }
      let targetRowIndex = -1;
      for (let i = 1; i < data.length; i++) {
        const existingSlipRef = String(data[i][slipRefIdx] || "");
        if (existingSlipRef && existingSlipRef === slipRef) {
          return { ok: false, reason: "DUPLICATE_SLIP" };
        }
        if (String(data[i][codeIdx]) === bookingCode) {
          targetRowIndex = i + 1;
        }
      }
      if (targetRowIndex === -1) {
        return { ok: false, reason: "BOOKING_NOT_FOUND" };
      }
      const holdCell = data[targetRowIndex - 1][holdExpiresIdx];
      const holdExpiresAt = holdCell instanceof Date ? Utilities.formatDate(holdCell, timeZone, "yyyy-MM-dd HH:mm:ss") : String(holdCell || "").trim();
      const serverNow = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
      if (String(data[targetRowIndex - 1][statusIdx] || "") !== "pending" || !holdExpiresAt || holdExpiresAt <= serverNow) {
        return { ok: false, reason: "HOLD_EXPIRED" };
      }
      const validation = validateSlipUpload(base64, MAX_SLIP_IMAGE_BYTES);
      if (!validation.valid || !validation.type) {
        return { ok: false, reason: "INVALID_FILE", errors: validation.errors };
      }
      const settings = getSettings();
      if (!settings.drive_folder_id) {
        throw new Error("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 drive_folder_id \u0E43\u0E19\u0E0A\u0E35\u0E15 settings");
      }
      const folder = DriveApp.getFolderById(settings.drive_folder_id);
      const extension = validation.type === "jpeg" ? "jpg" : validation.type;
      const contentType = `image/${validation.type}`;
      const rawBase64 = base64.replace(/^data:[^;]*;base64,/, "");
      const bytes = Utilities.base64Decode(rawBase64);
      const blob = Utilities.newBlob(bytes, contentType, `slip_${bookingCode}_${slipRef}.${extension}`);
      const file = folder.createFile(blob);
      const slipUrl = file.getUrl();
      const expectedAmount = Number(data[targetRowIndex - 1][totalPriceIdx]);
      const verifyResult = verifySlipViaSlipOk(
        rawBase64,
        expectedAmount,
        settings.slipok_endpoint,
        settings.slipok_api_key
      );
      const rowValues = data[targetRowIndex - 1].slice();
      rowValues[slipUrlIdx] = slipUrl;
      rowValues[slipRefIdx] = safeSheetText2(slipRef);
      if (verifyResult.verified) {
        rowValues[paymentStatusIdx] = "paid";
        rowValues[statusIdx] = "confirmed";
      } else {
        rowValues[paymentStatusIdx] = "slip_uploaded";
      }
      bookingsSheet.getRange(targetRowIndex, 1, 1, headers.length).setValues([rowValues]);
      return { ok: true, slip_url: slipUrl, verified: verifyResult.verified, reason: verifyResult.reason };
    } finally {
      lock.releaseLock();
    }
  }

  // src/adapters/adminService.ts
  function toStr2(v) {
    return v === null || v === void 0 ? "" : String(v).trim();
  }
  function toNumber2(v) {
    const n = Number(toStr2(v));
    return Number.isFinite(n) ? n : 0;
  }
  function toDateStr(v, formatDate) {
    return v instanceof Date ? formatDate(v) : toStr2(v);
  }
  function toAdminBookings(rows, formatDate) {
    const bookings = rows.filter((data) => toStr2(data.id)).map((data) => ({
      id: toStr2(data.id),
      booking_code: toStr2(data.booking_code),
      status: toStr2(data.status),
      hold_expires_at: toDateStr(data.hold_expires_at, formatDate),
      created_at: toDateStr(data.created_at, formatDate),
      check_in: toDateStr(data.check_in, formatDate),
      check_out: toDateStr(data.check_out, formatDate),
      room_id: toStr2(data.room_id),
      guests_count: toNumber2(data.guests_count),
      total_price: toNumber2(data.total_price),
      currency: toStr2(data.currency) || "THB",
      guest_name: toStr2(data.guest_name),
      guest_email: toStr2(data.guest_email),
      phone: toStr2(data.phone),
      arrival_time: toStr2(data.arrival_time),
      special_requests: toStr2(data.special_requests),
      source: toStr2(data.source),
      payment_status: toStr2(data.payment_status)
    }));
    return bookings.sort((a, b) => {
      if (a.created_at === b.created_at) return 0;
      return a.created_at > b.created_at ? -1 : 1;
    });
  }
  function listBookingsForAdmin() {
    const spreadsheet = getSpreadsheet();
    const timeZone = spreadsheet.getSpreadsheetTimeZone();
    const rows = readSheetRows(spreadsheet, "bookings").map((r) => r.data);
    return toAdminBookings(rows, (d) => Utilities.formatDate(d, timeZone, "yyyy-MM-dd HH:mm:ss"));
  }
  function getSlipForAdmin(bookingCode) {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName("bookings");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(String);
    const codeIdx = headers.indexOf("booking_code");
    const slipUrlIdx = headers.indexOf("slip_url");
    if (codeIdx === -1 || slipUrlIdx === -1) {
      throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/slip_url \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
    }
    const row = data.slice(1).find((r) => String(r[codeIdx]) === bookingCode);
    if (!row) return { ok: false, reason: "NOT_FOUND" };
    const slipUrl = String(row[slipUrlIdx] || "").trim();
    if (!slipUrl) return { ok: false, reason: "NO_SLIP" };
    return { ok: true, slip_url: slipUrl };
  }

  // src/adapters/adminActions.ts
  function confirmBookingByAdmin(bookingCode) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) return { ok: false, reason: "BUSY" };
    try {
      const spreadsheet = getSpreadsheet();
      const sheet = spreadsheet.getSheetByName("bookings");
      if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
      const data = sheet.getDataRange().getValues();
      const headers = data[0].map(String);
      const codeIdx = headers.indexOf("booking_code");
      const statusIdx = headers.indexOf("status");
      const paymentStatusIdx = headers.indexOf("payment_status");
      if (codeIdx === -1 || statusIdx === -1 || paymentStatusIdx === -1) {
        throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/status/payment_status \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
      }
      let targetRow = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][codeIdx]) === bookingCode) {
          targetRow = i + 1;
          break;
        }
      }
      if (targetRow === -1) return { ok: false, reason: "NOT_FOUND" };
      const currentStatus = String(data[targetRow - 1][statusIdx]);
      const currentPayment = String(data[targetRow - 1][paymentStatusIdx]);
      if (currentStatus === "confirmed" && currentPayment === "paid") {
        return { ok: false, reason: "ALREADY_CONFIRMED" };
      }
      if (currentStatus !== "pending") return { ok: false, reason: "INVALID_STATUS" };
      sheet.getRange(targetRow, statusIdx + 1).setValue("confirmed");
      sheet.getRange(targetRow, paymentStatusIdx + 1).setValue("paid");
      return { ok: true };
    } finally {
      lock.releaseLock();
    }
  }
  function cancelBookingByAdmin(bookingCode) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) {
      return { ok: false, reason: "BUSY" };
    }
    try {
      const spreadsheet = getSpreadsheet();
      const sheet = spreadsheet.getSheetByName("bookings");
      if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
      const data = sheet.getDataRange().getValues();
      const headers = data[0].map(String);
      const codeIdx = headers.indexOf("booking_code");
      const statusIdx = headers.indexOf("status");
      const idIdx = headers.indexOf("id");
      if (codeIdx === -1 || statusIdx === -1 || idIdx === -1) {
        throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C booking_code/status/id \u0E43\u0E19\u0E0A\u0E35\u0E15 bookings");
      }
      let targetRow = -1;
      let bookingId = "";
      let currentStatus = "";
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][codeIdx]) === bookingCode) {
          targetRow = i + 1;
          bookingId = String(data[i][idIdx]);
          currentStatus = String(data[i][statusIdx]);
          break;
        }
      }
      if (targetRow === -1) return { ok: false, reason: "NOT_FOUND" };
      if (currentStatus === "cancelled") return { ok: false, reason: "ALREADY_CANCELLED" };
      if (!["pending", "confirmed"].includes(currentStatus)) return { ok: false, reason: "INVALID_STATUS" };
      sheet.getRange(targetRow, statusIdx + 1).setValue("cancelled");
      let freedDates = 0;
      const blockedSheet = spreadsheet.getSheetByName("blocked_dates");
      if (blockedSheet && bookingId !== "") {
        const blockedData = blockedSheet.getDataRange().getValues();
        if (blockedData.length > 1) {
          const blkHeaders = blockedData[0].map(String);
          const blkBookingIdColIdx = blkHeaders.indexOf("booking_id");
          if (blkBookingIdColIdx !== -1) {
            const blockedRowData = blockedData.map((row) => ({
              booking_id: String(row[blkBookingIdColIdx])
            }));
            const indicesToDelete = sheetRowsToDelete(blockedRowData, /* @__PURE__ */ new Set([bookingId]));
            for (const rowIndex of indicesToDelete) {
              blockedSheet.deleteRow(rowIndex);
              freedDates++;
            }
          }
        }
      }
      clearCache("blocked_dates");
      clearCache("blocked_dates_detailed");
      return { ok: true, freed_dates: freedDates };
    } finally {
      lock.releaseLock();
    }
  }

  // src/adapters/extraServiceAdmin.ts
  function safeSheetText3(value) {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }
  function writeAuditLog(action, targetType, targetId, detail) {
    const sheet = getSpreadsheet().getSheetByName("audit_log");
    if (!sheet) return;
    const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
    const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
    let email = "system";
    try {
      email = Session.getActiveUser().getEmail() || "system";
    } catch (_e) {
    }
    sheet.appendRow([
      Utilities.getUuid(),
      // 1: id
      now,
      // 2: timestamp
      email,
      // 3: admin_email
      action,
      // 4: action
      targetType,
      // 5: target_type
      targetId,
      // 6: target_id
      detail
      // 7: detail
    ]);
  }
  function createExtraService(data) {
    try {
      if (data.price !== void 0 && (!Number.isFinite(Number(data.price)) || Number(data.price) < 0)) {
        return { ok: false, reason: "Invalid service price" };
      }
      const spreadsheet = getSpreadsheet();
      const sheet = spreadsheet.getSheetByName("extra_services");
      if (!sheet) return { ok: false, reason: "Sheet extra_services not found" };
      const newId = Utilities.getUuid();
      const row = [
        newId,
        // 1: id
        safeSheetText3(data.name_th || ""),
        // 2: name_th
        safeSheetText3(data.name_en || data.name_th || ""),
        // 3: name_en
        safeSheetText3(data.description_th || ""),
        // 4: description_th
        safeSheetText3(data.description_en || data.description_th || ""),
        // 5: description_en
        data.price || 0,
        // 6: price
        data.multiply_by_nights === true,
        // 7: multiply_by_nights
        data.multiply_by_guests === true,
        // 8: multiply_by_guests
        "",
        // 9: unit_label_th
        "",
        // 10: unit_label_en
        typeof data.max_qty === "number" && data.max_qty > 0 ? data.max_qty : 10,
        // 11: max_qty
        "",
        // 12: icon
        data.is_active !== void 0 ? data.is_active : true,
        // 13: is_active
        data.sort_order || 0
        // 14: sort_order
      ];
      sheet.appendRow(row);
      writeAuditLog("CREATE_EXTRA_SERVICE", "extra_service", newId, `Created service: ${data.name_th}`);
      clearCache("extra_services");
      clearCache("catalog");
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : String(err) };
    }
  }
  function updateExtraService(id, data) {
    try {
      const spreadsheet = getSpreadsheet();
      const sheet = spreadsheet.getSheetByName("extra_services");
      if (!sheet) return { ok: false, reason: "Sheet extra_services not found" };
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      if (lastRow < 2) return { ok: false, reason: "No data" };
      const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
      const headers = values[0].map((h) => String(h));
      const idIdx = headers.indexOf("id");
      const nameThIdx = headers.indexOf("name_th");
      const nameEnIdx = headers.indexOf("name_en");
      const descThIdx = headers.indexOf("description_th");
      const descEnIdx = headers.indexOf("description_en");
      const priceIdx = headers.indexOf("price");
      const multiplyByNightsIdx = headers.indexOf("multiply_by_nights");
      const multiplyByGuestsIdx = headers.indexOf("multiply_by_guests");
      const isActiveIdx = headers.indexOf("is_active");
      const sortOrderIdx = headers.indexOf("sort_order");
      let targetRow = -1;
      let oldName = "";
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idIdx]) === id) {
          targetRow = i + 1;
          oldName = String(values[i][nameThIdx]);
          break;
        }
      }
      if (targetRow === -1) return { ok: false, reason: "Service not found" };
      if (data.name_th !== void 0) {
        sheet.getRange(targetRow, nameThIdx + 1).setValue(safeSheetText3(data.name_th));
      }
      if (data.name_en !== void 0) {
        sheet.getRange(targetRow, nameEnIdx + 1).setValue(safeSheetText3(data.name_en));
      }
      if (data.description_th !== void 0) {
        sheet.getRange(targetRow, descThIdx + 1).setValue(safeSheetText3(data.description_th));
      }
      if (data.description_en !== void 0) {
        sheet.getRange(targetRow, descEnIdx + 1).setValue(safeSheetText3(data.description_en));
      }
      if (data.price !== void 0) {
        if (!Number.isFinite(Number(data.price)) || Number(data.price) < 0) {
          return { ok: false, reason: "Invalid service price" };
        }
        sheet.getRange(targetRow, priceIdx + 1).setValue(data.price);
      }
      if (data.multiply_by_nights !== void 0) {
        sheet.getRange(targetRow, multiplyByNightsIdx + 1).setValue(data.multiply_by_nights === true);
      }
      if (data.multiply_by_guests !== void 0) {
        sheet.getRange(targetRow, multiplyByGuestsIdx + 1).setValue(data.multiply_by_guests === true);
      }
      if (data.is_active !== void 0) {
        sheet.getRange(targetRow, isActiveIdx + 1).setValue(data.is_active);
      }
      if (data.sort_order !== void 0) {
        sheet.getRange(targetRow, sortOrderIdx + 1).setValue(data.sort_order);
      }
      writeAuditLog("UPDATE_EXTRA_SERVICE", "extra_service", id, `Updated service: ${oldName} (${id})`);
      clearCache("extra_services");
      clearCache("catalog");
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : String(err) };
    }
  }
  function deleteExtraService(id) {
    try {
      const spreadsheet = getSpreadsheet();
      const sheet = spreadsheet.getSheetByName("extra_services");
      if (!sheet) return { ok: false, reason: "Sheet extra_services not found" };
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) return { ok: false, reason: "No data" };
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const idIdx = headers.indexOf("id");
      const allRows = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
      let targetRow = -1;
      let serviceName = "";
      for (let i = 1; i < allRows.length; i++) {
        if (String(allRows[i][idIdx]) === id) {
          targetRow = i + 1;
          serviceName = String(allRows[i][headers.indexOf("name_th")]);
          break;
        }
      }
      if (targetRow === -1) return { ok: false, reason: "Service not found" };
      sheet.deleteRow(targetRow);
      writeAuditLog("DELETE_EXTRA_SERVICE", "extra_service", id, `Deleted service: ${serviceName} (${id})`);
      clearCache("extra_services");
      clearCache("catalog");
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : String(err) };
    }
  }

  // src/adapters/blockedDateAdmin.ts
  var ADMIN_SOURCE = "admin";
  function safeSheetText4(value) {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }
  function readBlockedSheet(spreadsheet) {
    const sheet = spreadsheet.getSheetByName("blocked_dates");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 blocked_dates");
    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(String);
    const dateColIdx = headers.indexOf("date");
    const sourceColIdx = headers.indexOf("source");
    if (dateColIdx === -1) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C date \u0E43\u0E19\u0E0A\u0E35\u0E15 blocked_dates");
    return { sheet, values, headers, dateColIdx, sourceColIdx };
  }
  function cellToYmd(cell, timeZone) {
    return cell instanceof Date ? Utilities.formatDate(cell, timeZone, "yyyy-MM-dd") : String(cell).trim();
  }
  function blockDateRange(d1, d2, reason) {
    if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
    const targetDates = expandDateRangeInclusive(d1, d2);
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
    try {
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const { sheet, values, headers, dateColIdx, sourceColIdx } = readBlockedSheet(spreadsheet);
      const alreadyBlocked = /* @__PURE__ */ new Set();
      for (let i = 1; i < values.length; i++) {
        const cell = values[i][dateColIdx];
        if (!cell) continue;
        if (sourceColIdx !== -1 && String(values[i][sourceColIdx]).trim() !== ADMIN_SOURCE) continue;
        alreadyBlocked.add(cellToYmd(cell, timeZone));
      }
      const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
      const newRows = [];
      for (const date of targetDates) {
        if (alreadyBlocked.has(date)) continue;
        newRows.push(headers.map((h) => {
          switch (h) {
            case "id":
              return Utilities.getUuid();
            case "date":
              return date;
            case "source":
              return ADMIN_SOURCE;
            case "reason":
              return safeSheetText4(reason || "");
            case "created_at":
              return now;
            default:
              return "";
          }
        }));
      }
      if (newRows.length > 0) {
        sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
        clearCache("blocked_dates");
        clearCache("blocked_dates_detailed");
        writeAuditLog("BLOCK_DATE", "blocked_date", `${d1}..${d2}`, `Admin blocked ${newRows.length} day(s) in ${d1}..${d2}${reason ? ` (${reason})` : ""}`);
      }
      return { ok: true, affected: newRows.length };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : String(err) };
    } finally {
      lock.releaseLock();
    }
  }
  function unblockDateRange(d1, d2) {
    if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
    const targetSet = new Set(expandDateRangeInclusive(d1, d2));
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
    try {
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const { sheet, values, dateColIdx, sourceColIdx } = readBlockedSheet(spreadsheet);
      if (sourceColIdx === -1) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C source \u0E43\u0E19\u0E0A\u0E35\u0E15 blocked_dates" };
      const rowsToDelete = [];
      for (let i = 1; i < values.length; i++) {
        const cell = values[i][dateColIdx];
        if (!cell) continue;
        if (!targetSet.has(cellToYmd(cell, timeZone))) continue;
        if (String(values[i][sourceColIdx]).trim() === ADMIN_SOURCE) rowsToDelete.push(i + 1);
      }
      if (rowsToDelete.length === 0) return { ok: true, affected: 0 };
      for (let k = rowsToDelete.length - 1; k >= 0; k--) sheet.deleteRow(rowsToDelete[k]);
      clearCache("blocked_dates");
      clearCache("blocked_dates_detailed");
      writeAuditLog("UNBLOCK_DATE", "blocked_date", `${d1}..${d2}`, `Admin unblocked ${rowsToDelete.length} day(s) in ${d1}..${d2}`);
      return { ok: true, affected: rowsToDelete.length };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : String(err) };
    } finally {
      lock.releaseLock();
    }
  }

  // src/adapters/dailyPriceAdmin.ts
  function safeSheetText5(value) {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }
  function resolvePrimaryRoomId() {
    const rooms = getRooms();
    if (rooms.length === 0) return null;
    const active = rooms.find((r) => r.status === "active");
    return (active || rooms[0]).id;
  }
  function cellToYmd2(cell, timeZone) {
    return cell instanceof Date ? Utilities.formatDate(cell, timeZone, "yyyy-MM-dd") : String(cell).trim();
  }
  function setDailyPriceRange(d1, d2, price, minNights, description) {
    if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
    if (typeof price !== "number" || !isFinite(price) || price <= 0) {
      return { ok: false, reason: "\u0E23\u0E32\u0E04\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0" };
    }
    const minN = typeof minNights === "number" && isFinite(minNights) && minNights > 0 ? Math.floor(minNights) : 0;
    const targetDates = expandDateRangeInclusive(d1, d2);
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
    try {
      const roomId = resolvePrimaryRoomId();
      if (!roomId) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" };
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const sheet = spreadsheet.getSheetByName("custom_daily_prices");
      if (!sheet) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 custom_daily_prices" };
      const values = sheet.getDataRange().getValues();
      const headers = values[0].map(String);
      const dateColIdx = headers.indexOf("date");
      const roomColIdx = headers.indexOf("room_id");
      const priceColIdx = headers.indexOf("price");
      const minNightsColIdx = headers.indexOf("min_nights");
      const descColIdx = headers.indexOf("description");
      const updatedColIdx = headers.indexOf("updated_at");
      if (dateColIdx === -1 || roomColIdx === -1 || priceColIdx === -1) {
        return { ok: false, reason: "\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E0A\u0E35\u0E15 custom_daily_prices \u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A" };
      }
      const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
      const targetSet = new Set(targetDates);
      const existingRowByDate = /* @__PURE__ */ new Map();
      for (let i = 1; i < values.length; i++) {
        const cell = values[i][dateColIdx];
        if (!cell || String(values[i][roomColIdx]).trim() !== roomId) continue;
        const ymd2 = cellToYmd2(cell, timeZone);
        if (targetSet.has(ymd2)) existingRowByDate.set(ymd2, i + 1);
      }
      const newRows = [];
      for (const date of targetDates) {
        const existingRow = existingRowByDate.get(date);
        if (existingRow) {
          sheet.getRange(existingRow, priceColIdx + 1).setValue(price);
          if (minNightsColIdx !== -1) sheet.getRange(existingRow, minNightsColIdx + 1).setValue(minN);
          if (descColIdx !== -1) sheet.getRange(existingRow, descColIdx + 1).setValue(safeSheetText5(description || ""));
          if (updatedColIdx !== -1) sheet.getRange(existingRow, updatedColIdx + 1).setValue(now);
        } else {
          newRows.push(headers.map((h) => {
            switch (h) {
              case "date":
                return date;
              case "room_id":
                return roomId;
              case "price":
                return price;
              case "min_nights":
                return minN;
              case "description":
                return safeSheetText5(description || "");
              case "updated_at":
                return now;
              default:
                return "";
            }
          }));
        }
      }
      if (newRows.length > 0) sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
      clearCache("custom_daily_prices");
      writeAuditLog("SET_DAILY_PRICE", "daily_price", `${d1}..${d2}`, `Set price ${price} for ${targetDates.length} day(s) ${d1}..${d2}${minN ? ` (min ${minN} nights)` : ""}${description ? ` \u2014 ${description}` : ""}`);
      return { ok: true, affected: targetDates.length };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : String(err) };
    } finally {
      lock.releaseLock();
    }
  }
  function removeDailyPriceRange(d1, d2) {
    if (!isValidYmd(d1) || !isValidYmd(d2)) return { ok: false, reason: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
    const targetSet = new Set(expandDateRangeInclusive(d1, d2));
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) return { ok: false, reason: "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" };
    try {
      const roomId = resolvePrimaryRoomId();
      if (!roomId) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" };
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const sheet = spreadsheet.getSheetByName("custom_daily_prices");
      if (!sheet) return { ok: false, reason: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 custom_daily_prices" };
      const values = sheet.getDataRange().getValues();
      const headers = values[0].map(String);
      const dateColIdx = headers.indexOf("date");
      const roomColIdx = headers.indexOf("room_id");
      if (dateColIdx === -1 || roomColIdx === -1) return { ok: false, reason: "\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E0A\u0E35\u0E15 custom_daily_prices \u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A" };
      const rowsToDelete = [];
      for (let i = 1; i < values.length; i++) {
        const cell = values[i][dateColIdx];
        if (!cell || String(values[i][roomColIdx]).trim() !== roomId) continue;
        if (targetSet.has(cellToYmd2(cell, timeZone))) rowsToDelete.push(i + 1);
      }
      if (rowsToDelete.length === 0) return { ok: true, affected: 0 };
      for (let k = rowsToDelete.length - 1; k >= 0; k--) sheet.deleteRow(rowsToDelete[k]);
      clearCache("custom_daily_prices");
      writeAuditLog("REMOVE_DAILY_PRICE", "daily_price", `${d1}..${d2}`, `Removed special price for ${rowsToDelete.length} day(s) ${d1}..${d2}`);
      return { ok: true, affected: rowsToDelete.length };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : String(err) };
    } finally {
      lock.releaseLock();
    }
  }

  // src/adapters/serviceActions.ts
  function getBooking(bookingCode) {
    const sheet = getSpreadsheet().getSheetByName("bookings");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 bookings");
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return null;
    const headers = data[0].map(String);
    const codeIdx = headers.indexOf("booking_code");
    const rowIdx = data.findIndex((r, i) => i > 0 && String(r[codeIdx]) === bookingCode);
    if (rowIdx === -1) return null;
    const raw = data[rowIdx];
    const booking = {};
    headers.forEach((h, i) => {
      booking[h] = raw[i];
    });
    return { sheet, rowIdx: rowIdx + 1, booking, headers };
  }
  function getBookingServices(bookingId) {
    const sheet = getSpreadsheet().getSheetByName("booking_services");
    if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 booking_services");
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return { sheet, services: [], headers: data.length === 1 ? data[0].map(String) : [] };
    const headers = data[0].map(String);
    const bIdIdx = headers.indexOf("booking_id");
    const services = [];
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][bIdIdx]) === bookingId) {
        const sv = {};
        headers.forEach((h, j) => {
          sv[h] = data[i][j];
        });
        services.push({ rowIdx: i + 1, data: sv });
      }
    }
    return { sheet, services, headers };
  }
  function detailBookingRow(booking, timeZone) {
    const dateValue = (value) => value instanceof Date ? Utilities.formatDate(value, timeZone, "yyyy-MM-dd HH:mm:ss") : String(value || "").trim();
    return {
      id: String(booking.id || ""),
      booking_code: String(booking.booking_code || ""),
      status: String(booking.status || ""),
      hold_expires_at: dateValue(booking.hold_expires_at),
      created_at: dateValue(booking.created_at),
      check_in: dateValue(booking.check_in),
      check_out: dateValue(booking.check_out),
      room_id: String(booking.room_id || ""),
      guests_count: Number(booking.guests_count) || 0,
      total_price: Number(booking.total_price) || 0,
      currency: String(booking.currency || "THB"),
      guest_name: String(booking.guest_name || ""),
      guest_email: String(booking.guest_email || ""),
      phone: String(booking.phone || ""),
      arrival_time: String(booking.arrival_time || ""),
      special_requests: String(booking.special_requests || ""),
      source: String(booking.source || ""),
      payment_status: String(booking.payment_status || "")
    };
  }
  function detailServiceRow(service) {
    return {
      id: String(service.id || ""),
      booking_id: String(service.booking_id || ""),
      booking_code: String(service.booking_code || ""),
      service_id: String(service.service_id || ""),
      service_name_snapshot: String(service.service_name_snapshot || ""),
      qty: Number(service.qty) || 0,
      unit_price_snapshot: Number(service.unit_price_snapshot) || 0,
      nights_applied: Number(service.nights_applied) || 0,
      guests_applied: Number(service.guests_applied) || 0,
      line_total: Number(service.line_total) || 0
    };
  }
  function bookingDateToYmd(value, timeZone) {
    return value instanceof Date ? Utilities.formatDate(value, timeZone, "yyyy-MM-dd") : String(value || "").trim().split(/[ T]/)[0];
  }
  function writeAuditLog2(action, targetType, targetId, detail) {
    const sheet = getSpreadsheet().getSheetByName("audit_log");
    if (!sheet) return;
    const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
    const now = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
    let email = "system";
    try {
      email = Session.getActiveUser().getEmail() || "system";
    } catch (e) {
    }
    sheet.appendRow([
      Utilities.getUuid(),
      // 1: id
      now,
      // 2: timestamp
      email,
      // 3: admin_email
      action,
      // 4: action
      targetType,
      // 5: target_type
      targetId,
      // 6: target_id
      detail
      // 7: detail
    ]);
  }
  function getBookingDetailsForAdmin(bookingCode) {
    const b = getBooking(bookingCode);
    if (!b) return { ok: false, reason: "NOT_FOUND" };
    const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
    const svcs = getBookingServices(b.booking.id);
    const extraServices = getExtraServices(true).filter((s) => s.is_active).map((s) => ({
      id: s.id,
      name_th: s.name_th,
      name_en: s.name_en,
      description_th: s.description_th,
      description_en: s.description_en,
      price: Number(s.price) || 0,
      multiply_by_nights: s.multiply_by_nights === true,
      multiply_by_guests: s.multiply_by_guests === true,
      max_qty: Number(s.max_qty) || 0,
      is_active: true
    }));
    const payment_breakdown = splitBookingPayment(
      Number(b.booking.total_price) || 0,
      svcs.services.map((s) => s.data.line_total)
    );
    return {
      ok: true,
      booking: detailBookingRow(b.booking, timeZone),
      booking_services: svcs.services.map((s) => detailServiceRow(s.data)),
      available_extra_services: extraServices,
      payment_breakdown
    };
  }
  function updateBookingTotalPrice(bookingData, oldServices, newServices) {
    if (!bookingData) return;
    const oldTotal = oldServices.reduce((sum, s) => sum + (Number(s.data.line_total) || 0), 0);
    const newTotal = newServices.reduce((sum, s) => sum + (Number(s.line_total) || 0), 0);
    const diff = newTotal - oldTotal;
    if (diff === 0) return;
    const currentPrice = Number(bookingData.booking.total_price) || 0;
    const nextPrice = round2(currentPrice + diff);
    const tpIdx = bookingData.headers.indexOf("total_price");
    bookingData.sheet.getRange(bookingData.rowIdx, tpIdx + 1).setValue(nextPrice);
  }
  function manageBookingService(payload) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) {
      return { ok: false, reason: "BUSY" };
    }
    try {
      const { bookingCode, operation, serviceId, qty = 0 } = payload;
      const b = getBooking(bookingCode);
      if (!b) return { ok: false, reason: "NOT_FOUND", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07" };
      const bookingStatus = String(b.booking.status || "");
      if (bookingStatus !== "confirmed") {
        return { ok: false, reason: "BAD_REQUEST", message: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E49\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E19\u0E35\u0E49\u0E44\u0E14\u0E49" };
      }
      const svcs = getBookingServices(b.booking.id);
      if (operation === "add") {
        if (!Number.isInteger(qty) || qty <= 0) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0" };
        const allExtra = getExtraServices(true);
        const extra = allExtra.find((e) => e.id === serviceId);
        if (!extra) return { ok: false, reason: "BAD_REQUEST", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E23\u0E34\u0E21\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49" };
        if (!extra.is_active) return { ok: false, reason: "BAD_REQUEST", message: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E39\u0E48" };
        if (qty > extra.max_qty) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14" };
        if (extra.multiply_by_guests && qty > 1) return { ok: false, reason: "BAD_REQUEST", message: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E04\u0E34\u0E14\u0E15\u0E32\u0E21\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E41\u0E25\u0E49\u0E27" };
        const timeZone = getSpreadsheet().getSpreadsheetTimeZone();
        const checkIn = bookingDateToYmd(b.booking.check_in, timeZone);
        const checkOut = bookingDateToYmd(b.booking.check_out, timeZone);
        let totalNights;
        try {
          totalNights = expandNights(checkIn, checkOut).length;
        } catch (e) {
          return { ok: false, reason: "BAD_REQUEST", message: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
        }
        if (totalNights <= 0) return { ok: false, reason: "BAD_REQUEST", message: "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
        const guestsCount = Number(b.booking.guests_count) || 1;
        const nightsApplied = extra.multiply_by_nights ? totalNights : 1;
        const guestsApplied = extra.multiply_by_guests ? guestsCount : 1;
        const unitPrice = Number(extra.price) || 0;
        const lineTotal = round2(qty * unitPrice * nightsApplied * guestsApplied);
        const newRowData = {
          id: Utilities.getUuid(),
          booking_id: b.booking.id,
          booking_code: bookingCode,
          service_id: extra.id,
          service_name_snapshot: extra.name_th,
          qty,
          unit_price_snapshot: unitPrice,
          nights_applied: nightsApplied,
          guests_applied: guestsApplied,
          line_total: lineTotal
        };
        const rowArr = svcs.headers.map((h) => newRowData[h] !== void 0 ? newRowData[h] : "");
        let appendedRow = 0;
        try {
          svcs.sheet.appendRow(rowArr);
          appendedRow = svcs.sheet.getLastRow();
          updateBookingTotalPrice(b, svcs.services, [...svcs.services.map((s) => s.data), newRowData]);
        } catch (err) {
          if (appendedRow > 1) svcs.sheet.deleteRow(appendedRow);
          throw err;
        }
        clearCache("all_booking_services");
        try {
          writeAuditLog2("ADD_SERVICE", "booking", bookingCode, `Added ${extra.name_th} x${qty} to ${bookingCode} (+${lineTotal} THB)`);
        } catch (err) {
          console.error("manageBookingService audit error:", err instanceof Error ? err.message : "unknown error");
        }
        return { ok: true };
      }
      if (operation === "edit") {
        if (!Number.isInteger(qty) || qty <= 0) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E15\u0E47\u0E21\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 0" };
        const target = svcs.services.find((s) => String(s.data.service_id) === serviceId);
        if (!target) return { ok: false, reason: "NOT_FOUND", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E43\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07" };
        const currentExtra = getExtraServices(true).find((e) => e.id === serviceId);
        if (currentExtra && qty > currentExtra.max_qty) return { ok: false, reason: "BAD_REQUEST", message: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14" };
        if (currentExtra?.multiply_by_guests && qty > 1) return { ok: false, reason: "BAD_REQUEST", message: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E04\u0E34\u0E14\u0E15\u0E32\u0E21\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E1E\u0E31\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E41\u0E25\u0E49\u0E27" };
        const unitPrice = Number(target.data.unit_price_snapshot) || 0;
        const nightsApplied = Number(target.data.nights_applied) || 1;
        const guestsApplied = Number(target.data.guests_applied) || 1;
        const lineTotal = round2(qty * unitPrice * nightsApplied * guestsApplied);
        const updatedData = { ...target.data, qty, line_total: lineTotal };
        const newServices = svcs.services.map((s) => s.rowIdx === target.rowIdx ? updatedData : s.data);
        const qtyIdx = svcs.headers.indexOf("qty");
        const ltIdx = svcs.headers.indexOf("line_total");
        const totalIdx = b.headers.indexOf("total_price");
        try {
          svcs.sheet.getRange(target.rowIdx, qtyIdx + 1).setValue(qty);
          svcs.sheet.getRange(target.rowIdx, ltIdx + 1).setValue(lineTotal);
          updateBookingTotalPrice(b, svcs.services, newServices);
        } catch (err) {
          svcs.sheet.getRange(target.rowIdx, qtyIdx + 1).setValue(target.data.qty);
          svcs.sheet.getRange(target.rowIdx, ltIdx + 1).setValue(target.data.line_total);
          if (totalIdx !== -1) svcs.sheet.getRange(b.rowIdx, totalIdx + 1).setValue(b.booking.total_price);
          throw err;
        }
        clearCache("all_booking_services");
        try {
          writeAuditLog2("UPDATE_SERVICE", "booking", bookingCode, `Updated ${target.data.service_name_snapshot} to x${qty} on ${bookingCode} (New Total: ${lineTotal} THB)`);
        } catch (err) {
          console.error("manageBookingService audit error:", err instanceof Error ? err.message : "unknown error");
        }
        return { ok: true };
      }
      if (operation === "delete") {
        const target = svcs.services.find((s) => String(s.data.service_id) === serviceId);
        if (!target) return { ok: false, reason: "NOT_FOUND", message: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E43\u0E19\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07" };
        const newServices = svcs.services.filter((s) => s.rowIdx !== target.rowIdx).map((s) => s.data);
        const deletedRow = svcs.sheet.getRange(target.rowIdx, 1, 1, svcs.headers.length).getValues()[0];
        const totalIdx = b.headers.indexOf("total_price");
        try {
          svcs.sheet.deleteRow(target.rowIdx);
          updateBookingTotalPrice(b, svcs.services, newServices);
        } catch (err) {
          svcs.sheet.insertRowBefore(target.rowIdx);
          svcs.sheet.getRange(target.rowIdx, 1, 1, svcs.headers.length).setValues([deletedRow]);
          if (totalIdx !== -1) svcs.sheet.getRange(b.rowIdx, totalIdx + 1).setValue(b.booking.total_price);
          throw err;
        }
        clearCache("all_booking_services");
        try {
          writeAuditLog2("DELETE_SERVICE", "booking", bookingCode, `Deleted ${target.data.service_name_snapshot} from ${bookingCode}`);
        } catch (err) {
          console.error("manageBookingService audit error:", err instanceof Error ? err.message : "unknown error");
        }
        return { ok: true };
      }
      return { ok: false, reason: "BAD_REQUEST", message: "Operation \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
    } finally {
      lock.releaseLock();
    }
  }

  // src/core/monthlyReport.ts
  function countNights(checkIn, checkOut) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return 0;
    const [sy, sm, sd] = checkIn.split("-").map(Number);
    const [ey, em, ed] = checkOut.split("-").map(Number);
    const diff = Math.round((Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) / 864e5);
    return diff > 0 ? diff : 0;
  }
  function ymd(value) {
    return String(value || "").trim().split(" ")[0];
  }
  function buildMonthlyReport(bookings) {
    const byMonth = /* @__PURE__ */ new Map();
    for (const b of bookings) {
      if (b.status !== "confirmed") continue;
      const createdAt = ymd(b.created_at);
      const checkIn = ymd(b.check_in);
      const checkOut = ymd(b.check_out);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(createdAt)) continue;
      const month = createdAt.slice(0, 7);
      const revenue = Number(b.total_price) || 0;
      const row = byMonth.get(month) || { month, bookings: 0, nights: 0, revenue: 0, paid: 0 };
      row.bookings += 1;
      row.nights += countNights(checkIn, checkOut);
      row.revenue += revenue;
      if (b.payment_status === "paid") row.paid += revenue;
      byMonth.set(month, row);
    }
    return [...byMonth.values()].sort((a, b) => a.month > b.month ? -1 : a.month < b.month ? 1 : 0);
  }

  // src/core/icalImport.ts
  function otaNightKey(date, otaUid) {
    return `${date}|${otaUid}`;
  }
  function selectOtaRowsForCalendar(rows, otaName) {
    const target = otaName.trim().toLowerCase();
    if (!target) return [];
    return rows.filter((r) => r.source.trim().toLowerCase() === "ota" && r.reason.trim().toLowerCase() === target).map((r) => ({ rowIndex: r.rowIndex, date: r.date, ota_uid: r.ota_uid }));
  }
  function planOtaImport(events, existing) {
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

  // src/adapters/icalImport.ts
  var OTA_SOURCE = "ota";
  function readOtaConfigs() {
    try {
      return getOtaCalendars().map((c) => ({ name: c.ota_name, url: c.ical_url }));
    } catch {
      return [];
    }
  }
  function cellToYmd3(cell, timeZone) {
    return cell instanceof Date ? Utilities.formatDate(cell, timeZone, "yyyy-MM-dd") : String(cell).trim();
  }
  function writeSyncLog(spreadsheet, otaName, status, message, nowStr) {
    const sheet = spreadsheet.getSheetByName("ical_sync_log");
    if (!sheet) return;
    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(String);
    const nameIdx = headers.indexOf("ota_name");
    if (nameIdx === -1) return;
    const setCol = (row, col, val) => {
      const idx = headers.indexOf(col);
      if (idx !== -1) row[idx] = val;
    };
    let targetRow = -1;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][nameIdx]) === otaName) {
        targetRow = i + 1;
        break;
      }
    }
    if (targetRow === -1) {
      const row = new Array(headers.length).fill("");
      setCol(row, "id", Utilities.getUuid());
      setCol(row, "ota_name", otaName);
      setCol(row, "last_import_at", nowStr);
      setCol(row, "last_sync_at", nowStr);
      setCol(row, "status", status);
      setCol(row, "message", message);
      sheet.getRange(sheet.getLastRow() + 1, 1, 1, headers.length).setValues([row]);
    } else {
      const setCell = (col, val) => {
        const idx = headers.indexOf(col);
        if (idx !== -1) sheet.getRange(targetRow, idx + 1).setValue(val);
      };
      setCell("last_import_at", nowStr);
      setCell("last_sync_at", nowStr);
      setCell("status", status);
      setCell("message", message);
    }
  }
  function importOtaCalendars() {
    const configs = readOtaConfigs();
    const result = { ok: true, imported: [] };
    if (configs.length === 0) return result;
    const fetched = [];
    for (const cfg of configs) {
      try {
        const res = UrlFetchApp.fetch(cfg.url, {
          muteHttpExceptions: true,
          followRedirects: true,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; LittleBroBot/1.0)",
            "Accept": "text/calendar, text/plain, */*"
          }
        });
        const code = res.getResponseCode();
        if (code < 200 || code >= 300) {
          fetched.push({ name: cfg.name, events: null, isCalendar: false, error: `HTTP ${code}` });
          continue;
        }
        const raw = res.getContentText();
        const events = parseICal(raw);
        const rawPreview = raw.length > 0 ? raw.slice(0, 120) : "(\u0E27\u0E48\u0E32\u0E07)";
        fetched.push({ name: cfg.name, events, isCalendar: isICalendarDocument(raw), rawPreview });
      } catch (err) {
        fetched.push({
          name: cfg.name,
          events: null,
          isCalendar: false,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(3e4)) {
      return { ok: false, imported: [{ ota_name: "(all)", added: 0, removed: 0, status: "error", message: "\u0E23\u0E30\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 (lock)" }] };
    }
    try {
      const spreadsheet = getSpreadsheet();
      const timeZone = spreadsheet.getSpreadsheetTimeZone();
      const nowStr = Utilities.formatDate(/* @__PURE__ */ new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
      const sheet = spreadsheet.getSheetByName("blocked_dates");
      if (!sheet) throw new Error("\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E0A\u0E35\u0E15 blocked_dates");
      let touched = false;
      for (const f of fetched) {
        if (f.events === null) {
          const errMsg = f.error || "fetch \u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08";
          writeSyncLog(spreadsheet, f.name, "error", errMsg, nowStr);
          result.imported.push({ ota_name: f.name, added: 0, removed: 0, status: "error", message: errMsg });
          result.ok = false;
          continue;
        }
        if (f.events.length === 0 && !f.isCalendar) {
          const preview = f.rawPreview || "(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25)";
          const warnMsg = `response \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E44\u0E1F\u0E25\u0E4C\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19 \u2014 \u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22: ${preview}`;
          writeSyncLog(spreadsheet, f.name, "error", warnMsg, nowStr);
          result.imported.push({ ota_name: f.name, added: 0, removed: 0, status: "error", message: warnMsg });
          result.ok = false;
          continue;
        }
        const values = sheet.getDataRange().getValues();
        const headers = values[0].map(String);
        const dateIdx = headers.indexOf("date");
        const sourceIdx = headers.indexOf("source");
        const uidIdx = headers.indexOf("ota_uid");
        const reasonIdx = headers.indexOf("reason");
        if (dateIdx === -1 || sourceIdx === -1 || uidIdx === -1 || reasonIdx === -1) {
          throw new Error("blocked_dates \u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C date/source/ota_uid/reason");
        }
        const blockedRows = [];
        for (let i = 1; i < values.length; i++) {
          blockedRows.push({
            rowIndex: i + 1,
            date: cellToYmd3(values[i][dateIdx], timeZone),
            source: String(values[i][sourceIdx]),
            reason: String(values[i][reasonIdx]),
            ota_uid: String(values[i][uidIdx]).trim()
          });
        }
        const existingOta = selectOtaRowsForCalendar(blockedRows, f.name);
        const plan = planOtaImport(f.events, existingOta);
        for (const rowIndex of plan.rowsToDelete) {
          sheet.deleteRow(rowIndex);
        }
        if (plan.toAdd.length > 0) {
          const newRows = plan.toAdd.map((night) => headers.map((h) => {
            switch (h) {
              case "id":
                return Utilities.getUuid();
              case "date":
                return night.date;
              case "source":
                return OTA_SOURCE;
              case "ota_uid":
                return night.ota_uid;
              case "reason":
                return f.name;
              case "created_at":
                return nowStr;
              default:
                return "";
            }
          }));
          sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length).setValues(newRows);
        }
        if (plan.toAdd.length > 0 || plan.rowsToDelete.length > 0) touched = true;
        const msg = `\u0E40\u0E1E\u0E34\u0E48\u0E21 ${plan.toAdd.length} / \u0E25\u0E1A ${plan.rowsToDelete.length} \u0E04\u0E37\u0E19 (\u0E23\u0E27\u0E21\u0E04\u0E27\u0E23\u0E1A\u0E25\u0E47\u0E2D\u0E01 ${plan.desiredNightCount})`;
        writeSyncLog(spreadsheet, f.name, "success", msg, nowStr);
        result.imported.push({ ota_name: f.name, added: plan.toAdd.length, removed: plan.rowsToDelete.length, status: "success", message: msg });
      }
      if (touched) {
        clearCache("blocked_dates");
        clearCache("blocked_dates_detailed");
        clearCache("ical_sync_log");
        const summary = result.imported.map((r) => `${r.ota_name}:+${r.added}/-${r.removed}`).join(", ");
        writeAuditLog("IMPORT_OTA", "blocked_date", "ota_import", `OTA import \u2014 ${summary}`);
      } else {
        clearCache("ical_sync_log");
      }
      return result;
    } catch (err) {
      return { ok: false, imported: [{ ota_name: "(all)", added: 0, removed: 0, status: "error", message: err instanceof Error ? err.message : String(err) }] };
    } finally {
      lock.releaseLock();
    }
  }

  // src/adapters/otaDiagnostics.ts
  function maskIcalUrl(url) {
    return url ? `[iCal URL \u0E16\u0E39\u0E01\u0E1B\u0E34\u0E14\u0E1A\u0E31\u0E07 \u2014 ${url.length} \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23]` : "";
  }
  function oneLinePreview(s, maxLen = 150) {
    return String(s).replace(/[\r\n\t]+/g, " ").substring(0, maxLen);
  }
  function checkOtaUrls() {
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

  // src/main.ts
  var APP_VERSION = "1.0.0";
  function findRoom(roomId, rooms) {
    return rooms.find((r) => r.id === roomId);
  }
  function handleAvailability(payload) {
    const result = validateAvailabilityRequest(payload);
    if (!result.valid) {
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E33\u0E02\u0E2D\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07", { errors: result.errors });
    }
    const { checkIn, checkOut } = result.value;
    const conflicts = findConflicts(checkIn, checkOut, getBlockedDates());
    if (conflicts.length > 0) {
      return fail("DATES_UNAVAILABLE", "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07", { conflicts });
    }
    return ok({ available: true });
  }
  function handleQuote(payload) {
    const availability = validateAvailabilityRequest(payload);
    if (!availability.valid) {
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E33\u0E02\u0E2D\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07", { errors: availability.errors });
    }
    const raw = payload;
    const roomId = raw.roomId;
    if (typeof roomId !== "string" || roomId.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 roomId");
    }
    const settings = getSettings();
    const room = findRoom(roomId, getRooms());
    if (!room) return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38");
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
        lang: raw.lang === "en" ? "en" : settings.default_lang
      });
      return ok(quote);
    } catch (err) {
      console.error("handleQuote error:", err instanceof Error ? err.message : "unknown error");
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E43\u0E2B\u0E49\u0E21\u0E32\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E04\u0E33\u0E19\u0E27\u0E13\u0E23\u0E32\u0E04\u0E32\u0E44\u0E14\u0E49");
    }
  }
  function handleCreateBooking(payload) {
    const result = validateBookingRequest(payload);
    if (!result.valid) {
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E33\u0E02\u0E2D\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07", { errors: result.errors });
    }
    const room = findRoom(result.value.roomId, getRooms());
    if (!room) return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E49\u0E2D\u0E07\u0E1E\u0E31\u0E01\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38");
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
      lang: result.value.lang
    });
    if (!booking.ok) {
      if (booking.reason === "BUSY") {
        return fail("BUSY", "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2D\u0E37\u0E48\u0E19\u0E2D\u0E22\u0E39\u0E48 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07");
      }
      return fail("DATES_UNAVAILABLE", "\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E1E\u0E34\u0E48\u0E07\u0E16\u0E39\u0E01\u0E08\u0E2D\u0E07\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27", { conflicts: booking.conflicts });
    }
    try {
      sendPaymentRequestEmail(booking.booking_code);
    } catch (err) {
      console.error("sendPaymentRequestEmail error:", err instanceof Error ? err.message : "unknown error");
    }
    return ok({ booking_code: booking.booking_code, quote: booking.quote });
  }
  function handleGetCatalog() {
    return ok(getCatalog());
  }
  function handleGetPaymentInfo(payload) {
    const raw = payload;
    const bookingCode = raw.bookingCode;
    if (typeof bookingCode !== "string" || bookingCode.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 bookingCode");
    }
    const result = getPaymentInfo(bookingCode);
    if (!result.ok) {
      if (result.reason === "HOLD_EXPIRED") {
        return fail("BAD_REQUEST", "\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E19\u0E35\u0E49\u0E2B\u0E21\u0E14\u0E40\u0E27\u0E25\u0E32\u0E41\u0E25\u0E49\u0E27", { reason: "HOLD_EXPIRED" });
      }
      return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
    }
    return ok(result.data);
  }
  function handleConfirmBooking(payload) {
    const raw = payload;
    const bookingCode = raw.bookingCode;
    if (typeof bookingCode !== "string" || bookingCode.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 bookingCode");
    }
    const result = confirmBookingByAdmin(bookingCode);
    if (!result.ok) {
      return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E17\u0E35\u0E48\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E44\u0E14\u0E49");
    }
    return ok(result.data);
  }
  function handleCancelBooking(payload) {
    const raw = payload;
    const bookingCode = raw.bookingCode;
    if (typeof bookingCode !== "string" || bookingCode.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 bookingCode");
    }
    const reason = raw.reason ? String(raw.reason) : "";
    const result = cancelBookingByAdmin(bookingCode, reason);
    if (!result.ok) {
      return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
    }
    return ok(result.data);
  }
  function handleEditBookingDetails(payload) {
    const raw = payload;
    const bookingCode = raw.bookingCode;
    if (typeof bookingCode !== "string" || bookingCode.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 bookingCode");
    }
    const fields = raw.fields;
    if (!fields || typeof fields !== "object") {
      return fail("BAD_REQUEST", "fields \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 object");
    }
    const result = updateBookingDetails(bookingCode, fields);
    if (!result.ok) {
      return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
    }
    return ok(result.data);
  }
  function handleGetAdminExtraServices() {
    return ok({ services: getExtraServices() });
  }
  function handleCreateExtraService(payload) {
    const raw = payload;
    const service = raw.service;
    if (!service || typeof service !== "object") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E23\u0E34\u0E21");
    }
    const result = createExtraService(service);
    if (!result.ok) return fail("BAD_REQUEST", result.message || "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E23\u0E34\u0E21\u0E44\u0E14\u0E49");
    return ok(result.data);
  }
  function handleUpdateExtraService(payload) {
    const raw = payload;
    const id = raw.id;
    const fields = raw.fields;
    if (typeof id !== "string" || !fields || typeof fields !== "object") {
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07");
    }
    const result = updateExtraService(id, fields);
    if (!result.ok) return fail("NOT_FOUND", result.message || "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E23\u0E34\u0E21");
    return ok(result.data);
  }
  function handleDeleteExtraService(payload) {
    const raw = payload;
    const id = raw.id;
    if (typeof id !== "string") return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 id");
    const result = deleteExtraService(id);
    if (!result.ok) return fail("NOT_FOUND", result.message || "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E2A\u0E23\u0E34\u0E21");
    return ok(result.data);
  }
  function handleBlockDate(payload) {
    const raw = payload;
    const { start, end, note } = raw;
    if (!start || !end) return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 start \u0E41\u0E25\u0E30 end");
    const result = blockDateRange(start, end, note);
    if (!result.ok) return fail("BAD_REQUEST", result.message || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E1A\u0E25\u0E47\u0E2D\u0E01\u0E27\u0E31\u0E19");
    return ok(result.data);
  }
  function handleUnblockDate(payload) {
    const raw = payload;
    const { start, end } = raw;
    if (!start || !end) return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 start \u0E41\u0E25\u0E30 end");
    const result = unblockDateRange(start, end);
    if (!result.ok) return fail("BAD_REQUEST", result.message || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E1B\u0E25\u0E14\u0E1A\u0E25\u0E47\u0E2D\u0E01");
    return ok(result.data);
  }
  function handleSetDailyPrice(payload) {
    const raw = payload;
    const { roomId, start, end, price, minNights, description } = raw;
    if (!roomId || !start || !end || price === void 0) {
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19");
    }
    const result = setDailyPriceRange(roomId, start, end, price, minNights, description);
    if (!result.ok) return fail("BAD_REQUEST", result.message || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14");
    return ok(result.data);
  }
  function handleRemoveDailyPrice(payload) {
    const raw = payload;
    const { roomId, start, end } = raw;
    if (!roomId || !start || !end) return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 roomId, start, end");
    const result = removeDailyPriceRange(roomId, start, end);
    if (!result.ok) return fail("BAD_REQUEST", result.message || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14");
    return ok(result.data);
  }
  function handleGetBookingDetails(payload) {
    const raw = payload;
    const bookingCode = raw.bookingCode;
    if (typeof bookingCode !== "string" || bookingCode.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 bookingCode");
    }
    const details = getBookingDetailsForAdmin(bookingCode);
    if (!details) return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
    return ok(details);
  }
  function handleManageBookingService(payload) {
    const raw = payload;
    const { bookingCode, operation, serviceId, qty } = raw;
    if (!bookingCode || !operation || !serviceId) {
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19");
    }
    const result = manageBookingService(bookingCode, operation, serviceId, qty);
    if (!result.ok) return fail("BAD_REQUEST", result.message || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14");
    return ok(result.data);
  }
  function handleAddServiceToBooking(payload) {
    const raw = payload;
    const { bookingCode, serviceId, qty } = raw;
    if (!bookingCode || !serviceId || qty === void 0) {
      return fail("BAD_REQUEST", "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19");
    }
    const result = addServiceToBooking(bookingCode, serviceId, qty);
    if (!result.ok) return fail("BAD_REQUEST", result.message || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14");
    return ok(result.data);
  }
  function handleListBookings() {
    const bookings = listBookingsForAdmin();
    return ok({ bookings });
  }
  function handleGetAdminDashboardData() {
    const bookings = listBookingsForAdmin();
    const rooms = getRooms();
    const extraServices = getExtraServices();
    const blockedDates = getBlockedDates();
    return ok({ bookings, rooms, extraServices, blockedDates });
  }
  function handleAdminReportMonth(payload) {
    const raw = payload;
    const yearMonth = raw.yearMonth;
    if (typeof yearMonth !== "string" || !/^\d{4}-\d{2}$/.test(yearMonth)) {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 yearMonth \u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A yyyy-mm");
    }
    const bookings = listBookingsForAdmin();
    const report = buildMonthlyReport(yearMonth, bookings);
    return ok(report);
  }
  function handleListOtaCalendars() {
    return ok({ calendars: [] });
  }
  function handleGetAdminOtaData() {
    return ok({ calendars: [] });
  }
  function handleSyncOta() {
    const result = importOtaCalendars();
    return ok(result);
  }
  function handleGetSlip(payload) {
    const raw = payload;
    const bookingCode = raw.bookingCode;
    if (typeof bookingCode !== "string" || bookingCode.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 bookingCode");
    }
    const result = getSlipForAdmin(bookingCode);
    if (!result.ok) {
      return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
    }
    return ok({ slip_url: result.slip_url });
  }
  function handleUploadSlip(payload) {
    const raw = payload;
    const { bookingCode, base64, slipRef } = raw;
    if (typeof bookingCode !== "string" || bookingCode.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 bookingCode");
    }
    if (typeof base64 !== "string" || base64.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E41\u0E19\u0E1A\u0E44\u0E1F\u0E25\u0E4C\u0E2A\u0E25\u0E34\u0E1B");
    }
    if (typeof slipRef !== "string" || slipRef.trim() === "") {
      return fail("BAD_REQUEST", "\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E38 slipRef");
    }
    const result = uploadSlip(bookingCode, base64, slipRef);
    if (!result.ok) {
      if (result.reason === "BOOKING_NOT_FOUND") return fail("NOT_FOUND", "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E35\u0E49");
      if (result.reason === "DUPLICATE_SLIP") return fail("BAD_REQUEST", "\u0E2A\u0E25\u0E34\u0E1B\u0E19\u0E35\u0E49\u0E40\u0E04\u0E22\u0E16\u0E39\u0E01\u0E43\u0E0A\u0E49\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27", { reason: "DUPLICATE_SLIP" });
      if (result.reason === "HOLD_EXPIRED") return fail("BAD_REQUEST", "\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E19\u0E35\u0E49\u0E2B\u0E21\u0E14\u0E40\u0E27\u0E25\u0E32\u0E41\u0E25\u0E49\u0E27", { reason: "HOLD_EXPIRED" });
      if (result.reason === "BUSY") return fail("BUSY", "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2D\u0E37\u0E48\u0E19\u0E2D\u0E22\u0E39\u0E48 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48");
      return fail("BAD_REQUEST", "\u0E44\u0E1F\u0E25\u0E4C\u0E2A\u0E25\u0E34\u0E1B\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07", { errors: result.errors });
    }
    try {
      if (result.verified) {
        sendPaymentConfirmedEmail(bookingCode);
      } else {
        sendSlipReceivedEmail(bookingCode);
      }
    } catch (err) {
      console.error("uploadSlip email error:", err instanceof Error ? err.message : "unknown error");
    }
    return ok({ slip_url: result.slip_url, verified: result.verified, reason: result.reason });
  }
  var actionHandlers = {
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
    syncOta: () => handleSyncOta()
  };
  function doPost(e) {
    return dispatchPost(e, actionHandlers);
  }
  function doGet(e) {
    return dispatchGet(e, APP_VERSION);
  }
  function syncOtaCalendars() {
    importOtaCalendars();
  }
  function setupTriggers() {
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
  function onOpen() {
    SpreadsheetApp.getUi().createMenu("\u{1F527} \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E2D\u0E07").addItem("\u23F0 \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 Trigger (\u0E2B\u0E21\u0E14\u0E40\u0E27\u0E25\u0E32\u0E08\u0E2D\u0E07)", "setupTriggers").addSeparator().addItem("\u2709\uFE0F \u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25", "menuTestEmails").addItem("\u{1F4CA} \u0E14\u0E39\u0E42\u0E04\u0E27\u0E15\u0E32\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E04\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D", "menuCheckQuota").addItem("\u{1F50D} \u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E04\u0E23\u0E1A", "menuVerifySetup").addSeparator().addItem("\u{1F504} Sync OTA \u0E17\u0E31\u0E19\u0E17\u0E35", "menuSyncOta").addItem("\u{1F50D} \u0E15\u0E23\u0E27\u0E08 URL OTA", "menuCheckOtaUrls").addSeparator().addItem("\u{1F5D1}\uFE0F \u0E25\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A (\u0E2D\u0E31\u0E19\u0E15\u0E23\u0E32\u0E22)", "menuCleanup").addToUi();
  }
  function menuTestEmails() {
    const ui = SpreadsheetApp.getUi();
    const email = Session.getActiveUser().getEmail();
    if (!email) {
      ui.alert("\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2B\u0E32\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19\u0E44\u0E14\u0E49");
      return;
    }
    const result = ui.alert("\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25", `\u0E08\u0E30\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A 3 \u0E09\u0E1A\u0E31\u0E1A\u0E44\u0E1B\u0E22\u0E31\u0E07 ${email}`, ui.ButtonSet.OK_CANCEL);
    if (result !== ui.Button.OK) return;
    try {
      verifyMailServiceSetup();
      ui.alert("\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27");
    } catch (err) {
      ui.alert("\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25", err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
    }
  }
  function menuCheckQuota() {
    const ui = SpreadsheetApp.getUi();
    const quota = MailApp.getRemainingDailyQuota();
    ui.alert("\u0E42\u0E04\u0E27\u0E15\u0E32\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E04\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D", `\u0E42\u0E04\u0E27\u0E15\u0E32\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E04\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49: ${quota} \u0E09\u0E1A\u0E31\u0E1A`, ui.ButtonSet.OK);
  }
  function menuVerifySetup() {
    const ui = SpreadsheetApp.getUi();
    try {
      verifyMailServiceSetup();
      ui.alert("\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07", "\u0E23\u0E30\u0E1A\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19", ui.ButtonSet.OK);
    } catch (err) {
      ui.alert("\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E1E\u0E1A\u0E1B\u0E31\u0E0D\u0E2B\u0E32", err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
    }
  }
  function menuCleanup() {
    const ui = SpreadsheetApp.getUi();
    const confirm = ui.prompt("\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E25\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", "\u0E1E\u0E34\u0E21\u0E1E\u0E4C LBDELETE \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E25\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", ui.ButtonSet.OK_CANCEL);
    if (confirm.getSelectedButton() !== ui.Button.OK || confirm.getResponseText().trim() !== "LBDELETE") {
      ui.alert("\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E01\u0E32\u0E23\u0E25\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25");
      return;
    }
    const deletedCounts = debugCleanupTestData();
    const summary = Object.entries(deletedCounts).map(([sheetName, count]) => `${sheetName}: ${count} \u0E41\u0E16\u0E27`).join("\n");
    ui.alert("\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22", summary, ui.ButtonSet.OK);
  }
  function menuSyncOta() {
    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    try {
      ss.toast("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E0B\u0E34\u0E07\u0E04\u0E4C\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19 OTA...", "Sync OTA", 30);
      const result = importOtaCalendars();
      ui.alert("\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E0B\u0E34\u0E07\u0E04\u0E4C OTA", `\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22: ${result.imported?.length || 0} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23`, ui.ButtonSet.OK);
    } catch (err) {
      ui.alert("\u0E0B\u0E34\u0E07\u0E04\u0E4C OTA \u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
    }
  }
  function menuCheckOtaUrls() {
    const ui = SpreadsheetApp.getUi();
    try {
      const checks = checkOtaUrls();
      const okCount = checks.filter((c) => c.ok).length;
      ui.alert("\u0E1C\u0E25\u0E15\u0E23\u0E27\u0E08 URL OTA", `\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E44\u0E14\u0E49 ${okCount} / ${checks.length} \u0E40\u0E08\u0E49\u0E32`, ui.ButtonSet.OK);
    } catch (err) {
      ui.alert("\u0E15\u0E23\u0E27\u0E08\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", err instanceof Error ? err.message : String(err), ui.ButtonSet.OK);
    }
  }
  return __toCommonJS(main_exports);
})();

// --- Google Apps Script Global Triggers & Entry Points ---
function doGet(e) { return _App.doGet(e); }
function doPost(e) { return _App.doPost(e); }
function onOpen() { return _App.onOpen(); }
function setupTriggers() { return _App.setupTriggers(); }
function syncOtaCalendars() { return _App.syncOtaCalendars(); }
function menuTestEmails() { return _App.menuTestEmails(); }
function menuCheckQuota() { return _App.menuCheckQuota(); }
function menuVerifySetup() { return _App.menuVerifySetup(); }
function menuCleanup() { return _App.menuCleanup(); }
function menuSyncOta() { return _App.menuSyncOta(); }
function menuCheckOtaUrls() { return _App.menuCheckOtaUrls(); }

