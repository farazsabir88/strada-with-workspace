import type { EventProps } from 'react-big-calendar';
import type { Ibuilding } from 'types';
import type { IGLData } from 'admin/purchaseOrder/types';
import type React from 'react';

export interface IHeader {
  date: Date | null;
  setDate: (date: Date | null) => void;
  dateYear: string;
  setDateYear: (year: string) => void;
  setYearly: (yearly: boolean) => void;
  setNewEventOpen: (action: boolean) => void;

}

export interface IVendorRespose {
  message: string;
  success: boolean;
  detail: ISingleVendorContact[];
}
export interface ISingleVendorContact {
  id: number;
  label: string;
  name: string;
  job: string;
}

export interface IAction {
  variant: string;
  task: ITask | null;
  data: ISideSheetData | null;
  isScheduling: boolean;
}

export interface ISearchFilter {
  search: string;
  setSearch: (search: string) => void;
}
export interface ISetOccurrences {
  occurrences: number[];
  setOccurrences: (occurrences: number[]) => void;
}
export interface IAssigneeFilters {
  assignees: number[];
  setAssignees: (assignees: number[]) => void;
}
export interface IBuildingFilters {
  buildingFilter: number[];
  setBuildingFilter: (building: number[]) => void;
}
export interface IWorkspaceFilters {
  workspaceFilter: number[];
  setWorkspaceFilter: (worksapce: number[]) => void;
}
export interface IMovesFilter {
  moves: number[];
  setMoves: (moves: number[]) => void;
}
export interface ICreatedFilters {
  createdFilters: number[];
  setCreatedFilters: (moves: number[]) => void;
}
export interface IProjectsFilters {
  projectFiltrs: number[];
  setProjectFilters: (moves: number[]) => void;
}
export interface ITemplateFilter {
  templateFilter: number[];
  setTemplateFilter: (moves: number[]) => void;
}
export interface IStatusFilter {
  statusFilter: number[];
  setStatusFilter: (status: number[]) => void;
}
export interface IMonthFilter {
  monthFilter: number[];
  setMonthFilter: (month: number[]) => void;
}

export interface IFilters extends ISearchFilter, IAssigneeFilters, ISetOccurrences, IMovesFilter, ICreatedFilters, IProjectsFilters, IStatusFilter, IMonthFilter {
  handleResetFilters: () => void;
  propertyFilter: number[];
  setPropertyFilter: (building: number[]) => void;
}

export interface IOption {
  name?: string;
  template_name?: string;
  id: number;
}

export interface IBuildingResponse {
  message: string;
  detail: Ibuilding[];
  success: boolean;
}

export interface IFilterButton {
  text: string;
  taskCompletedType?: string;
  taskCompletedValue?: number;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  options?: IOption[];
  selectedOptions?: number[] | string[];
  resetSelected: (event: React.ChangeEvent) => void;
}

export interface IGLResponse {
  message: string;
  result: IGlCode[];
  success: boolean;
}

export interface IGlCode {
  gl_account: string;
  gl_code: string;
  label: string;
  id: number;
}

export interface INonYardiVendor {
  company: string;
  created_at: string;
  label: string;
  email: string;
  id: number;
  job: string | null;
  name: string;
  notes: string | null;
  phone: number | string | null;
  property: number;
  surname: string | null;
  updated_at: string;
}
export interface INonYardiVendorResponse {
  message: string;
  detail: INonYardiVendor[];
  success: boolean;
}

