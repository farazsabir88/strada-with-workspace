export interface Iinputs {
  name: string;
  description: string;
}
export interface Ipayload {
  template_name: string;
  description: string;
  content: string;
  template_type: number;
  workspace: number;
}
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
  property: number ;
}
export interface IfilteredProps {
  detail: IDetail[];
}
