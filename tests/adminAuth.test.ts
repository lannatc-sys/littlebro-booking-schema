import { describe, it, expect } from 'vitest';
import {
  hashPasswordSha256,
  verifyPassword,
  isAdmin,
  validateAdminCredentials,
} from '../src/core/adminAuth.js';

describe('Admin Authentication Core Logic', () => {
  const adminUsers = [
    {
      username: 'admin',
      email: 'admin@hotel.com',
      password: 'plainpassword123',
      role: 'superadmin',
      is_active: true,
    },
    {
      username: 'manager',
      email: 'manager@hotel.com',
      // SHA-256 of 'secret567' is: 2bb80e08f8863f8bb64f8958ea07f3cc52f6f5ff6007ecfa71804f334bfb557b (example)
      password: hashPasswordSha256('secret567'),
      role: 'manager',
      is_active: true,
    },
    {
      username: 'inactive_user',
      email: 'inactive@hotel.com',
      password: 'mypassword',
      role: 'staff',
      is_active: false,
    },
  ];

  it('correctly hashes password with SHA-256', () => {
    const hash = hashPasswordSha256('admin1234');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).toBe(hashPasswordSha256('admin1234'));
    expect(hash).not.toBe(hashPasswordSha256('admin1235'));
  });

  it('verifies plain text password', () => {
    expect(verifyPassword('plainpassword123', 'plainpassword123')).toBe(true);
    expect(verifyPassword('wrongpass', 'plainpassword123')).toBe(false);
  });

  it('verifies SHA-256 hashed password', () => {
    const hash = hashPasswordSha256('secret567');
    expect(verifyPassword('secret567', hash)).toBe(true);
    expect(verifyPassword('wrongpass', hash)).toBe(false);
  });

  it('checks isAdmin case-insensitively by username or email', () => {
    expect(isAdmin('admin', adminUsers)).toBe(true);
    expect(isAdmin('ADMIN', adminUsers)).toBe(true);
    expect(isAdmin('admin@hotel.com', adminUsers)).toBe(true);
    expect(isAdmin('unknown', adminUsers)).toBe(false);
    expect(isAdmin('inactive_user', adminUsers)).toBe(false);
  });

  it('validates credentials for active admin with plain password', () => {
    const result = validateAdminCredentials('admin', 'plainpassword123', adminUsers);
    expect(result.ok).toBe(true);
    expect(result.admin?.username).toBe('admin');
    expect(result.admin?.role).toBe('superadmin');
  });

  it('validates credentials for active admin with SHA-256 password', () => {
    const result = validateAdminCredentials('manager', 'secret567', adminUsers);
    expect(result.ok).toBe(true);
    expect(result.admin?.username).toBe('manager');
  });

  it('rejects wrong password', () => {
    const result = validateAdminCredentials('manager', 'wrongpassword', adminUsers);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('ไม่ถูกต้อง');
  });

  it('rejects inactive user', () => {
    const result = validateAdminCredentials('inactive_user', 'mypassword', adminUsers);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('ถูกระงับ');
  });

  it('rejects non-existent username', () => {
    const result = validateAdminCredentials('nobody', 'password', adminUsers);
    expect(result.ok).toBe(false);
  });
});
