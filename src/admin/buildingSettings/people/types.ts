export interface Iresult {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
}
export interface IPeopleResponse {
  success: boolean;
  detail: Iresult[];
  message: string;
}
export interface IAssigneeFilterData {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
}
export interface IAssigneeFilterResponse {
  success: boolean;
  detail: IAssigneeFilterData[];
  message: string;
}

export interface IselectPayload {
  role: number;
  id: number;
}
export interface IaddPayload {
  email: string;
  property: number;
}
export interface IuserIdPayload {
  user: number;
  property: number;
  role: number;
}
