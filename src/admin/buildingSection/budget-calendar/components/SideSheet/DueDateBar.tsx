/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import TodayIcon from '@mui/icons-material/Today';
import {
  IconButton, InputAdornment, ClickAwayListener,
} from '@mui/material';

import 'react-datepicker/dist/react-datepicker.css';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

export default function DueDateBar(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  // const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  useEffect(() => {
    if (singleSideSheetData !== null) {
      if (singleSideSheetData.due_date !== null) {
        setDate(new Date(moment(singleSideSheetData.due_date).format('YYYY/MM/DD')));
      } else {
        setDate(null);
      }
    } else {
      setDate(null);
    }
  }, [singleSideSheetData]);

  const { mutate: updateDueDate, isLoading: updatingDueDate } = useMutation(async (dateToUpdate: Date | null) => axios({
    url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      due_date: dateToUpdate !== null ? moment(dateToUpdate).format('YYYY-MM-DD') : null,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Due date updated successfully');
    },
  });

  function CustomInput(): JSX.Element {
    return (
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
    );
  }

  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Due date </h6>
      <div className='assignee-sheet-popover'>
        <ClickAwayListener onClickAway={(): void => { setOpen(false); }}>
          <div className='popover-btn' aria-hidden='true'>
            {updatingDueDate ? <StradaSpinner open={updatingDueDate} message='Updating' /> : (
              <DatePicker
                selected={date}
                open={open}
                onChange={(newData): void => {
                  updateDueDate(newData); setOpen(false);
                }}
                customInput={<CustomInput />}
                popperPlacement='top-start'
                popperModifiers={[
                  {
                    name: 'offset',
                    options: {
                      offset: [-12, 14],
                    },
                  },
                ]}
              />

            )}

          </div>
        </ClickAwayListener>
      </div>
    </div>
  );
}
