export interface IUserInfo {
  id?: number;
  name: string;
  avatar: string;
  email: string;
  pending: boolean;
}

export interface IMemberData {
  id?: number;
  role: number;
  user_info: IUserInfo;
}

export interface IMemberListingResponse {
  detail: IMemberData[];
}
