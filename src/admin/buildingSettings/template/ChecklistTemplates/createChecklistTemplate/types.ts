/* eslint-disable @typescript-eslint/no-type-alias */
export interface IFiles {
  file: string;
  file_name: string;
}
export interface Iassignee {
  avatar: string;
  name: string;
  id: number;
  email: string;
}
export interface ISubTasks {
  id?: number;
  value: string;
  isTrue?: boolean;
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
}

export interface IContent {
  created_at?: string;
  id?: number;
  position?: number;
  type: string;
  unique_position_key: string;
  updated_at?: string;
  value?: string;
  form_type?: string;
  is_required?: boolean;
  label?: string;
  label_key?: string;
  options?: IOptions[];
  description?: string;
  files?: IFiles;
  subTasks?: ISubTasks[];
  is_duplicate?: boolean;
  is_new?: boolean;
  sendEmailData?: ISendEmailData;

}

export interface ITasks {
  assignees: Iassignee[];
  content: IContent[];
  created_at?: string;
  due_days?: number;
  task_index?: number;
  due_hours?: number;
  due_is_after?: boolean;
  due_is_weekday_only?: boolean;
  due_minutes?: number;
  due_months?: number;
  due_rule?: string | null;
  have_email_form_fields?: boolean;
  have_form_fields?: boolean;
  isDueDateSave?: boolean;
  id?: number;
  index?: number;
  is_heading: boolean;
  is_stop: boolean;
  name?: string | null;
  unique_position_key?: string;
  updated_at?: string;
}

export interface IState {
  assignees: [];
  author: number;
  created_at: string;
  id: number;
  is_getting_updated: boolean;
  num_of_tasks: number;
  property: number;
  tasks: ITasks[];
  template_name: string;
  updated_at: string;
}
export type Id = string;
export type DraggableId = Id;
export type DroppableId = Id;
export interface Combine {
  draggableId: DraggableId;
  droppableId: DroppableId;
}
export interface DraggableLocation {
  droppableId: DroppableId;
  index: number;
}
export interface DraggableRubric {
  draggableId: DraggableId;
  mode: MovementMode;
  source: DraggableLocation;
}
export type MovementMode = 'FLUID' | 'SNAP';
export interface DragStart extends DraggableRubric {
  mode: MovementMode;
}

export interface DragUpdate extends DragStart {
  // may not have any destination (drag to nowhere)
  destination?: DraggableLocation | undefined;
  // populated when a draggable is dragging over another in combine mode
  combine?: Combine | undefined;
}

export type DropReason = 'CANCEL' | 'DROP';

export interface DropResult extends DragUpdate {
  reason: DropReason;
}
export interface Iresult {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
}
export interface IPeopleResponse {
  success: boolean;
  detail: Iresult[];
  message: string;
}

export interface IselectPayload {
  role: number;
  id: number;
}
export interface IResponse {
  code: string;
  message: string;
  status: number;
}
export interface IData {
  response: IResponse;
}
export interface IErrorResponse {
  data: IData;
}
