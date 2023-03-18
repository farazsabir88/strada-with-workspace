export interface IDetail {
  id: number ;
  author_name: string;
  created_at: string;
  updated_at: string;
  template_name: string;
  description: string;
  default_check: boolean;
  content: string;
  author: number ;
  address: string;
  country: string;
  logo_image: string;
  payable_to: string;
  state: string;
  zip: string;
  for_inquiries: string;
  invoice_number: number ;
  user: number ;
  property: number ;
  workspace: number;
}
export interface Iresponse {
  detail: IDetail[];
}