export interface IVendor {
  Address1: string;
  CheckMemo: string;
  City: string;
  Contact: string;
  Country: string;
  DiscountDays: string;
  DiscountPercent: string;
  Email: string;
  GovernmentID: string;
  GovernmentName: string;
  IsConsolidatePayments: string; // it must be boolean
  IsDiscountDaysAfterInvoice: string; // it must be boolean
  IsEmployee: string; // boolean;
  IsGets1099: string; // boolean
  IsHoldPayments: string; // boolean
  IsMemoFromInvoice: string; // boolean
  IsNoSignature: string; // boolean
  IsPORequired: string; // boolean
  IsSubcontractor: string; // boolean
  LiabilityExpirationDate: string; // boolean
  NoSignatureAmount: string; // number
  PaymentMethod: string;
  PhoneNumber1: string;
  RegistrationNumber: string;
  RetentionPercentage: string;
  SalesTaxPercent: string;
  Salutation: string;
  State: string;
  TaxPoint: string;
  UserDefinedField1: string;
  UserDefinedField2: string;
  UsualCategoryId: string; // number
  VendorId: number | string;
  VendorLastName: string;
  WorkersCompExpirationDate: string;
  Zipcode: string;
}

export interface IVendorResponse {
  message: string;
  result: IVendor[];
  success: boolean;
}

export interface IAssigneeInfo {
  id: number;
  name: string;
  email: string;
  avatar: string;
}
export interface IGLCode {
  label: string;
  value: string;
}

export interface ITagResponse {
  message: string;
  detail: ITags[];
  success: boolean;
}

export interface ITags {
  created_at: string;
  event: number;
  id: number;
  tag: string;
  updated_at: string;
  name?: string | undefined;
}
export interface IEventVendor {
  email: string;
  label: string;
  value: string;
  id: number;
}
export interface IWorksapceDetail {
  id: number;
  name: string;
}

export interface IPropertyDetail {
  id: number;
  address: string;
}

export interface IEventCollaborator {
  id: number;
  avatar: string | null;
  name: string;
  email: string;
}

export interface IEvent {
  amount_budget: number | null;
  is_annual_budget_event: boolean;
  assignee: IAssigneeInfo | null;
  associative_key: string;
  final_cost: number | null;
  created_at: string;
  collaborators: IEventCollaborator[];
  date: string;
  due_date: string | null;
  dayRangeType: string;
  description: string | null;
  durationType: string;
  endDate: string | null;
  event_end_date: string | null;
  event_start_date: string | null;
  file: string | null;
  gl: IGLData | number | null;
  id: number | string;
  invitation_title: string;
  is_deleted: boolean;
  is_email_scheduled: boolean;
  is_rfp_form_link: boolean;
  month: number | null;
  occurrence: number | null;
  offer_availability: boolean;
  po_amount: number | null;
  po_id: number | null;
  po_status: boolean | null;
  po_closed: boolean;
  priority: number | null;
  priority_index: string | null;
  building: IPropertyDetail;
  reference_id: number | null;
  rfp_form: string | null;
  source_type: string | null;
  startDate: string | null;
  status: number | string | null;
  subject: null;
  tags: ITags[] | null;
  timeDuration: number;
  title: string;
  track_email: boolean;
  unique_token: string | null;
  updated_at: string;
  user: number;
  vendor: IEventVendor | number | null;
  vendorEmail: string;
  workspace: IWorksapceDetail | null;
}

export interface IEventResponse {
  next?: string | null | undefined;
  previous?: string;
  results: IEvent[];
  success: boolean;
  detail?: IEvent[];
}
export interface ISingleEventResponse {
  detail: IEvent;
}
export interface IAllEventResponse {
  next?: string | null | undefined;
  previous?: string;
  success: boolean;
  detail: IEvent[];
  results: IEvent[];
}
export interface ITableSectionProps {
  events: IEvent[];
  newEventOpen: boolean;
  setNewEventOpen: (action: boolean) => void;
  createEvent: (title: string) => void;
  setDate?: (date: Date) => void;
  dateYear: string;
}

export interface IUserInfo {
  name: string;
  avatar: string;
}

export interface IComment {
  comment: string;
  id: number;
  updated_at: string;
  user: number;
  user_info: IUserInfo;
}

export interface ICollaborator {
  created_at: string;
  event: number;
  id: number;
  updated_at: string;
  user: number;
}

