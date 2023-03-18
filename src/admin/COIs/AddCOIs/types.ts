export interface IcreatCois {
  aggregate: number;
  any_auto: boolean;
  anyone_excluded: boolean;
  automobile_liability_eff_date: string;
  automobile_liability_exp_date: string;
  automobile_liability_policy_num: string;
  automobile_liability_subrogation: boolean;
  bodily_injury_per_accident: number;
  bodily_injury_per_person: number;
  certificate_holder: string;
  claims_made: boolean;
  claims_made_umbrella: boolean;
  combined_single_limit: number;
  commercial_general_liability: boolean;
  damage_to_rented_premises: number;
  ded: boolean;
  description_of_operations: string;
  disease_ea_employee: number;
  disease_policy_limit: number;
  each_accident: number;
  each_occurrence: number;
  each_occurrence_umbrella: number;
  excess_liab: boolean;
  file: string;
  general_aggregate: number;
  general_liability_eff_date: string;
  general_liability_exp_date: string;
  general_liability_policy_num: string;
  general_liability_subrogation: boolean;
  general_other: boolean;
  general_other_value: boolean;
  gl_accounts: number | string | null;
  hired_autos_only: boolean;
  image: string;
  insured: string;
  loc: boolean;
  med_exp: number;
  non_owned_autos_only: boolean;
  occur: boolean;
  occur_umbrella: boolean;
  other: boolean;
  owned_autos_only: boolean;
  per_statute: boolean;
  personal_adv_injury: number;
  policy: boolean;
  products_comp: number;
  project: boolean;
  property_damage_per_accident: number;
  retention_value: number;
  scheduled_autos: boolean;
  umbrella_liab: boolean;
  umbrella_liability_eff_date: string;
  umbrella_liability_exp_date: string;
  umbrella_liability_policy_num: string;
  umbrella_liability_subrogation: boolean;
  vendor_category: number | string | null;
  workers_liability_eff_date: string;
  workers_liability_exp_date: string;
  workers_liability_policy_num: string;
  workers_liability_subrogation: boolean;
}

export interface Iresult {
  name: string;
  uploaded: boolean;
  taskId: string;
  progress: number;
  result: null;
}
export interface Iresponse {
  success: boolean;
  message: string;
  details: Iresult[];
}
export interface IresponseCelery {
  success: boolean;
  message: string;
  result: Iresult[];
}

export interface Ipayload {
  workspace: number | undefined;
  user: number | undefined;
  data: IcreatCois[] | null[];
}
