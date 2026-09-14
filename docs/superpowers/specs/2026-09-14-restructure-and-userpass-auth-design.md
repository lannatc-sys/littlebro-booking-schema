# Design: Restructure Modular TypeScript, Router & Username/Password Authentication

**Date:** 2026-09-14  
**Project:** littlebro-booking-schema (Google Apps Script Backend & Web Frontend)  
**Status:** Approved  

---

## 1. Context & Objectives

The project currently consists of a single 4,119-line Google Apps Script file (`get.gs`) that was generated from a modular `src/` directory without a web frontend or structured routing.

### Objectives:
1. **Restore Modular Architecture:** Unpack and restructure the code into standard TypeScript ES modules under `src/core/`, `src/adapters/`, `src/types/`, `src/router/`, `src/views/`, and `src/main.ts`.
2. **Implement Dedicated Router System (`src/router/`):**
   - **GET Router (`getRouter.ts`):** Serve HTML views (`index.html` for customer booking, `admin.html` for admin dashboard) via `HtmlService`, as well as API endpoints (`action=health`, `action=ical`).
   - **POST Router (`postRouter.ts`):** Action-based router replacing the monolithic switch-case, cleanly dividing Public routes, Auth routes, and Admin-guarded routes.
3. **Implement Username + Password Authentication:** Replace legacy Google ID Token and Facebook OAuth login with username and password authentication for admin access.
4. **Provide Responsive Web Views (`src/views/`):**
   - `index.html`: Customer booking frontend (room selection, date picker, real-time quote, PromptPay QR display, and slip upload).
   - `admin.html`: Admin dashboard (username/password login form, booking list, payment status, slip modal, confirmation/cancel actions).
5. **Build Pipeline:** Add `esbuild` to compile and bundle TypeScript and inline/copy HTML templates into a production-ready Google Apps Script project.
6. **Unit Testing:** Configure `vitest` to run tests locally for core business logic and router handlers.

---

## 2. Router Architecture (`src/router/`)

### 2.1 GET Router (`src/router/getRouter.ts`)
Dispatches `doGet(e)` events:
- **HTML Views:**
  - `?page=admin` -> Serves `views/admin.html` (with viewport and title)
  - Default (no page / `?page=booking`) -> Serves `views/index.html` (Customer booking interface)
- **API Endpoints:**
  - `?action=health` -> Returns JSON `{ ok: true, data: { status: "ok", version: "1.0.0" } }`
  - `?action=ical` -> Returns `text/calendar` iCal feed (with optional token verification)

### 2.2 POST Router (`src/router/postRouter.ts`)
Dispatches `doPost(e)` events with clean middleware:
- **Middleware:** Payload size check, JSON body parse, rate limiting check.
- **Route Groups:**
  - **Public Routes:** `getCatalog`, `availability`, `quote`, `createBooking`, `getPaymentInfo`, `uploadSlip`
  - **Auth Routes:** `adminLogin`, `adminLogout`
  - **Admin Guarded Routes (Auto-checked with `requireAdmin`):**
    - Bookings: `listBookings`, `getSlip`, `confirmBooking`, `cancelBooking`, `editBookingDetails`, `getBookingDetails`
    - Services: `manageBookingService`, `addServiceToBooking`, `getAdminExtraServices`, `createExtraService`, `updateExtraService`, `deleteExtraService`
    - Calendar & Prices: `blockDate`, `unblockDate`, `setDailyPrice`, `removeDailyPrice`
    - Reports & OTA: `getAdminDashboardData`, `adminReportMonth`, `listOtaCalendars`, `getAdminOtaData`, `syncOta`

---

## 3. Authentication Architecture (Username + Password)

### 3.1 Storage in `admin_users` Sheet
The Google Sheet tab `admin_users` will store admin accounts with columns:
- `username`: Unique username or email identifier (e.g. `admin` or `admin@hotel.com`).
- `password`: Password stored as a SHA-256 hex digest or plain text.
- `role`: Role string (e.g. `admin`, `manager`).
- `is_active`: Boolean (`true` or `false`).

### 3.2 Password Verification Logic
In `src/core/adminAuth.ts`:
- Support both SHA-256 hashed passwords (64 hex characters) and plain text passwords.
- Provide `verifyPassword(inputPassword, storedPassword)`:
  - If `storedPassword` is 64 hex characters, compute SHA-256 of `inputPassword` and compare.
  - Otherwise compare `inputPassword === storedPassword`.

### 3.3 Session Management
- `createSession(username)` generates a UUID token and stores it in `CacheService` for 6 hours (`SESSION:<token>` -> `username.toLowerCase()`).
- `requireAdmin(body)` verifies the token against active admin users.

---

## 4. Modular File Structure

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
│   ├── router/
│   │   ├── getRouter.ts       # GET dispatcher: Web views & GET API
│   │   └── postRouter.ts      # POST dispatcher: Public, Auth, & Admin routes
│   ├── views/
│   │   ├── index.html         # Customer Booking UI
│   │   └── admin.html         # Admin Dashboard & Login UI
│   └── main.ts                # Apps Script entry points (doGet, doPost, onOpen)
└── tests/
    ├── dateRange.test.ts
    ├── pricing.test.ts
    ├── adminAuth.test.ts
    ├── promptpay.test.ts
    ├── icalParser.test.ts
    └── postRouter.test.ts
```

---

## 5. Build System (esbuild)

- Input: `src/main.ts`
- Output: `get.gs`
- Target: `es2020`
- Bundle: `true`
- Global entry points preserved: `doGet`, `doPost`, `onOpen`, `testOtaUrls`
- Views: Inlined or copied so `HtmlService` can access them.
