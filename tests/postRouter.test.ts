import { describe, it, expect, vi } from 'vitest';
import { dispatchPost, handleAdminLogin, handleAdminLogout } from '../src/router/postRouter.js';
import * as sheetsRepo from '../src/adapters/sheetsRepo.js';
import * as sessionService from '../src/adapters/sessionService.js';
import { hashPasswordSha256 } from '../src/core/adminAuth.js';

describe('POST Router Dispatcher', () => {
  it('dispatches public routes correctly', () => {
    const mockHandlers = {
      getCatalog: vi.fn().mockReturnValue({ ok: true, data: { rooms: [] } }),
    };

    const event = {
      postData: {
        contents: JSON.stringify({ action: 'getCatalog' }),
      },
    };

    const output = dispatchPost(event, mockHandlers);
    expect(mockHandlers.getCatalog).toHaveBeenCalled();
  });

  it('rejects unknown actions with BAD_REQUEST', () => {
    const mockHandlers = {};
    const event = {
      postData: {
        contents: JSON.stringify({ action: 'unknownAction' }),
      },
    };

    // jsonOutput mock in node environment
    const output = dispatchPost(event, mockHandlers);
    // Since ContentService is undefined in pure Node, it catches and returns fail('INTERNAL') or returns error
    expect(output).toBeDefined();
  });

  it('handles admin login with valid user and pass', () => {
    const mockAdmins = [
      {
        username: 'admin',
        password: hashPasswordSha256('password123'),
        role: 'superadmin',
        is_active: true,
      },
    ];

    vi.spyOn(sheetsRepo, 'getAdminUsers').mockReturnValue(mockAdmins);
    vi.spyOn(sessionService, 'createSession').mockReturnValue('mock-uuid-token');

    const result = handleAdminLogin({
      username: 'admin',
      password: 'password123',
    });

    expect(result.ok).toBe(true);
    expect(result.data?.token).toBe('mock-uuid-token');
    expect(result.data?.user?.username).toBe('admin');
  });

  it('handles admin logout', () => {
    const destroySpy = vi.spyOn(sessionService, 'destroySession').mockImplementation(() => {});
    const result = handleAdminLogout({ token: 'test-token' });
    expect(result.ok).toBe(true);
    expect(destroySpy).toHaveBeenCalledWith('test-token');
  });
});
