/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState, useEffect } from 'react';
import {
  Avatar, Popover, Button, Switch, IconButton, Snackbar,
} from '@mui/material';
import InputField from 'shared-components/inputs/InputField';
import SelectInput from 'shared-components/inputs/SelectInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import ArchiveIcon from '@mui/icons-material/Archive';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import SaveIcon from '@mui/icons-material/Save';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { encrypt } from 'shared-components/hooks/useEncryption';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import type { RootState } from 'mainStore';
import { getCurrentBuilding } from 'admin/store/currentBuildingSlice';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import type {
  Iresponse, Iassignee,
} from '../types';

interface ISideBar {
  data: Iresponse;
  setShowSideBar: (open: boolean) => void;
  isStopIndex: number;
  setErrorChecklistsIds: (ids: number[]) => void;
  addChecklistAssignee: (assignee: Iassignee[]) => void;
  removeSideMenuDueDate: (dueDate: Date | null) => void;
  assignee: Iassignee[] | undefined;
  setGetPrint: (open: boolean) => void;
}

function SideMenuClose(): JSX.Element {
  return (
    <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M11.2383 1.81641L7.05469 6L11.2383 10.1836L10.1836 11.2383L6 7.05469L1.81641 11.2383L0.761719 10.1836L4.94531 6L0.761719 1.81641L1.81641 0.761719L6 4.94531L10.1836 0.761719L11.2383 1.81641Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function CompleteAllTaskIcon(): JSX.Element {
  return (
    <svg width='16' height='13' viewBox='0 0 16 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M15.4883 3.23828H8.73828V4.75H15.4883V3.23828ZM15.4883 9.25H8.73828V10.7617H15.4883V9.25ZM3.14844 6.26172L0.511719 3.58984L1.56641 2.53516L3.14844 4.11719L6.3125 0.953125L7.40234 2.00781L3.14844 6.26172ZM3.14844 12.2383L0.511719 9.60156L1.56641 8.54688L3.14844 10.1289L6.3125 6.96484L7.40234 8.01953L3.14844 12.2383Z' fill='#212121' fillOpacity='0.87' />
    </svg>
  );
}
function DueDateErrorIcon(): JSX.Element {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M10.9844 10.9844V4.98438H9.01562V10.9844H10.9844ZM10.9844 15.0156V13H9.01562V15.0156H10.9844ZM2.92188 2.96875C4.89062 1 7.25 0.015625 10 0.015625C12.75 0.015625 15.0938 1 17.0312 2.96875C19 4.90625 19.9844 7.25 19.9844 10C19.9844 12.75 19 15.1094 17.0312 17.0781C15.0938 19.0156 12.75 19.9844 10 19.9844C7.25 19.9844 4.89062 19.0156 2.92188 17.0781C0.984375 15.1094 0.015625 12.75 0.015625 10C0.015625 7.25 0.984375 4.90625 2.92188 2.96875Z' fill='#C62828' />
    </svg>
  );
}

export default function SideBar(props: ISideBar): JSX.Element {
  const {
    data, setShowSideBar, isStopIndex, setErrorChecklistsIds, addChecklistAssignee, removeSideMenuDueDate, assignee, setGetPrint,
  } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [sideMenuAssigneePopupAncherEl, setSideMenuAssigneePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [assigneeSearch, setAssigneeSearch] = useState<string>('');
  const [checklistDuedateError, setChecklistDuedateError] = useState<boolean>(false);
  const [dueDatePopupAncherEl, setDueDatePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [sideMenuDueDateAndTime, setSideMenuDueDateAndTime] = useState<string>('');
  const [sideMenuDueDate, setSideMenuDueDate] = useState<string>('');
  const [sideMenuDueTime, setSideMenuDueTime] = useState<string>('');
  const [shareLink, setShareLink] = useState<boolean>(false);
  const [openDeleteChecklistDialog, setOpenDeleteChecklistDialog] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const { buildingId } = useParams();

  const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);

  useEffect(() => {
    dispatch(getCurrentBuilding(buildingId));
    if (data.due_date !== null) {
      if (window.innerWidth > 600) {
        setSideMenuDueDateAndTime(moment(data.due_date).format('MMMM DD, YYYY hh:mm a'));
      } else {
        setSideMenuDueDateAndTime(moment(data.due_date).format('MMM DD, YYYY hh:mm a'));
      }
      setSideMenuDueDate(moment(data.due_date).format('MM/DD/YYYY'));
      setSideMenuDueTime(moment(data.due_date).format('hh:mm a'));
    }
  }, [buildingId, dispatch, data.due_date]);

  // eslint-disable-next-line no-useless-escape
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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

  const { mutate: markAllTasksComplete } = useMutation(
    async () => axios({
      url: '/api/checklist/complete_all_task/',
      method: 'post',
      data: {
        checklist: data.id,
      },
    }),
    {
      onSuccess: () => {
        setErrorChecklistsIds([]);
        window.history.back();
      },
    },
  );
  const { mutate: editTemplate } = useMutation(
    async () => axios({
      url: `/api/checklist-template/${data.template}`,
      method: 'get',
    }),
    {
      onSuccess: (res) => {
        navigate(`/workspace/settings/create-checklist-template/${res.data.id}`);
      },
    },
  );
  const { mutate: archive } = useMutation(
    async () => axios({
      url: '/api/checklist/archive_checklist/',
      data: { checklist: data.id },
      method: 'POST',
    }),
    {
      onSuccess: () => {
        window.history.back();
      },
    },
  );
  const { mutate: deleteChecklist } = useMutation(
    async () => axios({
      url: `/api/checklist/${data.id}`,
      method: 'delete',
    }),
    {
      onSuccess: () => {
        window.history.back();
      },
    },
  );

  const completeAllTasks = (): void => {
    if (isStopIndex === -1) {
      let error = false;
      const errorIds: number[] = [];
      data.tasks.map((task) => {
        task.content.map((content) => {
          if ((content.is_required === true && content.value === '') || (content.form_type === 'email' && !emailValidation.test(content.value))) {
            if (!errorIds.includes(task.id)) {
              errorIds.push(task.id);
            }
            error = true;
          }
          if (content.type === 'subTask' && content.subTasks !== undefined) {
            content.subTasks.map((subtask) => {
              if (content.is_required === true && !subtask.is_completed) {
                if (!errorIds.includes(task.id)) {
                  errorIds.push(task.id);
                }
                error = true;
              }
            });
          }
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!error) {
        markAllTasksComplete();
      } else {
        setErrorChecklistsIds(errorIds);
      }
    }
  };

  const addAssignee = (assigneeItem: Iassignee): void => {
    const previousAssignee = data.assignees;
    const obj = { ...assigneeItem };
    const check = previousAssignee.find((val) => val.id === assigneeItem.id);
    if (!check) {
      const avatar = obj.avatar.slice(obj.avatar.indexOf('/media'));
      obj.avatar = avatar;
      previousAssignee.push(obj);
      addChecklistAssignee(previousAssignee);
    }
  };
  const handleSideMenuDueDateAndTime = (): void => {
    if (sideMenuDueDate !== '') {
      const todayDate = new Date();
      let dateValue = null;
      if (sideMenuDueTime !== '') {
        setSideMenuDueDateAndTime(`${sideMenuDueDate}, ${sideMenuDueTime}`);
        setDueDatePopupAncherEl(null);
        dateValue = new Date(`${sideMenuDueDate} ${sideMenuDueTime}`);
      } else {
        setSideMenuDueDateAndTime(sideMenuDueDate);
        setDueDatePopupAncherEl(null);
        dateValue = new Date(sideMenuDueDate);
      }
      if (!moment.utc(todayDate).isBefore(moment.utc(dateValue))) {
        setChecklistDuedateError(true);
      } else {
        setChecklistDuedateError(false);
        removeSideMenuDueDate(dateValue);
      }
    }
  };
  const handleRemoveSideMenuDueDateAndTime = (): void => {
    setSideMenuDueDateAndTime('');
    setSideMenuDueDate('');
    setSideMenuDueTime('');
    setDueDatePopupAncherEl(null);
    setChecklistDuedateError(false);
    removeSideMenuDueDate(null);
  };
  const copyCodeToClipboard = (): void => {
    const copyLink = `${process.env.REACT_APP_BASE_URL}building/view-checklist/${encrypt(currentBuilding.id)}/${data.id}`;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(copyLink);
    enqueueSnackbar('Checklist Link Copied Successfully');
  };

  const lowercasedFilter = assigneeSearch.toLowerCase();
  const filteredData = assignee !== undefined ? assignee.filter((item: Iassignee) => Object.keys(item).some((key) => (key === 'name' || key === 'email') && item[key].toString().toLowerCase().includes(lowercasedFilter))) : null;
  return (
    <>
      {window.innerWidth > 600
      && (
        <div className='side-bar-div-cross cursor-pointer' style={{ top: data.is_archived ? '124px' : '64px' }} aria-hidden='true' onClick={(): void => { setShowSideBar(false); }}>
          <SideMenuClose />
        </div>
      ) }
      <div className='checklist-right-grid-wrapper' style={{ top: data.is_archived ? '124px' : '64px' }}>
        {window.innerWidth < 600
      && (
        <div className='d-flex align-items-center justify-space-between mb-4'>
          <div className='cursor-pointer' aria-hidden='true' onClick={(): void => { setShowSideBar(false); }}>
            <SideMenuClose />
          </div>
          <p style={{ fontSize: '14px', fontWeight: '500' }}>Hide Menu</p>
          <p />
        </div>
      )}
        <div className='sidebar-items-wrapper'>
          <div className={isStopIndex !== -1 ? 'disabled-sidemenu-menu-div' : 'sidemenu-menu-div'} aria-hidden='true' onClick={(): void => { completeAllTasks(); }}>
            <div className='menu-item'>
              <CompleteAllTaskIcon />
              <p className='menu-item-title'>Complete all tasks</p>
            </div>
          </div>
          {window.innerWidth > 600
        && (
          <div className='sidemenu-menu-div' aria-hidden='true' onClick={(): void => { editTemplate(); }}>
            <div className='menu-item'>
              <EditIcon />
              <p className='menu-item-title'>Edit template</p>
            </div>
          </div>
        ) }
          <div className='sidemenu-menu-div' aria-hidden='true' onClick={(): void => { archive(); }}>
            <div className='menu-item'>
              <ArchiveIcon />
              <p className='menu-item-title'>Archive</p>
            </div>
          </div>
          <div className='sidemenu-menu-div' aria-hidden='true' onClick={(): void => { setGetPrint(true); }}>
            <div className='menu-item'>
              <PrintIcon />
              <p className='menu-item-title'>Print</p>
            </div>
          </div>
          <div className='sidemenu-menu-div' aria-hidden='true' onClick={(): void => { setOpenDeleteChecklistDialog(true); }}>
            <div className='menu-item'>
              <DeleteIcon />
              <p className='menu-item-title'>Delete</p>
            </div>
          </div>
          <div className='sidemenu-people-div'>
            <p className='heading'>People</p>
            <div className='sidemenu-assigne-div'>
              {data.assignees.map((singleAssignee) => (
                <div className='sidemenu-assigne-item' key={singleAssignee.id}>
                  <Avatar alt={singleAssignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${singleAssignee.avatar}`} />
                </div>
              ))}
            </div>
            <div>
              <div className='sidemenu-menu-div' aria-hidden='true' onClick={(e: React.MouseEvent<HTMLDivElement>): void => { setSideMenuAssigneePopupAncherEl(e.currentTarget); }}>
                <div className='menu-item'>
                  <PersonAddIcon />
                  <p className='menu-item-title'>Assign users</p>
                </div>
              </div>
              <Popover
                open={Boolean(sideMenuAssigneePopupAncherEl)}
                anchorEl={sideMenuAssigneePopupAncherEl}
                onClose={(): void => { setSideMenuAssigneePopupAncherEl(null); }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className='assignee-popup-wrapper' style={{ width: '250px' }}>
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
                      <div className='assignee-inner-div cursor-pointer' key={item.id} aria-hidden='true' onClick={(): void => { addAssignee(item); }}>
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
            </div>
          </div>
          <div className='sidemenu-duedate-div'>
            <p className='heading'>Due date</p>
            <div
              className={checklistDuedateError ? 'duedate-error-input' : 'duedate-noterror-input'}
              aria-hidden='true'
              onClick={(e: React.MouseEvent<HTMLDivElement>): void => { setDueDatePopupAncherEl(e.currentTarget); }}
            >
              <InputField
                name='name'
                type='text'
                value={sideMenuDueDateAndTime}
                placeholder='Date'
                endAdornment={checklistDuedateError ? <DueDateErrorIcon /> : <EventIcon />}
              />
            </div>
            {checklistDuedateError && <span className='duedate-error'>The due date must be in the future</span> }
            <Popover
              open={Boolean(dueDatePopupAncherEl)}
              anchorEl={dueDatePopupAncherEl}
              onClose={(): void => { setDueDatePopupAncherEl(null); }}
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
                      value={sideMenuDueDate}
                      error={false}
                    />
                  </div>
                  <div className='time-select-div' style={{ width: '50%', marginTop: '3px' }}>
                    <SelectInput
                      value={sideMenuDueTime}
                      name='time'
                      onChange={(obj: SelectChangeEvent): void => { setSideMenuDueTime(obj.target.value); }}
                      options={TimeSlots}
                      showPleaseSelect={false}
                      haveMarginBottom={false}
                      label='Time'
                    />
                  </div>
                </div>
                <Calendar
                  color='#00CFA1'
                  date={sideMenuDueDate !== '' ? new Date(sideMenuDueDate) : undefined}
                  onChange={(newDate: Date): void => { setSideMenuDueDate(moment(newDate).format('MM/DD/YYYY')); }}
                />
                <div className='dueDatebtndiv'>
                  <Button onClick={(): void => { handleRemoveSideMenuDueDateAndTime(); }} color='primary' startIcon={<DeleteIcon />} style={{ color: '#00CFA1', textTransform: 'inherit' }}>Remove</Button>
                  <Button onClick={(): void => { handleSideMenuDueDateAndTime(); }} className='durdate-save-btn' style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' startIcon={<SaveIcon />} variant='contained'>Save</Button>
                </div>
              </div>
            </Popover>
          </div>
          <div className='sidemenu-sharelink-div'>
            <div className='share-link-wrapper'>
              <p className='heading'>Share link</p>
              <Switch
                id=' share_link'
                name=' share_link'
                checked={shareLink}
                value={shareLink}
                onChange={(): void => {
                  setShareLink(!shareLink);
                }}
                color='primary'
                className='heading'
              />
            </div>
            {shareLink
            && (
              <div aria-hidden='true' onClick={(): void => { copyCodeToClipboard(); }}>
                <InputField
                  name='name'
                  type='text'
                  value={`${process.env.REACT_APP_BASE_URL}building/view-checklist/${encrypt(currentBuilding.id)}/${data.id}`}
                  endAdornment={<FileCopyIcon />}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={openDeleteChecklistDialog} onClose={(): void => { setOpenDeleteChecklistDialog(false); }} aria-labelledby='form-dialog-title'>
        <DialogContent style={{ width: 500, padding: '24px' }}>
          <div className='dialog-heading'>Delete this Checklist?</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            Checklist will be deleted and irrecoverable!
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => { setOpenDeleteChecklistDialog(false); }} color='primary' style={{ color: '#00CFA1', textTransform: 'inherit' }}>Cancel</Button>
          <Button onClick={(): void => { setOpenDeleteChecklistDialog(false); setSnackbarMessage(`Checklist '${data.name}' was deleted`); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' variant='contained'>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarMessage !== ''}
        autoHideDuration={!snackbarMessage.includes("Checklist '") ? 2000 : null}
        onClose={(): void => { setSnackbarMessage(''); }}
        message={snackbarMessage}
        action={(
          <div>
            {snackbarMessage.includes("Checklist '") && (
              <>
                <Button color='secondary' style={{ color: '#00CFA1' }} size='small' onClick={(): void => { setSnackbarMessage(''); }}>
                  UNDO
                </Button>
                <IconButton size='small' aria-label='close' color='inherit' onClick={(): void => { deleteChecklist(); }}>
                  <CloseIcon fontSize='small' />
                </IconButton>
              </>
            )}
          </div>
        )}
      />
    </>
  );
}
