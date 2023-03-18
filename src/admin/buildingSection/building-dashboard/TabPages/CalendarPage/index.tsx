/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  IconButton, Input, InputAdornment, Dialog, DialogContent,
} from '@mui/material';
import moment from 'moment';
import { useQuery } from 'react-query';
import type { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib//css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { ICalendarEvents, ICalendarEventsResponse } from '../../types';

export default function CalendarPage(): JSX.Element {
  const localizer = momentLocalizer(moment);
  const [mainDate, setDate] = useState(new Date());
  const [yearly, setYearly] = useState(false);
  const [allEvents, setAllEvents] = useState<ICalendarEvents[]>([]);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [calendarPopupEvents, setCalendarPopupEvents] = useState<ICalendarEvents[]>([]);
  const formats = {
    timeGutterFormat: 'HH:mm',
  };
  useQuery(
    ['get/dashboard/calendar-events'],
    async () => axios({
      url: 'api/dashboard/calendar-events/',
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<ICalendarEventsResponse>) => res.data.detail,
      onSuccess: (res) => {
        setAllEvents(res.all_event_data);
      },
    },

  );
  function CustomMonthInput({ value, onClick, yearly: newYearly }: { value: Date; onClick: () => void; yearly: boolean }): JSX.Element {
    return (
      <Input
        id='month-input'
        name='month-input'
        type='text'
        value={newYearly ? moment(value).format('YYYY') : value}
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

  function CustomToolbar(): JSX.Element {
    return (
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
                  setDate(date);
                  setYearly(true);
                }}
                aria-hidden='true'
              >
                {' '}
                {moment(date).format('YYYY')}

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
          customInput={<CustomMonthInput value={mainDate} onClick={(): void => { }} yearly={yearly} />}
          // ref={this.startRef}
          shouldCloseOnSelect={false}
        />
        <span aria-hidden='true' onClick={(): void => { setDate(new Date()); }}>Today</span>

      </div>
    );
  }

  return (
    <div>
      <div>
        <Calendar
          localizer={localizer}
          formats={formats}
          popup={false}
          style={{ height: '800px' }}
          onShowMore={(events): void => { setShowCalendarPopup(true); setCalendarPopupEvents(events); }}
          events={allEvents}
          startAccessor='start'
          endAccessor='end'
          views={['month']}
          date={mainDate}
          components={{
            toolbar: CustomToolbar,
            event: (e): JSX.Element => (
              <div>
                <span style={{ fontSize: '11px' }}>
                  {moment(e.event.start).format('hh:mm a') !== '12:00 am' ? moment(e.event.start).format('hh:mm a') : null}
                  {' '}
                  <strong style={{ fontSize: '12px', marginLeft: '4px' }}>{e.title}</strong>
                  {' '}
                </span>
              </div>
            )
            ,
          }}
        />
      </div>
      {showCalendarPopup
        && (
          <Dialog open={showCalendarPopup} onClose={(): void => { setCalendarPopupEvents([]); setShowCalendarPopup(false); }} aria-labelledby='form-dialog-title'>
            <DialogContent style={{ padding: '24px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>
                {' '}
                {calendarPopupEvents[0].start}
              </div>
              {calendarPopupEvents.map((event) => (
                <>
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>{event.title}</span>
                  <br />
                </>
              ))}
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
}
