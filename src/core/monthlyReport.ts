export function countNights(checkIn, checkOut) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return 0;
  const [sy, sm, sd] = checkIn.split("-").map(Number);
  const [ey, em, ed] = checkOut.split("-").map(Number);
  const diff = Math.round((Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) / 864e5);
  return diff > 0 ? diff : 0;
}
export function ymd(value) {
  return String(value || "").trim().split(" ")[0];
}
export function buildMonthlyReport(bookings) {
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
