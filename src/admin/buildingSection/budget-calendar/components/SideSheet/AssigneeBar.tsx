/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Avatar, Popover } from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

interface IAssigneeOption {
  name: string | undefined;
  value: number | undefined;
  avatar: string | undefined;
}

export default function AssigneeBar(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState<IAssigneeOption | null>(null);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  useEffect(() => {
    setAnchorEl(null);
  }, [selectedAssignee]);

  useEffect(() => {
    if (singleSideSheetData !== null) {
      if (singleSideSheetData.assignee_info !== null) {
        const dataToUpdate: IAssigneeOption = {
          name: singleSideSheetData.assignee_info.name,
          value: singleSideSheetData.assignee_info.id,
          avatar: singleSideSheetData.assignee_info.avatar,
        };
        setSelectedAssignee(dataToUpdate);
      } else {
        setSelectedAssignee(null);
      }
    } else {
      setSelectedAssignee(null);
    }
  }, [singleSideSheetData]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { mutate: updateAssignee, isLoading: updatingAssignee } = useMutation(async (id: number) => axios({
    url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      assignee: id !== 0 ? id : null,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Assignee updated successfully');
    },

  });

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { data: assignees = [], refetch: refetchAssignees } = useQuery(['get/people', singleSideSheetData?.workspace], async () => axios({
    url: '/api/filter/assignee/',
    params: {
      workspace: singleSideSheetData?.workspace,
    },
    method: 'get',

  }), {
    enabled: singleSideSheetData?.workspace !== null,
    select: (res: AxiosResponse<IPeopleResponse>) => {
      const options = res.data.detail.map((user) => ({
        name: user.name,
        value: user.id,
        avatar: user.avatar,
      }));
      return options;
    },
  });
  useEffect(() => {
    if (singleSideSheetData !== null) {
      refetchAssignees().catch((e) => { throw e; });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleSideSheetData]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollIntoView = (): void => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollIntoView();
  }, [singleSideSheetData?.id]);
  return (
    <div className='assignee-sheet-bar' ref={scrollRef}>
      <h6 className='side-sheet-side-label'> Assignee </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' onClick={handleClick} aria-hidden='true'>
          {updatingAssignee ? <StradaSpinner open={updatingAssignee} message='Updating' /> : (
            <>
              <Avatar src={selectedAssignee !== null && selectedAssignee.avatar !== '' ? `${process.env.REACT_APP_IMAGE_URL}${selectedAssignee.avatar}` : ''} style={{ width: '20px', height: '20px' }} />
              <p>
                {' '}
                {selectedAssignee ? selectedAssignee.name : 'No Assignee'}
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
            {assignees.length > 0 && assignees.map((assignee) => (
              <div
                className={selectedAssignee?.value === assignee.value ? 'popover-option active' : 'popover-option'}
                key={assignee.name}
                onClick={(): void => {
                  updateAssignee(assignee.value); handleClose();
                }}
                aria-hidden='true'
              >
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
