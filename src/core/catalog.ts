export function toPublicRoom(r) {
  return {
    id: r.id,
    name_th: r.name_th,
    name_en: r.name_en,
    capacity_min: r.capacity_min,
    capacity_max: r.capacity_max,
    base_price: r.base_price
  };
}
export function toPublicService(s) {
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
export function toPublicSettings(settings) {
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
export function buildPublicCatalog(settings, rooms, services) {
  return {
    rooms: rooms.filter((r) => r.status === "active").map(toPublicRoom),
    services: services.filter((s) => s.is_active).slice().sort((a, b) => a.sort_order - b.sort_order).map(toPublicService),
    settings: toPublicSettings(settings)
  };
}
