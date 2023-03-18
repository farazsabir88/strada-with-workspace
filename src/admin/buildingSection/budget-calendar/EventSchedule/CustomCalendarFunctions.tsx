/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import moment from 'moment';
import type { IDefaultIntervals, IIntervals } from '../types';

export interface CalendarIntervalsProps {
  start: string;
  end: string;
}

export interface CalendarCellProps {
  id: number | null;
  date: Date;
  day: string;
  dayNum: number;
  isToday: boolean;
  default_intervals?: CalendarIntervalsProps[];
  intervals: CalendarIntervalsProps[];
}

export const GenerateDates = (startDate: Date, endDate: Date): CalendarCellProps[] => {
  // Cloning Start and end dates so that, we can use its initial state later
  const startDateClone = new Date(startDate);
  const endDateClone = new Date(endDate);
  const dates = [];

  // this while loop calculates all the dates between range
  while (moment(startDate).format('M/D/YYYY') !== moment(endDate).format('M/D/YYYY')) {
    dates.push({
      id: null,
      date: moment(startDate).toDate(),
      day: moment(startDate).format('dddd'),
      dayNum: startDate.getDate(),
      isToday: moment(startDate).isSame(moment(), 'day'),
      default_intervals: moment(startDate).format('dddd') === 'Sunday' || moment(startDate).format('dddd') === 'Saturday' ? [] : [{ end: '17:00', start: '9:00' }],
      intervals: [],
    });
    startDate = moment(startDate).add(1, 'days').toDate();
  }

  // this block of code creat new dates which starts from sunday to start date range
  const startDay = startDateClone.getDay();
  const endDay = endDateClone.getDay();

  let startDayCopy = moment(new Date(startDateClone)).subtract(startDay, 'd').toDate();
  const startDates = [];

  for (let i = 0; i < startDay; i++) {
    startDates.push({
      id: null,
      date: moment(startDayCopy).toDate(),
      day: moment(startDayCopy).format('dddd'),
      dayNum: startDayCopy.getDate(),
      isToday: moment(startDayCopy).isSame(moment(), 'day'),
      default_intervals: moment(startDayCopy).format('dddd') === 'Sunday' ? [] : [{ end: '17:00', start: '9:00' }],
      intervals: [],
    });
    startDayCopy = moment(startDayCopy).add(1, 'd').toDate();
  }

  // this block of code creat new dates which ends on Saturday in the end date range
  let endDayCopy = new Date(endDateClone);
  const endDates = [];

  for (let i = 0; i <= (6 - endDay); i++) {
    endDates.push({
      id: null,
      date: moment(endDayCopy).toDate(),
      day: moment(endDayCopy).format('dddd'),
      dayNum: endDayCopy.getDate(),
      isToday: moment(endDayCopy).isSame(moment(), 'day'),
      default_intervals: moment(endDayCopy).format('dddd') === 'Saturday' ? [] : [{ end: '17:00', start: '9:00' }],
      intervals: [],
    });
    endDayCopy = moment(endDayCopy).add(1, 'd').toDate();
  }

  return [...startDates, ...dates, ...endDates];
};

export const updateWithDefaultIntervals = (generalDates: CalendarCellProps[], defaultIntervals: IDefaultIntervals[]): CalendarCellProps[] => {
  const generalDatesCopy = [...generalDates];
  defaultIntervals.map((defaultInterval) => {
    generalDatesCopy.map((gd, gdIndex) => {
      if (gd.day === defaultInterval.day) {
        generalDatesCopy[gdIndex].default_intervals = defaultInterval.intervals;
        generalDatesCopy[gdIndex].id = defaultInterval.id;
      }

      return gd;
    });
    return defaultInterval;
  });

  return generalDatesCopy;
};

export const updateWithIntervals = (datesWithDefaultIntervals: CalendarCellProps[], intervals: IIntervals[]): CalendarCellProps[] => {
  const datesWithDefaultIntervalsCopy = [...datesWithDefaultIntervals];

  intervals.map((interval) => {
    datesWithDefaultIntervalsCopy.map((gd, gdIndex) => {
      if (moment(gd.date).format('YYYY-MM-DD') === interval.date) {
        datesWithDefaultIntervalsCopy[gdIndex].intervals = interval.intervals;
        datesWithDefaultIntervalsCopy[gdIndex].id = interval.id;
        delete datesWithDefaultIntervalsCopy[gdIndex].default_intervals; // no def intervals when intervals are found
      }
      return gd;
    });
    return interval;
  });
  return datesWithDefaultIntervalsCopy;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const datesDeviderInRows = (dates: CalendarCellProps[]): any => {
  const datesClone = [...dates];
  const devidedResults = [];
  let datesParking = [];
  for (let i = 1; i < dates.length; i++) {
    if (datesClone.length > 0) {
      const dateToPush = datesClone.shift();
      if (datesParking.length === 7) {
        devidedResults.push(datesParking);
        datesParking = [];
      }
      datesParking.push(dateToPush);
    }
  }
  return devidedResults;
};
