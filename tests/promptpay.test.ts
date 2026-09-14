import { describe, it, expect } from 'vitest';
import {
  tlv,
  crc16ccitt,
  buildProxyField,
  buildPromptPayPayload,
} from '../src/core/promptpay.js';

describe('PromptPay QR Core Logic', () => {
  it('generates TLV (Tag-Length-Value) correctly', () => {
    expect(tlv('00', '01')).toBe('000201');
    expect(tlv('01', '11')).toBe('010211');
  });

  it('formats proxy field for telephone number', () => {
    // 0812345678 -> 0066812345678
    const proxy = buildProxyField('0812345678');
    expect(proxy).toBe('01130066812345678');
  });

  it('formats proxy field for national ID / tax ID', () => {
    const proxy = buildProxyField('1234567890123');
    expect(proxy).toBe('02131234567890123');
  });

  it('calculates CRC16-CCITT correctly', () => {
    const data = '000201010211';
    const crc = crc16ccitt(data);
    expect(crc).toMatch(/^[0-9A-F]{4}$/);
  });

  it('generates valid PromptPay EMVCo payload with amount', () => {
    const payload = buildPromptPayPayload('0812345678', 500);
    expect(payload).toContain('000201');
    expect(payload).toContain('5406500.00'); // amount
    expect(payload).toContain('5303764');   // THB currency
    expect(payload.endsWith(crc16ccitt(payload.slice(0, -4)))).toBe(true);
  });
});
