/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
import { IconButton, Input, InputAdornment } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { IHeader } from '../types';

function CustomMonthInput({
  value, onClick, dateYear,
}: { value: Date | string | null; onClick: () => void; dateYear: string }): JSX.Element {
  return (
    <Input
      id='month-input'
      name='month-input'
      type='text'
      value={value === '' ? dateYear : value}
      readOnly
      disableUnderline
      endAdornment={(
        <InputAdornment position='end'>
          <IconButton onClick={onClick}><ArrowDropDownIcon /></IconButton>
        </InputAdornment>
      )}
    />
  );
}

export default function Header(props: IHeader): JSX.Element {
  const {
    date: mainDate, setDate, dateYear, setDateYear, setYearly, setNewEventOpen,
  } = props;

  return (
    <div>
      <p className='bc-header'> Budget Calendar </p>
      <div className='bc-bottom-header'>
        <DatePicker
          renderCustomHeader={({
            date,
            decreaseYear,
            increaseYear,
          }): JSX.Element => (
            <div className='DatePicker-custom-header'>
              <div className='DatePicker-custom-prev-button' onClick={decreaseYear} aria-hidden='true'>
                <i className='fas fa-caret-left' />
              </div>
              <div
                className='DatePicker-custom-date'
                onClick={(): void => {
                  setDateYear(moment(date).format('YYYY'));
                  setDate(null);
                  setYearly(true);
                }}
                aria-hidden='true'
              >
                {' '}
                { date === null ? dateYear : moment(date).format('YYYY')}

              </div>
              <div className='DatePicker-custom-next-button' onClick={increaseYear} aria-hidden='true'>
                <i className='fas fa-caret-right' />
              </div>
            </div>
          )}
          selected={mainDate}
          dateFormat='MMM yyyy'
          showMonthYearPicker
          className='monthpicker-input'
          calendarClassName='monthpicker-calendar'
          showPopperArrow={false}
          onChange={(obj: Date): void => { setDate(obj); setYearly(false); }}
          customInput={<CustomMonthInput value={mainDate} onClick={(): void => { }} dateYear={dateYear} />}
          shouldCloseOnSelect={false}
        />
        <div className='btn-wrapper d-flex align-items-center'>
          <PrimayButton onClick={(): void => { setNewEventOpen(true); }}> Add Event </PrimayButton>
        </div>
      </div>

    </div>
  );
}
