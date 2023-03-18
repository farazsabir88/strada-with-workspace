export interface Idata {
  aggregate: number ;
  any_auto: boolean;
  anyone_excluded: boolean;
  authorized_representative: boolean;
  automobile_liability_addin: number | string | null;
  automobile_liability_eff_date: number | string | null;
  automobile_liability_exp_date: number | string | null;
  automobile_liability_insured: boolean;
  automobile_liability_policy_num: string;
  automobile_liability_subrogation: boolean;
  bodily_injury_per_accident: number ;
  bodily_injury_per_person: number ;
  certificate_holder: string;
  claims_made: boolean;
  claims_made_umbrella: boolean;
  cois_extra: unknown;
  combined_single_limit: number ;
  commercial_general_liability: boolean;
  created_at: string;
  damage_to_rented_premises: number ;
  ded: boolean;
  description_of_operations: string;
  disease_ea_employee: number ;
  disease_policy_limit: number ;
  each_accident: number ;
  each_occurrence: number ;
  each_occurrence_umbrella: number ;
  excess_liab: boolean;
  file: string;
  general_aggregate: number ;
  general_liability_addin: number | string | null;
  general_liability_eff_date: number | string | null;
  general_liability_exp_date: number | string | null;
  general_liability_insured: boolean;
  general_liability_policy_num: string;
  general_liability_subrogation: boolean;
  general_other: boolean;
  general_other_value: number | string | null;
  gl_accounts: number | string | null;
  hired_autos_only: boolean;
  id: number ;
  image: string;
  insured: string;
  loc: boolean;
  med_exp: number ;
  non_owned_autos_only: boolean;
  occur: boolean;
  occur_umbrella: boolean;
  other: boolean;
  owned_autos_only: boolean;
  per_statute: boolean;
  personal_adv_injury: number ;
  policy: boolean;
  products_comp: number ;
  project: boolean;
  property: number ;
  property_damage_per_accident: number ;
  remove_insured_address: number | string | null;
  retention_value: number | string | null;
  scheduled_autos: boolean;
  sent_notes: boolean;
  status: string;
  subrogation_waiver: boolean;
  umbrella_liab: boolean;
  umbrella_liability_addin: number | string | null;
  umbrella_liability_eff_date: number | string | null;
  umbrella_liability_exp_date: number | string | null;
  umbrella_liability_insured: boolean;
  umbrella_liability_policy_num: string;
  umbrella_liability_subrogation: boolean;
  updated_at: string;
  user: number ;
  vendor_category: number | string | null;
  workers_liability_addin: number | string | null;
  workers_liability_eff_date: number | string | null;
  workers_liability_exp_date: number | string | null;
  workers_liability_insured: boolean;
  workers_liability_policy_num: string;
  workers_liability_subrogation: boolean;
}

export interface Iresponse {
  id: number;
  success: boolean;
  message: string;
  result: Idata[];
}

interface Iresults {
  buildings: number[];
  id: number ;
  property: number ;
  certificate_holders: [
    [
    ],
  ];
  name: string ;
  must_be_named_certificate_holder: boolean;
  can_be_mentioned_in_description: boolean;
  each_occurrence: number ;
  damage_to_rented_premises: number ;
  med_exp: number ;
  personal_adv_injury: number ;
  general_aggregate: number ;
  products_comp: number ;
  commercial_general_liability: boolean;
  claims_made: boolean;
  occur: boolean;
  policy: boolean;
  project: boolean;
  loc: boolean;
  general_other: boolean;
  general_other_value: number | string | null;
  combined_single_limit: number ;
  bodily_injury_per_person: number ;
  bodily_injury_per_accident: number ;
  property_damage_per_accident: number ;
  any_auto: boolean;
  owned_autos_only: boolean;
  scheduled_autos: boolean;
  hired_autos_only: boolean;
  non_owned_autos_only: boolean;
  each_occurrence_umbrella: number ;
  aggregate: number ;
  claims_made_umbrella: boolean;
  occur_umbrella: boolean;
  umbrella_liab: boolean;
  excess_liab: boolean;
  ded: boolean;
  retention_value: number | string | null;
  each_accident: number ;
  disease_ea_employee: number ;
  disease_policy_limit: number ;
  per_statute: boolean;
  other: boolean;
  anyone_excluded: boolean;
}

export interface IvendorResponse {
  success: boolean;
  message: string;
  result: Iresults[];
  detail: Iresults[];

}
export interface IvendorFilter {
  label: string;
  value: number;
  buildings: number[];

}
export interface IvendorFilterEdit {
  name: string;
  value: number;
  buildings: number[];

}
export interface IvendorChange {
  label: string;
  value: number;
}
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type IpropertySelect = IvendorChange;

export interface IvendorPayload {
  id: number;
  vendor_category: number;
}

export interface IstatusColors {
  color: string;
  background: string;
  status: string;
}
