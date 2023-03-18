import React from 'react';
import Drawer from '@mui/material/Drawer';
import { DateRangePicker } from 'react-date-range';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface IDueDateDrawer {
  openDueDateDrawer: boolean;
  setOpenDueDateDrawer: (dueDate: boolean) => void;
  drawerStartDate: Date | undefined;
  setDrawerStartDate: (startDate: Date | undefined) => void;
  drawerEndDate: Date | undefined;
  setDrawerEndDate: (endDate: Date | undefined) => void;
}

export default function DueDateDrawer(props: IDueDateDrawer): JSX.Element {
  const {
    openDueDateDrawer, setOpenDueDateDrawer, drawerStartDate, setDrawerStartDate, drawerEndDate, setDrawerEndDate,
  } = props;

  return (
    <div>
      <Drawer
        anchor='bottom'
        open={openDueDateDrawer}
        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
      >
        <div className='filter-wrapper'>
          <div className='d-flex justify-space-between align-items-canter px-4'>
            <p className='cursor-pointer' aria-hidden='true' onClick={(): void => { setOpenDueDateDrawer(false); }}><ArrowBackIcon /></p>
            <p className='heading'>Due</p>
            <p className='btn-txt cursor-pointer text-danger' aria-hidden='true' onClick={(): void => { setDrawerStartDate(undefined); setDrawerEndDate(undefined); setOpenDueDateDrawer(false); }}>Remove</p>
          </div>
          <div className='date-range-popover'>
            <DateRangePicker
              className='schedule-range-picker srp-width'
              ranges={[{
                startDate: drawerStartDate !== undefined ? new Date(drawerStartDate) : new Date(),
                endDate: drawerEndDate !== undefined ? new Date(drawerEndDate) : new Date(),
                // startDate,
                // endDate,
                key: 'selection',
              }]}
              months={1}
              direction='vertical'
              onChange={({ selection }): void => { setDrawerStartDate(selection.startDate); setDrawerEndDate(selection.endDate); }}
              showMonthArrow
              weekdayDisplayFormat='EEEEE'
              monthDisplayFormat='MMM d'
              showMonthAndYearPickers={false}
              color='#00CFA1'
              rangeColors={['rgba(0, 207, 161, 0.3)']}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}
