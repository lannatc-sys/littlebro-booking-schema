import { describe, it, expect } from 'vitest';
import {
  isICalendarDocument,
  parseLine,
  parseICalDate,
  parseICal,
  buildICal,
} from '../src/core/icalParser.js';

describe('iCal Parser Core Logic', () => {
  const sampleIcal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Little Bro Booking//TH',
    'BEGIN:VEVENT',
    'UID:booking-123',
    'DTSTART;VALUE=DATE:20260914',
    'DTEND;VALUE=DATE:20260917',
    'SUMMARY:Airbnb Reservation',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  it('detects valid iCalendar document', () => {
    expect(isICalendarDocument(sampleIcal)).toBe(true);
    expect(isICalendarDocument('hello world')).toBe(false);
  });

  it('parses iCal lines correctly', () => {
    const parsed = parseLine('DTSTART;VALUE=DATE:20260914');
    expect(parsed?.name).toBe('DTSTART');
    expect(parsed?.value).toBe('20260914');
  });

  it('parses iCal date format into yyyy-mm-dd', () => {
    expect(parseICalDate('20260914')).toBe('2026-09-14');
    expect(parseICalDate('20260914T150000Z')).toBe('2026-09-14');
  });

  it('parses complete iCalendar events', () => {
    const events = parseICal(sampleIcal);
    expect(events.length).toBe(1);
    expect(events[0].uid).toBe('booking-123');
    expect(events[0].summary).toBe('Airbnb Reservation');
    expect(events[0].start).toBe('2026-09-14');
    expect(events[0].end).toBe('2026-09-17');
  });

  it('builds valid iCalendar format', () => {
    const events = [
      {
        uid: 'test-1',
        start: '2026-09-14',
        end: '2026-09-17',
        summary: 'Blocked Period',
      },
    ];
    const ics = buildICal(events);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('UID:test-1');
    expect(ics).toContain('END:VCALENDAR');
  });
});
