/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import type {
  ISchedulingPaylod, ISelectedTimeZone, IRecurrence, IVendorScheduleDetails, IVendorScheduleResponse,
} from 'admin/buildingSection/budget-calendar/VendorSchedule/types';
import 'admin/buildingSection/budget-calendar/VendorSchedule/_vendorSchedule.scss';
import 'admin/buildingSection/budget-calendar/_budget-calendar.scss';
import {
  getMinDate, getAvailableTimeIntervals, getDisableDates, getMaxDate, getTimezoneOffset,
} from 'admin/buildingSection/budget-calendar/VendorSchedule/helper';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BusinessIcon from '@mui/icons-material/Business';
import {
  Button, Divider,
} from '@mui/material';
import { Calendar } from 'react-date-range';
import Select from 'react-select';
import StradaLoader from 'shared-components/components/StradaLoader';
import moment from 'moment-timezone';
import tick from 'assests/images/tick.svg';
import { WithContext as ReactTags } from 'react-tag-input';

import HookTextField from 'shared-components/hooks/HookTextField';
import type { IFormValues } from 'formsTypes';
import { defaultTimezones } from './timeZones';

const defaultValues: IVendorScheduleDetails = {
  date: '', description: '', email: '', end: '', event_name: '', guests: [], start: '', timezone: '',
};

