/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
  Avatar, AvatarGroup, IconButton,
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from '@mui/styles';
import moment from 'moment';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArchiveIcon from '@mui/icons-material/Archive';
import PrintIcon from '@mui/icons-material/Print';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import type {
  Iresponse, Iassignee, IDuplicateChecklist,
} from './types';

interface IChecklistCard {
  item: Iresponse;
  copyCodeToClipboard: (id: number | string) => void;
  onDuplicateChecklist: (data: IDuplicateChecklist) => void;
  archiveChecklist: (id: number | string) => void;
  setOpenDeleteChecklistDialog: (status: boolean) => void;
  setFocusedChecklistId: (task: number | string) => void;
}

function HomeIcon(): JSX.Element {
  return (
    <svg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M7.98438 6.98438H12.0156C12.0156 6.45312 11.8125 6 11.4062 5.625C11 5.21875 10.5312 5.01562 10 5.01562C9.46875 5.01562 9 5.21875 8.59375 5.625C8.1875 6 7.98438 6.45312 7.98438 6.98438ZM16.9844 6.28125L19.9844 9H16.9844V17.0156H12.0156V11.0156H7.98438V17.0156H3.01562V9H0.015625L10 0L13.9844 3.60938V0.984375H16.9844V6.28125Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 7,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: '#eeeeee',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
}))(LinearProgress);

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
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    value: 3,
    selected: false,
    label: 'Completed',
    color: '#4CAF50',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  {
    name: 'Archive',
    value: 4,
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
];

export default function ChecklistCard(props: IChecklistCard): JSX.Element {
  const {
    item, copyCodeToClipboard, onDuplicateChecklist, archiveChecklist, setOpenDeleteChecklistDialog, setFocusedChecklistId,
  } = props;
  const navigate = useNavigate();
  const currentStatus = statusList[item.status - 1];
  return (
    <div className='checklist-card-wrapper'>
      <div className='d-flex justify-content-between align-items-center'>
        <p
          className='title'
          aria-hidden='true'
          onClick={(): void => {
            navigate(`/workspace/view-checklist/${item.id}`, { state: item });
          }}
        >
          {item.name}
        </p>
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <PopupState variant='popper' popupId='demo-popup-popper'>
            {(popupState): JSX.Element => (
              <div>
                <IconButton {...bindToggle(popupState)}>
                  <MoreHorizIcon />
                </IconButton>
                <Popper {...bindPopper(popupState)} transition>
                  {({ TransitionProps }): JSX.Element => (
                    <ClickAwayListener
                      onClickAway={(): void => {
                        popupState.close();
                      }}
                    >
                      <Fade {...TransitionProps} timeout={350}>
                        <Paper className='checklist-list-popover'>
                          <div
                            className='chart-btn'
                            onClick={(): void => {
                              navigate(`/workspace/view-checklist/${item.id}`, { state: item });
                              popupState.close();
                            }}
                            aria-hidden='true'
                          >
                            <VisibilityIcon className='edit-delete-icon' />
                            <span className='edit-delete-text '> View</span>
                          </div>
                          <div
                            className='chart-btn'
                            onClick={(): void => {
                              copyCodeToClipboard(item.id);
                              popupState.close();
                            }}
                            aria-hidden='true'
                          >
                            <ShareIcon className='edit-delete-icon' />
                            <span className='edit-delete-text '> Share</span>
                          </div>
                          <div
                            className='chart-btn'
                            onClick={(): void => {
                              const rowData = {
                                name: item.name,
                                template: item.template,
                              };
                              onDuplicateChecklist(rowData);
                              popupState.close();
                            }}
                            aria-hidden='true'
                          >
                            <FileCopyIcon className='edit-delete-icon' />
                            <span className='edit-delete-text '> Duplicate</span>
                          </div>
                          <div
                            className='chart-btn'
                            onClick={(): void => {
                              item.isPrint = true;
                              navigate(`/workspace/view-checklist/${item.id}`, { state: item });
                              popupState.close();
                            }}
                            aria-hidden='true'
                          >
                            <PrintIcon className='edit-delete-icon' />
                            <span className='edit-delete-text '> Print</span>
                          </div>
                          <div
                            className='chart-btn'
                            onClick={(): void => {
                              archiveChecklist(item.id);
                              popupState.close();
                            }}
                            aria-hidden='true'
                          >
                            <ArchiveIcon className='edit-delete-icon' />
                            <span className='edit-delete-text '> Archive</span>
                          </div>
                          <div
                            className='chart-btn'
                            onClick={(): void => {
                              setOpenDeleteChecklistDialog(true);
                              setFocusedChecklistId(item.id);
                              popupState.close();
                            }}
                            aria-hidden='true'
                          >
                            <DeleteIcon className='edit-delete-icon' />
                            <span className='edit-delete-text '>
                              Delete
                            </span>
                          </div>
                        </Paper>
                      </Fade>
                    </ClickAwayListener>
                  )}
                </Popper>
              </div>
            )}
          </PopupState>
        </div>
      </div>
      <div className='d-flex justify-center-center align-items-center mt-4'>
        <div
          style={{
            background: currentStatus.background,
            color: currentStatus.color,
          }}
          className='single-tag-global'
        >
          {' '}
          {currentStatus.name}
        </div>
      </div>
      <div className='d-flex align-items-center mt-4'>
        <HomeIcon />
        <p className='ms-4'>{item.building.address}</p>
      </div>
      <div className='d-flex align-items-center mt-4'>
        <PersonIcon />
        <div className='ms-4'>
          {item.assignees.length > 0
            ? (
              <AvatarGroup max={3} className='flex-row-reverse' style={{ width: 'fit-content' }}>
                {item.assignees.map((assignee: Iassignee) => (
                  <Avatar key={assignee.id} alt={assignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
                ))}
              </AvatarGroup>
            )
            : '-' }
        </div>
      </div>
      <div className='d-flex align-items-center mt-4'>
        <CalendarMonthIcon />
        <p className='ms-4'>
          {' '}
          {item.due_date !== null ? moment(item.due_date).format('LLL') : '-'}
        </p>
      </div>
      <div className='task-completed-div mt-4'>
        <div className={`progress-bar-div${(item.task_completed === item.total_tasks) && item.task_completed !== 0 ? '-completed' : ''}`} style={{ width: '100%' }}>
          <BorderLinearProgress variant='determinate' value={Math.floor((item.task_completed / item.total_tasks) * 100)} />
        </div>
        <div style={{ marginLeft: '8px', minWidth: '40px' }}>
          {`${item.task_completed} / ${item.total_tasks}`}
        </div>
      </div>
    </div>
  );
}
