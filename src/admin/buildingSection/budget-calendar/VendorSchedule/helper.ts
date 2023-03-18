/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-for-of */
import type {
  ISelectedTimeZone, IVendorSchedule, IIntervals, IRecurrence, IAvailableTime,
} from 'admin/buildingSection/budget-calendar/VendorSchedule/types';
import moment from 'moment';

export const getTimezoneOffset = (): ISelectedTimeZone => {
  let offset = new Date().getTimezoneOffset();
  const name = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const sign = offset < 0 ? '+' : '-';
  offset = Math.abs(offset);
  const hour = offset / 60 > 9 ? (offset / 60).toString() : `0${(offset / 60).toString()}`;
  const minutes = offset % 60 > 10 ? (offset % 60).toString() : `0${(offset % 60).toString()}`;
  return {
    label: `(GMT${sign}${hour}:${minutes}) ${name}`,
    value: name,
  };
};

export const getDisableDates = (event: IVendorSchedule | undefined): Date[] => {
  const start = moment(event?.startDate);
  const end = moment(event?.endDate);
  const disableDates = [];
  while (start <= end) {
    if (start.weekday() === 0 || start.weekday() === 6) {
      const index = event?.intervals.findIndex((date: IIntervals) => date.date === start.format('YYYY-MM-DD'));
      if (index === -1) { disableDates.push(start.toDate()); }
    }

    const index = event?.intervals.findIndex((date: IIntervals) => date.date === start.format('YYYY-MM-DD') && date.intervals.length === 0);
    if (index !== -1) { disableDates.push(start.toDate()); }

    start.add(1, 'days');
  }
  return disableDates;
};

export const convertDateToUTC = (date: Date): Date => new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

export const getMinDate = (event: IVendorSchedule | undefined): Date => {
  if (event !== undefined) {
    return convertDateToUTC(new Date(event.startDate));
  }
  return convertDateToUTC(new Date());
};

export const getMaxDate = (event: IVendorSchedule | undefined): Date => {
  if (event !== undefined) {
    return convertDateToUTC(new Date(event.endDate));
  }
  return convertDateToUTC(new Date());
};

