import { describe, it, expect } from 'vitest';
import {
  ymdToDayNumber,
  dayNumberToYmd,
  isValidYmd,
  nightsBetween,
  expandNights,
  findConflicts,
  consolidateBlockedRanges,
} from '../src/core/dateRange.js';

describe('DateRange Core Logic', () => {
  it('converts YMD to day number and back correctly', () => {
    const ymd = '2026-09-14';
    const dayNumber = ymdToDayNumber(ymd);
    expect(dayNumberToYmd(dayNumber)).toBe(ymd);
  });

  it('validates YMD format correctly', () => {
    expect(isValidYmd('2026-09-14')).toBe(true);
    expect(isValidYmd('2026-02-29')).toBe(false); // 2026 is not a leap year
    expect(isValidYmd('invalid-date')).toBe(false);
  });

  it('calculates nights between dates', () => {
    expect(nightsBetween('2026-09-14', '2026-09-17')).toBe(3);
  });

  it('expands nights correctly', () => {
    const nights = expandNights('2026-09-14', '2026-09-17');
    expect(nights).toEqual(['2026-09-14', '2026-09-15', '2026-09-16']);
  });

  it('detects date conflicts against blocked dates', () => {
    const blocked = ['2026-09-15', '2026-09-20'];
    const conflicts = findConflicts('2026-09-14', '2026-09-17', blocked);
    expect(conflicts).toEqual(['2026-09-15']);
  });

  it('consolidates blocked ranges', () => {
    const blockedDays = ['2026-09-10', '2026-09-11', '2026-09-12', '2026-09-15'];
    const ranges = consolidateBlockedRanges(blockedDays);
    expect(ranges).toEqual([
      { start: '2026-09-10', end: '2026-09-13' },
      { start: '2026-09-15', end: '2026-09-16' },
    ]);
  });
});
