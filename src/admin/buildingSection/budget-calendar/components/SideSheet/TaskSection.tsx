/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react';
import { Button, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSnackbar } from 'notistack';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import type { RootState } from 'mainStore';
import type {
  IAction, IStatusChip, ITask, TaskTemplatesProps, IDetail, IAssigneeInfo,
} from 'admin/buildingSection/budget-calendar/types';
import StatusTag from 'shared-components/components/StatusTag';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import StradaLoader from 'shared-components/components/StradaLoader';
import { setTaskIntoFocus } from 'admin/store/SideSheetData';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import TaskTemplateDialog from './TaskTemplateDialog';

interface ITaskSection {
  setAction: (action: IAction) => void;
  // sideSheetData: IEvent | null;
  // singleSideSheetData: ISideSheetData | null;

}

const statusList = [
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
  {
    name: 'As Needed',
    value: 5,
    color: 'rgb(0, 172, 193)',
    background: 'rgba(0, 172, 193, 0.08)',
  },
  {
    name: 'Contingency',
    value: 6,
    color: 'rgb(216, 27, 96)',
    background: 'rgba(216, 27, 96, 0.08)',
  },
  {
    name: 'Contract',
    value: 7,
    color: 'rgb(94, 53, 177)',
    background: 'rgba(94, 53, 177, 0.08)',
  },
];
interface IAssigneeOption {
  avatar: string;
  email: string;
  id: number;
  name: string;
}
export default function TaskSection({ setAction }: ITaskSection): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [selectedAssignee, setSelectedAssignee] = React.useState<IAssigneeOption | null>(null);

  const [task, setTask] = useState('');
  const [taskId, setTaskId] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);
  const [taskOpen, setTaskOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [anchorElAssignee, setAnchorElAssignee] = React.useState<HTMLDivElement | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<IDetail | null>(null);

  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const taskInFocus = useSelector((state: RootState) => state.workspaces.sideSheetData.taskInFocus);

  useEffect(() => {
    setAnchorEl(null);
  }, [selectedAssignee]);

  const { mutate: updateAssignee, isLoading: updatingAssignee } = useMutation(async (id: number) => axios({
    url: `/api/budget-calendar/task/${taskId}/`,
    method: 'PATCH',
    params: {
      type: 'task',
    },
    data: {
      assignee: id !== 0 ? id : null,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Assignee updated successfully');
    },
  });

  const handleClickAssignee = (event: React.MouseEvent<HTMLDivElement>, taskId: number, assigneeInfo: IAssigneeInfo | null): void => {
    setAnchorElAssignee(event.currentTarget);
    setTaskId(taskId);
    setSelectedAssignee(assigneeInfo);
  };
  const handleCloseAssignee = (): void => {
    setAnchorElAssignee(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(setTaskIntoFocus(false));
    setTaskOpen(false);
  }, [sideSheetData]);

  const open = Boolean(anchorEl);
  const openAssignee = Boolean(anchorElAssignee);

  const id = open ? 'simple-popover' : undefined;

  const getCurrentStatus = (status: number | null): IStatusChip => {
    if (status !== null) {
      const currentStatus = statusList.filter((st) => st.value === status);
      return currentStatus[0];
    }
    return statusList[0];
  };

  const { mutate: createTask } = useMutation(async (taskToAdd: string) => axios({
    url: '/api/budget-calendar/task/',
    method: 'POST',
    data: {
      event: sideSheetData?.id,
      title: taskToAdd,
      user: user.id,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      setTask('');
      setTaskOpen(false);
      dispatch(setTaskIntoFocus(false));
      enqueueSnackbar('New task is created successfully');
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      await queryClient.invalidateQueries('others-events').then();
    },
  });

  const { data: templateList = [] } = useQuery(['get-task-templates', singleSideSheetData?.workspace], async () => axios({
    url: `/api/tasks-template/?workspace=${singleSideSheetData?.workspace}`,
    method: 'GET',
  }), {
    enabled: singleSideSheetData?.workspace !== null,
    select: (res: AxiosResponse<TaskTemplatesProps>) => res.data.detail,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value }: { value: string } = e.target;
    setTask(value);
  };
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      createTask(task);
    }

    if (e.key === 'Escape') {
      dispatch(setTaskIntoFocus(false));
      setTaskOpen(false);
    }
  };

  const handleTemplateClick = (currentTemplate: IDetail): void => {
    setSelectedTemplate(currentTemplate);
    handleClose();
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
    setSelectedTemplate(null);
  };

  const { mutate: updateStatus, isLoading: updatingStatus } = useMutation(async ({ statusId, taskId }: { statusId: number; taskId: number }) => axios({
    url: `/api/budget-calendar/task/${taskId}/`,
    method: 'PATCH',
    data: {
      status: statusId,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Status updated successfully');
    },
  });

  useEffect(() => {
    if (taskInFocus || taskOpen) {
      document.getElementById('task-div-99')?.focus();
      // document.getElementById('task-scroll-99')?.scrollIntoView({ block: 'end' });
    }
  }, [taskInFocus]);

  const { data: assignees = [] } = useQuery(['get/people', singleSideSheetData?.workspace], async () => axios({
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

  return (
    <div className='task-section-main-wrapper'>
      <StradaLoader open={updatingStatus} message='Updating Status' />
      <StradaLoader open={updatingAssignee} message='Updating Assignee' />

      {openDialog && <TaskTemplateDialog open={openDialog} handleClose={handleDialogClose} selectedTemplate={selectedTemplate} sideSheetData={sideSheetData} />}

      <div className='inner-wrapper' id='task-scroll-99'>
        <h6>Tasks</h6>

        <div className='tasks-list'>
          { singleSideSheetData?.tasks && singleSideSheetData?.tasks.map((singleTask: ITask) => (

            <div
              key={singleTask.id}
              className='single-task'
              onClick={(): void => {
                setAction({
                  variant: 'task', task: singleTask, isScheduling: false, data: singleSideSheetData,
                });
              }}
              aria-hidden='true'
            >
              <div className='left-side'>
                {singleTask.title}
              </div>
              <div
                className='right-side'
                onClick={(e): void => { e.stopPropagation(); }}
                aria-hidden='true'
              >

                <PopupState variant='popover' popupId='demo-popup-popover'>
                  {(popupState): JSX.Element => (
                    <div>
                      <div
                        className='styled-status'
                        aria-hidden='true'
                        {...bindTrigger(popupState)}
                        style={{
                          background: getCurrentStatus(singleTask.status).background,
                          color: getCurrentStatus(singleTask.status).color,
                        }}
                      >
                        {getCurrentStatus(singleTask.status).name}

                      </div>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <div className='task-status-popover'>
                          {[1, 2, 3, 4].map((tagVal) => (
                            <div key={tagVal} onClick={(): void => { updateStatus({ statusId: tagVal, taskId: singleTask.id }); popupState.close(); }} aria-hidden='true' className='tag-in-list'><StatusTag value={tagVal} /></div>
                          ))}
                        </div>

                      </Popover>
                    </div>
                  )}
                </PopupState>

                <div onClick={(e): void => { handleClickAssignee(e, singleTask.id, singleTask.assignee_info); }}>
                  <Avatar
                    src={`${process.env.REACT_APP_IMAGE_URL}${singleTask.assignee_info?.avatar}`}
                    // src={selectedAssignee !== null && selectedAssignee.avatar !== '' ? `${process.env.REACT_APP_IMAGE_URL}${singleTask.assignee_info?.avatar}` : ''}
                    style={{ width: '26px', height: '26px' }}
                  />
                </div>
                <ChevronRightIcon onClick={(): void => {
                  setAction({
                    variant: 'task', task: singleTask, isScheduling: false, data: singleSideSheetData,
                  });
                }}
                />
              </div>

            </div>
          ))}
        </div>

        <Popover
          id={id}
          open={openAssignee}
          anchorEl={anchorElAssignee}
          onClose={handleCloseAssignee}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className='assignee-popover'>
            <div
              className={selectedAssignee === null ? 'popover-option active' : 'popover-option'}
              key='firts-option'
              onClick={(): void => { setSelectedAssignee(null); updateAssignee(0); handleCloseAssignee(); }}
              aria-hidden='true'
            >
              <Avatar className='popover-avatar' alt='img' />
              <h5>No Assignee</h5>
            </div>
            {assignees.map((assignee) => (
              <div
                key={assignee.name}
                className={selectedAssignee?.id === assignee.value ? 'popover-option active' : 'popover-option'}
                onClick={(): void => {
                  updateAssignee(assignee.value);
                  handleCloseAssignee();
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

        {taskOpen || taskInFocus ? <input id='task-div-99' value={task} onChange={handleChange} onKeyDown={handleEnterPress} /> : ''}

        <div className='task-btns'>
          <Button
            className='task-btn'
            startIcon={<AddIcon color='primary' fontSize='small' />}
            onClick={(): void => {
              setTaskOpen(true);
              dispatch(setTaskIntoFocus(true));
            }}
          >
            {' '}
            Add Task
            {' '}

          </Button>
          {singleSideSheetData?.building !== null
          && <Button onClick={handleClick} className='task-btn' endIcon={<ArrowDropDownIcon color='primary' fontSize='small' />}> Add Task From Template </Button>}

          <Popover
            id={id}
            open={open}
            sx={{ height: '142px' }}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {templateList.map((temp) => (
              <Typography key={temp.id} sx={{ p: 2 }} className='cursor-pointer template-name' onClick={(): void => { handleTemplateClick(temp); }}>
                {' '}
                {temp.template_name}
                {' '}
              </Typography>
            ))}

          </Popover>
        </div>
      </div>

    </div>
  );
}
