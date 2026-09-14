# Modular TypeScript Restructure & Username/Password Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the monolithic 4,119-line `get.gs` file into clean, modular TypeScript files under `src/`, implement username+password admin authentication, and configure esbuild bundling and Vitest unit testing.

**Architecture:** Clean Architecture separating pure business logic (`src/core/`) from Google Apps Script infrastructure adapters (`src/adapters/`). The entry points and web routing reside in `src/main.ts`, which compiles via esbuild into a unified Google Apps Script `get.gs` file.

**Tech Stack:** TypeScript, Node.js, esbuild, Vitest, Google Apps Script.

**Spec:** `docs/superpowers/specs/2026-09-14-restructure-and-userpass-auth-design.md`

## Global Constraints
- Do not break existing booking, quotation, payment, or iCal synchronization logic.
- Admin authentication must support username and password in `admin_users` sheet (with both SHA-256 and plain text support).
- Build output `get.gs` must expose top-level global functions required by Google Apps Script (`doGet`, `doPost`, `onOpen`, `testOtaUrls`).
- Core business logic in `src/core/` must remain pure TypeScript with zero Google Apps Script API calls (`SpreadsheetApp`, `UrlFetchApp`, `CacheService`).

---

### Task 1: Initialize Project Configuration & Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `build.js`

**Interfaces:**
- Consumes: Node.js runtime
- Produces: `npm run build` command, `npm test` command

- [ ] **Step 1: Create package.json with dependencies**
Create `package.json` with scripts:
`"build": "node build.js"`, `"test": "vitest run"`
and devDependencies: `esbuild`, `vitest`, `typescript`, `@types/node`.

- [ ] **Step 2: Create tsconfig.json**
Configure TypeScript with `"target": "ES2022"`, `"module": "ESNext"`, `"moduleResolution": "node"`, `"strict": false` (to match existing code pragmatism while allowing type safety), `"outDir": "dist"`.

- [ ] **Step 3: Create vitest.config.ts**
Configure Vitest for running `.test.ts` files under `tests/`.

- [ ] **Step 4: Create build.js esbuild script**
Write `build.js` that bundles `src/main.ts` into `get.gs` using esbuild with `bundle: true`, `format: "iife"`, `globalName: "App"`, and a banner assigning top-level functions (`doGet`, `doPost`, `onOpen`, `testOtaUrls`) to the global scope.

- [ ] **Step 5: Run npm install**
Run `npm install` to install dependencies and verify toolchain.

- [ ] **Step 6: Commit**
Commit changes to git.

---

### Task 2: Extract Types and Data Models

**Files:**
- Create: `src/types/models.ts`
- Create: `src/types/apiContract.ts`

**Interfaces:**
- Consumes: Domain definitions from `get.gs`
- Produces: TypeScript interfaces for `Booking`, `Room`, `ExtraService`, `AdminUser`, `PriceRule`, `QuoteResult`, `ApiResponse`.

- [ ] **Step 1: Write model interfaces in `src/types/models.ts`**
Define interfaces: `Room`, `ExtraService`, `BlockedDate`, `DailyPrice`, `AdminUser`, `BookingRecord`, `QuoteResult`.

- [ ] **Step 2: Write API contract types in `src/types/apiContract.ts`**
Define response wrapper types: `ApiResponse<T>`, `SuccessResponse<T>`, `ErrorResponse`, and request payload interfaces.

- [ ] **Step 3: Commit**
Commit changes to git.

---

### Task 3: Extract Core Pure Logic Modules & Unit Tests

**Files:**
- Create: `src/core/dateRange.ts`
- Create: `src/core/pricing.ts`
- Create: `src/core/promptpay.ts`
- Create: `src/core/slipValidation.ts`
- Create: `src/core/slipOkClient.ts`
- Create: `src/core/bookingLogic.ts`
- Create: `src/core/monthlyReport.ts`
- Create: `src/core/icalParser.ts`
- Create: `src/core/icalImport.ts`
- Test: `tests/dateRange.test.ts`
- Test: `tests/pricing.test.ts`
- Test: `tests/promptpay.test.ts`
- Test: `tests/icalParser.test.ts`

**Interfaces:**
- Consumes: Types from `src/types/`
- Produces: Exported pure functions (`ymdToDayNumber`, `dayNumberToYmd`, `nightsBetween`, `findConflicts`, `calculateQuote`, `generatePromptPayPayload`, `parseIcalEvents`, etc.)

- [ ] **Step 1: Extract dateRange.ts and write tests**
Extract `src/core/dateRange.ts`. Create `tests/dateRange.test.ts` testing `ymdToDayNumber`, `dayNumberToYmd`, `nightsBetween`, and `findConflicts`.

