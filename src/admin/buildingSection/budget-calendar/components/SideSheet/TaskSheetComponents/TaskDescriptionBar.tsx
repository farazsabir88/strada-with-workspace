/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import type { IAction } from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

export default function TaskDescriptionBar({ action }: { action: IAction }): JSX.Element {
  const { task } = action;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [description, setDescription] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);

  useEffect(() => {
    if (currentTask !== null && currentTask !== undefined && currentTask.description_info !== null) {
      setDescription(currentTask.description_info);
    } else {
      setDescription('');
    }
  }, [currentTask]);

  const { mutate: updateDescription } = useMutation(async () => axios({
    url: `/api/budget-calendar/task/${task?.id}/`,
    method: 'PATCH',
    data: {
      description_info: description,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Description updated successfully');
    },
  });

  const handleUpdateDescription = (): void => {
    if (currentTask !== null && currentTask !== undefined && description !== currentTask.description_info) {
      updateDescription();
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !description) {
      if (currentTask !== null && currentTask !== undefined && description !== currentTask.description_info) {
        updateDescription();
      }
    }
  };

  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Description </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn-description' aria-hidden='true'>
          <textarea
            value={description}
            onChange={(e): void => { setDescription(e.target.value); }}
            rows={3}
            placeholder='Enter more info'
            onKeyPress={handleEnterPress}
            onBlur={(): void => { handleUpdateDescription(); }}
          />
        </div>
      </div>
    </div>
  );
}
