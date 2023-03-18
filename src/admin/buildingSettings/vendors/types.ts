export interface IContactDetails {
  [key: string]: number | string | null | undefined;
  id?: number;
  unique_position_key: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  note: string | null;
}

export interface IVendorData {
  [key: string]: IContactDetails[] | number | string | null | undefined;
  name: string | null;
  job: string | null;
  note: string | null;
  id?: number;
  qty_contacts?: number;
  vendor_contacts: IContactDetails[];
}

export interface IDetail {
  detail: IVendorData[];
}

export interface IVendorListingResponse {
  detail: IVendorData[];
}

export interface IVendorResponse {
  detail: IVendorData;
  success: boolean;
}
