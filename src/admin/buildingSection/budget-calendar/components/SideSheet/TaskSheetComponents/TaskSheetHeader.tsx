/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useEffect, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import { useSnackbar } from 'notistack';
import Typography from '@mui/material/Typography';
import type { IAction } from 'admin/buildingSection/budget-calendar/types';
import StradaLoader from 'shared-components/components/StradaLoader';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { setCurrentTask } from 'admin/store/SideSheetData';

interface ITaskSheetHeader {
  action: IAction;
  setAction: (action: IAction) => void;
  setShowAttachment: (val: boolean) => void;
  showAttachment: boolean;
  isFullScreen: boolean;
  setIsFullScreen: (status: boolean) => void;
}

export default function TaskSheetHeader(props: ITaskSheetHeader): JSX.Element {
  const {
    action, setAction, setShowAttachment, showAttachment, isFullScreen, setIsFullScreen,
  } = props;
  const { task } = action;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [val, setVal] = useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    if (task !== null) {
      setVal(task.title);
    }
  }, [task]);

  const { mutate: upadteTitle } = useMutation(async () => axios({
    url: `/api/budget-calendar/task/${task?.id}/`,
    method: 'PATCH',
    data: {
      title: val,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
    },
  });

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      upadteTitle();
    }
  };
  const handleBlur = (): void => {
    upadteTitle();
  };

  const handleScheduleButton = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (singleSideSheetData?.building !== null) {
      navigate(
        `/workspace/budget-calendar/task-schedule/${currentTask?.id}/task`,
      );
    } else {
      enqueueSnackbar('Please select a building to use this functionality');
    }
  };

  const { mutate: deleteEvent, isLoading: doingUndo } = useMutation(async (status: boolean) => axios({
    url: `/api/budget-calendar/task/${currentTask?.id}/`,
    method: 'PATCH',
    data: {
      is_deleted: status,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
    },
  });

  const { mutate: deletePermanantely, isLoading: deletingPermanantly } = useMutation(async () => axios({
    url: `/api/budget-calendar/sidesheet/${currentTask?.id}/?type=task`,
    method: 'DELETE',
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
    },
  });

  return (
    <DialogTitle className='bc-sh-title-bar'>
      <StradaLoader open={doingUndo || deletingPermanantly} message='Action in progress' />
      {Boolean(currentTask?.is_deleted) && (
        <div className='deleted-event-controls'>

          <div className='left-side'>
            <IconButton>
              <DeleteIcon htmlColor='#c62828' />
            </IconButton>
            <p> This task was deleted</p>
          </div>
          <div className='right-side'>
            <h6 onClick={(): void => { deleteEvent(false); }} aria-hidden='true'> Undo Delete </h6>
            <span onClick={(): void => { deletePermanantely(); }} aria-hidden='true'> Delete permanently </span>
          </div>
        </div>
      )}
      <div className='task-header-bar'>
        <p>
          {' '}
          {sideSheetData?.title}
          {' '}
        </p>
        <ArrowRightAltIcon color='primary' />
        <h5>
          {' '}
          {task?.title}
          {' '}
        </h5>
        <IconButton onClick={(): void => {
          dispatch(setCurrentTask(null));
          setAction({
            ...action, variant: 'event', task: null, data: null,
          });
        }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </div>
      <div className='name-header'>
        <div className='control-bar'>
          <InputBase
            className='input-base'
            value={val}
            onChange={(e): void => { setVal(e.target.value); }}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
          />
          <div style={{ width: '24px' }} />

        </div>
        <div className='menu-bar'>

          <span className='menu-link' onClick={(): void => { setShowAttachment(!showAttachment); }} aria-hidden='true'> Add Attachment </span>
          <span className='menu-link' onClick={handleScheduleButton} aria-hidden='true'> Schedule </span>

          <span className='menu-link'>
            {' '}
            <IconButton onClick={handleClick}>
              {' '}
              <MoreHorizIcon fontSize='small' />
              {' '}
            </IconButton>
            {' '}
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
              <Typography sx={{ p: 2 }} style={{ cursor: 'pointer' }} onClick={(): void => { setIsFullScreen(!isFullScreen); }}>
                {' '}
                {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                {' '}
              </Typography>

              {/* <Typography sx={{ p: 2 }} style={{ cursor: 'pointer' }} onClick={(): void => { }}>Close PO</Typography> */}
              <Typography sx={{ p: 2 }} style={{ cursor: 'pointer' }} onClick={(): void => { deleteEvent(true); handleClose(); }}>Delete</Typography>
            </Popover>
          </span>
        </div>
      </div>
      <div className='underline' />
    </DialogTitle>
  );
}
