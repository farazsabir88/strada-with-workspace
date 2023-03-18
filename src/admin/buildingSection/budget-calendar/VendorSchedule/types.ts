import type { IDefaultIntervals } from 'admin/buildingSection/budget-calendar/types';
import type { Moment } from 'moment';

export interface ISelectedTimeZone {
  label: string;
  value: string;
}

export interface IRecurrence {
  end: string;
  start: string;
}
export interface IPayloadDetail {
  guests: string[];
  event_name: string;
  email: string;
  description: string;
  date: string;
  start: string;
  end: string;
  timezone: string;
}
export interface ISchedulingPaylod {
  details: IPayloadDetail;
}

interface IIntegratedEmailEvents {
  end: string;
  recurrence: IRecurrence[];
  start: string;
  subject: string;
  time_zone: string;
}

export interface IIntervals {
  created_at: string;
  date: string;
  event: number;
  id: number;
  intervals: IRecurrence[];
  type: string;
  updated_at: string;
}

export interface IGuests {
  label: string;
  value: string;
}

export interface IVendorScheduleDetails {
  date: string;
  description: string;
  email: string;
  end: string;
  event_name: string;
  guests: string[];
  start: string;
  timezone: string;
}
export interface IVendorSchedule {
  dayRangeType: string;
  default_integration: string;
  default_intervals: IDefaultIntervals[];
  details: IVendorScheduleDetails;
  durationType: string;
  endDate: string;
  future_days: number;
  id: number;
  integrated_email_events: IIntegratedEmailEvents[];
  intervals: IIntervals[];
  invitation_title: string;
  property: string;
  startDate: string;
  subject: string | null;
  timeDuration: number;
  title: string;
  user: number;
}

export interface IVendorScheduleResponse {
  detail: IVendorSchedule;
}

export interface IAvailableTime {
  start: Moment;
  end: Moment;
  isBooked: boolean;
}
