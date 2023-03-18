/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  Avatar, Popover, Checkbox, Drawer,
} from '@mui/material';
import moment from 'moment';
import AvatarGroup from '@mui/material/AvatarGroup';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import type {
  Iresponse, Itasks, Iassignee, IchecklistCompleteStatus,
} from '../types';

interface ITasksListing {
  data: Iresponse;
  isStopIndex: number;
  errorChecklistsIds: number[];
  setErrorChecklistsIds: (ids: number[]) => void;
  focusedTask: Itasks | null;
  handleChecklistTaskCompleted: (checklistCompleteStatus: IchecklistCompleteStatus) => void;
  handleTaskAssignee: (assignee: Iassignee[]) => void;
  setIsStopIndex: (index: number) => void;
  handleFocusTask: (selectedTask: Itasks, index: number) => void;
  setShowLeftSideBar: (show: boolean) => void;
}

function HandIcon(): JSX.Element {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M17.2617 4.11328V15.0117C17.2617 15.832 16.957 16.5352 16.3477 17.1211C15.7617 17.707 15.0586 18 14.2383 18H8.78906C7.94531 18 7.23047 17.707 6.64453 17.1211L0.738281 11.1094C1.37109 10.5 1.69922 10.1953 1.72266 10.1953C1.88672 10.0547 2.08594 9.98438 2.32031 9.98438C2.48438 9.98438 2.63672 10.0195 2.77734 10.0898L6.01172 11.918V2.98828C6.01172 2.68359 6.11719 2.42578 6.32812 2.21484C6.5625 1.98047 6.83203 1.86328 7.13672 1.86328C7.44141 1.86328 7.69922 1.98047 7.91016 2.21484C8.14453 2.42578 8.26172 2.68359 8.26172 2.98828V8.26172H9V1.125C9 0.796875 9.10547 0.527344 9.31641 0.316406C9.52734 0.105469 9.79688 0 10.125 0C10.4531 0 10.7227 0.105469 10.9336 0.316406C11.1445 0.527344 11.25 0.796875 11.25 1.125V8.26172H11.9883V1.86328C11.9883 1.55859 12.0938 1.30078 12.3047 1.08984C12.5391 0.855469 12.8086 0.738281 13.1133 0.738281C13.418 0.738281 13.6758 0.855469 13.8867 1.08984C14.1211 1.30078 14.2383 1.55859 14.2383 1.86328V8.26172H15.0117V4.11328C15.0117 3.80859 15.1172 3.55078 15.3281 3.33984C15.5625 3.10547 15.832 2.98828 16.1367 2.98828C16.4414 2.98828 16.6992 3.10547 16.9102 3.33984C17.1445 3.55078 17.2617 3.80859 17.2617 4.11328Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function RemovePerson(): JSX.Element {
  return (
    <svg width='22' height='18' viewBox='0 0 22 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12.0156 5.01562C12.0156 4.26562 11.8281 3.59375 11.4531 3C11.1094 2.375 10.625 1.89062 10 1.54688C9.40625 1.17188 8.73438 0.984375 7.98438 0.984375C7.26562 0.984375 6.59375 1.17188 5.96875 1.54688C5.375 1.89062 4.89062 2.375 4.51562 3C4.17188 3.59375 4 4.26562 4 5.01562C4 5.73438 4.17188 6.40625 4.51562 7.03125C4.89062 7.625 5.375 8.10938 5.96875 8.48438C6.59375 8.82812 7.26562 9 7.98438 9C8.73438 9 9.40625 8.82812 10 8.48438C10.625 8.10938 11.1094 7.625 11.4531 7.03125C11.8281 6.40625 12.0156 5.73438 12.0156 5.01562ZM15.0156 6.98438V9H21.0156V6.98438H15.0156ZM0.015625 15V17.0156H16V15C16 14.4688 15.8125 14 15.4375 13.5938C15.0625 13.1562 14.5625 12.7812 13.9375 12.4688C13.3438 12.125 12.6875 11.8594 11.9688 11.6719C11.25 11.4531 10.5312 11.2969 9.8125 11.2031C9.125 11.0781 8.51562 11.0156 7.98438 11.0156C7.45312 11.0156 6.84375 11.0781 6.15625 11.2031C5.46875 11.2969 4.76562 11.4531 4.04688 11.6719C3.32812 11.8594 2.65625 12.125 2.03125 12.4688C1.4375 12.7812 0.953125 13.1562 0.578125 13.5938C0.203125 14 0.015625 14.4688 0.015625 15Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

export default function TasksListing(props: ITasksListing): JSX.Element {
  const {
    data, isStopIndex, errorChecklistsIds, setErrorChecklistsIds, focusedTask, handleChecklistTaskCompleted, handleTaskAssignee, setIsStopIndex, handleFocusTask, setShowLeftSideBar,
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [selectedTask, setSelectedTask] = useState<Itasks | null>(null);

  // eslint-disable-next-line no-useless-escape
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const handleChecklistTaskComplete = (id: number, status: boolean): void => {
    let error = false;
    if (!status) {
      data.tasks.map((task) => {
        if (task.id === id) {
          task.content.map((content) => {
            if ((content.is_required === true && content.value === '') || (content.form_type === 'email' && !emailValidation.test(content.value))) {
              if (!errorChecklistsIds.includes(id)) {
                setErrorChecklistsIds([...errorChecklistsIds, id]);
              }
              error = true;
            }
            if (content.type === 'subTask' && content.subTasks !== undefined) {
              content.subTasks.map((subtask) => {
                if (content.is_required === true && !subtask.is_completed) {
                  if (!errorChecklistsIds.includes(id)) {
                    setErrorChecklistsIds([...errorChecklistsIds, id]);
                  }
                  error = true;
                }
              });
            }
          });
        }
      });
    }
    if (!error) {
      const index = errorChecklistsIds.indexOf(id);
      errorChecklistsIds.splice(index, 1);
      handleChecklistTaskCompleted({ checklistStatus: !status, completeId: id });
      setErrorChecklistsIds(errorChecklistsIds);
      setIsStopIndex(-1);
    }
  };

  const removeTaskAssignee = (assigneeItem: Iassignee): void => {
    if (focusedTask !== null) {
      const previousAssignee = focusedTask.assignees.filter((val) => val.id !== assigneeItem.id);
      const removeIndex = focusedTask.assignees.findIndex((val) => val.id === assigneeItem.id);
      focusedTask.assignees.splice(removeIndex, 1);
      // setFocusedTask(focusedTask);
      setSelectedTask(null);
      enqueueSnackbar(`${assigneeItem.name} was unassigned `);
      handleTaskAssignee(previousAssignee);
    }
  };

  return (
    <>
      {data.tasks.map((task, index) => (
        <div className='task-item-wrapper' key={task.id}>
          <div className='task-index' style={{ color: errorChecklistsIds.length > 0 && errorChecklistsIds.includes(task.id) ? '#C62828' : focusedTask?.id === task.id ? '#00CFA1' : 'rgba(33, 33, 33, 0.87)' }}>
            {!task.is_heading && task.task_index !== undefined ? <p>{task.task_index}</p> : <p />}
            {task.is_stop && <div className={errorChecklistsIds.length > 0 && errorChecklistsIds.includes(task.id) ? 'hand-icon-error' : focusedTask?.id === task.id ? 'hand-icon-focus' : 'hand-icon'}><HandIcon /></div>}
          </div>
          <div aria-hidden='true' onClick={(): void => { handleFocusTask(task, index); setShowLeftSideBar(true); }} className='task-data-div' style={{ borderRadius: index === 0 ? '8px 8px 0px 0px' : index === data.tasks.length - 1 ? '0px 0px 8px 8px' : '', padding: task.is_heading ? '0px 8px 0px 14px' : '0px 8px 0px 2px', backgroundColor: errorChecklistsIds.includes(task.id) && focusedTask?.id === task.id ? '#C62828' : errorChecklistsIds.includes(task.id) ? '#FFCDD2' : focusedTask?.id === task.id ? '#00CFA1' : 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {!task.is_heading
                    && (
                      <Checkbox
                        checked={task.is_completed}
                        color={focusedTask?.id === task.id ? 'default' : 'primary'}
                        disabled={(isStopIndex !== -1 && task.index > isStopIndex)}
                        onChange={(): void => { handleChecklistTaskComplete(task.id, task.is_completed); }}
                      />
                    )}
              <div>
                { task.name.length < 30 ? (
                  <p style={{ color: focusedTask?.id === task.id ? 'white' : 'rgba(33, 33, 33, 0.87)', textDecoration: task.is_completed ? 'line-through' : 'none', fontFamily: task.is_heading ? 'Roboto-Medium' : 'Roboto' }} className='test-check'>
                    {task.name}
                  </p>
                )
                  : (
                    <p style={{ color: focusedTask?.id === task.id ? 'white' : 'rgba(33, 33, 33, 0.87)', textDecoration: task.is_completed ? 'line-through' : 'none', fontFamily: task.is_heading ? 'Roboto-Medium' : 'Roboto' }} className='test-check'>
                      {task.name.substring(0, 30)}
                      ...
                    </p>
                  )}
                {task.is_completed && (
                  <h6 className='task-completd-time'>
                    by
                    {' '}
                    <b>{task.completed_by.name}</b>
                    {' '}
                    {moment.utc(task.completed_at).format('MMM DD [at] hh:mm a')}
                  </h6>
                )}
              </div>
            </div>
            {task.due_status.due !== null
              ? (
                <div className='task-duedate-status-div' style={{ width: window.innerWidth > 600 ? '75px' : '55px', color: task.due_status.status === 0 ? '#C62828' : task.due_status.status === 1 ? '#FB8C00' : '#2196F3', background: focusedTask?.id === task.id ? 'white' : task.due_status.status === 0 ? 'rgba(198, 40, 40, 0.08)' : task.due_status.status === 1 ? 'rgba(251, 140, 0, 0.08)' : 'rgba(33, 150, 243, 0.08)' }}>
                  {task.due_status.due}
                </div>
              ) : null}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px' }}>
              <div>
                {window.innerWidth > 600
                  ? (
                    <PopupState variant='popover' popupId='demo-popup-popover'>
                      {(popupState): JSX.Element => (
                        <div className='task-listing-avatargroup'>
                          <AvatarGroup max={3} {...bindTrigger(popupState)}>
                            {task.assignees.map((assignee) => (
                              <Avatar key={assignee.id} alt={assignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
                            ))}
                          </AvatarGroup>
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                          >
                            <div className='assignee-popup-wrapper'>
                              <div className='selected-assignee-div'>
                                <span className='heading'>Assignees</span>
                                <div aria-hidden='true' onClick={(): void => { popupState.close(); }}><CancelIcon /></div>
                              </div>
                              <div className='task-list-avatar-wrapper'>
                                {task.assignees.map((item) => (
                                  <div className='assignee-inner-div' key={item.id}>
                                    <Avatar alt={item.name} src={`${process.env.REACT_APP_IMAGE_URL}${item.avatar}`} sx={{ height: '28px', width: '28px' }} />
                                    <div className='assignee-nameEmail-div'>
                                      <span className='name'>{item.name}</span>
                                      <span className='email'>{item.email}</span>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }} aria-hidden='true' onClick={(): void => { removeTaskAssignee(item); }}><RemovePerson /></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Popover>
                        </div>
                      )}
                    </PopupState>
                  )
                  : (
                    <div className='task-listing-avatargroup' aria-hidden='true' onClick={(): void => { setSelectedTask(task); }}>
                      <AvatarGroup max={3}>
                        {task.assignees.map((assignee) => (
                          <Avatar key={assignee.id} alt={assignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
                        ))}
                      </AvatarGroup>
                    </div>
                  ) }
              </div>
            </div>
          </div>
        </div>
      ))}
      <Drawer
        anchor='bottom'
        open={selectedTask !== null}
        onClose={(): void => { setSelectedTask(null); }}
        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
      >
        <div className='filter-wrapper'>
          <div>
            <p className='heading'>Assignees</p>
          </div>
          <div className='mt-4'>
            {selectedTask !== null && selectedTask.assignees.map((item) => (
              <div className='assignee-inner-div' key={item.id}>
                <Avatar alt={item.name} src={`${process.env.REACT_APP_IMAGE_URL}${item.avatar}`} sx={{ height: '28px', width: '28px' }} />
                <div className='assignee-nameEmail-div'>
                  <span className='name'>{item.name}</span>
                  <span className='email'>{item.email}</span>
                </div>
                <div style={{ marginLeft: 'auto' }} aria-hidden='true' onClick={(): void => { removeTaskAssignee(item); }}><RemovePerson /></div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
