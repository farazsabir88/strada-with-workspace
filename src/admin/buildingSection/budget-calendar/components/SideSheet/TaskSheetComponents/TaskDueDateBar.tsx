/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import TodayIcon from '@mui/icons-material/Today';
import { IconButton, InputAdornment, ClickAwayListener } from '@mui/material';

import 'react-datepicker/dist/react-datepicker.css';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IAction } from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

export default function DueDateBar({ action }: { action: IAction }): JSX.Element {
  const { task } = action;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);

  useEffect(() => {
    if (currentTask !== null && currentTask !== undefined) {
      if (currentTask.due_date !== null) {
        setDate(new Date(new Date(moment(currentTask.due_date).format('YYYY/MM/DD'))));
      } else {
        setDate(null);
      }
    } else {
      setDate(null);
    }
  }, [currentTask]);

  const { mutate: updateDueDate, isLoading } = useMutation(async (dateToUpdate: Date | null) => axios({
    url: `/api/budget-calendar/task/${task?.id}/`,
    method: 'PATCH',
    data: {
      due_date: dateToUpdate !== null ? moment(dateToUpdate).format('YYYY-MM-DD') : null,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Due date updated successfully');
    },
  });

  function CustomInput(): JSX.Element {
    return (
      <ClickAwayListener onClickAway={(): void => { setOpen(false); }}>
        <div className='sidesheet-custom-date-input' aria-hidden='true' onClick={(): void => { setOpen(true); }}>
          <div className='left-side'>
            <InputAdornment position='start'>
              {' '}
              <TodayIcon fontSize='small' />
              {' '}
            </InputAdornment>
            <p>
              {' '}
              {date === null ? 'No Due Date' : moment(date).format('MMM DD')}
              {' '}
            </p>
          </div>
          <div className='right-side'>
            {Boolean(date) && (
              <IconButton onClick={(): void => { updateDueDate(null); setOpen(false); }}>
                <CancelIcon fontSize='small' />
              </IconButton>
            )}

          </div>
        </div>
      </ClickAwayListener>
    );
  }

  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Due date </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          {isLoading ? <StradaSpinner open={isLoading} message='Updating' /> : (
            <DatePicker
              dateFormat='MMM d'
              selected={date}
              open={open}
              onChange={(newData): void => {
                updateDueDate(newData); setOpen(false);
              }}
              customInput={<CustomInput />}
            />
          )}

        </div>
      </div>
    </div>
  );
}
