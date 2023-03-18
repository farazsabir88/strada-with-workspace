export interface Iarchiveby {
  id: number;
  name: string;
}
export interface IDueStatus {
  due: string | null;
  status: number | null;
}
export interface ISubTasks {
  id?: number;
  value: string;
  isTrue?: boolean;
  is_completed: boolean;
  unique_position_key: string;
  created_at?: string;
}
export interface IOptions {
  id?: number;
  value?: string;
  label: string;
  isTrue?: boolean;
  unique_position_key: string;
  created_at?: string;
}
export interface ISendEmailData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  cleaned_to: string;
  cleaned_cc: string;
  cleaned_bcc: string;
  cleaned_subject: string;
  cleaned_body: string;
}
export interface IFiles {
  file: string;
  file_name: string;
}
export interface ISelectedOption {
  id: number;
  value: string;
  label: string;
}
export interface IContent {
  created_at?: string;
  id?: number;
  position?: number;
  type: string;
  unique_position_key: string;
  updated_at?: string;
  value: string;
  form_type?: string;
  is_required?: boolean;
  label?: string;
  label_key?: string;
  options?: IOptions[];
  description?: string;
  files?: IFiles;
  file?: IFiles;
  subTasks?: ISubTasks[];
  is_duplicate?: boolean;
  is_new?: boolean;
  email_sent?: boolean;
  sendEmailData?: ISendEmailData;
  selected_option?: ISelectedOption | null;

}
export interface Icommentuser {
  id: number;
  name: string;
  avatar: string;
}
export interface Iattachment {
  id: number;
  file: string;
  file_name: string;
}
export interface Icomments {
  id: number;
  created_at: string;
  updated_at: string;
  comment: string | null;
  attachments: Iattachment[];
  user: Icommentuser;
}
export interface Ihistoryuser {
  id: number;
  name: string;
}
export interface Ihistory {
  id: number;
  description: string;
  time: string;
  comment: string;
  user: Ihistoryuser;
}
export interface ICompletedBy {
  id: number;
  name: string;
}
export interface Itasks {
  assignees: Iassignee[];
  comments: Icomments[];
  completed_at: string;
  completed_by: ICompletedBy;
  content: IContent[];
  created_at: string;
  due_date: string | null;
  due_status: IDueStatus;
  have_email_form_fields: boolean;
  have_form_fields: boolean;
  history: Ihistory[];
  id: number;
  index: number;
  is_completed: boolean;
  is_heading: boolean;
  is_next_blocked: boolean;
  is_stop: boolean;
  is_template_due_date: boolean;
  name: string;
  task_index: number;
  template_id: number;
  updated_at: string;
  due_months: number;
  due_days: number;
  due_hours: number;
  due_minutes: number;
  due_rule: string | null;
  due_is_after: boolean;
}
export interface IBuilding {
  id: number;
  address: string;
}
export interface Iresponse {
  name: string;
  archived_at: string | null;
  archived_by: Iarchiveby | null;
  building: IBuilding;
  due_date: string | null;
  id: number ;
  error_occurred: boolean;
  is_archived: boolean;
  is_getting_updated: boolean;
  last_activity: number;
  status: number;
  task_completed: number;
  total_tasks: number;
  template: number;
  updated_at: string;
  author_name: string;
  created_at: string;
  template_name: string;
  assignees: Iassignee[];
  tasks: Itasks[];
  isPrint?: boolean;
}

export interface ITemplateResponse {
  id: number ;
  author_name: string;
  created_at: string;
  updated_at: string;
  template_name: string;
  description: string;
  default_check: boolean;
  content: string;
  author: number ;
  property: number ;
  num_of_tasks: number;
  is_getting_updated: boolean;
  assignees: [];
  tasks: [];
}
export interface ITemplateFilterData {
  id: number ;
  template_name: string;
}
export interface ITemplateFilterResponse {
  detail: ITemplateFilterData[];
}
export interface IBuildingFilterData {
  id: number ;
  address: string;
}

export interface IBuildingFilterResponse {
  detail: IBuildingFilterData[];
}
export interface IAssigneeFilterData {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
}
export interface IAssigneeFilterResponse {
  success: boolean;
  detail: IAssigneeFilterData[];
  message: string;
}
export interface IDuplicateChecklist {
  name: string;
  template: number;
}

export interface Iuser {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}
export interface ITemplateOption {
  name: string;
  value: number;
}
export interface IOption {
  name: string;
  id: number;
}
export interface Iassignee {
  avatar: string;
  name: string;
  email: string;
  id: number;
}
export interface IStatusFilter {
  statusFilter: number[];
  setStatusFilter: (status: number[]) => void;
}
export interface IBuildingFilter {
  buildingFilter: number[];
  setBuildingFilter: (building: number[]) => void;
}
export interface ITemplateFilters {
  templateFilter: number[];
  setTemplateFilter: (template: number[]) => void;
}
export interface IAssigneeFilters {
  assignees: number[];
  setAssignees: (assignees: number[]) => void;
}
export interface ITaskCompletedFilters {
  taskCompletedType: string;
  setTaskCompletedType: (taskCompletedType: string) => void;
  taskCompletedValue: number | undefined;
  setTaskCompletedValue: (taskCompletedValue: number | undefined) => void;
}
export interface ICreatedFilters {
  startDate: Date | undefined;
  setStartDate: (startDate: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (endDate: Date | undefined) => void;
}
export interface IFilters extends IStatusFilter, IBuildingFilter, ITemplateFilters, IAssigneeFilters, ITaskCompletedFilters, ICreatedFilters {
}
interface IpropertyPermission {
  vendor_contracts: boolean;
  accounts_receivable: boolean;
  invoicing: boolean;
  cois: boolean;
  approval_docs: boolean;
  budget_calendar: boolean;
  reforecast_items: true;
}
interface IuserInfo {
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}
export interface Iresult {
  id: number;
  property: number;
  user: number;
  user_info: IuserInfo;
  property_permissions: IpropertyPermission;
  role: number;
  no_approval: number;
}
export interface IPeople {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
}
export interface IPeopleResponse {
  success: boolean;
  detail: IPeople[];
  message: string;
}
export interface IchecklistCompleteStatus {
  checklistStatus: boolean;
  completeId: number;
}
export interface ISortBy {
  value: string;
  label: string;
}
