/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import {
  Grid, IconButton, InputBase, Tooltip, TextField, Autocomplete,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import AttachmentIcon from '@mui/icons-material/Attachment';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useSnackbar } from 'notistack';
import HookTextField from 'shared-components/hooks/HookTextField';
import HookCheckbox from 'shared-components/hooks/HookCheckbox';
import PrimayButton from 'shared-components/components/PrimayButton';
import CustomSwitch from 'shared-components/inputs/Switch';
import StradaLoading from 'shared-components/components/StradaLoader';
import type { IFormValues } from 'formsTypes';
import type { IEventSchedulePayload } from 'admin/AdminFormTypes';
import { WithContext as ReactTags } from 'react-tag-input';
import type { RootState } from 'mainStore';
import { useSelector } from 'react-redux';
import DateRangeDialog from '../EventSchedule/DateRangeDialog';
import type {
  ISchedulingRespose, ISchedulingVendor, ISchedulingAttachmentResonse, IErrorResponse,
} from '../types';
import CustomCalendar from '../EventSchedule/CustomCalendar';

interface IStatusOption {
  name: string;
  value: number;
  color: string;
  background: string;
}
interface IVendorContact {
  id: number;
  full_name: string;
  email: string;
  name: string;
  label: string;
}

const tagList = [
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

const scheduleContentDefaultValues = {
  is_email_scheduled: true,
  invitation_title: '',
  offer_availability: false,
  unique_token: null,
  schedule_cc: [],
  schedule_bcc: [],
  dayRangeType: '',
  future_days: 1,
  startDate: '',
  endDate: '',
  durationType: '',
  timeDuration: null,
  subject: '',
  description: '',
  vendor: null,
  schedule_vendor_contact: null,
  track_email: false,
  attachments: [],
  status: 1,
};

const formSchema = yup.object().shape({
  invitation_title: yup.string().required('Enter Title').nullable(),
  vendor: yup.object().shape({
    label: yup.string().required('Select Vendor'),
  }),
  schedule_vendor_contact: yup.object().shape({
    label: yup.string().required('Select Vendor Contact'),
  }),
  // schedule_vendor_contact: yup.string().required('Select Vendor Contact').nullable(),
  // vendor_email: yup.string().required('Enter Email').email('This email is not valid'),
  subject: yup.string().required('Enter Subject').nullable(),
  description: yup.string().required('Enter Description').nullable(),
});

export default function TaskScheduleContent(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    taskId,
  } = useParams();
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const [open, setOpen] = useState(false);
  const [vendorBcc, setVendorBcc] = useState<{ id: string; text: string }[]>([]);
  const [cc, setcc] = useState<{ id: string; text: string }[]>([]);
  const [ccError, setCCError] = useState<boolean>(false);
  const [bccError, setBCCError] = useState<boolean>(false);
  const [futureDays, setFutureDays] = useState<number | string | null>(1);
  const [vendorList, setVendorList] = useState<ISchedulingVendor[]>([]);
  const [vendor, setVendor] = useState<ISchedulingVendor | null>(null);
  const [vendorContact, setVendorContact] = useState<IVendorContact | null>(null);
  const [vendorContactList, setVendorContactList] = useState<IVendorContact[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<IStatusOption | null>({
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  });

  const handleDelete = (i: number): void => {
    setVendorBcc([...vendorBcc.filter((tag, index) => index !== i)]);
    setCCError(false);
  };
  const handleAddition = (vbcc: { id: string; text: string }): void => {
    const validation = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (vbcc.text.trim() && validation.test(vbcc.text)) {
      setVendorBcc([...vendorBcc, vbcc]);
      setBCCError(false);
    } else if (vbcc.text.trim() === '') {
      setBCCError(false);
    } else {
      setBCCError(true);
    }
  };
  const handleDeletecc = (i: number): void => {
    setcc([...cc.filter((tag, index) => index !== i)]);
    setCCError(false);
  };
  const handleAdditioncc = (vcc: { id: string; text: string }): void => {
    const validation = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (vcc.text.trim() && validation.test(vcc.text)) {
      setcc([...cc, vcc]);
      setCCError(false);
    } else if (vcc.text.trim() === '') {
      setCCError(false);
    } else {
      setCCError(true);
    }
  };

  const {
    control, formState, handleSubmit, setValue, watch, getValues,
  } = useForm<IFormValues>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
    defaultValues: scheduleContentDefaultValues,
  });

  const { errors } = formState;
  //  gettting current event schedule

  const { data: schedulingData = null, isLoading } = useQuery(
    'get-task-schedule',
    async () => axios({
      url: `/api/budget-calendar/task-schedule/${taskId}/`,
      method: 'GET',
    }),
    {
      select: (res: AxiosResponse<ISchedulingRespose>) => res.data.detail,
    },
  );

  const { mutate: handlePost, isLoading: updating } = useMutation(async (dataToPost: IEventSchedulePayload) => axios({
    url: `/api/budget-calendar/task-schedule/${taskId}/`,
    method: 'PATCH',
    data: dataToPost,
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-task-schedule').then();
      enqueueSnackbar('Scheduling email sent successfully');
      navigate(-1);
    },
    onError: (err: IErrorResponse) => {
      enqueueSnackbar(err.data.detail, { variant: 'error' });
    },
  });
  useQuery(
    'get-vendors-by-workpsace-id',
    async () => axios({
      url: `api/filter/vendor/?workspace=${currentWorkspace.id}`,
      method: 'GET',
    }),
    {
      onSuccess: (res) => {
        if (res.data?.detail !== undefined && res.data.detail.length !== 0) {
          const data: ISchedulingVendor[] = res.data.detail;
          setVendorList(data);
        }
      },
    },
  );
  const { mutate: getVendorContact } = useMutation(
    async (payload: number) => axios({
      url: `api/filter/vendor-contact/?vendor=${payload}`,
      method: 'get',
    }),
    {
      onSuccess: (res) => {
        if (res.data?.detail !== undefined && res.data.detail.length !== 0) {
          const data = res.data.detail;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const list: IVendorContact[] = data.map((item: IVendorContact) => {
            const obj = {
              id: item.id,
              full_name: item.full_name || '',
              name: item.full_name || '',
              email: item.email,
              label: `${item.full_name} (${item.email})` || '',
            };
            return obj;
          });
          setVendorContactList(list);
        }
      },
    },
  );
  const handleVendorValue = (value: ISchedulingVendor): void => {
    setValue('vendor', value, { shouldDirty: true });
    // schedulingData.schedule_vendor_contact = null;
    setValue('schedule_vendor_contact', null);
    setVendor(value);
    setVendorContact(null);
    setVendorContactList([]);
  };
  const handleVendorContactValue = (value: IVendorContact): void => {
    setValue('schedule_vendor_contact', value, { shouldDirty: true });
    setVendorContact(value);
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    if (value === 'future') {
      setValue('range', '', { shouldDirty: true });
      setValue('forever', '', { shouldDirty: true });
    } else if (value === 'range') {
      setValue('startDate', '', { shouldDirty: true });
      setValue('endDate', '', { shouldDirty: true });
    }
    setValue('dayRangeType', value);
  };

  const handleRadioForDuration = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    if (value !== '00') {
      setValue('timeDuration', Number(value), { shouldDirty: true });
    } else {
      const timeDuration = Number.parseInt(value, 10);
      setValue('timeDuration', Number(timeDuration));
    }
    setValue('durationType', value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    if (name === 'future_days') {
      setValue('future_days', value, { shouldDirty: true });
    } else if (name === 'forever') {
      setValue('startDate', moment(new Date()).format('YYYY-MM-DD'));
      setValue(
        'endDate',
        moment(new Date()).add(180, 'days').format('YYYY-MM-DD'),
      );
    }
  };

  useEffect(() => {
    const currentStatus = tagList.filter((tag) => tag.value === watch('status'));
    setSelectedTag(currentStatus[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('status')]);

  const onTimeDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (Number(e.target.value)) {
      setValue('timeDuration', Number(e.target.value));
    }
  };

  const setRanges = (_startDate: string, _endDate: string): void => {
    setValue('startDate', _startDate);
    setValue('endDate', _endDate);
  };
  useEffect(() => {
    const selectedVendor = getValues('vendor');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (vendorList.length > 0 && selectedVendor !== null) {
      getVendorContact(selectedVendor.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('vendor')]);
  const { mutate: uploadFile, isLoading: uploading } = useMutation(
    async ({ file, id }: { file: File; id: string | undefined }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('task', String(id));
      formData.append('group', 'schedule');
      return axios({
        url: '/api/budget-calendar/task-attachment/',
        method: 'POST',
        data: formData,
      });
    },
    {
      onSuccess: (res: AxiosResponse<ISchedulingAttachmentResonse>): void => {
        // await queryClient.invalidateQueries('get-task-schedule').then();
        const oldFiles = watch('attachments');
        const {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          file, filename, id, group, file_url, event_rfp,
        } = res.data.detail;

        setValue('attachments', [...oldFiles, {
          file, filename, id, group, file_url, event_rfp,
        }]);
        // await queryClient.invalidateQueries('get-single-sidesheet').then();
      },
    },
  );

  const { mutate: deleteFile, isLoading: deleting } = useMutation(
    async (fileId: number) => axios({
      url: `/api/budget-calendar/task-attachment/${fileId}/`,
      method: 'DELETE',
    }),
    {
      onSuccess: (res, fileId): void => {
        const newFiles = watch('attachments').filter((file) => file.id !== fileId);
        setValue('attachments', newFiles, { shouldDirty: true });
      },
    },
  );

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length !== 0) {
      let id: string | undefined = '';
      id = taskId;
      uploadFile({ file: e.target.files[0], id });
    }
  };

  useEffect(() => {
    if (schedulingData !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      getValues('invitation_title') === '' && setValue('invitation_title', schedulingData.invitation_title, { shouldDirty: true });
      setValue('vendor', schedulingData.vendor, { shouldDirty: true });
      setValue('schedule_vendor_contact', schedulingData.schedule_vendor_contact, { shouldDirty: true });
      setValue('subject', schedulingData.subject, { shouldDirty: true });
      setValue('description', schedulingData.description, { shouldDirty: true });
      setValue('dayRangeType', schedulingData.dayRangeType, { shouldDirty: true });
      setValue('durationType', schedulingData.durationType, { shouldDirty: true });
      setValue('endDate', schedulingData.endDate, { shouldDirty: true });
      setValue('startDate', schedulingData.startDate, { shouldDirty: true });
      setValue('timeDuration', schedulingData.timeDuration, { shouldDirty: true });
      setValue('attachments', schedulingData.attachments, { shouldDirty: true });
      setValue('status', schedulingData.status, { shouldDirty: true });
      setVendor(schedulingData.vendor);
      setVendorContact(schedulingData.schedule_vendor_contact);
      setValue('future_days', schedulingData.future_days, { shouldDirty: true });
      setFutureDays(schedulingData.future_days);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

      // eslint-disable-next-line array-callback-return
      schedulingData.schedule_cc.map((item, i) => { setcc([...cc, { id: JSON.stringify(i), text: item }]); });
      // eslint-disable-next-line array-callback-return
      schedulingData.schedule_bcc.map((item, i) => { setVendorBcc([...vendorBcc, { id: JSON.stringify(i), text: item }]); });
      setValue('schedule_cc', schedulingData.schedule_cc, { shouldDirty: true });
      setValue('schedule_bcc', schedulingData.schedule_bcc, { shouldDirty: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, schedulingData, setValue]);

  const onSubmit = (formData: IEventSchedulePayload): void => {
    if (schedulingData !== null) {
      // setValue('future_days', Number(futureDays), { shouldDirty: true });
      handlePost({
        ...formData, future_days: Number(futureDays), schedule_cc: cc.map((singleCC) => singleCC.text), schedule_bcc: vendorBcc.map((singleCC) => singleCC.text),
      });
    }
  };

  useEffect(() => {
    document.getElementById('budget-calendar-start')?.scrollIntoView();
  }, []);

  return (
    <div style={{ width: '100%', paddingTop: '62px' }} id='budget-calendar-start'>
      <StradaLoading message={deleting ? 'Deleting...' : 'loading...'} open={uploading || deleting || updating || isLoading} />
      <DateRangeDialog
        open={open}
        handleClose={(): void => {
          setOpen(false);
        }}
        setRanges={setRanges}
        startDate={watch('startDate')}
        endDate={watch('endDate')}
      />
      <Grid container>
        <Grid item md={2} />
        <Grid item md={8}>
          <div className='event-schule-main-wrapper'>
            <div className='header'>
              <IconButton onClick={(): void => { window.history.back(); }} className='back-btn'>
                <ArrowBackIcon htmlColor='' />
              </IconButton>
              <h2>
                {' '}
                {schedulingData?.title}
                {' '}
              </h2>

              {selectedTag !== null ? (
                <div
                  style={{
                    background: selectedTag.background,
                    color: selectedTag.color,
                  }}
                  className='single-tag'
                >
                  {' '}
                  {selectedTag.name}
                </div>
              )
                : '-'}
            </div>

            {/* Form Area */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {watch('is_email_scheduled') && (
                <HookTextField
                  name='invitation_title'
                  label='Title for Calendar Invite'
                  control={control}
                  errors={errors}
                />
              )}

              <div className='custom-switch'>
                <CustomSwitch
                  checked={watch('is_email_scheduled')}
                  onChange={(e, val): void => {
                    setValue('is_email_scheduled', val, { shouldDirty: true });
                  }}
                />
                <p> Add scheduling link to email </p>
              </div>

              {watch('is_email_scheduled') && (
                <div>

                  <div className='date-range-section'>
                    <h6> Date Range </h6>
                    <p> Set a range of dates when you can accept meetings. </p>

                    <div className='input-section'>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby='demo-radio-buttons-group-label'
                          defaultValue=''
                          name='dayRangeType'
                          value={watch('dayRangeType')}
                          onChange={handleRadioChange}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: 24,
                            },
                          }}
                        >
                          <FormControlLabel
                            value='future'
                            className='form-control-label-schedule'
                            control={<Radio color='primary' />}
                            label={(
                              <div className='date-range-wrapper'>
                                <InputBase
                                  className='future-input-field'
                                  disabled={watch('dayRangeType') !== 'future'}
                                  onChange={(e): void => { setFutureDays(e.target.value); }}
                                  name='future_days'
                                  type='number'
                                  value={
                                    watch('dayRangeType') === 'future'
                                      ? futureDays === 0 ? '' : futureDays
                                      : ''
                                  }
                                />
                                <span>days into the future</span>
                              </div>
                            )}
                          />
                          <FormControlLabel
                            value='range'
                            className='form-control-label-schedule'
                            control={<Radio />}
                            label={(
                              <div className='date-range-wrapper'>
                                <span>Within a date range</span>
                                <InputBase
                                  className='range-input-field'
                                  name='range'
                                  onChange={handleChange}
                                  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                                  value={watch('dayRangeType') === 'range' && watch('startDate') && watch('endDate')
                                    ? `${moment(watch('startDate')).format('MMM DD')}  -  ${moment(watch('endDate')).format('MMM DD')}` : ''}
                                  onClick={(): void => {
                                    if (watch('dayRangeType') === 'range') {
                                      setOpen(true);
                                    }
                                  }}
                                  disabled={watch('dayRangeType') !== 'range'}
                                />
                              </div>
                            )}
                          />
                          <FormControlLabel
                            value='forever'
                            className='form-control-label-schedule'
                            control={<Radio />}
                            label={(
                              <div className='date-range-wrapper'>
                                <span>Indefinitely into the future</span>
                              </div>
                            )}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <h6> Event Duration </h6>
                    <p> Choose a duration </p>

                    <div className='event-duration-section'>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby='demo-radio-buttons-group-label'
                          defaultValue=''
                          name='durationType'
                          value={watch('durationType')}
                          onChange={handleRadioForDuration}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: 24,
                            },
                          }}
                        >
                          <div className='fixed-durations'>
                            <FormControlLabel
                              value='15'
                              control={<Radio color='primary' />}
                              label='15 min'
                              classes={{
                                label: 'duration-radio-label',
                              }}
                            />
                            <FormControlLabel
                              value='30'
                              control={<Radio />}
                              label='30 min'
                              classes={{
                                label: 'duration-radio-label',
                              }}
                            />
                            <FormControlLabel
                              value='45'
                              control={<Radio />}
                              label='45 min'
                              classes={{
                                label: 'duration-radio-label',
                              }}
                            />
                            <FormControlLabel
                              value='60'
                              control={<Radio />}
                              label='60 min'
                              classes={{
                                label: 'duration-radio-label',
                              }}
                            />
                          </div>
                          <p> ..or choose a custom duration </p>
                          <FormControlLabel
                            value='00'
                            control={<Radio />}
                            label={(
                              <div className='custom-duration-input'>
                                <div className='input-wrapper'>
                                  <InputBase
                                    name='custom-duration'
                                    type='number'
                                    value={watch('timeDuration')}
                                    disabled={watch('durationType') !== '00'}
                                    onChange={onTimeDurationChange}
                                  />
                                  <span>min</span>
                                </div>
                              </div>
                            )}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>

                  {/* Table Section  */}

                  <Grid item md={12}>
                    <CustomCalendar
                      schedulingData={schedulingData}
                    />
                  </Grid>

                </div>
              )}
              {/* show below only when kind is scheduling */}
              <Grid container columnSpacing={2}>
                <Grid item md={6} sm={12}>
                  <Autocomplete
                    // disablePortal
                    disableClearable
                    options={vendorList}
                    // defaultValue={vendor}
                    value={vendor}
                    style={{ marginBottom: errors.vendor ? '0px' : '20px' }}
                    onChange={(obj: React.SyntheticEvent, value): void => { handleVendorValue(value); }}
                    renderInput={(params): JSX.Element => (
                      <TextField
                        {...params}
                        placeholder='Search by name'
                        name='vendor'
                        label='Choose vendor*'
                      />
                    )}
                  />
                  <label className='error-message'>
                    {' '}
                    {errors.vendor ? 'Select Vendor' : ''}
                    {' '}
                  </label>
                </Grid>
                <Grid item md={6} sm={12}>
                  <Autocomplete
                    // freeSolo
                    disableClearable
                    options={vendorContactList}
                    value={vendorContactList.length > 0 ? vendorContact : ''}
                    defaultValue={schedulingData?.schedule_vendor_contact}
                    style={{ marginBottom: errors.schedule_vendor_contact ? '0px' : '20px' }}
                    onChange={(obj: React.SyntheticEvent, value): void => { handleVendorContactValue(value); }}
                    renderInput={(params): JSX.Element => (
                      <TextField
                        {...params}
                        name='schedule_vendor_contact'
                        placeholder='Search by name and email'
                        label='Contact Person'
                      />
                    )}
                  />
                  <label className='error-message'>
                    {' '}
                    {errors.schedule_vendor_contact ? 'Select Vendor Contact' : ''}
                    {' '}
                  </label>
                </Grid>
                <Grid item md={12}>
                  <HookTextField
                    name='subject'
                    label='Subject'
                    control={control}
                    errors={errors}
                  />
                </Grid>

                <Grid item md={12}>
                  <div className='bcc-wrapper'>
                    <label> CC </label>
                    <ReactTags
                      tags={cc}
                      handleDelete={handleDeletecc}
                      handleAddition={(tagone): void => { handleAdditioncc(tagone); }}
                      placeholder=' '
                      autofocus={false}
                      handleInputBlur={(tagVal): void => { handleAdditioncc({ id: tagVal, text: tagVal }); }}
                    />
                  </div>
                  <label className='error-message'>
                    {' '}
                    {ccError ? 'Enter a valid email' : ''}
                    {' '}
                  </label>
                </Grid>

                <Grid item md={12}>
                  <div className='bcc-wrapper'>
                    <label> BCC </label>
                    <ReactTags
                      tags={vendorBcc}
                      handleDelete={handleDelete}
                      handleAddition={(tagone): void => { handleAddition(tagone); }}
                      placeholder=''
                      autofocus={false}
                      handleInputBlur={(tagVal): void => { handleAddition({ id: tagVal, text: tagVal }); }}
                    />
                  </div>
                  <label className='error-message'>
                    {' '}
                    {bccError ? 'Enter a valid email' : ''}
                    {' '}
                  </label>
                </Grid>

                <Grid item md={12}>
                  <HookTextField
                    name='description'
                    label='Description'
                    control={control}
                    errors={errors}
                    multiline
                    rows={5}
                  />
                </Grid>
                <Grid item md={12}>
                  <label htmlFor='schedule-attachment-btn' className='attachment-btn'>
                    <AttachmentIcon color='primary' />
                    <h6> Attach File </h6>
                  </label>
                  <input id='schedule-attachment-btn' type='file' onChange={(e): void => { handleAttachmentChange(e); }} style={{ display: 'none' }} />
                </Grid>
                <div className='message-attachment-list' style={{ marginTop: '15px' }}>
                  {watch('attachments').length > 0 && watch('attachments').map((file) => (

                    <PopupState variant='popover' popupId='demo-popup-popover'>
                      {(popupState): JSX.Element => (
                        <div>
                          <Tooltip title={file.filename}>
                            <div className='message-attachment' style={{ marginTop: '0px' }} {...bindTrigger(popupState)}>
                              {' '}
                              <span style={{ paddingRight: '6px', display: 'flex' }}><InsertDriveFileIcon fontSize='small' /></span>
                              {' '}
                              {file.filename && file.filename.length > 10 ? `${file.filename.substring(0, 10)}...` : file.filename}
                              {' '}
                              <span style={{ display: 'flex' }}>
                                {' '}
                                <ArrowDropDownIcon fontSize='small' />
                              </span>
                            </div>
                          </Tooltip>
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
                            <div className='event-schedule-att-popover'>
                              <div> Download </div>
                              <div onClick={(): void => { deleteFile(file.id); popupState.close(); }} aria-hidden='true'> Delete </div>
                            </div>
                          </Popover>
                        </div>
                      )}
                    </PopupState>

                  ))}
                </div>

              </Grid>

              <Grid item md={12}>
                <div className='event-schedule-footer'>
                  <HookCheckbox
                    name='track_email'
                    label='Track Emails'
                    control={control}
                  />
                  <div className='btn-wrapper'>
                    <PrimayButton type='submit'>
                      Schedule
                    </PrimayButton>
                  </div>
                </div>
              </Grid>
            </form>
          </div>
        </Grid>
        <Grid item md={2} />
      </Grid>
    </div>
  );
}
