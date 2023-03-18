import type { IeditCOIs } from 'admin/AdminFormTypes';

export interface ICoiPayload extends IeditCOIs {
  combined?: ICombined[];
}

export interface ICombined extends IgenerelLiability, IautoMobileLiability, IumbrellaLiability, IworkersCompensations {
  age?: string;
}

export interface ICommonCoiTypes {
  Type: string;
  Insurd: string;
  startingDate: number | string | null;
  endDate: number | string | null;
  policyNum: string;
  Amount: number | string | null;
  Addin: number | string | null;
  subrogation: boolean;
  selected: boolean;
  org: boolean;
  additional: boolean;
  subrogationCheck: boolean;
}

export interface IgenerelLiability extends ICommonCoiTypes {
  commercialGeneral?: boolean;
  claimsMade?: boolean;
  occur?: boolean;
  subrogationWaiver?: boolean;
  policy?: boolean;
  project?: boolean;
  loc?: boolean;
  damageRented?: number | string | null;
  medExp?: number | string | null;
  personalInjury?: number | string | null;
  generalAgg?: number | string | null;
  products?: number | string | null;

}

export interface IautoMobileLiability extends ICommonCoiTypes {
  anyAuto?: boolean;
  ownedAutos?: boolean;
  hiredAutos?: boolean;
  scheduledAutos?: boolean;
  nonOwnedAutos?: boolean;
  injuryPerPerson?: number | string | null;
  injuryPerAccident?: number | string | null;
  propertyDamage?: number | string | null;

}

export interface IumbrellaLiability extends ICommonCoiTypes {
  excessLiab?: boolean;
  occurUmbrella?: boolean;
  claimsMadeUmbrella?: boolean;
  umbrellaLiab?: boolean;
  ded?: boolean;
  aggregate?: number | string | null;
  retention?: number | string | null;
}
export interface IworkersCompensations extends ICommonCoiTypes {
  statutory?: boolean;
  other?: boolean;
  diseaseEmployee?: number | string | null;
  diseasePolicy?: number | string | null;
  anyExclude?: string;
}
