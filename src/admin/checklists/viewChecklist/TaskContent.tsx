/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from 'react';
import {
  Checkbox, Button, Popover, Avatar, Tooltip, Radio, RadioGroup, FormControlLabel,
} from '@mui/material';
import { StyledMenu, StyledMenuItem } from 'shared-components/components/StyledComponent';
import InputField from 'shared-components/inputs/InputField';
import SelectInput from 'shared-components/inputs/SelectInput';
import moment from 'moment';
import { Multiselect } from 'multiselect-react-dropdown';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import DescriptionIcon from '@mui/icons-material/Description';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import GetAppIcon from '@mui/icons-material/GetApp';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import DoneIcon from '@mui/icons-material/Done';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import { Editor } from '@tinymce/tinymce-react';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Notifications, { notify } from 'react-notify-toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Calendar } from 'react-date-range';
import CustomLoader from 'shared-components/components/CustomLoader';
import TaskComment from './TaskComment';
// import { green } from '@mui/material/colors';
import type {
  Itasks, ISendEmailData, IContent, Iresponse, Icomments, IchecklistCompleteStatus,
} from '../types';
import type {
  IHandleSubTask, IHandleTaskEmail, IHandleTaskForm, ISelectedItem,
} from './types';

interface ITaskContent {
  focusedTask: Itasks | null;
  setFocusedTask: (task: Itasks) => void;
  errorChecklistsIds: number[];
  isStopIndex: number;
  focusedTaskIndex: number;
  data: Iresponse;
  handleChecklistTaskCompleted: (checklistCompleteStatus: IchecklistCompleteStatus) => void;
  setErrorChecklistsIds: (ids: number[]) => void;
  setIsStopIndex: (index: number) => void;
  handleFocusTask: (selectedTask: Itasks, index: number) => void;
  commentForEdit: Icomments | null;
  setCommentForEdit: (val: Icomments | null) => void;
  showSendEmailIndex: number;
  setShowSendEmailIndex: (index: number) => void;
  showCleanedSendEmailFields: boolean;
  setShowCleanedSendEmailFields: (status: boolean) => void;
}
function FilledTickIcon(): JSX.Element {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M7.98438 15.0156L16.9844 6.01562L15.5781 4.5625L7.98438 12.1562L4.42188 8.59375L3.01562 10L7.98438 15.0156ZM2.92188 2.96875C4.89062 1 7.25 0.015625 10 0.015625C12.75 0.015625 15.0938 1 17.0312 2.96875C19 4.90625 19.9844 7.25 19.9844 10C19.9844 12.75 19 15.1094 17.0312 17.0781C15.0938 19.0156 12.75 19.9844 10 19.9844C7.25 19.9844 4.89062 19.0156 2.92188 17.0781C0.984375 15.1094 0.015625 12.75 0.015625 10C0.015625 7.25 0.984375 4.90625 2.92188 2.96875Z' fill='#4CAF50' />
    </svg>
  );
}
function ExpendMoreIcon(): JSX.Element {
  return (
    <svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M8.44531 0.433594L9.5 1.48828L5 5.98828L0.5 1.48828L1.55469 0.433594L5 3.87891L8.44531 0.433594Z' fill='#00CFA1' />
    </svg>
  );
}
function ExpendLessIcon(): JSX.Element {
  return (
    <svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M5 0.0117188L9.5 4.51172L8.44531 5.56641L5 2.12109L1.55469 5.56641L0.5 4.51172L5 0.0117188Z' fill='#00CFA1' />
    </svg>
  );
}
function EmailInputIcon(): JSX.Element {
  return (
    <svg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M18.0156 5.01562V3L10 8.01562L1.98438 3V5.01562L10 9.98438L18.0156 5.01562ZM18.0156 0.984375C18.5469 0.984375 19 1.1875 19.375 1.59375C19.7812 2 19.9844 2.46875 19.9844 3V15C19.9844 15.5312 19.7812 16 19.375 16.4062C19 16.8125 18.5469 17.0156 18.0156 17.0156H1.98438C1.45312 17.0156 0.984375 16.8125 0.578125 16.4062C0.203125 16 0.015625 15.5312 0.015625 15V3C0.015625 2.46875 0.203125 2 0.578125 1.59375C0.984375 1.1875 1.45312 0.984375 1.98438 0.984375H18.0156Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}
function InputErrorIcon(): JSX.Element {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M10.9844 10.9844V4.98438H9.01562V10.9844H10.9844ZM10.9844 15.0156V13H9.01562V15.0156H10.9844ZM2.92188 2.96875C4.89062 1 7.25 0.015625 10 0.015625C12.75 0.015625 15.0938 1 17.0312 2.96875C19 4.90625 19.9844 7.25 19.9844 10C19.9844 12.75 19 15.1094 17.0312 17.0781C15.0938 19.0156 12.75 19.9844 10 19.9844C7.25 19.9844 4.89062 19.0156 2.92188 17.0781C0.984375 15.1094 0.015625 12.75 0.015625 10C0.015625 7.25 0.984375 4.90625 2.92188 2.96875Z' fill='#C62828' />
    </svg>
  );
}
export default function TaskContent(props: ITaskContent): JSX.Element {
  const {
    focusedTask, setFocusedTask, errorChecklistsIds, isStopIndex, focusedTaskIndex, data, handleChecklistTaskCompleted, setErrorChecklistsIds, setIsStopIndex, handleFocusTask, commentForEdit, setCommentForEdit, showSendEmailIndex, setShowSendEmailIndex, showCleanedSendEmailFields, setShowCleanedSendEmailFields,
  } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const [emailReceiver, setEmailReceiver] = useState<string>('');
  const [openSendEmailDialog, setOpenSendEmailDialog] = useState<boolean>(false);
  const [sendEmailId, setSendEmailId] = useState<number>();
  const [multiSelectId, setMultiSelectId] = useState<number>();
  const [selectedFileId, setSelectedFileId] = useState<number>();
  const [formFileLoader, setFormFileLoader] = useState<boolean>(false);
  const [openRemoveFormFileDialog, setOpenRemoveFormFileDialog] = useState<boolean>(false);
  const [formDatePopupAncherEl, setFormDatePopupAncherEl] = useState<HTMLDivElement | null>(null);
  const [formDateId, setFormDateId] = useState<number>();
  const [formDate, setFormDate] = useState<string>('');
  const [formTime, setFormTime] = useState<string>('');
  const [activityShow, setActivityShow] = useState<string>('comments');
  const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLDivElement | null>(null);
  const [singleCommentId, setSingleCommentId] = useState<number>(-1);

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

  // eslint-disable-next-line no-useless-escape
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // eslint-disable-next-line no-useless-escape
  const websiteValidation = /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

  const { mutate: handleSubTask } = useMutation(
    async (payload: IHandleSubTask) => axios({
      url: `/api/checklist-subtask-completed/${payload.id}/`,
      method: 'patch',
      data: {
        is_completed: !payload.status,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
      },
    },
  );
  const handleSendEmailForm = (e: React.ChangeEvent<HTMLInputElement> | string, index: number): void => {
    if (focusedTask !== null) {
      const newContent = focusedTask.content.map((item, indx) => {
        if (index === indx && item.sendEmailData !== undefined) {
          if (typeof e === 'string') {
            item.sendEmailData.body = e;
          } else {
            item.sendEmailData[e.target.name as keyof ISendEmailData] = e.target.value;
          }
        }
        return item;
      });
      setFocusedTask({ ...focusedTask, content: newContent });
    }
  };
  const handleSendEnailClickAway = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowCleanedSendEmailFields(true);
    }
  };
  const { mutate: handleSendEmail } = useMutation(
    async (id: number | undefined) => axios({
      url: '/api/checklist-send-email/',
      method: 'post',
      data: {
        email_id: id,
      },
    }),
    {
      onSuccess: async (res) => {
        if (res.status === 201 || res.status === 200) {
          await queryClient.invalidateQueries('get/checklist').then();
          setOpenSendEmailDialog(false);
          enqueueSnackbar('Email send Successfully!');
        } else {
          enqueueSnackbar('Error in Sending Email');
        }
      },
    },
  );
  const handleValidateSendEmail = (email_id: number | undefined, to: string | undefined, cc: string | undefined, bcc: string | undefined): void => {
    let error = false;
    if (cc !== undefined && cc !== '' && !emailValidation.test(cc)) {
      notify.show('CC Should be an Email Fromat', 'error', 2000);
      error = true;
    } else if (bcc !== undefined && bcc !== '' && !emailValidation.test(bcc)) {
      notify.show('BCC Should be an Email Fromat', 'error', 2000);
      error = true;
    }
    if (!error && to !== undefined) {
      setEmailReceiver(to);
      setOpenSendEmailDialog(true);
      setSendEmailId(email_id);
    }
  };
  const { mutate: handleTaskEmail } = useMutation(
    async (payload: IHandleTaskEmail) => axios({
      url: `/api/checklist-email/${payload.id}/`,
      method: 'patch',
      data: {
        [payload.name]: payload.value,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
      },
    },
  );
  const handleTaskFormValue = (index: number, value: string): void => {
    if (focusedTask !== null) {
      const newContent = focusedTask.content.map((item, indx) => {
        if (index === indx) {
          item.value = value;
        }
        return item;
      });
      setFocusedTask({ ...focusedTask, content: newContent });
    }
  };
  const { mutate: handleTaskForm } = useMutation(
    async (payload: IHandleTaskForm) => axios({
      url: `/api/checklist-form/${payload.id}/`,
      method: 'patch',
      data: {
        value: payload.value,
      },
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
        setFormFileLoader(false);
        setOpenRemoveFormFileDialog(false);
      },
    },
  );
  const onSelect = (selectedList: ISelectedItem[]): void => {
    handleTaskForm({ id: multiSelectId, value: selectedList });
  };
  const onRemove = (selectedList: ISelectedItem[]): void => {
    handleTaskForm({ id: multiSelectId, value: selectedList });
  };
  const handleFileClick = (fileId: string): void => {
    document.getElementById(fileId)?.click();
  };
  async function file2Base64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => { resolve(reader.result !== null && typeof reader.result === 'string' ? reader.result.toString() : ''); };
      reader.onerror = (error): void => { reject(error); };
    });
  }
  async function onProcessAttachment(addedFile: File, fileitem: IContent): Promise<string> {
    setSelectedFileId(fileitem.id);
    setFormFileLoader(true);
    const base64 = await file2Base64(addedFile).then((res): string => {
      const obj = {
        file: res,
        file_name: addedFile.name,
      };
      handleTaskForm({ id: fileitem.id, value: obj });
      return res;
    });
    return base64;
  }
  const handleRemoveFormDateAndTime = (): void => {
    setFormDate('');
    setFormTime('');
    setFormDatePopupAncherEl(null);
    handleTaskForm({ id: formDateId, value: '' });
  };
  const handleFormDateAndTime = (): void => {
    if (formDate !== '') {
      if (formTime !== '') {
        handleTaskForm({ id: formDateId, value: new Date(`${formDate} ${formTime}`) });
      } else {
        handleTaskForm({ id: formDateId, value: new Date(`${formDate}`) });
      }
    }
    setFormDate('');
    setFormTime('');
    setFormDatePopupAncherEl(null);
  };
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!error) {
      const index = errorChecklistsIds.indexOf(id);
      errorChecklistsIds.splice(index, 1);
      handleChecklistTaskCompleted({ checklistStatus: !status, completeId: id });
      setErrorChecklistsIds(errorChecklistsIds);
      setIsStopIndex(-1);
    }
  };
  const handleEditComment = (commentId: number): void => {
    if (focusedTask !== null) {
      const commnetforId = focusedTask.comments.filter((c) => c.id === commentId);
      if (commnetforId.length > 0) {
        setCommentForEdit(commnetforId[0]);
        setCommentAnchorEl(null);
      }
    }
  };
  const { mutate: removeChecklistTaskComment } = useMutation(
    async (id: number) => axios({
      url: `/api/checklist-task-comment/${id}/`,
      method: 'DELETE',
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get/checklist').then();
        setCommentAnchorEl(null);
        enqueueSnackbar('Comment deleted successfully');
      },
    },
  );

  return (
    <div className='task-form-wrapper'>
      {focusedTask !== null && focusedTask.content.length > 0 && focusedTask.content.map((content, index) => (
        <div>
          {content.type === 'text'
            ? (
              <div className='task-form-item'>
                <div className='editor-div'>{parse(content.value && content.value !== null ? content.value : '')}</div>
              </div>
            ) : content.type === 'subTask'
              ? (
                <div className={errorChecklistsIds.includes(focusedTask.id) && content.subTasks !== undefined && content.subTasks.some((element) => { if (!element.is_completed) { return true; } return false; }) ? 'task-form-item-error' : 'task-form-item'}>
                  {content.subTasks !== undefined ? content.subTasks.map((subtask, subTaskIndex) => (
                    <div className={subtask.is_completed ? 'subItems-groups' : ''} style={{ display: 'flex', alignItems: 'center' }}>
                      <p>{subTaskIndex + 1}</p>
                      <Checkbox
                        checked={subtask.is_completed}
                        color={errorChecklistsIds.includes(focusedTask.id) && !subtask.is_completed ? 'error' : 'primary'}
                        onChange={(): void => { handleSubTask({ id: subtask.id, status: subtask.is_completed }); }}
                      />
                      <p style={{ textDecoration: subtask.is_completed ? 'line-through' : 'none', opacity: subtask.is_completed ? '0.4' : '1' }}>{subtask.value}</p>
                    </div>
                  )) : null}
                  {(errorChecklistsIds.includes(focusedTask.id) && content.subTasks !== undefined && content.subTasks.some((element) => { if (!element.is_completed) { return true; } return false; })) && <span className='duedate-error'>All subtasks are required</span> }
                </div>
              ) : content.type === 'file'
                ? (
                  <div className='task-form-item'>
                    <div className='file-div'>
                      <DescriptionIcon />
                      <div style={{ width: '100%' }}>
                        <h6>{content.files !== undefined && content.files.file_name.length > 25 ? `${content.files.file_name.slice(0, 25)}...` : content.files?.file_name}</h6>
                        <p>PDF</p>
                      </div>
                      <a className='file-download-icon' href={`${process.env.REACT_APP_IMAGE_URL}${content.files !== undefined ? content.files.file : null}`}><GetAppIcon /></a>
                    </div>
                    {content.description !== undefined && <p>{content.description}</p>}
                  </div>
                ) : content.type === 'sendEmail'
                  ? (
                    <div className='task-form-item'>
                      {content.email_sent === true
                    && (
                      <div className='sended-email-div'>
                        <div className='receiver-details'>
                          <FilledTickIcon />
                          <p>
                            Email was sent to
                            {' '}
                            {content.sendEmailData !== undefined ? content.sendEmailData.cleaned_to : ''}
                          </p>
                        </div>
                        {showSendEmailIndex !== index
                          ? (
                            <div className='expend-div' aria-hidden='true' onClick={(): void => { setShowSendEmailIndex(index); }}>
                              <ExpendMoreIcon />
                              <p>Expand less</p>
                            </div>
                          )
                          : (
                            <div className='expend-div' aria-hidden='true' onClick={(): void => { setShowSendEmailIndex(-1); }}>
                              <ExpendLessIcon />
                              <p>Expand more</p>
                            </div>
                          )}
                      </div>
                    )}
                      {showSendEmailIndex !== index
                    && (
                      <>
                        {showCleanedSendEmailFields || (content.email_sent !== undefined && content.email_sent)
                          ? (
                            <div style={{ cursor: content.email_sent !== undefined && !content.email_sent ? 'pointer' : 'auto' }} aria-hidden='true' onClick={(): void => { setShowCleanedSendEmailFields(false); }}>
                              <div className='sendEmail-cleanField-wrapper'>
                                <h6>To</h6>
                                <div className='cleaned-text'>{ content.sendEmailData !== undefined ? content.sendEmailData.cleaned_to : ''}</div>
                              </div>
                              <div className='sendEmail-cleanField-wrapper'>
                                <h6>Cc</h6>
                                <div className='cleaned-text'>{content.sendEmailData !== undefined ? content.sendEmailData.cleaned_cc : ''}</div>
                              </div>
                              <div className='sendEmail-cleanField-wrapper'>
                                <h6>Bcc</h6>
                                <div className='cleaned-text'>{content.sendEmailData !== undefined ? content.sendEmailData.cleaned_bcc : ''}</div>
                              </div>
                              <div className='sendEmail-cleanField-wrapper'>
                                <h6>Subject</h6>
                                <div className='cleaned-text'>{content.sendEmailData !== undefined ? content.sendEmailData.cleaned_subject : ''}</div>
                              </div>
                              <div className='sendEmail-cleanField-wrapper'>
                                <h6>Body</h6>
                                <div className='cleaned-text'>{content.sendEmailData !== undefined ? parse(content.sendEmailData.cleaned_body) : ''}</div>
                              </div>
                            </div>
                          )
                          : (
                            <div aria-hidden='true' onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleSendEnailClickAway(e); }}>
                              <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                <InputField
                                  id='to'
                                  name='to'
                                  type='text'
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailForm(e, index); }}
                                  label='To'
                                  value={content.sendEmailData === undefined ? '' : content.sendEmailData.to}
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskEmail({ id: content.id, name: e.target.name, value: e.target.value }); }}
                                  error={false}
                                  required={content.is_required}
                                />
                              </div>
                              <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                <InputField
                                  id='cc'
                                  name='cc'
                                  type='text'
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailForm(e, index); }}
                                  label='CC'
                                  value={content.sendEmailData === undefined ? '' : content.sendEmailData.cc}
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskEmail({ id: content.id, name: e.target.name, value: e.target.value }); }}
                                  error={false}
                                  required={content.is_required}
                                />
                              </div>
                              <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                <InputField
                                  id='bcc'
                                  name='bcc'
                                  type='text'
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailForm(e, index); }}
                                  label='Bcc'
                                  value={content.sendEmailData === undefined ? '' : content.sendEmailData.bcc}
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskEmail({ id: content.id, name: e.target.name, value: e.target.value }); }}
                                  error={false}
                                  required={content.is_required}
                                />
                              </div>
                              <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                <InputField
                                  id='subject'
                                  name='subject'
                                  type='text'
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleSendEmailForm(e, index); }}
                                  label='Subject'
                                  value={content.sendEmailData === undefined ? '' : content.sendEmailData.subject}
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskEmail({ id: content.id, name: e.target.name, value: e.target.value }); }}
                                  error={false}
                                  required={content.is_required}
                                />
                              </div>
                              {/* {this.state.editorLoder && <div><Loader /></div>} */}
                              <Editor
                                apiKey='1y7zut3pxyomlx5vhlj7wuh2q7r7sd4w8x7oevrxn05o07fq'
                                //   onLoadContent={() => this.setState({ editorLoder: false })}
                                init={{
                                  height: 150,
                                  branding: false,
                                  menubar: false,
                                  skin: 'material-outline',
                                  content_css: 'material-outline',
                                  plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help ',
                                  ],
                                  toolbar: 'undo redo | styleselect | fontsizeselect | backcolor | bold italic underline|  bullist numlist | outdent indent',
                                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;} ',
                                }}
                                value={content.sendEmailData === undefined ? '' : content.sendEmailData.body}
                                onBlur={(): void => { handleTaskEmail({ id: content.id, name: 'body', value: content.sendEmailData !== undefined ? content.sendEmailData.body : '' }); }}
                                onEditorChange={(editorData): void => { handleSendEmailForm(editorData, index); }}
                              />
                            </div>
                          )}
                        {content.email_sent !== undefined && !content.email_sent
                    && (
                      <div aria-hidden='true' className={content.sendEmailData !== undefined && emailValidation.test(content.sendEmailData.cleaned_to) && content.sendEmailData.subject !== '' && content.sendEmailData.body !== '' ? 'send-email-div' : 'send-email-disabled-div'} onClick={content.sendEmailData !== undefined && emailValidation.test(content.sendEmailData.cleaned_to) && content.sendEmailData.subject !== '' && content.sendEmailData.body !== '' ? (): void => { handleValidateSendEmail(content.id, content.sendEmailData?.cleaned_to, content.sendEmailData?.cleaned_cc, content.sendEmailData?.cleaned_bcc); } : (): void => {}}>
                        <EmailIcon />
                        <p>Send email</p>
                      </div>
                    )}
                      </>
                    )}
                    </div>
                  ) : content.type === 'form'
                    ? content.form_type === 'email' ? (
                      <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '' || !emailValidation.test(content.value)) ? 'task-form-item-error' : 'task-form-item'}>
                        <div className='email-item-wrap website-field'>
                          <InputField
                            id='email'
                            name='email'
                            type='email'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleTaskFormValue(index, e.target.value); }}
                            placeholder={content.label}
                            value={content.value && content.value !== null ? content.value : ''}
                            startAdornment={<EmailInputIcon />}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskForm({ id: content.id, value: e.target.value }); }}
                            error={!!(errorChecklistsIds.includes(focusedTask.id) && (content.value === '' || !emailValidation.test(content.value)))}
                            endAdornment={errorChecklistsIds.includes(focusedTask.id) && (content.value === '' || !emailValidation.test(content.value)) ? <InputErrorIcon /> : null}
                            required={content.is_required}
                          />
                          {errorChecklistsIds.includes(focusedTask.id) && content.value === '' ? <span className='duedate-error'>This field is required</span>
                            : errorChecklistsIds.includes(focusedTask.id) && !emailValidation.test(content.value) && content.value !== '' ? <span className='duedate-error'>This is not a valid Email</span> : null}
                        </div>
                      </div>
                    ) : content.form_type === 'shortText' ? (
                      <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                        <div className='email-item-wrap'>
                          <InputField
                            id='shortText'
                            name='name'
                            type='text'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleTaskFormValue(index, e.target.value); }}
                            placeholder={content.label}
                            value={content.value && content.value !== null ? content.value : ''}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskForm({ id: content.id, value: e.target.value }); }}
                            error={!!(errorChecklistsIds.includes(focusedTask.id) && (content.value === ''))}
                            endAdornment={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? <InputErrorIcon /> : null}
                            required={content.is_required}
                          />
                          {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                          && <span className='duedate-error'>This field is required</span>}
                        </div>
                      </div>
                    ) : content.form_type === 'longText' ? (
                      <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                        <div className='email-item-wrap'>
                          <InputField
                            id='longText'
                            name='name'
                            type='text'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleTaskFormValue(index, e.target.value); }}
                            placeholder={content.label}
                            value={content.value && content.value !== null ? content.value : ''}
                            multiline
                            rows={2}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskForm({ id: content.id, value: e.target.value }); }}
                            error={!!(errorChecklistsIds.includes(focusedTask.id) && (content.value === ''))}
                            endAdornment={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? <InputErrorIcon /> : null}
                            required={content.is_required}
                          />
                          {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                            && <span className='duedate-error'>This field is required</span>}
                        </div>
                      </div>
                    ) : content.form_type === 'dropdown'
                      ? (
                        <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                          <div className='item-wrap'>
                            <SelectInput
                              name='dropdown'
                              value={content.selected_option === undefined || content.selected_option === null ? '' : content.selected_option.value}
                              onChange={(obj: SelectChangeEvent): void => { handleTaskForm({ id: content.id, value: obj.target.value }); }}
                              options={content.options ? content.options.map((option) => ({
                                value: option.value === undefined ? '' : option.value,
                                name: option.label,
                              })) : []}
                              label={content.label === undefined ? '' : content.label}
                              haveMarginBottom={false}
                              showPleaseSelect={false}
                            />
                            {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                            && <span className='duedate-error'>This field is required</span>}
                          </div>
                        </div>
                      ) : content.form_type === 'radio'
                        ? (
                          <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                            <div className='item-wrap'>
                              <div>
                                <div>{content.label === undefined ? '' : content.label}</div>
                                <RadioGroup
                                  // aria-labelledby='demo-radio-buttons-group-label'
                                  name={content.label_key}
                                  value={content.selected_option === undefined || content.selected_option === null ? '' : content.selected_option.value}
                                  onChange={(obj: SelectChangeEvent): void => { handleTaskForm({ id: content.id, value: obj.target.value }); }}
                                >
                                  {content.options?.map((option) => (
                                    <FormControlLabel
                                      className={option.value === content.selected_option?.value ? 'subItems-groups' : ''}
                                      value={option.value}
                                      color='primary'
                                      control={(
                                        <Radio color='primary' />
                                      )}
                                      label={option.label}
                                    />
                                  ))}
                                </RadioGroup>
                              </div>
                              {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                            && <span className='duedate-error'>This field is required</span>}
                            </div>
                          </div>
                        )
                        : content.form_type === 'multiChoice'
                          ? (
                            <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                              <div className='item-wrap' aria-hidden='true' onClick={(): void => { setMultiSelectId(content.id); }}>
                                <Multiselect
                                  options={content.options ? content.options.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                  })) : []}
                                  closeIcon='circle'
                                  selectedValues={content.selected_option}
                                  onSelect={onSelect}
                                  onRemove={onRemove}
                                  displayValue='label'
                                  placeholder={content.selected_option !== undefined && content.selected_option === null ? 'Type to filter options' : content.label}
                                />
                                {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                            && <span className='duedate-error'>This field is required</span>}
                              </div>
                            </div>
                          ) : content.form_type === 'fileUpload'
                            ? (
                              <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                {formFileLoader && selectedFileId === content.id ? <div><CustomLoader /></div>
                                  : (
                                    <div className='item-wrap'>
                                      {content.file
                                        ? (
                                          <div className='file-div' style={{ width: '100%' }}>
                                            <DescriptionIcon />
                                            <div style={{ width: '100%' }}>
                                              <h6>{content.file.file_name}</h6>
                                              <p>PDF</p>
                                            </div>
                                            <div className='file-icons-div'>
                                              <a style={{ textDecoration: 'none', margin: '5px 5px 0px 0px' }} href={`${process.env.REACT_APP_IMAGE_URL}${content.file.file}`}><GetAppIcon /></a>
                                              <div className='cursor-pointer' aria-hidden='true' onClick={(): void => { setOpenRemoveFormFileDialog(true); setSelectedFileId(content.id); }}><CloseIcon /></div>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <p className='file-label'>{content.label !== undefined && content.label ? content.label : 'Untitled file upload'}</p>
                                            <div className='file-input-wrap'>
                                              <input
                                                type='file'
                                                name='file'
                                                id={`selectImage${content.id}`}
                                                style={{ display: 'none' }}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                  if (e.target.files === null) return;
                                                  onProcessAttachment(e.target.files[0], content).then(
                                                    () => {},
                                                    () => {},
                                                  );
                                                }}
                                              />
                                              <div className='file-input-div' aria-hidden='true' onClick={(): void => { handleFileClick(`selectImage${content.id}`); }}>
                                                <FileUploadIcon />
                                                <p>Upload file</p>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                            && <span className='duedate-error'>This field is required</span>}
                                    </div>
                                  )}
                              </div>
                            ) : content.form_type === 'website'
                              ? (
                                <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '' || !websiteValidation.test(content.value)) ? 'task-form-item-error' : 'task-form-item'}>
                                  <div className='email-item-wrap website-field'>
                                    <InputField
                                      id='website'
                                      name='name'
                                      type='text'
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleTaskFormValue(index, e.target.value); }}
                                      placeholder='Type URL here'
                                      label={content.label}
                                      startAdornment={<LanguageIcon />}
                                      value={content.value && content.value !== null ? content.value : ''}
                                      onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskForm({ id: content.id, value: e.target.value }); }}
                                      error={!!(errorChecklistsIds.includes(focusedTask.id) && (content.value === ''))}
                                      endAdornment={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? <InputErrorIcon /> : null}
                                      required={content.is_required}
                                    />
                                    {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                                      ? <span className='duedate-error'>This field is required</span>
                                      : errorChecklistsIds.includes(focusedTask.id) && !websiteValidation.test(content.value) && content.value !== ''
                                        ? <span className='duedate-error'>This is not a valid URL</span> : null}
                                  </div>
                                </div>
                              ) : content.form_type === 'date'
                                ? (
                                  <div className='task-form-item'>
                                    <div className='form-date-div' aria-hidden='true' onClick={(e: React.MouseEvent<HTMLDivElement>): void => { setFormDatePopupAncherEl(e.currentTarget); setFormDateId(content.id); }}>
                                      <EventIcon />
                                      <div>
                                        <p>{content.label}</p>
                                        <h6>{content.value && moment(new Date(content.value)).format('ddd MMM DD yyyy')}</h6>
                                      </div>
                                    </div>
                                    <Popover
                                      open={Boolean(formDatePopupAncherEl)}
                                      anchorEl={formDatePopupAncherEl}
                                      onClose={(): void => { setFormDatePopupAncherEl(null); }}
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
                                              value={formDate}
                                              error={false}
                                            />
                                          </div>
                                          <div className='time-select-div' style={{ width: '50%', marginTop: '3px' }}>
                                            <SelectInput
                                              value={formTime}
                                              name='time'
                                              onChange={(obj: SelectChangeEvent): void => { setFormTime(obj.target.value); }}
                                              options={TimeSlots}
                                              showPleaseSelect={false}
                                              haveMarginBottom={false}
                                              label='Time'
                                            />
                                          </div>
                                        </div>
                                        <Calendar
                                          color='#00CFA1'
                                          date={formDate !== '' ? new Date(formDate) : undefined}
                                          onChange={(newDate: Date): void => { setFormDate(moment(newDate).format('MM/DD/YYYY')); }}
                                        />
                                        <div className='dueDatebtndiv'>
                                          <Button onClick={(): void => { handleRemoveFormDateAndTime(); }} color='primary' startIcon={<DeleteIcon />} style={{ color: '#00CFA1', textTransform: 'inherit' }}>Remove</Button>
                                          <Button onClick={(): void => { handleFormDateAndTime(); }} className='durdate-save-btn' style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' startIcon={<SaveIcon />} variant='contained'>Save</Button>
                                        </div>
                                      </div>
                                    </Popover>
                                  </div>
                                ) : content.form_type === 'numbers'
                                  ? (
                                    <div className={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                      <div className='email-item-wrap'>
                                        <InputField
                                          id='numbers'
                                          name='name'
                                          type='number'
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleTaskFormValue(index, e.target.value); }}
                                          placeholder='Type numbers here'
                                          label={content.label}
                                          value={content.value && content.value !== null ? content.value : '0'} // (content.value !== null && Number(content.value) < 0) ? '0' : content.value
                                          onBlur={(e: React.FocusEvent<HTMLInputElement>): void => { handleTaskForm({ id: content.id, value: e.target.value }); }}
                                          error={!!(errorChecklistsIds.includes(focusedTask.id) && (content.value === ''))}
                                          endAdornment={errorChecklistsIds.includes(focusedTask.id) && (content.value === '') ? <InputErrorIcon /> : null}
                                          required={content.is_required}
                                        />
                                        {errorChecklistsIds.includes(focusedTask.id) && content.value === ''
                                  && <span className='duedate-error'>This field is required</span>}
                                      </div>
                                    </div>
                                  ) : null

                    : null}
        </div>
      ))}
      <div className='content-buttons-div'>
        {focusedTask !== null && !focusedTask.is_heading
            && (
              <div className={focusedTask.is_completed || (isStopIndex !== -1 && focusedTask.index > isStopIndex) ? 'disabled-button-div' : 'complete-button-div'}>
                <Button
                  disabled={!!(focusedTask.is_completed || (isStopIndex !== -1 && focusedTask.index > isStopIndex))}
                  onClick={(): void => { handleChecklistTaskComplete(focusedTask.id, focusedTask.is_completed); }}
                  className='durdate-save-btn'
                  style={{
                    textTransform: 'inherit', width: '100%', color: focusedTask.is_completed || (isStopIndex !== -1 && focusedTask.index > isStopIndex) ? '#C6C6C6' : 'white', background: focusedTask.is_completed || (isStopIndex !== -1 && focusedTask.index > isStopIndex) ? '#EBEBE4' : '#00CFA1',
                  }}
                  startIcon={<DoneIcon />}
                  variant='contained'
                >
                  Complete Task
                </Button>
              </div>
            )}
        {(focusedTaskIndex !== data.tasks.length - 1)
            && (
              <div className='next-button-div' aria-hidden='true' onClick={(): void => { handleFocusTask(data.tasks[focusedTaskIndex + 1], focusedTaskIndex + 1); }}>
                <p>Next</p>
                <ArrowForwardIosIcon />
              </div>
            )}
      </div>
      <div className='activity-wrapper'>
        <div className='heading'>Activity</div>
        <div className='activity-details'>
          <div className='activity-show-title'>Show:</div>
          <div className={`activity-description ${activityShow === 'comments' ? 'activity-selected' : ''}`} aria-hidden='true' onClick={(): void => { setActivityShow('comments'); }}>Comments</div>
          <div className={`activity-description ${activityShow === 'history' ? 'activity-selected' : ''}`} aria-hidden='true' onClick={(): void => { setActivityShow('history'); }}>History</div>
        </div>
        {
          activityShow === 'comments'
            && (
              <div className='activity-section'>
                {focusedTask !== null && focusedTask.comments.length > 0 ? focusedTask.comments.map((comment) => (
                  <div className='comment' key={comment.user.id}>
                    <Avatar alt={comment.user.name} src={`${process.env.REACT_APP_IMAGE_URL}${comment.user.avatar}`} sx={{ height: '28px', width: '28px' }} />
                    <div className='comment-details'>
                      <div className='comment-heading'>
                        <div className='comment-name'>{comment.user.name}</div>
                        {window.innerWidth > 600
                        && (
                          <Tooltip title={moment(comment.created_at).format('hh:mm A')}>
                            <div className='comment-time'>{moment(comment.created_at).format('MMMM DD, YYYY')}</div>
                          </Tooltip>
                        ) }
                        {userId === comment.user.id && (
                          comment.attachments.length > 0 ? <div className='comment-options'><DeleteIcon fontSize='small' onClick={(): void => { removeChecklistTaskComment(comment.id); }} /></div>
                            : <div className='comment-options' aria-hidden='true' onClick={(e: React.MouseEvent<HTMLDivElement>): void => { setSingleCommentId(comment.id); setCommentAnchorEl(e.currentTarget); }}><MoreHorizRounded fontSize='small' /></div>
                        )}
                      </div>
                      {window.innerWidth < 600
                      && (
                        <Tooltip title={moment(comment.created_at).format('hh:mm A')}>
                          <div className='comment-time'>{moment(comment.created_at).format('MMMM DD, YYYY')}</div>
                        </Tooltip>
                      ) }
                      <pre className='comment-data'>{comment.comment !== null && parse(comment.comment.replaceAll('@[', '<span>').replaceAll(/ *\([^)]*\) */g, '()').replaceAll('](', '').replaceAll(')', ' </span>'))}</pre>
                      {comment.attachments.length > 0
                        && (
                          <div className='comment-attachment-wrapper'>
                            Attachment:
                            {comment.attachments.map((file) => (
                              <p><a href={`${process.env.REACT_APP_IMAGE_URL}${file.file}`}>{file.file_name}</a></p>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                )) : null}
              </div>
            )
        }
        <StyledMenu
          id='comment-menu'
          elevation={0}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{ style: { boxShadow: '0px 0px 3px rgba(112, 112, 112, .3)' } }}
          anchorEl={commentAnchorEl}
          keepMounted
          open={Boolean(commentAnchorEl)}
          onClose={(): void => { setCommentAnchorEl(null); }}
        >
          <StyledMenuItem onClick={(): void => { handleEditComment(singleCommentId); }}>Edit</StyledMenuItem>
          <StyledMenuItem onClick={(): void => { removeChecklistTaskComment(singleCommentId); }}>Delete</StyledMenuItem>
        </StyledMenu>
        {
          activityShow === 'history' && (
            <div style={{ paddingBottom: '32px' }}>
              {focusedTask !== null && focusedTask.history.length > 0 ? focusedTask.history.map((history) => (
                <div className='history-single'>
                  <p className='history-description'>
                    {/* <pre> */}
                    <b style={{ fontWeight: '700', marginRight: '4px' }}>
                      {history.user.name}
                      {' '}
                    </b>
                    {window.innerWidth < 600
                    && (
                      <Tooltip title={moment(history.time).format('hh:mm A')}>
                        <div className='history-time'>{moment(history.time).format('LLL')}</div>
                      </Tooltip>
                    )}
                    {/* </pre> */}
                    {history.description}
                  </p>
                  {window.innerWidth > 600
                  && (
                    <Tooltip title={moment(history.time).format('hh:mm A')}>
                      <div className='history-time'>{moment(history.time).format('LLL')}</div>
                    </Tooltip>
                  )}
                </div>
              )) : null}
            </div>
          )
        }
        {window.innerWidth < 600
        && <TaskComment focusedTask={focusedTask} commentForEdit={commentForEdit} setCommentForEdit={setCommentForEdit} />}
      </div>
      <Notifications />
      <Dialog open={openSendEmailDialog} aria-labelledby='form-dialog-title'>
        <DialogContent style={{ width: 500, padding: '24px' }}>
          <div className='dialog-heading'>Send Email?</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            This will send an email out to
            {' '}
            {emailReceiver}
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => { setOpenSendEmailDialog(false); }} color='primary' style={{ color: '#00CFA1', textTransform: 'inherit' }}>Cancel</Button>
          <Button onClick={(): void => { handleSendEmail(sendEmailId); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' variant='contained'>Send Email</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openRemoveFormFileDialog} aria-labelledby='form-dialog-title'>
        <DialogContent style={{ width: 500, padding: '24px' }}>
          <div className='dialog-heading'>Remove this file?</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            If you remove this file, it will be deleted and irrecoverable.
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => { setOpenRemoveFormFileDialog(false); }} color='primary' style={{ color: '#00CFA1', textTransform: 'inherit' }}>Cancel</Button>
          <Button onClick={(): void => { handleTaskForm({ id: selectedFileId, value: null }); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' variant='contained'>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
