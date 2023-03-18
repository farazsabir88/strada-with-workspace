import type { Ibuilding } from 'types';

export interface Iuser {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  role: number;
}

export interface DeleteActionBuilding {
  open: boolean;
  data: Ibuilding | null;
}
export interface BuildingsResponse {
  success: true;
  detail: Ibuilding[];
  result: Ibuilding[];
  message: string;
}