export interface IStatusChip {
  name: string;
  value: number;
  color: string;
  background: string;
}

//= ======>> Sidesheet types

interface IPO {
  id: number;
  vendor: string;
}

export interface ISideSheetResponse {
  success: boolean;
  detail: ISideSheetData;
  message: string;
}

export interface ISideSheetData {
  attachments: ISSAttachment[];
  comments: ISSComment[];
  tracked_emails: ISSEmail[];
  collaborators: IEventCollaborator[];
  po: IPO | null;
  histories: IHistory[];
  tasks: ITask[];
  yardi_gl_account: ISSYardiGlAccount[];
  yardi_vendor: ISSVendor | null;
  email_reminder_count: number;
  email_reminders: IEmailReminderData[];
  amount_budget: number | null;
  is_annual_budget_event: boolean;
  assignee: number;
  assignee_info: IAssigneeInfo | null;
  associative_key: string;
  final_cost: number | null;
  created_at: string;
  date: string;
  due_date: string | null;
  dayRangeType: string;
  description: string | null;
  durationType: string;
  endDate: string | null;
  event_end_date: string | null;
  event_start_date: string | null;
  file: string | null;
  gl: number | null;
  id: number | string;
  invitation_title: string;
  is_deleted: boolean;
  is_email_scheduled: boolean;
  is_rfp_form_link: boolean;
  month: number | null;
  occurrence: number | null;
  offer_availability: boolean;
  po_amount: number | null;
  po_id: number | null;
  po_status: boolean | null;
  priority: number | null;
  priority_index: string | null;
  property: number | null;
  building: IPropertyDetail;
  reference_id: number | null;
  rfp_form: string | null;
  source_type: string | null;
  startDate: string | null;
  status: number | string | null;
  subject: null;
  tags: ITags[] | null;
  timeDuration: number;
  title: string;
  track_email: boolean;
  unique_token: string | null;
  updated_at: string;
  user: number;
  vendor: ISSVendor | string | null;
  vendorEmail: string;
  workspace: number | null;
}

export interface IEventTask {
  id: number;
  assignee_info: IAssigneeInfo | null;
  event_title: string;
  event_collaborators: IAssigneeInfo[];
  histories: IHistory[];
  comments: ISSComment[];
  attachments: ISSAttachment[];
  tracked_emails: ISSEmail[];
  created_at: string;
  updated_at: string;
  title: string;
  status: number;
  task_start_date: string | null;
  task_end_date: string | null;
  due_date: string | null;
  date_completed: string | null;
  description_info: string | null;
  is_deleted: boolean;
  vendor: number | null;
}

export interface IEventTaskResponse {
  detail: IEventTask;
}

export interface ISSAttachment {
  created_at: string;
  event: number;
  file: string;
  filename: string;
  group: string;
  history: IHistory[];
  id: number;
  updated_at: string;
}
export interface ISSComment {
  comment: IRefectorComment[] | string;
  commentString: IRefectorComment[] | string;
  id: number;
  updated_at: string;
  user: number;
  user_info: ISSUserInfo;
}

export interface IRefectorComment {
  part: string;
  flag: boolean;
}

export interface ISSRefectorComments {
  comment: IRefectorComment[] | string;
  newComment?: IRefectorComment[] | string;
  commentString: IRefectorComment[] | string;
  id: number;
  updated_at: string;
  user: number;
  user_info: ISSUserInfo;
}

export interface ISSUserInfo {
  avatar: string;
  name: string;
  id: number;
  email: string;
}

export interface IHistory {
  description: string;
  time: string;
  user_info: ISSUserInfo;
}
export interface ISSVendor {
  company: string;
  created_at: string;
  email: string;
  id: number;
  job: number | string | null;
  name: string;
  notes: number | string | null;
  phone: number | string | null;
  property: number;
  surname: string;
  updated_at: string;
}

