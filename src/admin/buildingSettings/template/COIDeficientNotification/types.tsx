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
  workspace: number ;
}
export interface Iresponse {
  detail: IDetail[];
}
