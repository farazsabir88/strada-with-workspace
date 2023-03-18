/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import TodayIcon from '@mui/icons-material/Today';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';
import {
  IconButton, InputAdornment, Popover,
} from '@mui/material';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IAction } from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

interface CustomRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export default function DateRangeBar({ action }: { action: IAction }): JSX.Element {
  const { task } = action;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;

  useEffect(() => {
    if (currentTask !== null && currentTask !== undefined) {
      if (currentTask.task_start_date !== null && currentTask.task_end_date !== null) {
        setStartDate(new Date(moment(currentTask.task_start_date).format('YYYY/MM/DD')));
        setEndDate(new Date(moment(currentTask.task_end_date).format('YYYY/MM/DD')));
      } else {
        setStartDate(undefined);
        setEndDate(undefined);
      }
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [currentTask]);

  const { mutate: updateDateRange, isLoading } = useMutation(async (range: CustomRange | null) => axios({
    url: `/api/budget-calendar/task/${task?.id}/`,
    method: 'PATCH',
    data: {
      task_start_date: range !== null ? moment(range.startDate).format('YYYY-MM-DD') : null,
      task_end_date: range !== null ? moment(range.endDate).format('YYYY-MM-DD') : null,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      setStartDate(undefined);
      setEndDate(undefined);
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Date range updated successfully');
    },
  });

  // const handleClose = (): void => {
  //   setAnchorEl(null);
  //   updateDateRange({ startDate, endDate });
  // };
  const handleClose = (): void => {
    setAnchorEl(null);
    if (currentTask !== null) {
      if (moment(startDate).format('YYYY-MM-DD') !== currentTask.task_start_date || moment(endDate).format('YYYY-MM-DD') !== currentTask.task_end_date) {
        updateDateRange({ startDate, endDate });
      }
    }
  };
  return (

    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Date Range </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          {isLoading ? <StradaSpinner open={isLoading} message='Updating' /> : (
            <div className='sidesheet-custom-date-input' aria-hidden='true' onClick={handleClick}>
              <div className='left-side'>
                <InputAdornment position='start'>
                  {' '}
                  <TodayIcon fontSize='small' />
                  {' '}
                </InputAdornment>
                <p>
                  {endDate === undefined ? 'No Due Date' : `${moment(startDate).format('MMM DD')} - ${moment(endDate).format('MMM DD')} `}
                </p>
              </div>
              <div className='right-side'>
                {Boolean(endDate) && (
                  <IconButton onClick={(e): void => {
                    e.stopPropagation();
                    updateDateRange(null);
                  }}
                  >
                    <CancelIcon fontSize='small' />
                  </IconButton>
                )}

              </div>
            </div>
          )}

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
                  startDate,
                  endDate,
                  key: 'selection',
                }]}
                minDate={new Date()}
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

        <div className='' />
      </div>
    </div>
  );
}
