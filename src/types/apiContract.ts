// src/types/apiContract.ts

export interface SuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[] | any;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface AvailabilityRequest {
  checkIn: string;
  checkOut: string;
  guests?: number;
}

export interface QuoteRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  selections?: Array<{ serviceId: string; qty: number }>;
  lang?: 'th' | 'en';
}

export interface CreateBookingRequest extends QuoteRequest {
  guest: {
    name: string;
    phone: string;
    email: string;
  };
  arrivalTime?: string;
  specialRequests?: string;
}