export interface ISSYardiGlAccount {
  gl_account: string;
  gl_code: string;
  id: number;
  property: number;
}

export interface ITask {
  assignee: number | string | null;
  assignee_info: IAssigneeInfo | null;
  created_at: string;
  due_date: number | string | null;
  dayRangeType: string;
  description: string;
  description_info: string;
  durationType: string;
  endDate: string | null;
  event: number;
  event_data: ISSEventData;
  future_days: number | string | null;
  history: IHistory[];
  id: number;
  invitation_title: string;
  is_deleted: boolean;
  is_email_scheduled: boolean;
  is_rfp_form_link: boolean;
  offer_availability: boolean;
  rfp_form: number | string | null;
  startDate: number | string | null;
  status: number | null;
  subject: number | string | null;
  task_end_date: number | string | null;
  task_start_date: number | string | null;
  timeDuration: number;
  title: string;
  track_email: boolean;
  unique_token: number | string | null;
  updated_at: string;
  user: number;
  vendor: IEventVendor | null;
  vendorEmail: string;
}

export interface ISSEventData {
  assignee: number | string | null;
  assignee_info: IAssigneeInfo | null;
  created_at: string;
  due_date: number | string | null;
  dayRangeType: string;
  description: string | null;
  description_info: string | null;
  durationType: string;
  endDate: string | null;
  event: number;
  id: number;
  invitation_title: string;
  is_deleted: boolean;
  is_email_scheduled: boolean;
  is_rfp_form_link: boolean;
  offer_availability: boolean;
  rfp_form: null;
  startDate: null;
  status: number;
  subject: null;
  task_end_date: null;
  task_start_date: null;
  timeDuration: number;
  title: string;
  track_email: boolean;
  unique_token: string | null;
  updated_at: string;
  user: number;
  vendor: ISSVendor;
  vendorEmail: string;
}

export interface ISSEmail {
  created_at: string;
  email: string;
  event: number;
  id: number;
  is_task: boolean;
  data: ISSMessage[];
  name: string;
  subject: string;
  updated_at: string;
}
export interface ISSMessage {
  dateTime: string;
  from: string;
  message: string;
  name: string;
}

export interface IEventScheduleFile {
  created_at: string;
  event: number;
  file: string;
  filename: string;
  group: string;
  id: number;
  type: string;
  updated_at: string;
}

//= ==>> Event Schedualing  page

export interface ISingleInterval {
  end: string;
  start: string;
}
export interface IDefaultIntervals {
  created_at: string;
  day: string;
  id: number;
  intervals: ISingleInterval[];
  updated_at: string;
  user: number;
}

export interface IIntervalsForCalendar extends EventProps {
  created_at: string;
  day: string;
  id: number;
  updated_at: string;
  user: number;
  end: Date | string;
  start: Date | string;
}

export interface IIntervals {
  created_at: string;
  date: string;
  event: number;
  id: number;
  intervals: ISingleInterval[];
  type: string;
  updated_at: string;
}

export interface IEventScheduleModuleFile {
  created_at: string;
  event: number;
  file: string;
  filename: string;
  id: number;
  type: string;
}

// interface IVendorData {
//   id: number;
//   label: string;
//   name: string;
//   job: string;
// }
interface IVendorContact {
  id: number;
  full_name: string;
  email: string;
  name: string;
  label: string;
}

export interface IFile extends IEventScheduleModuleFile {
  group?: string;
  updated_at?: string;
}

export interface IAddRFPData {
  event: number;
  type: string;
}
export interface IFormData {
  file: File;
  filename: string;
  event: number;
  group: string;
}
export interface ISelectedAttachment {
  file: File | string;
  filename: string;
  id: string;
}

