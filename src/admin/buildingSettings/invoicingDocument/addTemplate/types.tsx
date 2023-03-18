export interface Iinputs {
  name: string;
  description: string;
  payable_check: string;
  invoice_number: number | null;
  address: string;
  country: string;
  post_code: string;
  state: string;
  email: string;
}
export interface ICSC {
  value: string;
  name: string;
  code: string;
}

export interface IresponseFile {
  success: boolean;
  message: string;
  result: {
    filename: string;
  };
}
export interface Ipayload {
  template_name: string;
  description: string;
  payable_to: string;
  invoice_number: number | null ;
  address: string | undefined;
  country: number | string;
  zip: string;
  state: number | string;
  for_inquiries: string;
  logo_image: string;
  workspace: number;
}
