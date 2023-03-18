import type { ICOIBuilding } from '../vendorCOI/types';

export interface IAccountValue {
  gl_code: string ;
  gl_account: string;
  property: number | string;
}

export interface IWorkspaceCOA {
  id: number | string;
  building_access_all: boolean;
  buildings: ICOIBuilding[];
  gl_account: string;
  gl_code: string;
  workspace: number;
  showTooltip?: boolean;
  tooltipData?: ICOIBuilding[];
  allBuildings?: ICOIBuilding[];
}

export interface ICOAPayload {
  building_access_all?: boolean;
  buildings?: ICOIBuilding[];
  gl_account?: string;
  gl_code?: string;
}

export interface IAction {
  type: string;
  data: IWorkspaceCOA | undefined;
  // data: IAccountValue | undefined;
}

export interface IChartsOfAccountResponse {
  success: boolean;
  detail: IWorkspaceCOA[];
  message: string;
}

export interface IUploadDetails {
  name: string;
  uploaded: boolean;
  taskId: string;
  progress: number;
  result: null;
}
export interface IUploadResponse {
  success: boolean;
  message: string;
  detail: IUploadDetails;
}