export const getAvailableTimeIntervals = (event: IVendorSchedule | undefined, defaultIntervals: IRecurrence[], selectedDate: Date | undefined, booked: IRecurrence[]): IAvailableTime[] => {
  let customdefault: IRecurrence[] = [];
  if (event !== undefined) {
    for (let i = 0; i < event.default_intervals.length; i += 1) {
      if (event.default_intervals[i].day === moment(selectedDate).format('dddd')) {
        customdefault = event.default_intervals[i].intervals;
        break;
      }
    }
    if (customdefault.length === 0) {
      customdefault = defaultIntervals;
    }
    const index = event.intervals.findIndex((date) => date.date === moment(selectedDate).format('YYYY-MM-DD'));
    const selectedIntervals = index >= 0 ? event.intervals[index].intervals : customdefault;
    const availableTime: IAvailableTime[] = [];
    const selectedDateBooking = booked.filter((data) => moment(data.start).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'));
    selectedIntervals.forEach((interval) => {
      const start = moment(interval.start, 'HH:mm');
      const end = moment(interval.end, 'HH:mm');
      const middle = moment(interval.start, 'HH:mm').add(-30, 'minutes');
      const middleEnd = moment(interval.end, 'HH:mm').add(-30, 'minutes');
      while (start < end) {
        availableTime.push({ start: start.clone(), end: start.clone().add(event.timeDuration, 'minutes'), isBooked: false });
        if (event.timeDuration === 60 && middle.add(60, 'minutes') < middleEnd) {
          availableTime.push({ start: middle.clone(), end: middle.clone().add(event.timeDuration, 'minutes'), isBooked: false });
        }
        if (event.timeDuration === 60 && start.add(60, 'minutes') < middleEnd) { start.add(0, 'hours'); } else if (event.timeDuration === 45 && start.add(45, 'minutes') < middleEnd) {
          start.add(0, 'hours');
        } else { start.add(event.timeDuration, 'minutes'); }
      }
      selectedDateBooking.map((eventTime) => {
        if (moment.utc(eventTime.start).local().format('HH:mm') <= interval.start && moment.utc(eventTime.end).local().format('HH:mm') >= interval.end) {
          availableTime.map((slotTime) => { slotTime.isBooked = true; });
        } else if (
          moment.utc(eventTime.start).local().format('HH:mm') >= interval.start
          && moment.utc(eventTime.start).local().format('HH:mm') <= interval.end
          && moment.utc(eventTime.end).local().format('HH:mm') >= interval.start
          && moment.utc(eventTime.end).local().format('HH:mm') <= interval.end
        ) {
          availableTime.map((slotTime) => {
            if (moment.utc(eventTime.start).local().format('HH:mm') <= moment(slotTime.start).format('HH:mm') && moment.utc(eventTime.end).local().format('HH:mm') > moment(slotTime.start).format('HH:mm')) {
              slotTime.isBooked = true;
            }
          });
        } else if (moment.utc(eventTime.start).local().format('HH:mm') <= interval.start && moment.utc(eventTime.end).local().format('HH:mm') <= interval.end) {
          availableTime.map((slotTime) => {
            if (moment.utc(eventTime.end).local().format('HH:mm') > moment(slotTime.start).format('HH:mm')) {
              slotTime.isBooked = true;
            }
          });
        } else if (moment.utc(eventTime.start).local().format('HH:mm') >= interval.start && moment.utc(eventTime.end).local().format('HH:mm') >= interval.end) {
          availableTime.map((slotTime) => {
            if (moment.utc(eventTime.start).local().format('HH:mm') <= moment(slotTime.start).format('HH:mm')) {
              slotTime.isBooked = true;
            }
          });
        }
      });
    });
    return availableTime;
  }
  return [{ start: moment(new Date()), end: moment(new Date()), isBooked: false }];
};

export const getAvailableTimeIntervalsOld = (event: IVendorSchedule | undefined, defaultIntervals: IRecurrence[], selectedDate: Date | undefined, booked: IRecurrence[]): IAvailableTime[] => {
  let customdefault: IRecurrence[] = [];
  if (event !== undefined) {
    for (let i = 0; i < event.default_intervals.length; i += 1) {
      if (event.default_intervals[i].day === moment(selectedDate).format('dddd')) {
        customdefault = event.default_intervals[i].intervals;
        break;
      }
    }

    if (customdefault.length === 0) {
      customdefault = defaultIntervals;
    }

    const index = event.intervals.findIndex((date) => date.date === moment(selectedDate).format('YYYY-MM-DD'));
    const selectedIntervals = index >= 0 ? event.intervals[index].intervals : customdefault;
    const availableTime: IAvailableTime[] = [];
    const selectedDateBooking = booked.filter((data) => moment(data.start).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'));
    selectedIntervals.forEach((interval) => {
      const start = moment(interval.start, 'HH:mm');
      const end = moment(interval.end, 'HH:mm');
      const middle = moment(interval.start, 'HH:mm').add(-30, 'minutes');
      const middleEnd = moment(interval.end, 'HH:mm').add(-30, 'minutes');
      while (start < end) {
        const overlap = selectedDateBooking.findIndex((date) => moment(start, 'HH:mm').isBefore(moment(moment(date.end).format('HH:mm'), 'HH:mm')) && moment(start, 'HH:mm').isAfter(moment(moment(date.start).format('HH:mm'), 'HH:mm')) || moment(start, 'HH:mm').isSame(moment(moment(date.start).format('HH:mm'), 'HH:mm')) || moment(start, 'HH:mm').isSame(moment(moment(date.end).format('HH:mm'), 'HH:mm')));
        if (overlap !== -1) {
          availableTime.push({ start: start.clone(), end: moment(new Date()), isBooked: true });
          if (event.timeDuration === 60 && middle.add(60, 'minutes') < middleEnd) {
            availableTime.push({ start: middle.clone(), end: moment(new Date()), isBooked: true });
          }
        } else {
          availableTime.push({ start: start.clone(), end: moment(new Date()), isBooked: false });
          if (event.timeDuration === 60 && middle.add(60, 'minutes') < middleEnd) {
            availableTime.push({ start: middle.clone(), end: moment(new Date()), isBooked: false });
          }
        }
        if (event.timeDuration === 60 && start.add(60, 'minutes') < middleEnd) {
          start.add(0, 'hours');
        } else if (event.timeDuration === 45 && start.add(45, 'minutes') < middleEnd) {
          start.add(0, 'hours');
        } else { start.add(event.timeDuration, 'minutes'); }
      }
    });
    return availableTime;
  }
  return [{ start: moment(new Date()), end: moment(new Date()), isBooked: false }];
};
