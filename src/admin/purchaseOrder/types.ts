export interface IVendorDetails {
  label: string;
  value: string;
  vendor_info: string;
  name: string;
  job: string | null;
  id: number;

}

export interface IExpenseDetails {
  label: string;
  value: string;
}

export interface IStatus {
  value: number | string;
  name: string;
}

export interface IDetails {
  account: IExpenseDetails;
  amount: number;
  description: string;
  quantity: string;
  unit_price: string;
}

export interface IYardinResponseDetails {
  message: string;
}

interface ISignedUp {
  date: string;
  signed_user_email: string;
  signed_user_first_name: string;
  signed_user_last_name: string;
}

export interface IVendorListing {
  created_at: string;
  id: number;
  status: number;
  vendor: IVendorDetails | null;
  total: string;
  selected: boolean;
  status_disable_check: boolean;
  closed: boolean;
  event_name: string;
  vendor_info: string;
  po_number: number;
  Payment_due: string;
  expense_type: IExpenseDetails;
  last_received: string;
  description: string;
  delivery_date: string;
  order_date: string;
  Required_by: string;
  details: IDetails[];
  yardi_response: IYardinResponseDetails[];
  manager_approval: number;
  signed_by?: ISignedUp[];
  approved?: boolean;
  property_info?: string;
  close_date: string;
  shipping: string;
  taxes: string;
  event: number;
  property: {
    id: number;
    address: string;
  };
}

export interface IPODetailsProps {
  // open: boolean;
  // handleClose: () => void;
  selectedData: IVendorListing | undefined;
  getStatusValue: (value: number | undefined) => JSX.Element;
}

export interface IApprovalDetails {
  id: number;
  managerApproval: number;
}

export interface IGLData {
  gl_code: string;
  gl_account: string;
  label: string;
  id: number;
}

export interface IGLResponse {
  message: string;
  detail: IGLData[];
  success: boolean;
}

export interface IPOResponse {
  email: string;
  data: IVendorListing[];
}

export interface IPOResponseData {
  success: boolean;
  result: IPOResponse[];
}

export interface IApprovalPayload {
  invoice_file: number;
  sign_date: string;
  token: string | undefined;
}
