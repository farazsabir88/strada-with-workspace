/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Editor } from '@tinymce/tinymce-react';
import SelectInput from 'shared-components/inputs/SelectInput';
import { Multiselect } from 'multiselect-react-dropdown';
import InputField from 'shared-components/inputs/InputField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import GetAppIcon from '@mui/icons-material/GetApp';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import EventIcon from '@mui/icons-material/Event';
import EmailIcon from '@mui/icons-material/Email';
import {
  IconButton, Avatar, Checkbox, Tooltip,
} from '@mui/material';
import moment from 'moment';
import parse from 'html-react-parser';
import './_checklistPrint.scss';
import type {
  Iresponse,
} from '../types';

interface IChecklistPrint {
  data: Iresponse;
  errorChecklistsIds: number[];
  checklistName: string;
  changeChecklistName: boolean;
  setGetPrint: (open: boolean) => void;
  showSendEmailIndex: number;
  showCleanedSendEmailFields: boolean;
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

function ArchivePrintIcon(): JSX.Element {
  return (
    <svg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M16 0V3.98438H4V0H16ZM16.2812 8.71875C16.4688 8.90625 16.7031 9 16.9844 9C17.2656 9 17.5 8.90625 17.6875 8.71875C17.9062 8.53125 18.0156 8.29688 18.0156 8.01562C18.0156 7.73438 17.9062 7.5 17.6875 7.3125C17.5 7.09375 17.2656 6.98438 16.9844 6.98438C16.7031 6.98438 16.4688 7.09375 16.2812 7.3125C16.0938 7.5 16 7.73438 16 8.01562C16 8.29688 16.0938 8.53125 16.2812 8.71875ZM13.9844 15.9844V11.0156H6.01562V15.9844H13.9844ZM16.9844 5.01562C17.7969 5.01562 18.5 5.3125 19.0938 5.90625C19.6875 6.5 19.9844 7.20312 19.9844 8.01562V14.0156H16V18H4V14.0156H0.015625V8.01562C0.015625 7.20312 0.3125 6.5 0.90625 5.90625C1.5 5.3125 2.20312 5.01562 3.01562 5.01562H16.9844Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

export default function ChecklistPrint(props: IChecklistPrint): JSX.Element {
  const {
    data, errorChecklistsIds, checklistName, changeChecklistName, setGetPrint, showSendEmailIndex, showCleanedSendEmailFields,
  } = props;
  const componentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-useless-escape
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return (
    <div className='checklist-print'>
      <div className='checklist-print-header'>
        <div className='cursor-pointer' aria-hidden='true' onClick={(): void => { setGetPrint(false); }}><ArrowBackIcon /></div>
        <div>
          <ReactToPrint
            trigger={(): React.ReactElement => (
              <IconButton><ArchivePrintIcon /></IconButton>
            )}
            content={(): React.ReactInstance | null => componentRef.current}
          />
        </div>
      </div>
      <div className='checklist-print-wrapper' aria-hidden='true' ref={componentRef}>
        <div className='checklist-name'>
          {changeChecklistName ? <p>{checklistName}</p> : <p>{data.name}</p>}
          <p className='checklist-created-at'>
            Created on
            {' '}
            {moment(data.created_at).format('dddd, MMMM Do YYYY HH:mm:ss')}
          </p>
        </div>
        {data.assignees.length > 0
        && (
          <div className='assignee-div'>
            Assignee
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {data.assignees.map((assignee) => (
                <div style={{ width: '25%' }}>
                  <div className='assigne-item'>
                    <Avatar alt={assignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
                    <p>
                      {assignee.name}
                      {' '}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='task-summary-div'>
          <div className='task-heading-wrapper'>
            <p>Task Summary</p>
            <h6>
              {data.task_completed}
              /
              {data.total_tasks}
            </h6>
          </div>
          {data.tasks.map((task, indx) => (
            <div className='task-table-item' style={{ borderRadius: indx === 0 ? '8px 8px 0px 0px' : indx === data.tasks.length - 1 ? '0px 0px 8px 8px' : '' }}>
              <div className='index-div'>{indx + 1}</div>
              <div className='task-div'>
                {!task.is_heading
                && (
                  <Checkbox
                    checked={task.is_completed}
                    color='primary'
                  />
                )}
                <p style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>{task.name && task.name.length > 110 ? `${task.name.slice(0, 110)}...` : task.name}</p>
              </div>
              <div className='completed-by-div'>
                {task.is_completed && (
                  <div>
                    <p>
                      by
                      <b style={{ marginLeft: '4px' }}>{task.completed_by.name || ''}</b>
                    </p>
                    <p>{moment(task.completed_at).format('MMM DD [at] hh:mm a')}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className='task-details-div'>
          {data.tasks.map((task) => (
            <div>
              <div className='task-heading'>
                {!task.is_heading
                    && (
                      <Checkbox
                        checked={task.is_completed}
                        color='primary'
                      />
                    )}
                <p>{task.name}</p>
              </div>
              <div className='task-form-wrapper'>
                {task.content.length > 0 && task.content.map((content, index) => (
                  <div>
                    {content.type === 'text'
                      ? (
                        <div className='task-form-item'>
                          <div className='editor-div'>{parse(content.value)}</div>
                        </div>
                      ) : content.type === 'subTask'
                        ? (
                          <div className={errorChecklistsIds.includes(task.id) && content.subTasks !== undefined && content.subTasks.some((element) => { if (!element.is_completed) { return true; } return false; }) ? 'task-form-item-error' : 'task-form-item'}>
                            {content.subTasks !== undefined ? content.subTasks.map((subtask, subTaskIndex) => (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p>{subTaskIndex + 1}</p>
                                <Checkbox
                                  checked={subtask.is_completed}
                                  color={errorChecklistsIds.includes(task.id) && !subtask.is_completed ? 'error' : 'primary'}
                                />
                                <p style={{ textDecoration: subtask.is_completed ? 'line-through' : 'none', opacity: subtask.is_completed ? '0.4' : '1' }}>{subtask.value}</p>
                              </div>
                            )) : null}
                            {(errorChecklistsIds.includes(task.id) && content.subTasks !== undefined && content.subTasks.some((element) => { if (!element.is_completed) { return true; } return false; })) && <span className='duedate-error'>All subtasks are required</span> }
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
                                <GetAppIcon />
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
                                    <div className='expend-div'>
                                      <ExpendMoreIcon />
                                      <p>Expand less</p>
                                    </div>
                                  )
                                  : (
                                    <div className='expend-div'>
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
                                    <div style={{ cursor: content.email_sent !== undefined && !content.email_sent ? 'pointer' : 'auto' }}>
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
                                    <div aria-hidden='true'>
                                      <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                        <InputField
                                          id='to'
                                          name='to'
                                          type='text'
                                          label='To'
                                          value={content.sendEmailData === undefined ? '' : content.sendEmailData.to}
                                          error={false}
                                          required={content.is_required}
                                        />
                                      </div>
                                      <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                        <InputField
                                          id='cc'
                                          name='cc'
                                          type='text'
                                          label='CC'
                                          value={content.sendEmailData === undefined ? '' : content.sendEmailData.cc}
                                          error={false}
                                          required={content.is_required}
                                        />
                                      </div>
                                      <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                        <InputField
                                          id='bcc'
                                          name='bcc'
                                          type='text'
                                          label='Bcc'
                                          value={content.sendEmailData === undefined ? '' : content.sendEmailData.bcc}
                                          error={false}
                                          required={content.is_required}
                                        />
                                      </div>
                                      <div className='item-wrap' style={{ marginBottom: '15px' }}>
                                        <InputField
                                          id='subject'
                                          name='subject'
                                          type='text'
                                          label='Subject'
                                          value={content.sendEmailData === undefined ? '' : content.sendEmailData.subject}
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
                                      />
                                    </div>
                                  )}
                                {content.email_sent !== undefined && !content.email_sent
                            && (
                              <div aria-hidden='true' className={content.sendEmailData !== undefined && emailValidation.test(content.sendEmailData.cleaned_to) && content.sendEmailData.subject !== '' && content.sendEmailData.body !== '' ? 'send-email-div' : 'send-email-disabled-div'}>
                                <EmailIcon />
                                <p>Send email</p>
                              </div>
                            )}
                              </>
                            )}
                              </div>
                            ) : content.type === 'form'
                              ? content.form_type === 'email' ? (
                                <div className={errorChecklistsIds.includes(task.id) && (content.value === '' || !emailValidation.test(content.value)) ? 'task-form-item-error' : 'task-form-item'}>
                                  <div className='email-item-wrap'>
                                    <InputField
                                      id='email'
                                      name='email'
                                      type='email'
                                      placeholder={content.label}
                                      value={content.value && content.value}
                                      startAdornment={<EmailInputIcon />}
                                      error={!!(errorChecklistsIds.includes(task.id) && (content.value === '' || !emailValidation.test(content.value)))}
                                      endAdornment={errorChecklistsIds.includes(task.id) && (content.value === '' || !emailValidation.test(content.value)) ? <InputErrorIcon /> : null}
                                      required={content.is_required}
                                    />
                                    {errorChecklistsIds.includes(task.id) && content.value === '' ? <span className='duedate-error'>This field is required</span>
                                      : errorChecklistsIds.includes(task.id) && !emailValidation.test(content.value) && content.value !== '' ? <span className='duedate-error'>This is not a valid Email</span> : null}
                                  </div>
                                </div>
                              ) : content.form_type === 'shortText' ? (
                                <div className={errorChecklistsIds.includes(task.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                  <div className='email-item-wrap'>
                                    <InputField
                                      id='shortText'
                                      name='name'
                                      type='text'
                                      placeholder={content.label}
                                      value={content.value && content.value}
                                      error={!!(errorChecklistsIds.includes(task.id) && (content.value === ''))}
                                      endAdornment={errorChecklistsIds.includes(task.id) && (content.value === '') ? <InputErrorIcon /> : null}
                                      required={content.is_required}
                                    />
                                    {errorChecklistsIds.includes(task.id) && content.value === ''
                                && <span className='duedate-error'>This field is required</span>}
                                  </div>
                                </div>
                              ) : content.form_type === 'longText' ? (
                                <div className={errorChecklistsIds.includes(task.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                  <div className='email-item-wrap'>
                                    <InputField
                                      id='longText'
                                      name='name'
                                      type='text'
                                      placeholder={content.label}
                                      value={content.value && content.value}
                                      multiline
                                      rows={2}
                                      error={!!(errorChecklistsIds.includes(task.id) && (content.value === ''))}
                                      endAdornment={errorChecklistsIds.includes(task.id) && (content.value === '') ? <InputErrorIcon /> : null}
                                      required={content.is_required}
                                    />
                                    {errorChecklistsIds.includes(task.id) && content.value === ''
                                    && <span className='duedate-error'>This field is required</span>}
                                  </div>
                                </div>
                              ) : content.form_type === 'dropdown'
                                ? (
                                  <div className={errorChecklistsIds.includes(task.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                    <div className='item-wrap'>
                                      <SelectInput
                                        name='dropdown'
                                        value={content.selected_option === undefined || content.selected_option === null ? '' : content.selected_option.value}
                                        options={content.options ? content.options.map((option) => ({
                                          value: option.value === undefined ? '' : option.value,
                                          name: option.label,
                                        })) : []}
                                        label={content.label === undefined ? '' : content.label}
                                        haveMarginBottom={false}
                                        showPleaseSelect={false}
                                        // eslint-disable-next-line react/jsx-boolean-value
                                        disabled={true}
                                      />
                                      {errorChecklistsIds.includes(task.id) && content.value === ''
                                    && <span className='duedate-error'>This field is required</span>}
                                    </div>
                                  </div>
                                )
                                : content.form_type === 'multiChoice'
                                  ? (
                                    <div className={errorChecklistsIds.includes(task.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                      <div className='item-wrap'>
                                        <Multiselect
                                          options={content.options ? content.options.map((option) => ({
                                            value: option.value,
                                            label: option.label,
                                          })) : []}
                                          disable
                                          closeIcon='circle'
                                          selectedValues={content.selected_option}
                                          displayValue='label'
                                          placeholder={content.selected_option !== undefined && content.selected_option === null ? 'Type to filter options' : content.label}
                                        />
                                        {errorChecklistsIds.includes(task.id) && content.value === ''
                                    && <span className='duedate-error'>This field is required</span>}
                                      </div>
                                    </div>
                                  ) : content.form_type === 'fileUpload'
                                    ? (
                                      <div className={errorChecklistsIds.includes(task.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
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
                                                  <GetAppIcon />
                                                  <div><CloseIcon /></div>
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
                                                  />
                                                  <div className='file-input-div'>
                                                    <FileUploadIcon />
                                                    <p>Upload file</p>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          {errorChecklistsIds.includes(task.id) && content.value === ''
                                && <span className='duedate-error'>This field is required</span>}
                                        </div>
                                      </div>
                                    ) : content.form_type === 'website'
                                      ? (
                                        <div className={errorChecklistsIds.includes(task.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                          <div className='email-item-wrap website-field'>
                                            <InputField
                                              id='website'
                                              name='name'
                                              type='text'
                                              placeholder='Type URL here'
                                              label={content.label}
                                              startAdornment={<LanguageIcon />}
                                              value={content.value && content.value}
                                              error={!!(errorChecklistsIds.includes(task.id) && (content.value === ''))}
                                              endAdornment={errorChecklistsIds.includes(task.id) && (content.value === '') ? <InputErrorIcon /> : null}
                                              required={content.is_required}
                                            />
                                            {errorChecklistsIds.includes(task.id) && content.value === ''
                                        && <span className='duedate-error'>This field is required</span>}
                                          </div>
                                        </div>
                                      ) : content.form_type === 'date'
                                        ? (
                                          <div className='task-form-item'>
                                            <div className='form-date-div'>
                                              <EventIcon />
                                              <div>
                                                <p>{content.label}</p>
                                                <h6>{content.value && moment(new Date(content.value)).format('ddd MMM DD yyyy')}</h6>
                                              </div>
                                            </div>
                                          </div>
                                        ) : content.form_type === 'numbers'
                                          ? (
                                            <div className={errorChecklistsIds.includes(task.id) && (content.value === '') ? 'task-form-item-error' : 'task-form-item'}>
                                              <div className='email-item-wrap'>
                                                <InputField
                                                  id='numbers'
                                                  name='name'
                                                  type='number'
                                                  placeholder='Type numbers here'
                                                  label={content.label}
                                                  value={content.value && Number(content.value) < 0 ? '0' : content.value}
                                                  error={!!(errorChecklistsIds.includes(task.id) && (content.value === ''))}
                                                  endAdornment={errorChecklistsIds.includes(task.id) && (content.value === '') ? <InputErrorIcon /> : null}
                                                  required={content.is_required}
                                                />
                                                {errorChecklistsIds.includes(task.id) && content.value === ''
                                        && <span className='duedate-error'>This field is required</span>}
                                              </div>
                                            </div>
                                          ) : null

                              : null}
                  </div>
                ))}
                {(task.comments.length > 0 || task.history.length > 0)
                && (
                  <div className='activity-div'>
                    <p className='heading'>Activity</p>
                    {task.history.length > 0 ? task.history.map((history) => (
                      <div className='history-single'>
                        <p className='history-description'>
                          {/* <pre> */}
                          <b style={{ fontWeight: '500' }}>
                            {history.user.name}
                            {' '}
                          </b>
                          {/* </pre> */}
                          {history.description}
                        </p>
                        <Tooltip title={moment(history.time).format('hh:mm A')}>
                          <div className='history-time'>{moment(history.time).format('LLL')}</div>
                        </Tooltip>
                      </div>
                    )) : null}
                    <div className='activity-section'>
                      {task.comments.length > 0 ? task.comments.map((comment) => (
                        <div className='comment'>
                          <Avatar alt={comment.user.name} src={`${process.env.REACT_APP_IMAGE_URL}${comment.user.avatar}`} sx={{ height: '28px', width: '28px' }} />
                          <div className='comment-details'>
                            <div className='comment-heading'>
                              <div className='comment-name'>{comment.user.name}</div>
                              <Tooltip title={moment(comment.created_at).format('hh:mm A')}>
                                <div className='comment-time'>{moment(comment.created_at).format('MMMM DD, YYYY')}</div>
                              </Tooltip>
                            </div>
                            <pre className='comment-data'>{comment.comment !== null && parse(comment.comment.replaceAll('@[', '<span>').replaceAll(/ *\([^)]*\) */g, '()').replaceAll('](', '').replaceAll(')', ' </span>'))}</pre>
                            {comment.attachments.length > 0
                                && (
                                  <div className='comment-attachment-wrapper'>
                                    Attachment:
                                    {comment.attachments.map((file) => (
                                      <p>{file.file_name}</p>
                                    ))}
                                  </div>
                                )}
                          </div>
                        </div>
                      )) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
