export interface IInvitee {
  email: string;
  first_name: string | null;
  id: number;
  invite_email: string;
  invite_firstname: string;
  invite_lastname: string;
  is_active: boolean;
  last_name: string | null;
}

export interface IResponse {
  success: boolean;
  result: IInvitee;
  message: string;
}

export interface IPayload {
  [key: string]: number | string | null | undefined;
  first_name: string;
  last_name: string;
  password: string;
  token: string | undefined;
}