export default function VendorSchedule(): JSX.Element {
  const { eventId } = useParams();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState('calendar_time');
  const [selectedTimezone, setSelectedTimezone] = useState<ISelectedTimeZone>({ label: '(GMT+05:00) Asia/Karachi', value: 'Asia/Karachi' });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [bookedEvents, setBookedEvents] = useState<IRecurrence[]>([]);
  const defaultIntervals = [{ start: '9:00', end: '17:00' }];
  const [selectedTime, setSelectedTime] = useState(moment(new Date()));
  const [addGuests, setAddGuests] = useState(false);
  const [tags, setTags] = useState<{ id: string; text: string }[]>([]);
  const [mailError, setMailError] = useState('');

  useEffect(() => {
    setSelectedTimezone(getTimezoneOffset());
  }, []);
  const { data: event } = useQuery('get-event', async () => axios({
    url: `api/budget-calendar/${location.pathname.includes('/event') ? 'event' : 'task'}-vendor-scheduling/${eventId?.split('-')[1]}-${eventId?.split('-')[2]}`,
    method: 'get',

  }), {
    select: (res: AxiosResponse<IVendorScheduleResponse>) => res.data.detail,
    onSuccess: (eventData) => {
      if (eventData.dayRangeType === 'future') {
        eventData.startDate = moment(new Date()).add(1, 'days').toISOString().substring(0, 10);
        eventData.endDate = moment(new Date()).add(eventData.future_days, 'days').toISOString().substring(0, 10);
      }
      eventData.details = {
        date: '', description: '', email: '', end: '', event_name: '', guests: [], start: '', timezone: '',
      };
      if (Object.keys(eventData.integrated_email_events).length !== 0) {
        const booked: IRecurrence[] = [];
        eventData.integrated_email_events.forEach((eventSingle) => {
          const data = {
            start: moment(new Date(eventSingle.start)).format('YYYY-MM-DDTHH:mm:ssZ'),
            end: moment(new Date(eventSingle.end)).format('YYYY-MM-DDTHH:mm:ssZ'),
          };
          booked.push(data);
          if (eventSingle.recurrence.length > 0) {
            eventSingle.recurrence.forEach((recurrenceEvent) => {
              const recData = {
                start: moment(new Date(recurrenceEvent.start)).format('YYYY-MM-DDTHH:mm:ssZ'),
                end: moment(new Date(recurrenceEvent.end)).format('YYYY-MM-DDTHH:mm:ssZ'),
              };
              booked.push(recData);
            });
          }
        });
        setBookedEvents(booked);
      }
    },
  });

  const schema = yup.object().shape({
    event_name: yup.string().required('Enter Event Name'),
    email: yup.string().required('Email is required').email('Enter valid email'),
    description: yup.string().required('Enter Description'),
  });

  const {
    control, formState, handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const renderTimeList = (): JSX.Element => {
    const availableTime = getAvailableTimeIntervals(event, defaultIntervals, selectedDate, bookedEvents);

    return (
      <div className='time-list'>
        {availableTime.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const finalTime = moment(item.start).tz(selectedTimezone.value);
          if (!item.isBooked) {
            return (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              <div className='mt-1' style={{ display: 'flex' }} key={moment(item.start).format('hh:mm')}>
                { /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
                <Button variant='outlined' className='time-button text-transform-none' fullWidth style={{ fontSize: '12px', padding: '5px' }} onClick={(): void => { setSelectedTime(item.start); }}>
                  {finalTime.format('hh:mma')}
                </Button>
                { /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
                {moment(selectedTime).format('hh:mm') === moment(item.start).format('hh:mm') && (
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    style={{
                      fontSize: '12px', padding: '5px', backgroundColor: '#00CFA1', marginLeft: '5px',
                    }}
                    onClick={(): void => { setStep('event_details'); }}
                  >
                    Confirm
                  </Button>
                )}
              </div>
            );
          }
          return (
            <div className='mt-1' style={{ display: 'flex' }}>
              <Button variant='outlined' fullWidth disabled style={{ fontSize: '12px', padding: '5px' }}>
                {finalTime.format('hh:mma')}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCalendarTime = (): JSX.Element => {
    const disableWeekends = getDisableDates(event);
    return (
      <div className='email-vendor-to-schedule'>
        <p className='text-center title text-muted' style={{ marginTop: '50px' }}>strada</p>
        <div className='main-area text-muted'>
          <div
            className='inner-main-area'
          >
            <div>
              <p className='sub-title' style={{ maxWidth: '320px' }}>
                {/* {event['title']} */}
                {event?.invitation_title}
              </p>
              <p className='schedule-info'>
                <BusinessIcon style={{ fontSize: '16px' }} />
                <span>
                  &nbsp;&nbsp;
                  {event?.property}
                </span>
              </p>
              <p className='schedule-info'>
                <ScheduleIcon style={{ fontSize: '16px' }} />
                <span>
                  &nbsp;&nbsp;
                  {event?.timeDuration}
                  {' '}
                  minutes
                </span>
              </p>
            </div>
            <Divider orientation='vertical' flexItem style={{ height: 'auto' }} />
            <div>
              <p className='sub-title' style={{ textAlign: 'center' }}>Select Date and Time</p>
              <Calendar
                color='#00CFA1'
                date={selectedDate}
                showMonthArrow={false}
                showDateDisplay={false}
                // weekStartsOn={1}
                minDate={getMinDate(event)}
                maxDate={getMaxDate(event)}
                onChange={(date): void => { setSelectedDate(date); }}
                disabledDates={disableWeekends}
              />
              <Select
                options={defaultTimezones}
                isSearchable
                value={selectedTimezone}
                placeholder='TimeZone...'
                name='timezones'
                onChange={(obj): void => {
                  if (obj !== null) {
                    setSelectedTimezone(obj);
                  }
                }}
              />
            </div>
            {selectedDate && <Divider orientation='vertical' flexItem style={{ height: 'auto' }} />}
            {selectedDate && (
              <div className='time-panel'>
                <p className='sub-title'>{moment(selectedDate).format('dddd - MMM DD')}</p>
                {renderTimeList()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConfirm = (): JSX.Element => {
    const eventStartTime = moment(selectedTime);
    const eventEndTime = eventStartTime.clone().add(event?.timeDuration, 'minutes');
    return (
      <div className='email-vendor-to-schedule'>
        <p className='text-center mt-10 title  text-muted' style={{ marginTop: '50px' }}>strada</p>
        <div
          className='main-area'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            height: '472px',
            width: '368px',
            padding: '0 24px',
          }}
        >
          <img
            style={{
              marginTop: '40px',
              height: '94px',
            }}
            src={tick}
            alt='Congratulations'
          />
          <div className='vendor-card-one'>Your event scheduled</div>
          <div className='vendor-card-two'>
            A calendar invitation has been sent to your email address
          </div>
          <div className='vendor-card-event-name'>
            {event?.invitation_title}
          </div>
          <div className='vendor-card-time'>
            {`${eventStartTime.tz(selectedTimezone.value).format('hh:mma')} - ${eventEndTime.tz(selectedTimezone.value).format('hh:mma')}, ${moment(selectedDate).format(
              'dddd, MMMM DD, YYYY',
            )}`}
          </div>
          <div className='vendor-card-timezone'>
            {selectedTimezone.label}
          </div>
          <div className='vendor-card-email'>
            {event?.details.email}
          </div>
          {event?.details.guests.map((guest) => (
            <div className='vendor-card-guest'>
              {guest}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const {
    mutate,
    isLoading,
  } = useMutation(async (data: ISchedulingPaylod) => axios({
    url: `api/budget-calendar/${location.pathname.includes('/event') ? 'event' : 'task'}-schedule/${event?.id}/`,
    method: 'PATCH',
    data,
  }), {
    onSuccess: () => {
      setStep('confirm');
    },
    onError: () => {
      enqueueSnackbar('Schedule Failed!', { variant: 'error' });
    },
  });

  const onSubmit = (data: IVendorScheduleDetails): void => {
    if (event !== undefined) {
      const eventStartTime = moment(selectedTime);
      const eventEndTime = eventStartTime.clone().add(event.timeDuration, 'minutes');
      const payload: ISchedulingPaylod = {
        details: {
          date: data.description,
          description: data.description,
          email: data.email,
          end: eventEndTime.tz(selectedTimezone.value).format('hh:mm'),
          event_name: data.event_name,
          start: eventStartTime.tz(selectedTimezone.value).format('hh:mm'),
          timezone: selectedTimezone.label,
          guests: tags.map((tag) => tag.id),
        },
      };
      mutate(payload);
    }
  };

  const handleDelete = (i: number): void => {
    setTags(tags.filter((tag, index) => index !== i));
  };
  const handleAddition = (tag: { id: string; text: string }): void => {
    const validation = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!validation.test(tag.id)) {
      setMailError('Enter valid email');
      return;
    }
    setMailError('');
    setTags([...tags, tag]);
  };

  const renderEventDetails = (): JSX.Element => {
    const eventStartTime = moment(selectedTime);
    const eventEndTime = eventStartTime.clone().add(event?.timeDuration, 'minutes');
    return (
      <div className='email-vendor-to-schedule'>
        <p className='text-center mt-10 title  text-muted' style={{ marginTop: '50px' }}>Strada</p>
        <div className='main-area'>
          <div className='sub-area-handle'>
            <div className='res-are-handle'>
              <p className='sub-title'>
                {/* {event['title']} */}
                {event?.invitation_title}
              </p>
              <p className='schedule-info'>
                <BusinessIcon style={{ fontSize: '16px' }} />
                <span>
  &nbsp;&nbsp;
                  {event?.property}
                </span>
              </p>
              <p className='schedule-info'>
                <ScheduleIcon style={{ fontSize: '16px' }} />
                <span>
  &nbsp;&nbsp;
                  {event?.timeDuration}
                  {' '}
                  minutes
                </span>
              </p>
              <p className='schedule-info'>
                {eventStartTime.tz(selectedTimezone.value).format('hh:mm A')}
                {' '}
                ~
                {' '}
                {eventEndTime.tz(selectedTimezone.value).format('hh:mm A')}
                ,
                {' '}
                {moment(selectedDate).format('dddd, MMM, DD, YYYY')}
              </p>
              <p className='schedule-info'>{selectedTimezone.label}</p>
            </div>
            <Divider orientation='vertical' flexItem style={{ height: 'auto' }} />
            <div className='vendor-screen-s'>
              <p className='sub-title'>Event Details</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <HookTextField
                  name='event_name'
                  type='text'
                  label='Name*'
                  control={control}
                  errors={errors}
                />

                <HookTextField
                  name='email'
                  type='email'
                  label='Email*'
                  control={control}
                  errors={errors}
                />

                {!addGuests && (
                  <Button variant='text' className='text-transform-none' onClick={(): void => { setAddGuests(true); }}>
                    Add Guests
                  </Button>
                )}
                {addGuests && (
                  <div className='tag-main-wrapper mb-3' style={{ minHeight: 'auto' }}>
                    <p>Guests</p>
                    <ReactTags
                      tags={tags}
                      handleDelete={handleDelete}
                      handleAddition={handleAddition}
                      placeholder=''
                      allowDragDrop={false}
                    />
                  </div>
                )}
                {mailError !== '' && <p className='text-danger'>{mailError}</p>}

                <HookTextField
                  name='description'
                  type='text'
                  label='Description'
                  control={control}
                  errors={errors}
                  multiline
                  rows={7}
                />

                <div className='text-right'>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ backgroundColor: '#00CFA1' }}
                    type='submit'
                  >
                    Schedule Event
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main>
      {(event === undefined || isLoading) && <StradaLoader open message={isLoading ? 'Scheduling...' : ''} /> }
      {event !== undefined && step === 'calendar_time' && renderCalendarTime()}
      {event !== undefined && step === 'event_details' && renderEventDetails()}
      {event !== undefined && step === 'confirm' && renderConfirm()}
    </main>
  );
}
