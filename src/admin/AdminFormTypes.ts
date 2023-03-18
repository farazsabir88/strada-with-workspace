import type { Cell } from 'react-table';
import type { IDataObject } from 'formsTypes';
import type { IEventVendor } from './buildingSection/budget-calendar/types';
import type { ICOIBuilding } from './buildingSettings/vendorCOI/types';

export interface IResponse {
  code: string;
  message: string;
  status: number;
  data: IData;
}
export interface IData {
  code: string;
  message: string;
  status: number;
}

export interface IErrorResponse {
  response: IResponse;
}
export interface IDetailErrorResponse {
  data: IErrorResponse;
}

export interface IDetailForm {
  address: string | undefined;
  country: number | string ;
  state: number | string;
  city: number | string;
  company: number | string;
  zip: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
}
export interface IPeopleForm {
  test: string;
}
export interface IChartsOfAccountsForm {
  gl_account?: string;
  gl_code?: string;
  building_access_all?: boolean;
  buildings?: ICOIBuilding[];
}
export interface IUpdateNameForm {
  first_name: string;
  last_name: string;
  title: string;
}
export interface IUpdateEmailForm {
  email: string;
  confirm_email: string;
}
export interface IUpdatePasswordForm {
  user_id: number;
  password: string;
  repeat_password: string;
  old_password: string;
}
export interface IVendorContacts {
  test: string;
}
export interface IAddInvoiceForm {
  first_name: string;
  last_name: string;
  email: string;
}

export interface IContactDialog {
  company: number | string;
  created_at: string;
  email: string;
  id: number | string;
  name: string;
  job: string;
  notes: string;
  phone: string;
  property: number | string;
  surname: string;
  updated_at: string;
}

interface IAccount {
  label: string;
  value: string;
}

export interface IDetails {
  description: string;
  account: IAccount | string | null | undefined;
  quantity: string;
  unit_price: number | string;
  amount: number | string;
}
// interface IVendorData {
//   email: string;
//   label: string;
//   value: string;
// }

export interface IPurchaseOrder {
  Payment_due: string | null;
  Required_by: string | null;
  close_date: string | null;
  closed: boolean;
  delivery_date: string | null;
  description: string;
  details: IDetails[];
  event: number | null;
  expense_type: string;
  last_received: string;
  manager_approval: number | string | null;
  order_date: string | null;
  property: number | string ;
  shipping: number;
  sub_total: number;
  taxes: number;
  total: number;
  vendor: ISchedulingVendor;
  vendor_info: string;
}

// Table Types

export interface ISingleContact {
  company: string;
  created_at: string;
  email: string;
  id: number | string;
  job: string;
  name: string;
  notes: string;
  phone: string;
  property: number | string;
  surname: string;
  updated_at: string;
}

export interface ICategoryHolder {
  id: number | string;
  _id: number | string;
  name: string;
  category: string;
}

export interface ISingleVendorCIOExtended extends ISingleVendorCIO {
  category_holders: ICategoryHolder[];
}

export interface ISingleVendorCIO {
  aggregate: number;
  any_auto: boolean;
  anyone_excluded: boolean;
  bodily_injury_per_accident: number ;
  bodily_injury_per_person: number ;
  building_access_all?: boolean;
  buildings?: ICOIBuilding[];
  category_holders: ICategoryHolder[];
  can_be_mentioned_in_description: boolean;
  claims_made: boolean;
  claims_made_umbrella: boolean;
  combined_single_limit: number ;
  commercial_general_liability: boolean;
  damage_to_rented_premises: number ;
  ded: boolean;
  disease_ea_employee: number ;
  disease_policy_limit: number ;
  each_accident: number;
  each_occurrence: number;
  each_occurrence_umbrella: number ;
  excess_liab: boolean;
  general_aggregate: number ;
  general_other: boolean;
  general_other_value: number | string | null;
  hired_autos_only: boolean;
  id: number | string ;
  loc: boolean;
  med_exp: number ;
  must_be_named_certificate_holder: boolean;
  name: string;
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
  property: number | string;
  property_damage_per_accident: number ;
  retention_value: number | string | null;
  scheduled_autos: boolean;
  umbrella_liab: boolean;
}

export interface ISingleVendorResponse {
  detail: ISingleVendorCIO;
}
export interface IGetTenentsResponse {
  message: string;
  result: IUnpaidChargesResult[];
  success: boolean;
}

