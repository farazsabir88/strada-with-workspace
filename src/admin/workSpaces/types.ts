export interface IMember {
  id: number;
  name: string;
  avatar: string;
}
export interface Iallworkspace {
  created_at: string;
  id: number;
  logo_url: string | null;
  members: IMember[];
  members_count: number;
  name: string;
  recently_accessed: string;
  updated_at: string;
  user: number;
}
export interface IallworkspaceResponse {
  detail: Iallworkspace[];
}
export interface IRecentWorkspace {
  id: number;
  name: string;
  logo_url: string | null;
}

export interface ICurrentUserRole {
  role: number;
  role_name: string;
}

export interface ICurrentUserRoleResponse {
  detail: ICurrentUserRole;
}
