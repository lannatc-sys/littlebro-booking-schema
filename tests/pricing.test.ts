import { describe, it, expect } from 'vitest';
import {
  round2,
  getRawNightlyRates,
  applyPricingStrategy,
  getRequiredMinNights,
  splitBookingPayment,
} from '../src/core/pricing.js';

describe('Pricing Core Logic', () => {
  it('rounds numbers to 2 decimal places', () => {
    expect(round2(10.555)).toBe(10.56);
    expect(round2(10.554)).toBe(10.55);
    expect(round2(100)).toBe(100);
  });

  it('calculates raw nightly rates with custom prices', () => {
    const room = {
      id: 'room-1',
      base_price: 1000,
    };
    const settings = {
      base_price: 800,
    };
    const dailyPrices = [
      { date: '2026-09-15', price: 2000, room_id: 'room-1' },
    ];
    // 2026-09-14 to 2026-09-16 (nights: 2026-09-14, 2026-09-15)
    const rates = getRawNightlyRates('2026-09-14', '2026-09-16', dailyPrices, room, settings);

    expect(rates).toEqual([
      { date: '2026-09-14', price: 1000, is_custom: false },
      { date: '2026-09-15', price: 2000, is_custom: true },
    ]);
  });

  it('splits booking payment into accommodation and services', () => {
    const split = splitBookingPayment(2500, [300, 200]);
    expect(split.services_subtotal).toBe(500);
    expect(split.accommodation_subtotal).toBe(2000);
    expect(split.total_price).toBe(2500);
  });
});
