# Little Bro Booking — Modular Google Apps Script & Web App

ระบบจองห้องพักและจัดการการจองสำหรับ Little Bro Mae Hong Son รองรับทั้ง Frontend หน้าจองห้องพักสำหรับลูกค้า, แดชบอร์ดสำหรับผู้ดูแลระบบ (Admin Dashboard), และ Backend API บน Google Apps Script

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
little bro booking/
├── package.json               # คำสั่ง build, test และ dependencies
├── tsconfig.json              # กำหนดค่า TypeScript
├── vitest.config.ts           # กำหนดค่า Unit Testing
├── build.js                   # สคริปต์ esbuild รวมโค้ดเป็น get.gs
├── get.gs                     # ไฟล์ผลลัพธ์คอมไพล์แล้ว พร้อมใช้งานบน Google Apps Script
├── src/
│   ├── types/                 # TypeScript Interfaces & Types
│   │   ├── models.ts          # Room, BookingRecord, AdminUser, ExtraService
│   │   └── apiContract.ts     # Request/Response Types
│   ├── core/                  # Business Logic บริสุทธิ์ (Pure Logic รัน Unit Test ในเครื่องได้ 100%)
│   │   ├── dateRange.ts       # จัดการวันเข้า-ออก, ช่วงวันทับซ้อน (conflicts)
│   │   ├── pricing.ts         # คำนวณราคาห้องพัก, ราคาพิเศษรายวัน, บริการเสริม
│   │   ├── adminAuth.ts       # ตรวจสอบสิทธิ์ Admin (Username + Password / SHA-256)
│   │   ├── bookingLogic.ts    # Validate การจอง, รหัสจองห้องพัก
│   │   ├── promptpay.ts       # สร้าง EMVCo Payload สำหรับ PromptPay QR Code
│   │   ├── slipValidation.ts  # ตรวจสอบภาพสลิป Base64
│   │   ├── slipOkClient.ts    # ตัวแปลผล SlipOK
│   │   ├── monthlyReport.ts   # คำนวณสรุปยอดจองและรายได้
│   │   ├── icalParser.ts      # Parse และสร้างไฟล์ปฏิทิน iCal (.ics)
│   │   └── icalImport.ts      # ตรวจจับและวางแผนนำเข้าการจองจาก OTA
│   ├── adapters/              # ส่วนเชื่อมต่อ Google Apps Script
│   │   ├── sheetsRepo.ts      # อ่าน/เขียน Google Sheets
│   │   ├── sessionService.ts  # บันทึก Session Token ลง Script Cache (6 ชม.)
│   │   ├── adminService.ts    # ข้อมูล Admin และรายการจอง
│   │   ├── mailService.ts     # ส่งอีเมลยืนยันการจองผ่าน MailApp / GmailApp
│   │   ├── bookingService.ts  # บันทึกการจองลงชีต
│   │   ├── paymentService.ts  # จัดการสถานะชำระเงินและตรวจสลิป
│   │   ├── adminActions.ts    # ยืนยัน/ยกเลิกการจอง
│   │   ├── extraServiceAdmin.ts
│   │   ├── blockedDateAdmin.ts
│   │   ├── dailyPriceAdmin.ts
│   │   ├── otaDiagnostics.ts  # ตรวจสอบการเชื่อมต่อ OTA
│   │   ├── icalExport.ts      # ส่งออกปฏิทิน iCal
│   │   └── icalImport.ts      # ซิงก์ปฏิทิน OTA เข้าสู่ Google Sheets
│   ├── router/                # ระบบ Router แยกจัดการ Request
│   │   ├── getRouter.ts       # GET Router (สลับหน้าเว็บ HTML & API)
│   │   └── postRouter.ts      # POST Router (จัดการ Action Table, Rate Limit, Auth Guard)
│   ├── views/                 # หน้าเว็บ Responsive Web Views
│   │   ├── index.html         # หน้าจองห้องพักสำหรับลูกค้า (Booking UI)
│   │   └── admin.html         # หน้าแดชบอร์ดและ Login สำหรับ Admin (Admin UI)
│   └── main.ts                # Apps Script Entry Points (doGet, doPost, onOpen)
└── tests/                     # ชุดทดสอบ Unit Tests ด้วย Vitest
    ├── adminAuth.test.ts      # เทสต์การตรวจสอบรหัสผ่านและ SHA-256
    ├── dateRange.test.ts      # เทสต์การคำนวณวันเข้า-ออก
    ├── pricing.test.ts        # เทสต์การคำนวณราคาและมัดจำ
    ├── promptpay.test.ts      # เทสต์การสร้าง PromptPay QR
    ├── icalParser.test.ts     # เทสต์การอ่าน/สร้าง iCal
    └── postRouter.test.ts     # เทสต์การทำงานของ Router
```

---

## 🚀 คำสั่งพัฒนา (Development Commands)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รัน Unit Tests
```bash
npm test
```

### 3. Build รวมเป็นไฟล์ `get.gs`
```bash
npm run build
```
ไฟล์ผลลัพธ์จะถูกบันทึกที่ [get.gs](file:///d:/system%20make/little%20bro%20booking/get.gs) (พร้อมนำไปวางใน Google Apps Script Editor ทันที)

---

## 🌐 การทำงานของ Router และหน้าเว็บ

### 1. ฝั่งลูกค้า (Customer Booking Page)
- **URL**: `https://script.google.com/.../exec` (เปิดเข้าตามปกติ ไม่ต้องใส่พารามิเตอร์)
- **ฟังก์ชัน**:
  - เลือกวันที่เข้าพัก และจำนวนผู้เข้าพัก
  - ตรวจสอบห้องว่างและคำนวณราคาแบบเรียลไทม์
  - กรอกข้อมูลผู้จองและยืนยันการจอง
  - แสดง QR Code PromptPay สำหรับโอนเงิน
  - อัปโหลดสลิปยืนยันการโอนเงิน

### 2. ฝั่งผู้ดูแลระบบ (Admin Dashboard)
- **URL**: `https://script.google.com/.../exec?page=admin`
- **ฟังก์ชัน**:
  - เข้าสู่ระบบด้วย **Username + Password**
  - แสดงสถิติการจอง: รายการจองทั้งหมด, รอชำระ/รอตรวจสลิป, ยืนยันแล้ว
  - ตารางรายการจอง พร้อมปุ่ม **ดูสลิป**, **ยืนยันการจอง**, และ **ยกเลิกการจอง**
  - บันทึก Session ให้อัตโนมัติ (ไม่ต้องล็อกอินซ้ำบ่อยๆ)

---

## 🔐 การตั้งค่าบัญชี Admin ในชีต `admin_users`

ใน Google Sheets ให้สร้าง/ตรวจสอบแท็บชื่อ **`admin_users`** โดยมีคอลัมน์ดังนี้:

| username | password | role | is_active |
|---|---|---|---|
| admin | mypassword123 | superadmin | TRUE |
| manager | 2bb80e08f8863f8bb64f8958ea07f3cc52f6f5ff... | manager | TRUE |

> 💡 **หมายเหตุเรื่องรหัสผ่าน**:
> - สามารถใส่รหัสผ่านธรรมดา (Plain text) เช่น `mypassword123` ได้โดยตรง
> - หรือใส่เป็นรหัสผ่านที่เข้ารหัสด้วย **SHA-256** (ความยาว 64 ตัวอักษร) ก็ได้เช่นกัน ระบบรองรับทั้งสองแบบอัตโนมัติ
