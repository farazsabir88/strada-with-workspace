export interface IValues {
  id?: number;
  label?: string;
  value?: string;
  option_type?: boolean | string;
}

export interface IData {
  values: IValues[] | undefined;
}

interface IOptions {
  id: number;
  label: string;
  option_type: boolean | string;
  value: string;
}

export interface IQuestionValues {
  label?: string;
  tooltip?: string;
  value?: string;
}

export interface IQuestion {
  field_type?: string;
  label?: string;
  type?: string;
  id?: number;
  data: IData;
  options?: IOptions[];
  rows?: number;
  key?: number | string;
  questions?: IQuestionValues[];
  values?: IQuestionValues[];
}

export interface IDetail {
  add_footer?: boolean;
  add_header?: boolean;
  author?: number;
  author_name?: string;
  created_at?: string;
  default_check?: boolean;
  footer_text?: string;
  header_text?: string;
  id?: number;
  property: number | string;
  questions?: IQuestion[];
  template_name?: string;
  updated_at?: string;
  values?: IQuestion[];
}
export interface IRFPTemplate {
  detail: IDetail[];
}

export interface IFormBuilder {
  dispplay: string;
  components: IRFPTemplate[];
}
export interface IResponse {
  code: string;
  message: string;
  status: number;
}
export interface IErrorData {
  response: IResponse;
}
export interface IErrorResponse {
  data: IErrorData;
}