export interface IUnpaidChargesResult {
  tenant_data: ISingleUnpaidCharge[];
  transactions: ISingleTransection[];
}

export interface ISingleUnpaidCharge {
  Email: string;
  FirstName: string;
  LastName: string;
  LeaseFromDate: string;
  LeaseToDate: string;
  MoveInDate: string;
  MoveOutDate: string | null;
  NoticeDate: string | null;
  Phone: string | null;
  PossessionDate: string | null;
  Rent: string;
  Status: string;
  UnitCode: string;
  UnitEconomicStatus: string;
  UnitRent: string;
  UnitSqFt: string;
  tenant_code: string;
}
export interface ISingleTransection {
  ChargeAmount: string;
  ChargeCode: string;
  Description: string;
  Identification: string | null;
  Notes: string;
  TransDate: string;
  TransID: string;
  TransType: string;
  isOpen: boolean;
  isPosted: boolean;
}

export interface IYardiCredentials {
  property_id?: number;
  status: number | string | null;
  version: string | null;
  yardi_code: string;
  yardi_database: string;
  yardi_password: string;
  yardi_platform: string;
  yardi_servername: string;
  yardi_url: string;
  yardi_username: string;
}
export interface ISaveYardiPayload {
  property_id?: number;
  yardi_code: string;
}

export interface IEventScheduleModuleFile {
  created_at: string;
  event: number;
  file: string;
  filename: string;
  id: number;
  type: string;
}

export interface IEventScheduleModule {
  invitation_title: string;
  is_email_scheduled: boolean;
  is_rfp_form_link: boolean;
  vendor: IEventVendor | number | null;
  vendor_email: string | null;
  subject: string | null;
  description: string;
  track_email: boolean;
  durationType: string;
  dayRangeType: string;
  future_days: number;
  startDate: string | null;
  endDate: string | null;
  timeDuration: number | null;
  future: number | string;
  forever: number | string;
  range: number | string;
  rfp_form: string;
  rfp_form_id: number | string | null;
  status: number | string | null;
  attachments: IEventScheduleModuleFile[];
  vendor_bcc: string[];
  vendor_cc: string[];
}
export interface ISchedulingAttachment {
  id: number;
  file_url: string;
  file: string;
  filename: string;
  group: string;
  event_rfp: number | null;
}
export interface ISchedulingVendor {
  id: number;
  label: string;
  name: string;
  job: string;
}
export interface ISchedulingVendorContact {
  id: number;
  full_name: string;
  email: string;
  name: string;
  label: string;
}
export interface IEventSchedulePayload {
  invitation_title: string;
  is_email_scheduled: boolean;
  vendor: ISchedulingVendor | null;
  subject: string | null;
  description: string;
  track_email: boolean;
  dayRangeType: string;
  startDate: string;
  endDate: string;
  timeDuration: number | null;
  future_days: number | string;
  schedule_bcc: string[];
  schedule_cc: string[];
  schedule_vendor_contact: ISchedulingVendorContact | null;
  offer_availability: boolean;
  unique_token: number | string | null;
  status: number;
  attachments: ISchedulingAttachment[];
}

export interface IGlAccount {
  gl_account: string;
  id: number;
}

export interface ISinglAccount {
  gl_account: IGlAccount[];
  gl_code: string;
  property: number | string;
}

export interface ITableColumn {
  Header: JSX.Element | string;
  accessor: string;
  Cell?: (Cell: Cell<IDataObject>) => JSX.Element;
  width?: number | string;
}

export interface IunpaidEmailCharges {
  name: string;
  description: string;
}
interface Itask {
  name: string;
  assignee: number;
  description: string;
}
export interface ITasksInputs {
  template_name: string;
  description: string;
  tasks: Itask[];
}
export interface IinvoiceDocument {
  invoice_number: number | null;
  payable_check: string;
  post_code: string;
}
export interface IeditCOIs {
  building: string;
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
  cois_extra: null;
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
  file: string | null;
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
  id: number | string ;
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
  property: number | string | {
    address: string;
    id: number;
  };
  property_damage_per_accident: number ;
  remove_insured_address: number | string | null;
  retention_value: number | string | null;
  scheduled_autos: boolean;
  sent_notes: boolean;
  status: number | string | null;
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
