# Design: Restructure Modular TypeScript & Username/Password Authentication

**Date:** 2026-09-14  
**Project:** Little Bro Booking (Google Apps Script Backend)  
**Status:** Approved  

---

## 1. Context & Objectives

The project currently consists of a single 4,119-line Google Apps Script file (`get.gs`) that was generated from a modular `src/` directory.

### Objectives:
1. **Restore Modular Architecture:** Unpack and restructure the code into standard TypeScript ES modules under `src/core/`, `src/adapters/`, `src/types/`, and `src/main.ts`.
2. **Implement Username + Password Authentication:** Replace the legacy Google ID Token and Facebook OAuth login with username and password authentication for admin access.
3. **Build Pipeline:** Add `esbuild` to compile and bundle the TypeScript source back into a production-ready `get.gs` file for Google Apps Script.
4. **Unit Testing:** Configure `vitest` to run tests locally for core business logic without depending on Google Apps Script APIs.

---

## 2. Authentication Architecture (Username + Password)

### 2.1 Storage in `admin_users` Sheet
The Google Sheet tab `admin_users` will store admin accounts with columns:
- `username`: Unique username or email identifier (e.g. `admin` or `admin@hotel.com`).
- `password`: Password stored as a SHA-256 hex digest or plain text (for easy setup).
- `role`: Role string (e.g. `admin`, `manager`).
- `is_active`: Boolean (`true` or `false`).

### 2.2 Password Verification Logic
In `src/core/adminAuth.ts`:
- Support both SHA-256 hashed passwords (64 hex characters) and plain text passwords.
- Provide `verifyPassword(inputPassword, storedPassword)`:
  - If `storedPassword` is 64 hex characters, compute SHA-256 of `inputPassword` and compare.
  - Otherwise compare `inputPassword === storedPassword`.
- Support hash generation helper `hashPasswordSha256(password)`.

### 2.3 API Endpoint (`adminLogin`)
- Request payload:
  ```json
  {
    "action": "adminLogin",
    "username": "admin",
    "password": "secretpassword"
  }
  ```
  *(Also accepts aliases `user` / `pass`)*
- Response:
  - Success: `{ "ok": true, "data": { "token": "<uuid-token>", "user": { "username": "admin", "role": "admin" } } }`
  - Failure: `{ "ok": false, "error": { "code": "FORBIDDEN", "message": "Username หรือ Password ไม่ถูกต้อง" } }`

### 2.4 Session Management & Compatibility
- `createSession(username)` generates a UUID token and stores it in `CacheService` for 6 hours (`SESSION:<token>` -> `username.toLowerCase()`).
- `requireAdmin(body)` verifies the token against active admin users in the `admin_users` sheet.
- All existing admin actions (`confirmBooking`, `cancelBooking`, `editBookingDetails`, `syncAllOtaCalendars`, etc.) continue working without breaking changes.

---

## 3. Modular File Structure

```text
little bro booking/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── build.js
├── get.gs
├── src/
│   ├── types/
│   │   ├── apiContract.ts
│   │   ├── catalog.ts
│   │   └── models.ts
│   ├── core/
│   │   ├── dateRange.ts
│   │   ├── pricing.ts
│   │   ├── adminAuth.ts
│   │   ├── bookingLogic.ts
│   │   ├── promptpay.ts
│   │   ├── slipValidation.ts
│   │   ├── slipOkClient.ts
│   │   ├── monthlyReport.ts
│   │   ├── icalParser.ts
│   │   └── icalImport.ts
│   ├── adapters/
│   │   ├── sheetsRepo.ts
│   │   ├── sessionService.ts
│   │   ├── adminService.ts
│   │   ├── mailService.ts
│   │   ├── bookingService.ts
│   │   ├── paymentService.ts
│   │   ├── adminActions.ts
│   │   ├── extraServiceAdmin.ts
│   │   ├── blockedDateAdmin.ts
│   │   ├── dailyPriceAdmin.ts
│   │   ├── otaDiagnostics.ts
│   │   ├── icalExport.ts
│   │   └── icalImportAdapter.ts
│   └── main.ts
└── tests/
    ├── dateRange.test.ts
    ├── pricing.test.ts
    ├── adminAuth.test.ts
    ├── promptpay.test.ts
    └── icalParser.test.ts
```

---

## 4. Build System (esbuild)

- Input: `src/main.ts`
- Output: `get.gs`
- Target: `es2020`
- Bundle: `true`
- Global entry points preserved: `doGet`, `doPost`, `onOpen`, `testOtaUrls`
- Banner: `// สร้างอัตโนมัติจาก src/ — ห้ามแก้ไฟล์นี้โดยตรง\n`

---

## 5. Verification Plan

1. **Unit Tests:** Run `npm test` via Vitest covering dateRange, pricing, adminAuth (hashing & verification), promptpay payload generation, and icalParser.
2. **Build Verification:** Run `npm run build` and verify `get.gs` is created with proper syntax and all top-level Google Apps Script entrypoints.
3. **Syntax Validation:** Validate bundled `get.gs` with Node.js parser (`node -c get.gs`).
