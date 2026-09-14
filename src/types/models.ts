// src/types/models.ts

export interface Room {
  id: string;
  name_th: string;
  name_en: string;
  base_price: number;
  max_guests: number;
  description_th?: string;
  description_en?: string;
  images?: string[];
  is_active: boolean;
}

export interface ExtraService {
  id: string;
  name_th: string;
  name_en: string;
  price: number;
  max_qty: number;
  multiply_by_nights: boolean;
  multiply_by_guests: boolean;
  is_active: boolean;
}

export interface BlockedDate {
  date: string; // yyyy-mm-dd
  source?: string;
  note?: string;
}

export interface DailyPrice {
  room_id: string;
  date: string; // yyyy-mm-dd
  price: number;
  min_nights?: number;
  description?: string;
}

export interface AdminUser {
  username: string;
  email?: string;
  password?: string;
  password_hash?: string;
  role: 'superadmin' | 'admin' | 'manager' | 'staff';
  is_active: boolean;
}

export interface BookingRecord {
  id?: string;
  booking_code: string;
  room_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  total_price: number;
  status: 'HOLD' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  has_slip?: boolean;
  created_at?: string;
}
