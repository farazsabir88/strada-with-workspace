/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Grid, Drawer, Tooltip,
} from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import moment from 'moment';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputField from 'shared-components/inputs/InputField';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomLoader from 'shared-components/components/CustomLoader';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { RootState } from 'mainStore';
import { useSelector } from 'react-redux';
import './_viewChecklist.scss';
import type {
  Iresponse, Itasks, Iassignee, IPeople, IPeopleResponse, IchecklistCompleteStatus,
} from '../types';
import TasksListing from './TasksListing';
import SideBar from './SideBar';
import ChecklistTaskDetail from './ChecklistTaskDetail';
import ChecklistPrint from './ChecklistPrint';

function TickArrowIcon(): JSX.Element {
  return (
    <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='20' cy='20' r='20' fill='black' fillOpacity='0.04' />
      <path d='M17 24.1719L27.5938 13.5781L29 14.9844L17 26.9844L11.4219 21.4062L12.8281 20L17 24.1719Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

export default function ViewChecklist(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const checklistState = useLocation().state as Iresponse;
  const [checklistName, setChecklistName] = useState<string>('');
  const [isRenameChecklist, setIsRenameChecklist] = useState<boolean>(false);
  const [changeChecklistName, setChangeChecklistName] = useState<boolean>(false);
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [showLeftSideBar, setShowLeftSideBar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStopIndex, setIsStopIndex] = useState<number>(-1);
  const [errorChecklistsIds, setErrorChecklistsIds] = useState<number[]>([]);
  const [focusedTask, setFocusedTask] = useState<Itasks | null>(null);
  const [focusedTaskIndex, setFocusedTaskIndex] = useState<number>(0);
  const [assignee, setAssignee] = useState<Iassignee[]>();
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskDueTime, setTaskDueTime] = useState<string>('');
  const [getPrint, setGetPrint] = useState<boolean>(false);
  const [showSendEmailIndex, setShowSendEmailIndex] = useState<number>(-1);
  const [showCleanedSendEmailFields, setShowCleanedSendEmailFields] = useState<boolean>(true);

  const { checklistId } = useParams();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  const { data } = useQuery(
    'get/checklist',
    async () => axios({
      url: `/api/checklist/${checklistId}/`,
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<Iresponse>) => res.data,
      onSuccess: (res: Iresponse) => {
        setFocusedTask(res.tasks[focusedTaskIndex]);
        setChecklistName(res.name);
        setIsLoading(false);
        if (res.tasks[focusedTaskIndex].due_date !== null) {
          setTaskDueDate(moment.utc(res.tasks[focusedTaskIndex].due_date).format('MM/DD/YYYY'));
          setTaskDueTime(moment.utc(res.tasks[focusedTaskIndex].due_date).format('hh:mm a'));
        } else {
          setTaskDueDate('');
          setTaskDueTime('');
        }
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (checklistState.isPrint !== undefined && checklistState.isPrint) {
          setGetPrint(true);
        }
      },
    },
  );
  useQuery(
    'property-managers-people',
    async () => axios({
      url: `api/filter/assignee/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      select: (res: AxiosResponse<IPeopleResponse>) => res.data.detail,
      onSuccess: (res: IPeople[]) => {
        const newAssignee: Iassignee[] = [];
        res.forEach((user: IPeople) => {
          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: `${process.env.REACT_APP_IMAGE_URL}${user.avatar}`,
          };
          newAssignee.push(userData);
        });
        setAssignee(newAssignee);
      },
      enabled: currentWorkspace.id !== 0,
    },
  );

  useEffect(() => {
    let selectedIndex = isStopIndex;
    // eslint-disable-next-line array-callback-return
    data?.tasks.map((task: Itasks) => {
      if ((selectedIndex === -1 || (selectedIndex !== -1 && selectedIndex > task.index)) && task.is_stop && !task.is_completed && task.is_next_blocked) {
        selectedIndex = task.index;
      }
      setIsStopIndex(selectedIndex);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { mutate: renameChecklist } = useMutation(
    async () => axios({
      url: `/api/checklist/${checklistId}/`,
      method: 'patch',
      data: {
        building: checklistState.building,
        name: checklistName,
        template: checklistState.template,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
      },
    },
  );
  const { mutate: handleTaskAssignee } = useMutation(
    async (taskAssignee: Iassignee[]) => axios({
      url: `/api/checklist-task/${focusedTask?.id}/`,
      method: 'patch',
      data: {
        assignees: taskAssignee,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
      },
    },
  );
  const { mutate: handleChecklistTaskCompleted } = useMutation(
    async (checklistCompleteStatus: IchecklistCompleteStatus) => axios({
      url: `/api/checklist-task/${checklistCompleteStatus.completeId}/`,
      method: 'patch',
      data: {
        is_completed: checklistCompleteStatus.checklistStatus,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
      },
    },
  );
  const { mutate: addChecklistAssignee } = useMutation(
    async (checklistAssignee: Iassignee[]) => axios({
      url: `/api/checklist/${data?.id}/`,
      method: 'patch',
      data: {
        assignees: checklistAssignee,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
      },
    },
  );
  const { mutate: removeSideMenuDueDate } = useMutation(
    async (dueDate: Date | null) => axios({
      url: `/api/checklist/${data?.id}/`,
      method: 'patch',
      data: {
        due_date: dueDate,
      },
    }),
    {
      onSuccess: async (res, test): Promise<void> => {
        await queryClient.invalidateQueries('get/checklist').then();
        if (test === null) {
          enqueueSnackbar('Due Date was Removed');
        } else {
          enqueueSnackbar('Due Date was Added');
        }
      },
    },
  );
  const { mutate: changeTaskDueDate } = useMutation(
    async (dueDate: Date | null) => axios({
      url: `/api/checklist-task/${focusedTask?.id}/`,
      method: 'patch',
      data: {
        due_date: dueDate,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
      },
    },
  );
  const handleFocusTask = (selectedTask: Itasks, index: number): void => {
    setFocusedTask(selectedTask);
    setFocusedTaskIndex(index);
    if (selectedTask.due_date !== null) {
      setTaskDueDate(moment.utc(selectedTask.due_date).format('MM/DD/YYYY'));
      setTaskDueTime(moment.utc(selectedTask.due_date).format('hh:mm a'));
    } else {
      setTaskDueDate('');
      setTaskDueTime('');
    }
  };
  return (
    <div>
      {data !== undefined ? (
        <div>
          {!getPrint ? (
            <>
              {data.is_archived
      && (
        <div className='archive-div'>
          <div className='archive-heading-data'>
            <h6>Checklist archived</h6>
            {(data.archived_by !== null && data.archived_at !== null) && <p>{`by ${data.archived_by.name} at ${moment.utc(data.archived_at).format('MMMM DD, YYYY hh:mm')}`}</p>}
          </div>
          <div className='archive-icon-div' aria-hidden='true' onClick={(): void => { setGetPrint(true); }}><PrintIcon /></div>
        </div>
      ) }
              <div className='create-checklist-module' style={{ height: data.is_archived ? 'auto' : '100vh' }}>
                {isLoading ? <div style={{ height: '80vh' }} className='vh-50 d-flex justify-content-center align-items-center'><CustomLoader /></div>
                  : (
                    <>
                      <div className={window.innerWidth > 600 ? 'header-wrap align-items-center' : showLeftSideBar ? 'header-wrap h-auto' : 'header-wrap'} style={{ marginTop: data.is_archived ? '0px' : '64px' }}>
                        {!showLeftSideBar
                        && (
                          <div className='header-left-div' style={{ margin: isRenameChecklist && window.innerWidth < 600 ? '15px 0px 0px 0px' : isRenameChecklist ? '40px 0px 20px 0px' : '0px' }}>
                            <div className='arrow-back-div' aria-hidden='true' onClick={(): void => { window.history.back(); }}><ArrowBackIcon /></div>
                            {!isRenameChecklist ? (
                              <>
                                {changeChecklistName ? <p>{checklistName}</p> : <p>{data.name}</p>}
                                <div className='arrow-back-div' aria-hidden='true' onClick={(): void => { setIsRenameChecklist(true); }}><EditIcon /></div>
                              </>
                            )
                              : (
                                <>
                                  <InputField
                                    name='template_name'
                                    type='text'
                                    value={checklistName}
                                    onChange={(event): void => { setChecklistName(event.target.value); }}
                                  />
                                  <Tooltip title='Save'>
                                    <div className='rename-checklist-div cursor-pointer' aria-hidden='true' onClick={(): void => { renameChecklist(); setIsRenameChecklist(false); setChangeChecklistName(true); }} style={{ margin: '0px 8px' }}><TickArrowIcon /></div>
                                  </Tooltip>
                                  <div aria-hidden='true' onClick={(): void => { setIsRenameChecklist(false); setChangeChecklistName(false); }}><CancelIcon /></div>
                                </>
                              )}
                          </div>
                        ) }
                        {!showSideBar
                        && (
                          <div className='side-bar-div cursor-pointer' aria-hidden='true' role='presentation' onClick={(): void => { setShowSideBar(true); }}>
                            <div className='content-wrap-flex-div'>
                              <MenuOpenIcon />
                              {window.innerWidth > 600
                              && <h6>Show menu</h6> }
                            </div>
                          </div>
                        )}
                        {showLeftSideBar && window.innerWidth < 600
                        && (
                          <div className='side-bar-left-div' aria-hidden='true' role='presentation' onClick={(): void => { setShowLeftSideBar(false); }}>
                            <div className='content-wrap-flex-div'>
                              <ListAltIcon />
                            </div>
                          </div>
                        )}
                      </div>

                      {!showLeftSideBar && window.innerWidth < 600
                        ? (
                          <div className='task-wrap-div'>
                            <TasksListing data={data} isStopIndex={isStopIndex} errorChecklistsIds={errorChecklistsIds} setErrorChecklistsIds={setErrorChecklistsIds} focusedTask={focusedTask} handleChecklistTaskCompleted={handleChecklistTaskCompleted} handleTaskAssignee={handleTaskAssignee} setIsStopIndex={setIsStopIndex} handleFocusTask={handleFocusTask} setShowLeftSideBar={setShowLeftSideBar} />
                          </div>
                        )
                        : showLeftSideBar && window.innerWidth < 600 ? (
                          <ChecklistTaskDetail focusedTask={focusedTask} setFocusedTask={setFocusedTask} assignee={assignee} handleTaskAssignee={handleTaskAssignee} taskDueDate={taskDueDate} taskDueTime={taskDueTime} setTaskDueDate={setTaskDueDate} setTaskDueTime={setTaskDueTime} changeTaskDueDate={changeTaskDueDate} errorChecklistsIds={errorChecklistsIds} isStopIndex={isStopIndex} focusedTaskIndex={focusedTaskIndex} data={data} handleChecklistTaskCompleted={handleChecklistTaskCompleted} setErrorChecklistsIds={setErrorChecklistsIds} setIsStopIndex={setIsStopIndex} handleFocusTask={handleFocusTask} showSendEmailIndex={showSendEmailIndex} setShowSendEmailIndex={setShowSendEmailIndex} showCleanedSendEmailFields={showCleanedSendEmailFields} setShowCleanedSendEmailFields={setShowCleanedSendEmailFields} />
                        )
                          : (
                            <Grid container>
                              <Grid item sm={5}>
                                <div className='task-wrap-div'>
                                  <TasksListing data={data} isStopIndex={isStopIndex} errorChecklistsIds={errorChecklistsIds} setErrorChecklistsIds={setErrorChecklistsIds} focusedTask={focusedTask} handleChecklistTaskCompleted={handleChecklistTaskCompleted} handleTaskAssignee={handleTaskAssignee} setIsStopIndex={setIsStopIndex} handleFocusTask={handleFocusTask} setShowLeftSideBar={setShowLeftSideBar} />
                                </div>
                              </Grid>
                              <Grid item sm={showSideBar ? 5 : 7}>
                                <ChecklistTaskDetail focusedTask={focusedTask} setFocusedTask={setFocusedTask} assignee={assignee} handleTaskAssignee={handleTaskAssignee} taskDueDate={taskDueDate} taskDueTime={taskDueTime} setTaskDueDate={setTaskDueDate} setTaskDueTime={setTaskDueTime} changeTaskDueDate={changeTaskDueDate} errorChecklistsIds={errorChecklistsIds} isStopIndex={isStopIndex} focusedTaskIndex={focusedTaskIndex} data={data} handleChecklistTaskCompleted={handleChecklistTaskCompleted} setErrorChecklistsIds={setErrorChecklistsIds} setIsStopIndex={setIsStopIndex} handleFocusTask={handleFocusTask} showSendEmailIndex={showSendEmailIndex} setShowSendEmailIndex={setShowSendEmailIndex} showCleanedSendEmailFields={showCleanedSendEmailFields} setShowCleanedSendEmailFields={setShowCleanedSendEmailFields} />
                              </Grid>
                              {showSideBar && window.innerWidth > 600
                          && (
                            <Grid item sm={2}>
                              <SideBar data={data} setShowSideBar={setShowSideBar} isStopIndex={isStopIndex} setErrorChecklistsIds={setErrorChecklistsIds} addChecklistAssignee={addChecklistAssignee} removeSideMenuDueDate={removeSideMenuDueDate} assignee={assignee} setGetPrint={setGetPrint} />
                            </Grid>
                          ) }
                            </Grid>
                          )}
                      <Drawer
                        anchor='right'
                        open={showSideBar && window.innerWidth < 600}
                        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
                      >
                        <div className='overflow-hidden'>
                          <SideBar data={data} setShowSideBar={setShowSideBar} isStopIndex={isStopIndex} setErrorChecklistsIds={setErrorChecklistsIds} addChecklistAssignee={addChecklistAssignee} removeSideMenuDueDate={removeSideMenuDueDate} assignee={assignee} setGetPrint={setGetPrint} />
                        </div>
                      </Drawer>
                    </>
                  )}
              </div>
            </>
          )
            : (
              <ChecklistPrint data={data} errorChecklistsIds={errorChecklistsIds} checklistName={checklistName} changeChecklistName={changeChecklistName} setGetPrint={setGetPrint} showSendEmailIndex={showSendEmailIndex} showCleanedSendEmailFields={showCleanedSendEmailFields} />
            )}
        </div>
      ) : null}
    </div>
  );
}
