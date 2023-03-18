import type { IYardiCredentials } from 'admin/AdminFormTypes';

export interface IYardiCreadentialsResponse {
  results: IYardiCredentials;
  success: boolean;
}

export interface IYardiResults {
  properties: IYardiConnectionType[];
}

export interface IYardiConnectionTypeResponse {
  results: IYardiResults;
  success: boolean;
}

export interface IYardiConnectionType {
  address: string;
  city: string;
  company: string;
  state: string;
  yardi_code: string;
  zip: string;
}

export interface IConnectYardiResult {
  properties: IYardiConnectionType[];
  version_number: string;
}
export interface IConnectYardiResponse {
  success: boolean;
  results: IConnectYardiResult;
}
