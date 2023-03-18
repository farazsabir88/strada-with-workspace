import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { IconButton } from '@mui/material';
import Popover from '@mui/material/Popover';
import SecondaryButton from 'shared-components/components/SecondaryButton';

interface IDateRangeDialog {
  startDate: Date;
  endDate: Date;
  // open: boolean;
  // handleClose: () => void;

  setRanges: (_startDate: Date, _endDate: Date) => void;
}

export default function DateRangeForCalendar({ startDate, endDate, setRanges }: IDateRangeDialog): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [sd, setSd] = useState<Date>(new Date());
  const [ed, setEd] = useState<Date>(moment().add(13, 'd').toDate());

  useEffect(() => {
    setSd(moment(startDate).toDate());
    setEd(moment(endDate).toDate());
  }, [startDate, endDate]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    // setSd(new Date());
    // setEd(moment().add(13, 'd').toDate());
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleRange = (stDate: Date, edDate: Date): void => {
    setSd(stDate);
    setEd(edDate);
  };

  const handleSave = (): void => {
    setRanges(sd, ed);
    handleClose();
    // setSd(new Date());
    // setEd(moment().add(13, 'd').toDate());
  };

  return (
    <div className='date-range-for-calendar'>
      <IconButton onClick={handleClick}>
        <DateRangeIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <DateRangePicker
          // minDate={moment().toDate()}
          className='schedule-range-picker'
          ranges={[{
            startDate: sd,
            endDate: ed,
            key: 'selection',
          }]}
          onChange={(ranges): void => {
            handleRange(moment(ranges.selection.startDate).toDate(), moment(ranges.selection.endDate).toDate());
          }}
          showMonthArrow={false}
          showDateDisplay={false}
          weekdayDisplayFormat='EEEEE'
          dayDisplayFormat='d'
          color='#00CFA1'
          rangeColors={['rgba(0, 207, 161, 0.3)']}
        />

        <div className='calendar-control-button'>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton className='secondary-diloag-btn' form='gl-form' onClick={handleSave}>Save</SecondaryButton>
        </div>
      </Popover>

    </div>
  );
}
