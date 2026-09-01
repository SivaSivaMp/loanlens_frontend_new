export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type UserRole = "BANK_ADMIN" | "COMPANY_DSA" | "FIELD_AGENT";
export type LoanType =
  | "HOME"
  | "PERSONAL"
  | "CAR"
  | "BUSINESS"
  | "GOLD"
  | "LAP";
export type ApplicationStatus =
  | "LEAD"
  | "DOCS_COLLECTING"
  | "DOCS_SUBMITTED"
  | "UNDER_REVIEW"
  | "SANCTIONED"
  | "DISBURSED"
  | "REJECTED"
  | "WITHDRAWN";
