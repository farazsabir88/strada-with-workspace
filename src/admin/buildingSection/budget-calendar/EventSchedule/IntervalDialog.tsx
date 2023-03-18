/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TimeRange from 'react-time-range';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import { IconButton } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { ActionProps } from './CustomCalendar';
import type {
  ISchedulingDetail, ISingleInterval, ISchedualingDataDetail,
} from '../types';

interface IDialogProps {
  handleClose: () => void;
  action: ActionProps;
  schedulingData: ISchedualingDataDetail | ISchedulingDetail | null;
}

interface IData {
  date?: string;
  day?: string;
  event: number;
  intervals: ISingleInterval[];
  type: string | undefined;
}
interface IData2 {
  date?: string;
  day?: string;
  task: number;
  intervals: ISingleInterval[];
  type: string | undefined;
}

interface IPayload {
  id: number;
  url: string;
  data: IData | IData2;
  method: number;
}

export default function IntervalDialog({ handleClose, action, schedulingData }: IDialogProps): JSX.Element {
  const { open, data } = action;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { eventId, taskId, eventType } = useParams();
  const [isThisDay, setIsThisDay] = useState<boolean>(true);
  const [intervals, setIntervals] = useState<ISingleInterval[]>([]);

  useEffect(() => {
    if (data !== null && open) {
      if (data.defaultIntervals !== undefined) {
        setIntervals(data.defaultIntervals);
      } else {
        setIntervals(data.intervals);
      }
    }
  }, [data, open]);

  const handleTimeChange = (times: { startTime: string; endTime: string }, index: number): void => {
    const intervalsClone = [...intervals];
    intervalsClone[index].start = moment(new Date(times.startTime)).format('HH:mm');
    intervalsClone[index].end = moment(new Date(times.endTime)).format('HH:mm');
    setIntervals(intervalsClone);
  };

  const handleAddInterval = (): void => {
    setIntervals([...intervals, { end: '19:00', start: '9:00' }]);
  };

  const handleDeleteInterval = (index: number): void => {
    const newIntervals: ISingleInterval[] = intervals.filter((interval, i) => index !== i);
    setIntervals(newIntervals);
  };

  const { mutate, isLoading } = useMutation(async (payload: IPayload) => axios({
    url: payload.url,
    method: payload.method === 1 ? 'POST' : 'PATCH',
    data: payload.data,
  }), {
    onSuccess: async (): Promise<void> => {
      handleClose();
      await queryClient.invalidateQueries('get-event-schedule').then();
      enqueueSnackbar('Intervals updated successfully');
    },
    onError: () => {
      enqueueSnackbar('Interval updated failed', { variant: 'error' });
    },
  });

  const saveSingleDayIntervals = (): void => {
    if (data && schedulingData) {
      const evnetInfo = {
        date: moment(data.date).format('YYYY-MM-DD'),
        event: Number(eventId),
        intervals,
        type: eventType,
      };
      const taskInfo = {
        date: moment(data.date).format('YYYY-MM-DD'),
        task: Number(taskId),
        intervals,
        type: eventType,
      };
      let dataId = -100;
      for (let i = 0; i < schedulingData.intervals.length; i += 1) {
        if (schedulingData.intervals[i].date === moment(data.date).format('YYYY-MM-DD')) {
          // console.log('enter in  loop');
          dataId = schedulingData.intervals[i].id;
          break;
        }
      }

      // console.log({ information, dataId });
      if (dataId !== -100) {
        const payload = {
          id: dataId,
          url: `/api/budget-calendar/${eventType}-interval/${dataId}/`,
          data: eventId ? evnetInfo : taskInfo,
          method: 2,
        };
        mutate(payload);
      } else {
        const payload = {
          id: dataId,
          url: `/api/budget-calendar/${eventType}-interval/`,
          data: eventId ? evnetInfo : taskInfo,
          method: 1,
        };
        mutate(payload);
      }
    }
  };

  const saveWeeklyInterval = (): void => {
    if (data && schedulingData) {
      const evnetInfo = {
        date: moment(data.date).format('YYYY-MM-DD'),
        event: Number(eventId),
        intervals,
        type: eventType,
      };
      const taskInfo = {
        date: moment(data.date).format('YYYY-MM-DD'),
        task: Number(taskId),
        intervals,
        type: eventType,
      };
      let dataId = -900;
      for (let i = 0; i < schedulingData.default_intervals.length; i += 1) {
        if (schedulingData.default_intervals[i].day === moment(data.date).format('dddd')) {
          // console.log('enter in weekly loop');
          dataId = schedulingData.default_intervals[i].id;
          break;
        }
      }

      // console.log({ information, dataId });
      if (dataId !== -900) {
        const payload = {
          id: dataId,
          url: `/api/budget-calendar/default-intervals/${dataId}/`,
          data: eventId ? evnetInfo : taskInfo,
          method: 2,
        };
        mutate(payload);
      } else {
        const payload = {
          id: dataId,
          url: '/api/budget-calendar/default-intervals/',
          data: eventId ? evnetInfo : taskInfo,
          method: 1,
        };
        mutate(payload);
      }
    }
  };

  const handleSave = (): void => {
    if (isThisDay) {
      saveSingleDayIntervals();
    } else {
      saveWeeklyInterval();
    }
  };

  return (
    <div>
      <StradaLoader open={isLoading} message='Updating Intervals...' />
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{
          paper: 'intervalDialogPaper',
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading'> Choose Time Frame </h3>
        </DialogTitle>
        <DialogContent>

          {intervals.map((interval, i) => (
            <div className='single-time-interval' key={`${Math.random()}`}>
              <TimeRange
                startLabel=''
                endLabel=''
                minuteIncrement={5}
                className='time-range-picker'
                startMoment={moment(interval.start, 'HH:mm')}
                endMoment={moment(interval.end, 'HH:mm')}
                onChange={(times: { startTime: string; endTime: string }): void => { handleTimeChange(times, i); }}
                equalTimeError='Start and End times cannot be equal.'
                endTimeError='End time cannot be before start time.'
              />
              <IconButton onClick={(): void => { handleDeleteInterval(i); }}>
                <DeleteOutlineIcon color='primary' fontSize='small' />
              </IconButton>
            </div>
          ))}

          <div className='add-intervalButton' onClick={handleAddInterval} aria-hidden='true'>
            <AddIcon fontSize='small' color='primary' />
            <p>New Interval</p>
          </div>

          <div className='interval-radio-control'>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label-099'
                defaultValue={isThisDay}
                value={isThisDay}
                onChange={(val, vals): void => { setIsThisDay(vals === 'true'); }}
                name='radio-buttons-group-09878'
              >
                <FormControlLabel value control={<Radio />} label='Just this day' />
                <FormControlLabel value={false} control={<Radio />} label={`Apply to all ${data?.day}s`} />
              </RadioGroup>
            </FormControl>
          </div>

        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton className='secondary-diloag-btn' onClick={(): void => { handleSave(); }}>Save</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