export interface IRFPData {
  created_at?: string;
  description: string;
  event: number;
  // files: IFile[] | null | undefined;
  attachments: ISelectedAttachment[];
  id?: number;
  // is_saved: boolean;
  subject: string | null;
  // type: string;
  updated_at?: string;
  vendor: ISchedulingVendor | null;
  vendor_bcc: string[];
  vendor_cc: string[];
  vendor_contact: IVendorContact | null;
}
export interface ISchedualingDataDetail {
  rfps: IRFPData[];
  // amount_budget: number;
  // is_annual_budget_event: boolean;
  // assignee: number;
  // associative_key: string;
  // final_cost: number;
  created_at: string;
  // date: string;
  // due_date: string;
  dayRangeType: string;
  default_intervals: IDefaultIntervals[];
  description: string;
  durationType: string;
  endDate: string | null;
  event: number;
  // event_end_date: string | null;
  // event_start_date: string | null;
  // file: IEventScheduleModuleFile | null;
  // files: IEventScheduleModuleFile[];
  future_days: number | string | null;
  // gl: { label: string; value: string };
  id: number;
  intervals: IIntervals[];
  invitation_title: string;
  // is_deleted: boolean;
  is_email_scheduled: boolean;
  is_rfp_form_link: boolean;
  // month: number;
  // occurrence: number;
  offer_availability: boolean;
  // priority: number;
  // priority_index: number | string | null;
  // property: number;
  // reference_id: string | string | null;
  rfp_form: string | null;
  // rfp_form_id: string | null;
  source_type: string | null;
  startDate: string | null;
  status: number;
  subject: string;
  timeDuration: number;
  title: string;
  track_email: boolean;
  unique_token: number | string | null;
  updated_at: string;
  // user: number;
  // vendor: number | string | null;
  vendor_email: string;
  vendor_cc: string[];
  vendor_bcc: string[];
}
export interface IErrorData {
  detail: string;
}
export interface IErrorResponse {
  data: IErrorData;
}

export interface ISchedualingData {
  detail: ISchedualingDataDetail;
}
export interface ISchedulingAttachment {
  id: number;
  file_url: string;
  file: string;
  filename: string;
  group: string;
  event_rfp: number | null;
}
export interface ISchedulingAttachmentResonse {
  detail: ISchedulingAttachment;
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
export interface ISchedulingDetail {
  dayRangeType: string;
  default_intervals: IDefaultIntervals[];
  description: string;
  durationType: string;
  endDate: string;
  future_days: number | string | null;
  id: number;
  intervals: IIntervals[];
  invitation_title: string;
  is_email_scheduled: boolean;
  offer_availability: boolean;
  startDate: string;
  status: number;
  subject: string;
  timeDuration: number;
  title: string;
  track_email: boolean;
  unique_token: number | string | null;
  vendor: ISchedulingVendor;
  schedule_cc: string[];
  schedule_bcc: string[];
  schedule_vendor_contact: ISchedulingVendorContact;
  attachments: ISchedulingAttachment[];
}

export interface ISchedulingRespose {
  detail: ISchedulingDetail;
  message: string;
  success: boolean;
}

export interface ISingleEventProps {
  detail: IEvent;
  message: string;
  success: boolean;
}

export interface TemplateTaskProps {
  assignee: number;
  description: string;
  id: number;
  name: string;
  assignee_image: string;
  assignee_name: string;
}

export interface IDetail {
  author: number;
  author_name: string;
  created_at: string;
  default_check: boolean;
  description: string;
  id: number;
  property: number;
  tasks: TemplateTaskProps[];
  template_name: string;
  updated_at: string;
  workspace: number;
}

export interface TaskTemplatesProps {
  detail: IDetail[];
}
export interface Imember {
  name: string;
  id: number | string;
  avatar: string | null;
}

export interface IEmailReminderData {
  id?: number | string ;
  unique_position_key: number | string ;
  due_date_choice: number | string ;
  custom_days: number | string | null ;
  custom_choice: number | string ;
  send_email_choice: number | string ;
  member: Imember | null;
}
