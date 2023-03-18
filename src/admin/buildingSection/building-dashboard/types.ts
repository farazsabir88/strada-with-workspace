import type { Ibuilding } from 'types';
import type { IEvent } from '../budget-calendar/types';

export interface BuildingsResponse {
  success: true;
  detail: Ibuilding[];
  result: Ibuilding[];
  message: string;
}
export interface IWorkspace {
  id: number;
  name: string;
}
export interface WorkspacesResponse {
  success: true;
  detail: IWorkspace[];
  message: string;
}

export interface EventsResponse {
  next: string | null;
  previous: string | null;
  results: IEvent[];
}

export interface PrioritizedEvents {
  later: IEvent[];
  upcoming: IEvent[];
  today: IEvent[];
}
export interface PrioritizedEventsResponse {
  detail: PrioritizedEvents;
}

export interface UserInfo {
  avatar: string;
  email: string;
  id: number;
  name: string;
}
export interface Workspace {
  id: number;
  name: string;
}

export interface RecentActivity {
  description: string;
  event: number;
  property: number;
  property_info: string;
  time: string;
  type: string;
  user_info: UserInfo;
  workspace: Workspace;
}

export interface RecentActivityResponse {
  message: string;
  results: RecentActivity[];
  success: boolean;
  next: string;
}

export interface ICalendarEvents {
  title: string;
  start: Date;
  end: Date;
}
export interface ICalendarAllEventsResponse {
  all_event_data: ICalendarEvents[];
}
export interface ICalendarEventsResponse {
  detail: ICalendarAllEventsResponse;
}
