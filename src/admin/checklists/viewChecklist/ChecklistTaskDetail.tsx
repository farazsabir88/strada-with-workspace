/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  Avatar, Popover, Button, Drawer,
} from '@mui/material';
import _ from 'lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InputField from 'shared-components/inputs/InputField';
import SelectInput from 'shared-components/inputs/SelectInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import TaskContent from './TaskContent';
import TaskComment from './TaskComment';
import type {
  Itasks, Iassignee, Iresponse, Icomments, IchecklistCompleteStatus,
} from '../types';

interface ITaskDetail {
  focusedTask: Itasks | null;
  setFocusedTask: (task: Itasks) => void;
  assignee: Iassignee[] | undefined;
  handleTaskAssignee: (data: Iassignee[]) => void;
  taskDueDate: string;
  taskDueTime: string;
  setTaskDueDate: (date: string) => void;
  setTaskDueTime: (time: string) => void;
  changeTaskDueDate: (dueDate: Date | null) => void;
  errorChecklistsIds: number[];
  isStopIndex: number;
  focusedTaskIndex: number;
  data: Iresponse;
  handleChecklistTaskCompleted: (checklistCompleteStatus: IchecklistCompleteStatus) => void;
  setErrorChecklistsIds: (ids: number[]) => void;
  setIsStopIndex: (index: number) => void;
  handleFocusTask: (selectedTask: Itasks, index: number) => void;
  showSendEmailIndex: number;
  setShowSendEmailIndex: (index: number) => void;
  showCleanedSendEmailFields: boolean;
  setShowCleanedSendEmailFields: (status: boolean) => void;
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
function OverrideCalendarIcon(): JSX.Element {
  return (
    <svg width='36' height='41' viewBox='0 0 36 41' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M31.9688 36.9688V15.0312H4.03125V36.9688H31.9688ZM25.9688 0.96875H30V5H31.9688C33.0312 5 33.9688 5.40625 34.7812 6.21875C35.5938 7.03125 36 7.96875 36 9.03125V36.9688C36 38.0312 35.5938 38.9688 34.7812 39.7812C33.9688 40.5938 33.0312 41 31.9688 41H4.03125C2.90625 41 1.9375 40.625 1.125 39.875C0.375 39.0625 0 38.0938 0 36.9688V9.03125C0 7.96875 0.375 7.03125 1.125 6.21875C1.9375 5.40625 2.90625 5 4.03125 5H6V0.96875H10.0312V5H25.9688V0.96875ZM28.0312 23V33.0312H18V23H28.0312Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

export default function ChecklistTaskDetail(props: ITaskDetail): JSX.Element {
  const {
    focusedTask, setFocusedTask, assignee, handleTaskAssignee, taskDueDate, taskDueTime, setTaskDueDate, setTaskDueTime, changeTaskDueDate, errorChecklistsIds, isStopIndex, focusedTaskIndex, data, handleChecklistTaskCompleted, setErrorChecklistsIds, setIsStopIndex, handleFocusTask, showSendEmailIndex, setShowSendEmailIndex, showCleanedSendEmailFields, setShowCleanedSendEmailFields,
  } = props;
  const [assigneePopupAncherEl, setAssigneePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [selectedAssigneePopupAncherEl, setSelectedAssigneePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [assigneeSearch, setAssigneeSearch] = useState<string>('');
  const [isOverrideDueDate, setIsOverrideDueDate] = useState<boolean>(true);
  const [overrideDueDatePopupAncherEl, setOverrideDueDatePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [taskDueDatePopupAncherEl, setTaskDueDatePopupAncherEl] = useState<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const [commentForEdit, setCommentForEdit] = useState<Icomments | null>(null);
  const lowercasedFilter = assigneeSearch.toLowerCase();
  const filterData = assignee !== undefined ? assignee.filter((item: Iassignee) => Object.keys(item).some((key) => (key === 'name' || key === 'email') && item[key].toString().toLowerCase().includes(lowercasedFilter))) : null;
  const filteredData = focusedTask !== null ? _.differenceBy(filterData, focusedTask.assignees, 'id') : filterData;

  const TimeSlots = [
    { name: '12:00 am', value: '12:00 am' }, { name: '01:00 am', value: '01:00 am' }, { name: '02:00 am', value: '02:00 am' },
    { name: '03:00 am', value: '03:00 am' }, { name: '04:00 am', value: '04:00 am' }, { name: '05:00 am', value: '05:00 am' },
    { name: '06:00 am', value: '06:00 am' }, { name: '07:00 am', value: '07:00 am' }, { name: '08:00 am', value: '08:00 am' },
    { name: '09:00 am', value: '09:00 am' }, { name: '10:00 am', value: '10:00 am' }, { name: '11:00 am', value: '11:00 am' },
    { name: '12:00 pm', value: '12:00 pm' }, { name: '01:00 pm', value: '01:00 pm' }, { name: '02:00 pm', value: '02:00 pm' },
    { name: '03:00 pm', value: '03:00 pm' }, { name: '04:00 pm', value: '04:00 pm' }, { name: '05:00 pm', value: '05:00 pm' },
    { name: '06:00 pm', value: '06:00 pm' }, { name: '07:00 pm', value: '07:00 pm' }, { name: '08:00 pm', value: '08:00 pm' },
    { name: '09:00 pm', value: '09:00 pm' }, { name: '10:00 pm', value: '10:00 pm' }, { name: '11:00 pm', value: '11:00 pm' },
  ];

  const addTaskAssignee = (assigneeItem: Iassignee): void => {
    if (focusedTask !== null) {
      const previousAssignee = focusedTask.assignees;
      const obj = { ...assigneeItem };
      const check = previousAssignee.find((val) => val.id === assigneeItem.id);
      if (!check) {
        // const avatar = obj.avatar.slice(obj.avatar.indexOf('/media'));
        // obj.avatar = avatar;
        previousAssignee.push(obj);
        handleTaskAssignee(previousAssignee);
      }
    }
  };
  const removeTaskAssignee = (assigneeItem: Iassignee): void => {
    if (focusedTask !== null) {
      const previousAssignee = focusedTask.assignees.filter((val) => val.id !== assigneeItem.id);
      const removeIndex = focusedTask.assignees.findIndex((val) => val.id === assigneeItem.id);
      focusedTask.assignees.splice(removeIndex, 1);
      if (previousAssignee.length === 0) {
        setSelectedAssigneePopupAncherEl(null);
      }
      handleTaskAssignee(previousAssignee);
    }
  };
  const handleDueDateClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (focusedTask !== null) {
      if (focusedTask.is_template_due_date && isOverrideDueDate) {
        setOverrideDueDatePopupAncherEl(e.currentTarget);
      } else {
        setTaskDueDatePopupAncherEl(e.currentTarget);
      }
    }
  };
  const handleRemoveTaskDueDateAndTime = (): void => {
    setTaskDueDate('');
    setTaskDueTime('');
    setTaskDueDatePopupAncherEl(null);
    changeTaskDueDate(null);
  };
  const handleTaskDueDateAndTime = (): void => {
    if (taskDueDate !== '') {
      if (taskDueTime !== '') {
        changeTaskDueDate(new Date(`${taskDueDate} ${taskDueTime}`));
      } else {
        changeTaskDueDate(new Date(`${taskDueDate}`));
      }
    }
    setTaskDueDate('');
    setTaskDueTime('');
    setTaskDueDatePopupAncherEl(null);
  };

  return (
    <div className='middle-grid-wrapper'>
      <div className='task-name-div'>
        <p className={`task-name-${focusedTask !== null && focusedTask.name !== null && focusedTask.name.length > 100 ? 'long-p' : 'p'}`}>{focusedTask?.name}</p>
      </div>
      {focusedTask !== null && !focusedTask.is_heading
        && (
          <div className='assign-duedate-div'>
            <div>
              <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(e: React.MouseEvent<HTMLDivElement>): void => { setAssigneePopupAncherEl(e.currentTarget); }}>
                <PersonIcon />
                {window.innerWidth > 600 && <p>Assign</p>}
              </div>
              {window.innerWidth > 600
              && (
                <Popover
                  open={Boolean(assigneePopupAncherEl)}
                  anchorEl={assigneePopupAncherEl}
                  onClose={(): void => { setAssigneePopupAncherEl(null); }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <div className='assignee-popup-wrapper'>
                    <div style={{ width: '100%' }}>
                      <InputField
                        name='name'
                        placeholder='Enter name or email'
                        type='text'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setAssigneeSearch(e.target.value); }}
                        value={assigneeSearch}
                      />
                    </div>
                    <div>
                      {filteredData !== null ? filteredData.map((item) => (
                        <div className='assignee-inner-div cursor-pointer' key={item.id.toString()} aria-hidden='true' onClick={(): void => { addTaskAssignee(item); }}>
                          <Avatar alt={item.name} src={item.avatar} />
                          <div className='assignee-nameEmail-div'>
                            <span className='name'>{item.name}</span>
                            <span className='email'>{item.email}</span>
                          </div>
                        </div>
                      )) : null}
                    </div>
                  </div>
                </Popover>
              ) }
            </div>
            {(focusedTask !== null && focusedTask.assignees.length > 0)
            && (
              <div>
                <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(e: React.MouseEvent<HTMLDivElement>): void => { setSelectedAssigneePopupAncherEl(e.currentTarget); }}>
                  <AvatarGroup max={0}>
                    {focusedTask.assignees.map((item) => (
                      <Avatar alt={item.name} key={item.id.toString()} src={`${process.env.REACT_APP_IMAGE_URL}${item.avatar}`} sx={{ height: '28px', width: '28px' }} />
                    ))}
                  </AvatarGroup>
                </div>
                {window.innerWidth > 600
                && (
                  <Popover
                    open={Boolean(selectedAssigneePopupAncherEl)}
                    anchorEl={selectedAssigneePopupAncherEl}
                    onClose={(): void => { setSelectedAssigneePopupAncherEl(null); }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <div className='assignee-popup-wrapper'>
                      <div className='selected-assignee-div'>
                        <span className='heading'>Assignees</span>
                        <div aria-hidden='true' onClick={(): void => { setSelectedAssigneePopupAncherEl(null); }}><CancelIcon /></div>
                      </div>
                      <div>
                        {focusedTask.assignees.map((item) => (
                          <div className='assignee-inner-div'>
                            <Avatar alt={item.name} key={item.id} src={`${process.env.REACT_APP_IMAGE_URL}${item.avatar}`} sx={{ height: '28px', width: '28px' }} />
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
                ) }
              </div>
            )}
            <div>
              <div className='assign-duedate-innerdiv' aria-hidden='true' onClick={(e: React.MouseEvent<HTMLDivElement>): void => { handleDueDateClick(e); }}>
                <AccessTimeIcon />
                <p>
                  Due
                  {' '}
                  {focusedTask.due_date !== null && `${moment.utc(focusedTask.due_date).format('ddd MMM D')} ...`}
                </p>
              </div>
              <Popover
                open={Boolean(overrideDueDatePopupAncherEl)}
                anchorEl={overrideDueDatePopupAncherEl}
                onClose={(): void => { setOverrideDueDatePopupAncherEl(null); }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className='override-duedate-wrapper'>
                  <div className='calendar-icon-div'><OverrideCalendarIcon /></div>
                  {(focusedTask.due_months !== 0 && focusedTask.due_days && focusedTask.due_hours && focusedTask.due_minutes) || focusedTask.due_rule !== null
                    ? (
                      <p>
                        This task will be due
                        {' '}
                        <b>
                          {focusedTask.due_months !== 0 ? `${focusedTask.due_months} months` : focusedTask.due_days ? `${focusedTask.due_days} days` : focusedTask.due_hours ? `${focusedTask.due_hours} hours` : `${focusedTask.due_minutes} minutes`}
                          {' '}
                          {focusedTask.due_is_after ? 'after' : 'before'}
                          {' '}
                          {focusedTask.due_rule === '1' ? 'checklist start date' : focusedTask.due_rule === '2' ? 'prior to task checked' : focusedTask.due_rule === '3' ? 'checklist due date' : ''}
                        </b>
                      </p>
                    )
                    : <p style={{ textAlign: 'center' }}>This task does not have a due date</p>}
                  <Button
                    onClick={(): void => { setTaskDueDatePopupAncherEl(overrideDueDatePopupAncherEl); setOverrideDueDatePopupAncherEl(null); setIsOverrideDueDate(false); }}
                    style={{
                      textTransform: 'inherit', color: 'white', background: '#00CFA1', width: '100%',
                    }}
                    color='primary'
                    variant='contained'
                  >
                    Edit due date

                  </Button>
                  <h6 style={{ textAlign: 'center' }}>Overriding will break the dynamic link</h6>
                </div>
              </Popover>
              <Popover
                open={Boolean(taskDueDatePopupAncherEl)}
                anchorEl={taskDueDatePopupAncherEl}
                onClose={(): void => { setTaskDueDatePopupAncherEl(null); }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className='sidebar-duedate-popup-wrapper'>
                  <div className='duedate-inputs-wrapper'>
                    <div style={{ width: '47%' }}>
                      <InputField
                        id='due'
                        name='name'
                        type='text'
                        label='Date'
                        value={taskDueDate}
                        error={false}
                      />
                    </div>
                    <div className='time-select-div' style={{ width: '50%', marginTop: '3px' }}>
                      <SelectInput
                        value={taskDueTime}
                        name='time'
                        onChange={(obj: SelectChangeEvent): void => { setTaskDueTime(obj.target.value); }}
                        options={TimeSlots}
                        showPleaseSelect={false}
                        haveMarginBottom={false}
                        label='Time'
                      />
                    </div>
                  </div>
                  <Calendar
                    color='#00CFA1'
                    date={taskDueDate !== '' ? new Date(taskDueDate) : undefined}
                    onChange={(newDate: Date): void => { setTaskDueDate(moment(newDate).format('MM/DD/YYYY')); }}
                  />
                  <div className='dueDatebtndiv'>
                    <Button onClick={(): void => { handleRemoveTaskDueDateAndTime(); }} color='primary' startIcon={<DeleteIcon />} style={{ color: '#00CFA1', textTransform: 'inherit' }}>Remove</Button>
                    <Button onClick={(): void => { handleTaskDueDateAndTime(); }} className='durdate-save-btn' style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' startIcon={<SaveIcon />} variant='contained'>Save</Button>
                  </div>
                </div>
              </Popover>
            </div>
            {window.innerWidth < 600 && focusedTask.is_stop
            && (
              <div>
                <div className='assign-duedate-innerdiv'>
                  <HandIcon />
                </div>
              </div>
            )}
            {window.innerWidth < 600
            && (
              <>
                <Drawer
                  anchor='bottom'
                  open={Boolean(assigneePopupAncherEl)}
                  onClose={(): void => { setAssigneePopupAncherEl(null); }}
                  PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
                >
                  <div className='filter-wrapper'>
                    <div className='assignee-popup-wrapper' style={{ paddingTop: '0px' }}>
                      <p className='heading mb-4'>Assign Users</p>
                      <div style={{ width: '100%' }}>
                        <InputField
                          name='name'
                          placeholder='Enter name or email'
                          type='text'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setAssigneeSearch(e.target.value); }}
                          value={assigneeSearch}
                        />
                      </div>
                      <div>
                        {filteredData !== null ? filteredData.map((item) => (
                          <div className='assignee-inner-div pt-2 pb-2 cursor-pointer' key={item.id.toString()}>
                            <Avatar alt={item.name} src={item.avatar} sx={{ height: '24px', width: '24px' }} />
                            <div className='assignee-nameEmail-div'>
                              <span className='name'>{item.name}</span>
                              <span className='email'>{item.email}</span>
                            </div>
                            <div style={{ marginLeft: 'auto', paddingLeft: '8px' }} aria-hidden='true' onClick={(): void => { addTaskAssignee(item); }}><PersonAddIcon /></div>
                          </div>
                        )) : null}
                      </div>
                    </div>
                  </div>
                </Drawer>
                <Drawer
                  anchor='bottom'
                  open={Boolean(selectedAssigneePopupAncherEl)}
                  onClose={(): void => { setSelectedAssigneePopupAncherEl(null); }}
                  PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
                >
                  <div className='filter-wrapper'>
                    <div>
                      <p className='heading'>Assignees</p>
                    </div>
                    <div className='mt-4'>
                      {focusedTask !== null && focusedTask.assignees.map((singleAssignee) => (
                        <div className='assignee-inner-div pt-2 pb-2 cursor-pointer' key={singleAssignee.id}>
                          <Avatar alt={singleAssignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${singleAssignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
                          <div className='assignee-nameEmail-div'>
                            <span className='name'>{singleAssignee.name}</span>
                            <span className='email'>{singleAssignee.email}</span>
                          </div>
                          <div style={{ marginLeft: 'auto', paddingLeft: '8px' }} aria-hidden='true' onClick={(): void => { removeTaskAssignee(singleAssignee); }}><RemovePerson /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Drawer>
              </>
            ) }
          </div>
        )}
      <TaskContent focusedTask={focusedTask} setFocusedTask={setFocusedTask} errorChecklistsIds={errorChecklistsIds} isStopIndex={isStopIndex} focusedTaskIndex={focusedTaskIndex} data={data} handleChecklistTaskCompleted={handleChecklistTaskCompleted} setErrorChecklistsIds={setErrorChecklistsIds} setIsStopIndex={setIsStopIndex} handleFocusTask={handleFocusTask} commentForEdit={commentForEdit} setCommentForEdit={setCommentForEdit} showSendEmailIndex={showSendEmailIndex} setShowSendEmailIndex={setShowSendEmailIndex} showCleanedSendEmailFields={showCleanedSendEmailFields} setShowCleanedSendEmailFields={setShowCleanedSendEmailFields} />
      {window.innerWidth > 600 && <TaskComment focusedTask={focusedTask} commentForEdit={commentForEdit} setCommentForEdit={setCommentForEdit} />}
    </div>
  );
}
