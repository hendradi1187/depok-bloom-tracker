export type PlantStatus = 'available' | 'sold' | 'on_display'
export type PlantGrade = 'A' | 'B' | 'C'

export const PLANT_STATUS_LABEL: Record<PlantStatus, string> = {
  available: 'Tersedia',
  sold: 'Terjual',
  on_display: 'Dipamerkan',
}

export const PLANT_STATUS_COLOR: Record<PlantStatus, string> = {
  available: 'bg-green-100 text-green-700 border-green-200',
  sold: 'bg-red-100 text-red-700 border-red-200',
  on_display: 'bg-blue-100 text-blue-700 border-blue-200',
}

export const PLANT_GRADE_COLOR: Record<string, string> = {
  A: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  B: 'bg-slate-100 text-slate-600 border-slate-200',
  C: 'bg-orange-100 text-orange-700 border-orange-200',
}

export interface Plant {
  id: string;
  barcode: string;
  common_name: string;
  latin_name: string;
  category: string;
  description: string;
  care_guide: string;
  location: string;
  supplier: string;
  supplier_contact: string;
  price: number | null;
  status: PlantStatus;
  grade: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface ScanRecord {
  id: string;
  user_id?: string;
  plant_id: string;
  scanned_at: string;
  location: string;
  plant?: {
    id: string;
    barcode: string;
    common_name: string;
    latin_name: string;
    category: string;
    location: string;
    images: string[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'officer' | 'public';
  is_active: boolean;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  expires_in: number;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface StatsSummary {
  total_plants: number;
  total_scans: number;
  total_categories: number;
  total_users: number;
  scans_today: number;
  scans_this_week: number;
}
