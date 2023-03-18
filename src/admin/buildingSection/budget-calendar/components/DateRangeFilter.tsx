import {
  Popover,
} from '@mui/material';
import React from 'react';
import type { ICreatedFilters } from 'admin/buildingSettings/template/ChecklistTemplates/types';
import { DateRangePicker } from 'react-date-range';
import FilterButton from './FilterButton';

export default function DateRangeFilter(props: ICreatedFilters): JSX.Element {
  const {
    startDate, setStartDate, endDate, setEndDate,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const resetSelected = (event: React.ChangeEvent): void => {
    event.stopPropagation();
    setAnchorEl(null);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div>
      <FilterButton text='Created' onClick={handleClick} startDate={startDate} endDate={endDate} resetSelected={resetSelected} />
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
        <div className='date-range-popover' style={{ width: '500px' }}>
          <DateRangePicker
            className='schedule-range-picker srp-width'
            ranges={[{
              startDate: startDate !== undefined ? new Date(startDate) : new Date(),
              endDate: endDate !== undefined ? new Date(endDate) : new Date(),
              // startDate,
              // endDate,
              key: 'selection',
            }]}
            months={2}
            direction='horizontal'
            onChange={({ selection }): void => { setStartDate(selection.startDate); setEndDate(selection.endDate); }}
            showMonthArrow
            weekdayDisplayFormat='EEEEE'
            monthDisplayFormat='MMM d'
            showMonthAndYearPickers={false}
            color='#00CFA1'
            rangeColors={['rgba(0, 207, 161, 0.3)']}
          />
        </div>

      </Popover>
    </div>
  );
}