- [ ] **Step 2: Extract pricing.ts and write tests**
Extract `src/core/pricing.ts`. Create `tests/pricing.test.ts` testing base rate calculation, weekend pricing, and extra service line totals.

- [ ] **Step 3: Extract promptpay.ts and write tests**
Extract `src/core/promptpay.ts`. Create `tests/promptpay.test.ts` testing EMVCo QR code CRC16 and payload format.

- [ ] **Step 4: Extract icalParser.ts, icalImport.ts and write tests**
Extract `src/core/icalParser.ts` and `src/core/icalImport.ts`. Create `tests/icalParser.test.ts` testing VEVENT parsing.

- [ ] **Step 5: Extract slipValidation.ts, slipOkClient.ts, bookingLogic.ts, monthlyReport.ts**
Extract remaining pure core logic files.

- [ ] **Step 6: Run Vitest**
Run `npm test` to verify all unit tests pass.

- [ ] **Step 7: Commit**
Commit core modules and tests to git.

---

### Task 4: Implement Username + Password Authentication

**Files:**
- Create: `src/core/adminAuth.ts`
- Test: `tests/adminAuth.test.ts`

**Interfaces:**
- Consumes: `AdminUser` from `src/types/models.ts`
- Produces: `verifyPassword(inputPassword, storedPassword)`, `hashPasswordSha256(password)`, `validateAdminCredentials(username, password, adminUsers)`.

- [ ] **Step 1: Write failing test in `tests/adminAuth.test.ts`**
Test plain-text password verification, SHA-256 hashed password verification, and case-insensitive username lookup with inactive user rejection.

- [ ] **Step 2: Implement `src/core/adminAuth.ts`**
Implement `hashPasswordSha256`, `verifyPassword`, and `validateAdminCredentials`.

- [ ] **Step 3: Run Vitest**
Run `npx vitest run tests/adminAuth.test.ts` to verify tests pass.

- [ ] **Step 4: Commit**
Commit admin authentication module and test to git.

---

### Task 5: Extract Apps Script Adapters & Services

**Files:**
- Create: `src/adapters/sheetsRepo.ts`
- Create: `src/adapters/sessionService.ts`
- Create: `src/adapters/adminService.ts`
- Create: `src/adapters/mailService.ts`
- Create: `src/adapters/bookingService.ts`
- Create: `src/adapters/paymentService.ts`
- Create: `src/adapters/adminActions.ts`
- Create: `src/adapters/extraServiceAdmin.ts`
- Create: `src/adapters/blockedDateAdmin.ts`
- Create: `src/adapters/dailyPriceAdmin.ts`
- Create: `src/adapters/otaDiagnostics.ts`
- Create: `src/adapters/serviceActions.ts`
- Create: `src/adapters/icalExport.ts`
- Create: `src/adapters/icalImport.ts`

**Interfaces:**
- Consumes: `src/core/*`, Google Apps Script global types
- Produces: Data access and action handlers (`getSpreadsheet`, `readSheetRows`, `createSession`, `getAdminUsers`, `handleAdminLogin`, etc.)

- [ ] **Step 1: Extract sheetsRepo.ts and sessionService.ts**
Update `sheetsRepo.ts` to map `admin_users` columns `username` (or `email`), `password`, `role`, `is_active`.

- [ ] **Step 2: Implement new `handleAdminLogin` in adminService.ts / adminActions.ts**
Support `{ username, password }` authentication using `validateAdminCredentials`.

- [ ] **Step 3: Extract booking, payment, mail, and admin action adapters**
Extract all remaining adapters with proper imports and exports.

- [ ] **Step 4: Commit**
Commit adapter modules to git.

---

### Task 6: Assemble `src/main.ts` & Build `get.gs`

**Files:**
- Create: `src/main.ts`
- Modify: `build.js`
- Generate: `get.gs`

**Interfaces:**
- Consumes: All modules from `src/core/` and `src/adapters/`
- Produces: Production-ready `get.gs` with `doGet`, `doPost`, `onOpen`, `testOtaUrls` at top-level.

- [ ] **Step 1: Wire all routers and entry points into `src/main.ts`**
Export `doGet`, `doPost`, `onOpen`, and other global trigger handlers. Update `doPost` action `"adminLogin"` to invoke the new username/password login handler.

- [ ] **Step 2: Run build**
Run `npm run build` to generate `get.gs`.

- [ ] **Step 3: Verify syntax of `get.gs`**
Run `node -c get.gs` to confirm valid JavaScript syntax.

- [ ] **Step 4: Run full test suite**
Run `npm test` to verify 100% of unit tests pass.

- [ ] **Step 5: Commit**
Commit complete restructured source, build script, and generated `get.gs` to git.
