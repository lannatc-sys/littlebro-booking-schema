import { expandNights, nightsBetween } from './dateRange';

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
export function getRawNightlyRates(checkIn, checkOut, dailyPrices, room, settings) {
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
export function applyPricingStrategy(rates, strategy) {
  if (strategy === "per_night") return rates.map((r) => ({ ...r }));
  const hasCustom = rates.some((r) => r.is_custom);
  if (!hasCustom) return rates.map((r) => ({ ...r }));
  const maxPrice = Math.max(...rates.map((r) => r.price));
  return rates.map((r) => ({ ...r, price: maxPrice, is_custom: true }));
}
export function getRequiredMinNights(checkIn, checkOut, dailyPrices, roomId, settings) {
  const nights = new Set(expandNights(checkIn, checkOut));
  let required = settings.min_nights || 1;
  for (const dp of dailyPrices) {
    if (dp.room_id === roomId && nights.has(dp.date) && dp.min_nights > required) {
      required = dp.min_nights;
    }
  }
  return required;
}
export function calculateServiceLine(service, qty, nights, guests, lang = "th") {
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
export function splitBookingPayment(totalPrice, lineTotals) {
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
export function calculateQuote(input) {
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
