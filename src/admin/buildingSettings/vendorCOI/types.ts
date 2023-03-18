// import type { ISingleVendorCIO } from 'admin/AdminFormTypes';

export interface ICOIBuilding {
  id: number;
  address: string;
}

export interface IWorkspaceBuildingResponse {
  detail: ICOIBuilding[];
}

export interface IWorkspaceVendorCOI {
  id: number;
  building_access_all: boolean;
  buildings: ICOIBuilding[];
  name: string;
  showTooltip?: boolean;
  tooltipData?: ICOIBuilding[];
}

export interface IVendorICO {
  success: boolean;
  detail: IWorkspaceVendorCOI[];
  message: string;
}
