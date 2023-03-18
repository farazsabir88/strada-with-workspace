/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Button,
  Grid, IconButton, InputBase, Tooltip, TextField, Autocomplete,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as yup from 'yup';
import moment from 'moment';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import AttachmentIcon from '@mui/icons-material/Attachment';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
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
import type { IEventScheduleModule } from 'admin/AdminFormTypes';
import { WithContext as ReactTags } from 'react-tag-input';
import SelectInput from 'shared-components/inputs/SelectInput';
import makeStyles from '@mui/styles/makeStyles';
import type { SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { RootState } from 'mainStore';
import { useSelector } from 'react-redux';
import DateRangeDialog from '../EventSchedule/DateRangeDialog';
import type {
  ISchedulingVendor, IRFPData, ISchedualingData, ISelectedAttachment, IErrorResponse,
} from '../types';
import CustomCalendar from '../EventSchedule/CustomCalendar';

interface IStatusOption {
  name: string;
  value: number;
  color: string;
  background: string;
}
interface IDetail {
  id: number;
  template_name: string;
}

interface IRFPlist {
  detail: IDetail[];
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
  invitation_title: '',
  track_email: false,
  is_email_scheduled: true,
  is_rfp_form_link: false,
  durationType: '',
  future_days: 1,
  dayRangeType: '',
  startDate: '',
  endDate: '',
  timeDuration: null,
  future: '',
  range: '',
  rfp_form: '',
  forever: '',
  status: 1,
  files: [],
  attachments: [],
  rfps: [],
};

const useStyles = makeStyles(() => ({
  sss: {
    '& .MuiSelect-outlined': {
      border: '1px solid rgb(226, 226, 225)',

    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
}));

const rfpFormSchema = yup.object().shape({
  // invitation_title: yup.string().required('Enter Title').nullable(),
});

export default function RFPScheduleContent(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const navigate = useNavigate();
  const {
    eventId, eventType,
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
  const [rfpSelectionDisabled, setRFPSelectionDisabled] = useState<boolean>(true);
  const [selectedAttachments, setSelectedAttachments] = useState<ISelectedAttachment[]>([]);
  const [rfpFormData, setRFPFormData] = useState({
    value: '',
    name: '',
  });
  const [rfpNotExist, setRFPNotExist] = useState<boolean>(false);
  const [isAddRFP, setIsAddRFP] = useState<boolean>(false);
  const [editRFPData, setEditRFPData] = useState<IRFPData | null>(null);
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

  const {
    control, formState, handleSubmit, setValue, watch, getValues,
  } = useForm<IFormValues>({
    mode: 'onChange',
    resolver: yupResolver(rfpFormSchema),
    defaultValues: scheduleContentDefaultValues,
  });

  const { errors } = formState;
  //  gettting current event schedule

  const { data: schedulingData = null } = useQuery(
    'get-event-send-rfp-schedule',
    async () => axios({
      url: `/api/budget-calendar/event-send-rfp/${eventId}/`,
      method: 'GET',
    }),
    {
      select: (res: AxiosResponse<ISchedualingData>) => res.data.detail,
    },
  );

  const { mutate: handlePost, isLoading: updating } = useMutation(async (dataToPost: IEventScheduleModule) => axios({
    url: `/api/budget-calendar/event-send-rfp/${eventId}/`,
    method: 'PATCH',
    data: dataToPost,
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-event-send-rfp-schedule').then();
      enqueueSnackbar(`RFP was sent for "${schedulingData?.title}"`);
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
    // schedulingData.vendor_contact = null;
    setValue('vendor_contact', null);
    setVendor(value);
    setVendorContact(null);
    setVendorContactList([]);
  };
  const handleVendorContactValue = (value: IVendorContact): void => {
    setValue('vendor_contact', value, { shouldDirty: true });
    setVendorContact(value);
  };

  const { data: rfpList } = useQuery(
    'event-get-rfp',
    async () => axios({
      url: `/api/rfp-template/?workspace=${currentWorkspace.id}`,
    }),
    {
      select: (res: AxiosResponse<IRFPlist>) => res.data.detail.map((rfp) => ({
        name: rfp.template_name,
        value: `${rfp.id}`,
      })),
    },
  );

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
      setValue('timeDuration', 0, { shouldDirty: true });
    } else {
      const timeDuration = Number.parseInt(value, 10);
      setValue('timeDuration', Number(timeDuration));
    }
    setValue('durationType', value);
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
    if (vendor !== null) {
      getVendorContact(vendor.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('vendor')]);

  const uploadFile = (file: File, id: string | undefined): void => {
    const data: ISelectedAttachment = {
      file,
      filename: file.name,
      id: String(id),
    };
    setSelectedAttachments([...selectedAttachments, data]);
    enqueueSnackbar('File added Successfully');
  };
  const deleteFile = (id: string | undefined): void => {
    const files = selectedAttachments.filter((file) => file.id !== id);
    setSelectedAttachments(files);
    enqueueSnackbar('File deleted Successfully');
  };
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length !== 0) {
      // let id: string | undefined = '';
      // id = String(editRFPData?.id);
      const id = Date.now().toString();
      uploadFile(e.target.files[0], id);
    }
  };

  useEffect(() => {
    if (schedulingData !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      getValues('invitation_title') === '' && setValue('invitation_title', schedulingData.invitation_title, { shouldDirty: true });
      setValue('subject', schedulingData.subject, { shouldDirty: true });
      setValue('description', schedulingData.description, { shouldDirty: true });
      setValue('dayRangeType', schedulingData.dayRangeType, { shouldDirty: true });
      setValue('durationType', schedulingData.durationType, { shouldDirty: true });
      setValue('endDate', schedulingData.endDate, { shouldDirty: true });
      setValue('startDate', schedulingData.startDate, { shouldDirty: true });
      setValue('timeDuration', schedulingData.timeDuration, { shouldDirty: true });
      setValue('status', schedulingData.status, { shouldDirty: true });
      setValue('future_days', schedulingData.future_days, { shouldDirty: true });
      setFutureDays(schedulingData.future_days);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, schedulingData, setValue]);

  useEffect(() => {
    if (rfpFormData.name === '') {
      if (rfpList !== undefined && rfpList.length > 0 && schedulingData !== null && schedulingData.rfp_form !== null && schedulingData.rfp_form !== '') {
        const newOptions = rfpList.filter((option) => option.name === schedulingData.rfp_form);
        if (newOptions.length > 0) {
          setRFPFormData(newOptions[0]);
        } else {
          setRFPFormData({ value: schedulingData.rfp_form, name: schedulingData.rfp_form });
          setRFPNotExist(true);
        }
      } else {
        setRFPFormData({ value: '', name: '' });
      }
    }
  }, [rfpFormData.name, rfpList, schedulingData]);

  const handleRFPChange = (e: SelectChangeEvent): void => {
    if (rfpList !== undefined && rfpList.length > 0) {
      const newOptions = rfpList.filter((option) => option.value === e.target.value);
      if (newOptions.length > 0) {
        setRFPFormData(newOptions[0]);
      } else {
        setRFPFormData({ value: '', name: '' });
      }
      setRFPSelectionDisabled(false);
    }
  };

  useEffect(() => {
  }, [schedulingData]);

  const onSubmit = (formData: IEventScheduleModule): void => {
    if (schedulingData !== null) {
      schedulingData.future_days = Number(futureDays);

      handlePost({
        ...formData, future_days: Number(futureDays), rfp_form: rfpFormData.name, rfp_form_id: rfpFormData.value !== null ? Number(rfpFormData.value) : null,
      });
    }
  };

  useEffect(() => {
    document.getElementById('budget-calendar-start')?.scrollIntoView();
  }, []);

  const clearFieldsData = (): void => {
    setValue('description', '', { shouldDirty: true });
    setValue('subject', '', { shouldDirty: true });
    setVendor(null);
    setVendorContact(null);
    setSelectedAttachments([]);
    setVendorBcc([]);
    setcc([]);
  };

  const { mutate: addRFPMessage } = useMutation(async (dataToPost: IRFPData) => axios({
    url: '/api/budget-calendar/event-rfp-email/',
    method: 'POST',
    data: dataToPost,
  }), {
    onSuccess: async () => {
      clearFieldsData();
      setEditRFPData(null);
      setIsAddRFP(false);
      await queryClient.invalidateQueries('get-event-send-rfp-schedule').then();
    },
    onError: () => {
      enqueueSnackbar('Can not add message');
    },
  });

  const { mutate: updateRFPMessage } = useMutation(async ({ id, data }: { id: number | undefined; data: IRFPData }) => axios({
    url: `/api/budget-calendar/event-rfp-email/${id}/`,
    method: 'PATCH',
    data,
  }), {
    onSuccess: async (): Promise<void> => {
      setEditRFPData(null);
      setIsAddRFP(false);
      clearFieldsData();
      await queryClient.invalidateQueries('get-event-send-rfp-schedule').then();
    },
    onError: () => {
      enqueueSnackbar('Can not delete message');
    },
  });

  const { mutate: deleteRFPMessage } = useMutation(async (id: number | undefined) => axios({
    url: `/api/budget-calendar/event-rfp-email/${id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-event-send-rfp-schedule').then();
    },
    onError: () => {
      enqueueSnackbar('Can not delete message');
    },
  });

  const handleRFPEdit = (index: number): void => {
    if (schedulingData) {
      const data = schedulingData.rfps[index];
      setEditRFPData(schedulingData.rfps[index]);
      setVendor(schedulingData.rfps[index].vendor);
      setVendorContact(schedulingData.rfps[index].vendor_contact);
      setSelectedAttachments(schedulingData.rfps[index].attachments);
      setValue('description', data.description, { shouldDirty: true });
      setValue('subject', data.subject, { shouldDirty: true });
      setValue('vendor', data.vendor, { shouldDirty: true });
      const bcc = data.vendor_bcc.map((val: string) => ({ text: val, id: val }));
      const ccc = data.vendor_cc.map((cc_val: string) => ({ text: cc_val, id: cc_val }));
      setVendorBcc(bcc);
      setcc(ccc);
    }
  };

  const handleRFPDelete = (index: number): void => {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (schedulingData && schedulingData.rfps[index].id !== undefined) {
      deleteRFPMessage(schedulingData.rfps[index].id);
    }
  };

  const renderDisplayRFP = (rfp: IRFPData, index: number): JSX.Element => (
    <Grid item className='message-card'>
      <div className='message-email'>
        {rfp.vendor !== null ? rfp.vendor.label : ''}
        ,
        {' '}
        {rfp.vendor_contact !== null ? rfp.vendor_contact.email : ''}
        <div className='message-options'>
          <EditIcon className='cursor-pointer' onClick={(): void => { handleRFPEdit(index); }} />
          <span style={{ marginLeft: '5px' }}>
            <DeleteIcon className='cursor-pointer' onClick={(): void => { handleRFPDelete(index); }} />
          </span>
        </div>
      </div>
      <div className='message-subject'>{rfp.subject}</div>
      <div className='message-description'>{rfp.description}</div>
      <div className='message-attachment-list' style={{ marginTop: '15px' }}>
        {rfp.attachments?.map((file) => (
          <Tooltip title={file.filename}>
            <div className='message-attachment' style={{ marginTop: '0px' }}>
              <span style={{ paddingRight: '6px', display: 'flex' }}><InsertDriveFileIcon fontSize='small' /></span>
              {file.filename !== '' && file.filename.length > 10 ? `${file.filename.substring(0, 10)}...` : file.filename}
              <span style={{ display: 'flex' }}>
                <ArrowDropDownIcon fontSize='small' />
              </span>
            </div>
          </Tooltip>
        ))}
      </div>

    </Grid>
  );

  const onAddRFPClick = (): void => {
    setIsAddRFP(true);
    // addRFPMessage({ type: 'event', event: Number(eventId) });
  };

  const onCancelRFPClick = (): void => {
    if (isAddRFP && editRFPData !== null) {
      deleteRFPMessage(editRFPData.id);
    }
    setEditRFPData(null);
    setVendor(null);
    setVendorContact(null);
    setSelectedAttachments([]);
    clearFieldsData();
    setIsAddRFP(false);
  };

  async function file2Base64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => { resolve(reader.result !== null && typeof reader.result === 'string' ? reader.result.toString() : ''); };
      reader.onerror = (error): void => { reject(error); };
    });
  }

  const onSaveRFPClick = async (): Promise<void> => {
    const attachmentsData: string[] = await Promise.all(selectedAttachments.map(async (file): Promise<string> => {
      if (typeof file.file !== 'string') {
        return file2Base64(file.file).then((res): string => res);
      }
      return file.file;
    }));
    const newData: ISelectedAttachment[] = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let count = 0; count < selectedAttachments.length; count++) {
      const obj: ISelectedAttachment = { file: '', filename: '', id: '' };
      // eslint-disable-next-line prefer-destructuring
      obj.file = attachmentsData[count];
      obj.filename = selectedAttachments[count].filename;
      obj.id = selectedAttachments[count].id.length > 10 ? '' : selectedAttachments[count].id;
      newData.push(obj);
    }
    const data: IRFPData = {
      description: getValues('description'),
      event: Number(eventId),
      attachments: newData,
      // attachments: [],
      // is_saved: true,
      subject: getValues('subject'),
      // type: 'event',
      vendor,
      vendor_cc: cc.map((singleCC) => singleCC.text),
      vendor_bcc: vendorBcc.map((singleCC) => singleCC.text),
      vendor_contact: vendorContact,
    };
    if (isAddRFP) {
      addRFPMessage(data);
    } else {
      updateRFPMessage({ id: editRFPData?.id, data });
    }
  };

  const getDisabledCheck = (): boolean => {
    watch('subject');
    watch('description');

    if (vendor === null || vendorContact === null || getValues('subject') === '' || getValues('subject') === null || getValues('description') === '' || getValues('description') === null) {
      return true;
    }
    return false;
  };

  const renderAddEditForm = (): JSX.Element => (
    <Grid container className='mt-4'>
      <Grid container columnSpacing={2} className='d-flex mb-2 justify content-between'>
        <Grid item sm={6}>
          <div className='d-flex'>
            {editRFPData === null ? 'Add ' : 'Edit '}
            message
            <label htmlFor='schedule-attachment-btn' className='attachment-btn ms-3'>
              <AttachmentIcon color='primary' />
              <h6> Attach File </h6>
            </label>
            <input id='schedule-attachment-btn' type='file' onChange={(e): void => { handleAttachmentChange(e); }} style={{ display: 'none' }} />
          </div>
        </Grid>
        <Grid item sm={6} className='text-end'>
          <Button
            variant='text'
            className='text-transform-none'
            onClick={(): void => { onCancelRFPClick(); }}
          >
            Cancel
          </Button>
          <Button
            variant='text'
            disabled={getDisabledCheck()}
            className='ms-2 text-transform-none'
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            onClick={(): void => { onSaveRFPClick(); }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Grid container columnSpacing={2}>
        <Grid item md={6} sm={12}>
          <Autocomplete
            // disablePortal
            disableClearable
            options={vendorList}
            // defaultValue={vendor}
            value={vendor}
            style={{ marginBottom: '20px' }}
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
        </Grid>
        <Grid item md={6} sm={12}>
          <Autocomplete
            // freeSolo
            disableClearable
            options={vendorContactList}
            value={vendorContactList.length > 0 ? vendorContact : ''}
            style={{ marginBottom: '20px' }}
            onChange={(obj: React.SyntheticEvent, value): void => { handleVendorContactValue(value); }}
            renderInput={(params): JSX.Element => (
              <TextField
                {...params}
                name='vendor_contact'
                placeholder='Search by name and email'
                label='Contact Person'
              />
            )}
          />
        </Grid>
        <Grid item md={12}>
          <HookTextField
            name='subject'
            label='Subject'
            control={control}
            errors={errors}
            autoFocus
          />
        </Grid>

        <Grid item md={12}>
          <div className='bcc-wrapper'>
            <label> CC </label>
            <ReactTags
              tags={cc}
              handleDelete={handleDeletecc}
              handleAddition={(tagone): void => { handleAdditioncc(tagone); }}
              autofocus={false}
              handleInputBlur={(tagVal): void => { handleAdditioncc({ id: tagVal, text: tagVal }); }}
            />
          </div>
          <label className='error-message' style={{ marginBottom: '24px' }}>
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
              autofocus={false}
              handleInputBlur={(tagVal): void => { handleAddition({ id: tagVal, text: tagVal }); }}
            />
          </div>
          <label className='error-message' style={{ marginBottom: '24px' }}>
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
        <div className='message-attachment-list' style={{ marginTop: '15px' }}>
          {selectedAttachments.length > 0 && selectedAttachments.map((file) => (

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
    </Grid>
  );

  const renderRFPContent = (): JSX.Element => (
    <Grid container columnSpacing={2} className='d-flex justify content-between'>
      <Grid item sm={6} className='message'>Messages</Grid>
      { schedulingData && schedulingData.rfps.length === 0
        ? (
          <Grid item sm={6} className='text-right'>
            <Button variant='text' onClick={(): void => { onAddRFPClick(); }}>
              <AddIcon fontSize='small' />
              Add
            </Button>
          </Grid>
        )
        : <Grid item sm={6} /> }

      {!isAddRFP && schedulingData && schedulingData.rfps.length === 0
        ? (
          <Grid item sm={12} className='message-empty mt-4'>
            Click on the button &#34;Add&#34; to write the messages to vendors.
          </Grid>
        ) : null }
      {schedulingData && schedulingData.rfps.length > 0 && schedulingData.rfps.map((rfp, index) => {
        if (editRFPData?.id === rfp.id) {
          return renderAddEditForm();
        }
        return renderDisplayRFP(rfp, index);
      })}

      {isAddRFP && renderAddEditForm()}

      { !isAddRFP && schedulingData && schedulingData.rfps.length > 0 // count === 0 &&
            && (
              <Button variant='text' onClick={(): void => { onAddRFPClick(); }}>
                <AddIcon fontSize='small' />
                Add
              </Button>
            )}
    </Grid>
  );
  return (
    <div style={{ width: '100%', paddingTop: '62px' }} id='budget-calendar-start'>
      {/* <StradaLoading message={deleting ? 'Deleting...' : 'loading...'} open={uploading || deleting || updating} /> */}
      <StradaLoading message='loading...' open={updating} />
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

              {(eventType !== 'task') && (
                <Grid container>
                  <Grid item sm={6}>
                    <div className='custom-switch'>
                      <CustomSwitch
                        checked={!!watch('is_rfp_form_link')}
                        onChange={(e, val): void => {
                          setValue('is_rfp_form_link', val);
                        }}
                      />
                      <p>Add RFP form link to email</p>
                    </div>
                  </Grid>
                  <Grid item sm={6}>
                    {rfpNotExist ? (
                      <div className='no-rfp'>
                        {rfpFormData.name}
                        <ArrowDropDownIcon />
                      </div>
                    )
                      : (
                        <SelectInput
                          name='country'
                          label={rfpFormData.value === '' ? 'Select RFP form' : ''}
                          value={rfpFormData.value}
                          showPleaseSelect={false}
                          className={classes.sss}
                          showPlaceholder
                          onChange={(e): void => { handleRFPChange(e); }}
                          options={rfpList ?? []}
                          disabled={!!((rfpFormData.name !== '' && rfpSelectionDisabled) || !watch('is_rfp_form_link'))}
                        />
                      ) }
                  </Grid>
                </Grid>
              )}

              { renderRFPContent() }

              <Grid item md={12}>
                <div className='event-schedule-footer'>
                  <HookCheckbox
                    name='track_email'
                    label='Track Emails'
                    control={control}
                  />
                  <div className='btn-wrapper'>
                    <PrimayButton type='submit' disabled={schedulingData?.rfps.length === 0}>
                      Send RFP
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
