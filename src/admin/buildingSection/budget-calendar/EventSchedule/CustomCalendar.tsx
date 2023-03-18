/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import moment from 'moment';
import type { CalendarCellProps } from './CustomCalendarFunctions';
import {
  GenerateDates, updateWithDefaultIntervals, updateWithIntervals,
  datesDeviderInRows,
} from './CustomCalendarFunctions';
import './_calendarStyles.scss';
import DateRangeForCalendar from './DateRangeForCalendar';
import type { ISchedulingDetail, ISingleInterval, ISchedualingDataDetail } from '../types';
import IntervalDialog from './IntervalDialog';

export interface CustomCalendarProps {
  schedulingData: ISchedualingDataDetail | ISchedulingDetail | null;
}

export interface ActionProps {
  open: boolean;
  data: DialogIntervalsProps | null;
}

export interface DialogIntervalsProps {
  date: Date;
  id: number | null;
  day: string;
  intervals: ISingleInterval[];
  defaultIntervals?: ISingleInterval[];
}

export default function CustomCalendar({ schedulingData }: CustomCalendarProps): JSX.Element {
  const [rangeDif, setRangeDiff] = useState<number>(14);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [tableData, setTableData] = useState<CalendarCellProps[]>([]);
  const [endDate, setEndDate] = useState<Date>(moment().add(rangeDif, 'd').toDate());
  const [showMore, setShowMore] = useState<boolean>(false);
  const [action, setAction] = useState<ActionProps>({ open: false, data: null });

  const dataRender = datesDeviderInRows(tableData);

  const handleNext = (): void => {
    setStartDate(moment(startDate).add(rangeDif, 'd').toDate());
    setEndDate(moment(endDate).add(rangeDif, 'd').toDate());
  };

  const handleBack = (): void => {
    setStartDate(moment(startDate).subtract(rangeDif, 'd').toDate());
    setEndDate(moment(endDate).subtract(rangeDif, 'd').toDate());
  };

  const handleShowMore = (): void => {
    if (showMore) {
      setEndDate(moment(endDate).subtract(7, 'd').toDate());
      setShowMore(false);
    } else {
      setEndDate(moment(endDate).add(7, 'd').toDate());
      setShowMore(true);
    }
  };

  useEffect(() => {
    const generatedDates = GenerateDates(startDate, endDate);
    if (schedulingData !== null) {
      const datesWithDefaultIntervals = updateWithDefaultIntervals(generatedDates, schedulingData.default_intervals);
      const datesWithIntervals = updateWithIntervals(datesWithDefaultIntervals, schedulingData.intervals);
      setTableData(datesWithIntervals);
    }
    setRangeDiff(moment(endDate).diff(startDate, 'd'));
  }, [schedulingData, startDate, endDate]);

  const handleRange = (sDate: Date, eDate: Date): void => {
    setStartDate(moment(sDate).toDate());
    setEndDate(moment(eDate).toDate());
  };

  const handleClose = (): void => {
    setAction({ open: false, data: null });
  };

  return (
    <div className='custom-calendar'>
      <IntervalDialog handleClose={handleClose} action={action} schedulingData={schedulingData} />

      <div className='custom-calendar-header'>
        <div className='left-side'>
          {moment(startDate).format('LL')}
          {' '}
          -
          {' '}
          {moment(endDate).format('LL')}
        </div>
        <div className='right-side'>
          <IconButton onClick={handleBack}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton onClick={handleNext}>
            <ChevronRightIcon />
          </IconButton>
          <DateRangeForCalendar setRanges={handleRange} startDate={startDate} endDate={endDate} />

        </div>
      </div>

      <div className='event-table-wrapper'>

        <Table className='event-custom-calendar'>
          <TableHead>
            <TableRow>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, dayIndex) => (
                <TableCell className={dayIndex === 0 ? 'header-cell-wrapper first-header' : 'header-cell-wrapper'}>
                  {' '}
                  <div className='header-cell'>
                    {' '}
                    <span>

                      {day.substring(0, 3)}

                    </span>

                  </div>
                  {' '}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRender.map((row: CalendarCellProps[]) => (
              <TableRow>

                {row.map((cell: CalendarCellProps, cellIndex: number): JSX.Element => (
                  <TableCell
                    onClick={(): void => {
                      if (cell.day !== 'Sunday' && cell.day !== 'Saturday') {
                        setAction({
                          open: true,
                          data: {
                            id: cell.id, date: cell.date, day: cell.day, defaultIntervals: cell.default_intervals, intervals: cell.intervals,
                          },
                        });
                      }
                    }}
                    style={{ background: cell.isToday ? 'rgba(0,207,161,.12)' : '' }}
                    className={cellIndex === 0 ? 'body-cell-wrapper first-body-cell' : 'body-cell-wrapper'}
                  >
                    <div className='body-cell'>
                      <div className={cell.day === 'Sunday' || cell.day === 'Saturday' ? 'date-block date-disable' : 'date-block'}>
                        {cell.isToday ? 'Today' : cell.dayNum}
                      </div>
                      <div className='events-block'>
                        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                        {cell.default_intervals !== undefined ? cell.default_intervals.map((interval) => (
                          <p>
                            {moment(interval.start, 'hh:mm').format('hh:mm:A')}
                            -
                            {moment(interval.end, 'hh:mm').format('hh:mm:A')}
                          </p>
                        )) : cell.intervals.map((interval) => (
                          <p>
                            {moment(interval.start, 'hh:mm').format('hh:mm:A')}
                            -
                            {moment(interval.end, 'hh:mm').format('hh:mm:A')}
                          </p>
                        ))}

                      </div>
                      {/* <Tooltip title='something'></Tooltip> */}
                    </div>
                  </TableCell>
                ))}

              </TableRow>
            ))}

          </TableBody>
        </Table>
      </div>

      <div className='show-button' onClick={handleShowMore} aria-hidden='true'>
        <h6>
          {' '}
          {showMore ? 'Show Less' : 'Show More'}
          {' '}
        </h6>
      </div>

    </div>
  );
}
