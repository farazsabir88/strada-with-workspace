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
  num_of_tasks: number;
  is_getting_updated: boolean;
  assignees: [];
  tasks: [];
}
export interface Iresponse {
  detail: IDetail[];
}
export interface IResponse {
  code: string;
  message: string;
  status: number;
}
export interface IData {
  response: IResponse;
}
export interface IErrorResponse {
  data: IData;
}
export interface Iauthor {
  role: number;
  user: Iuser;
}
export interface Iuser {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}
export interface IOption {
  name: string;
  id: number;
}
export interface Iassignee {
  avatar: string;
  name: string;
  email?: string;
  id: number;
}
export interface IAssigneeFilters {
  assignees: number[];
  setAssignees: (assignees: number[]) => void;
}
export interface IAuthorFilters {
  author: number[];
  setAuthor: (author: number[]) => void;
}
export interface ICreatedFilters {
  startDate: Date | undefined;
  setStartDate: (startDate: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (endDate: Date | undefined) => void;
}
export interface IFilters extends IAssigneeFilters, IAuthorFilters, ICreatedFilters {
}
