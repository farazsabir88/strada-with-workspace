/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Avatar, Popover } from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import type { IAction } from 'admin/buildingSection/budget-calendar/types';

interface IAssigneeOption {
  name: string | undefined;
  value: number | undefined;
  avatar: string | undefined;
}

export default function AssigneeBar({ action }: { action: IAction }): JSX.Element {
  const { task } = action;
  const queryClient = useQueryClient();
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState<IAssigneeOption | null>(null);
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);

  useEffect(() => {
    setAnchorEl(null);
  }, [selectedAssignee]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (currentTask !== null && currentTask !== undefined && currentTask.assignee_info !== null) {
      const dataToUpdate: IAssigneeOption = {
        name: currentTask.assignee_info.name,
        value: currentTask.assignee_info.id,
        avatar: currentTask.assignee_info.avatar,
      };
      setSelectedAssignee(dataToUpdate);
    }
  }, [currentTask]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { mutate: updateCollaborators } = useMutation(
    async (assigneeId: number) => axios({
      url: '/api/budget-calendar/collaborators/',
      method: 'POST',
      data: {
        event_id: sideSheetData?.id,
        user_id: assigneeId,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('sidesheet-get-selected-collabs').then();
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
      },
    },
  );

  const { mutate: updateAssignee, isLoading } = useMutation(async (id: number) => axios({
    url: `/api/budget-calendar/task/${task?.id}/`,
    method: 'PATCH',
    data: {
      assignee: id !== 0 ? id : null,
    },
  }), {
    onSuccess: async (res, variables): Promise<void> => {
      updateCollaborators(variables);
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('sidesheet-get-selected-collabs').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      await queryClient.invalidateQueries('others-events').then();
      enqueueSnackbar('Assignee updated successfully');
    },
  });

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { data: assignees = [] } = useQuery('get/people', async () => axios({
    url: '/api/filter/assignee/',
    params: {
      workspace: currentWorkspace.id,
    },
    method: 'get',

  }), {
    select: (res: AxiosResponse<IPeopleResponse>) => {
      const options = res.data.detail.map((user) => ({
        name: user.name,
        value: user.id,
        avatar: user.avatar,
      }));

      return options;
    },
  });

  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Assignee </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' onClick={handleClick} aria-hidden='true'>
          {isLoading ? <StradaSpinner open={isLoading} message='Updating' /> : (
            <>
              <Avatar src={selectedAssignee !== null && selectedAssignee.avatar !== '' ? `${process.env.REACT_APP_IMAGE_URL}${selectedAssignee.avatar}` : ''} style={{ width: '20px', height: '20px' }} />
              <p>
                {' '}
                {Boolean(selectedAssignee) && Boolean(selectedAssignee?.name) ? selectedAssignee?.name : 'No Assignee'}
                {' '}
              </p>
            </>
          ) }

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
            <div className={selectedAssignee === null ? 'popover-option active' : 'popover-option'} key='firts-option' onClick={(): void => { setSelectedAssignee(null); updateAssignee(0); handleClose(); }} aria-hidden='true'>
              <Avatar className='popover-avatar' alt='img' />
              <h5>No Assignee</h5>
            </div>
            {assignees.map((assignee) => (
              <div className={selectedAssignee?.value === assignee.value ? 'popover-option active' : 'popover-option'} key={assignee.name} onClick={(): void => { updateAssignee(assignee.value); handleClose(); }} aria-hidden='true'>
                <Avatar src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} className='popover-avatar' />
                <h5>
                  {' '}
                  {assignee.name}
                  {' '}
                </h5>
              </div>
            ))}

          </div>
        </Popover>

      </div>
    </div>
  );
}
