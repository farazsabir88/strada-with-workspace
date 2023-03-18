import type { Ibuilding } from 'types';

export interface IBuildingsResponse {
  detail: Ibuilding[];
}
export interface IViewBuildingData {
  address: string;
  city: string;
  company: string;
  contact_email: string;
  contact_first_name: string;
  contact_last_name: string;
  country: string;
  id: number;
  state: string;
  zip: string;
}
export interface IWorkspaceRole {
  role: number;
  role_name: string;
}
export interface IWorkspaceRoleResponse {
  detail: IWorkspaceRole;
}
export interface ICSC {
  value: string;
  name: string;
  code: string;
}
export interface ITimezones {
  abbreviation: string;
  gmtOffset: number;
  gmtOffsetName: string;
  tzName: string;
  zoneName: string;
}
