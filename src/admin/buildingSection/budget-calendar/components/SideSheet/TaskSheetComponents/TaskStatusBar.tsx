/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Popover } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IAction } from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

interface IBuildingOption {
  name: string;
  value: number;
  color: string;
  background: string;
}

const optionsList = [
  {
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  },
  {
    name: 'In Process',
    value: 2,
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
  {
    name: 'Scheduled',
    value: 3,
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    value: 4,
    color: 'rgb(76, 175, 80)',
    background: 'rgba(76, 175, 80, 0.08)',
  },
];

export default function TaskStatusBar({ action }: { action: IAction }): JSX.Element {
  const { task } = action;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);
  const [selectedTag, setSelectedTag] = React.useState<IBuildingOption | null>({
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  });

  useEffect(() => {
    if (currentTask !== null && currentTask !== undefined) {
      const currentStatus = optionsList.filter((status) => currentTask.status === status.value);
      setSelectedTag(currentStatus[0]);
    }
  }, [currentTask]);

  useEffect(() => {
    setAnchorEl(null);
  }, [selectedTag]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { mutate: updateStatus, isLoading } = useMutation(async (statusId: number) => axios({
    url: `/api/budget-calendar/task/${task?.id}/`,
    method: 'PATCH',
    data: {
      status: statusId,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Status updated successfully');
    },
  });

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Status </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' onClick={handleClick} aria-hidden='true'>
          {isLoading ? <StradaSpinner open={isLoading} message='Updating' /> : (
            <div>
              {selectedTag !== null ? (
                <div style={{ background: selectedTag.background, color: selectedTag.color }} className='single-tag'>
                  {' '}
                  {selectedTag.name}
                </div>
              ) : '-'}
            </div>
          )}

        </div>
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
          <div className='assignee-popover'>
            {optionsList.map((status) => (
              <div className={selectedTag !== null && selectedTag.value === status.value ? 'popover-option active' : 'popover-option'} key={status.name} onClick={(): void => { updateStatus(status.value); handleClose(); }} aria-hidden='true'>
                <div style={{ background: status.background, color: status.color }} className='single-tag'>
                  {' '}
                  {status.name}
                </div>
              </div>
            ))}

          </div>
        </Popover>

      </div>
    </div>
  );
}
