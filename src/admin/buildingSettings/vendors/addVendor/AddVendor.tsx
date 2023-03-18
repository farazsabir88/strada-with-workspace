/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Button, Grid, Stack, Tooltip, Typography, Dialog, DialogContent, DialogActions, DialogTitle,
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import StradaLoader from 'shared-components/components/StradaLoader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import { useParams, useNavigate } from 'react-router-dom';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { IFormValues } from 'formsTypes';
import HookTextField from 'shared-components/hooks/HookTextField';
import AddContactIcon from 'assests/images/add_contact.svg';
import UploadIcon from 'assests/images/upload.svg';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { IErrorResponse } from 'admin/AdminFormTypes';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IUploadResponse, IUploadDetails } from 'admin/buildingSettings/chartsOfAccounts/types';
import type { IresponseCelery, Iresult } from 'admin/COIs/AddCOIs/types';
import makeStyles from '@mui/styles/makeStyles';
import type { IContactDetails, IVendorData, IVendorResponse } from '../types';
import AddContact from './AddContact';

const defaultValues: IVendorData = {
  name: '',
  job: '',
  note: '',
  vendor_contacts: [],
};

const useStyles = makeStyles(() => ({
  dialog: {
    '& .MuiDialog-container': {
      '& .MuiPaper-root': {
        maxWidth: '550px',
        width: '550px',
      },

    },
  },
}));

export default function AddVendorContent(): JSX.Element {
  const { tempId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [addContact, setAddContact] = useState(false);
  const [vendorData, setVendorData] = useState<IVendorData>();
  const [contactList, setContactList] = useState<IContactDetails[]>([]);
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [celeryModalOpen, setCeleryModalOpen] = React.useState(false);
  const [getProgress, setGetProgress] = useState(false);
  const [fileUploadData, setFileUploadData] = useState<IUploadDetails[]>([]);
  const intervals = useRef<NodeJS.Timer | null>(null);

  const schema = yup.object().shape({
    name: yup.string().trim().required('Please enter your name'),
    job: yup.string().trim().required('Please enter your job'),
  });

  const {
    control, formState, handleSubmit, getValues, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const { isLoading } = useQuery(
    ['get/edit-vendor-data', tempId],
    async () => axios({
      url: `api/workspace-vendor/${tempId}/`,
      method: 'get',
    }),
    {
      enabled: tempId !== 'new',
      select: (res: AxiosResponse<IVendorResponse>) => res.data.detail,
      onSuccess: (res) => {
        setVendorData(res);
        setContactList(res.vendor_contacts);
        if (res.name !== null) setValue('name', res.name);
        if (res.job !== null) setValue('job', res.job);
        if (res.note !== null) setValue('note', res.note);
      },
      onError: () => {
        enqueueSnackbar('Error fetching data.');
      },
    },
  );

  const {
    mutate: addVendor,
  } = useMutation(async (data: IVendorData) => axios({
    url: `api/workspace-vendor/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data,
  }), {
    onSuccess: async (): Promise<void> => {
      enqueueSnackbar('Vendor Created Successfully.');
      await queryClient.invalidateQueries('user-created-events').then();
      navigate('/workspace/settings/vendors');
    },
    onError: (e: IErrorResponse) => {
      enqueueSnackbar(e.response.message);
    },
  });

  const {
    mutate: updateVendor,
  } = useMutation(async ({ data, id }: { data: IVendorData; id: number }) => axios({
    url: `api/workspace-vendor/${id}/`,
    method: 'PATCH',
    data,
  }), {
    onSuccess: async (): Promise<void> => {
      enqueueSnackbar('Vendor updated Successfully.');
      await queryClient.invalidateQueries('user-created-events').then();
      navigate('/workspace/settings/vendors');
    },
    onError: (e: IErrorResponse) => {
      enqueueSnackbar(e.response.message);
    },
  });

  const onSubmit: SubmitHandler<IVendorData> = (data: IVendorData): void => {
    const payload = data;
    payload.vendor_contacts = contactList;

    if (tempId === 'new') {
      addVendor(payload);
    } else if (vendorData?.id !== undefined) {
      updateVendor({ data: payload, id: vendorData.id });
    } else {
      enqueueSnackbar('Vendor Information not correct. Try again.');
    }
  };

  const getVendorDisabledCheck = (): boolean => {
    if (getValues('name') === '' || getValues('job') === '' || addContact) {
      return true;
    }
    return false;
  };

  const checkProgress = (data: IUploadDetails[]): void => {
    if (intervals.current === null) {
      try {
        const newInterval = setInterval(async () => {
          await axios.post(`${process.env.REACT_APP_BASE_URL}api/celery-progress/`, data, {
          }).then(async (res: AxiosResponse<IresponseCelery>) => {
            const { result } = res.data;

            let runn = false;
            const unprogressedFiles: Iresult[] = result.filter((file) => !file.uploaded);
            runn = unprogressedFiles.length > 0;

            if (!runn) {
              clearInterval(newInterval);
              intervals.current = null;
              setCeleryModalOpen(false);
              setGetProgress(false);

              if (result[0].uploaded && result[0].progress === -1) {
                enqueueSnackbar(result[0].result);
              } else {
                await queryClient.invalidateQueries('get/edit-vendor-data').then();
                enqueueSnackbar(`Contacts were imported from ${fileUploadData[0].name}.`);
              }
            }
          }).catch(() => {
            clearInterval(newInterval);
            intervals.current = null;
            setCeleryModalOpen(false);
            setGetProgress(false);
            enqueueSnackbar('Failed to upload file, please try again.');
          });
        }, 1000);
        intervals.current = newInterval;
      } catch (e) {
        setCeleryModalOpen(false);
        setGetProgress(false);
        enqueueSnackbar('Failed to upload file, please try again.');
      }
    }
  };

  useEffect(() => {
    if (getProgress) {
      checkProgress(fileUploadData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProgress, fileUploadData]);

  const { mutate: uploadContact } = useMutation(
    async (file: File) => {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('vendor', String(tempId));

      return axios({
        url: '/api/workspace-vendor/upload_vendor_contacts/',
        method: 'POST',
        data: formData,
      });
    },
    {
      onSuccess: (res: AxiosResponse<IUploadResponse>) => {
        setFileUploadData([res.data.detail]);
        setGetProgress(true);
        // enqueueSnackbar('Vendor contact(s) from file are being uploaded.');
      },
      onError: () => {
        enqueueSnackbar('Error in uploading Vendor contact(s). Check file format and try again.');
      },
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length !== 0) {
      setCeleryModalOpen(true);
      uploadContact(e.target.files[0]);
    }
  };

  const onCeleryClose = (): void => {
    setGetProgress(false);
    setCeleryModalOpen(false);
  };

  const onInputClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  };

  return (
    <div className='add-template-container'>
      <StradaLoader open={isLoading} />
      <Stack spacing={1} direction='row' className='stack-header'>
        <div
          className='back-div'
        >
          {' '}
          <ArrowBackIcon
            className='back-icon'
            onClick={(): void => {
              window.history.back();
            }}
          />
        </div>
        {tempId === 'new' ? <Typography className='template-heading'>Add new vendor</Typography> : (
          <Typography className='template-heading'>
            Edit
            {' '}
            {vendorData?.name}
          </Typography>
        )}
        <div className='ms-auto cursor-pointer'>
          <Tooltip title='Vendor name and job must be distinct.'>
            <InfoIcon className='back-icon ' />
          </Tooltip>
        </div>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container columnSpacing={3}>
          <Grid item sm={6} md={6}>
            <HookTextField
              name='name'
              label='Name'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item sm={6} md={6}>
            <HookTextField
              name='job'
              label='Job'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item md={12}>
            <HookTextField
              name='note'
              label='Type your notes'
              control={control}
              errors={errors}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
        <Grid item md={12} className='d-flex justify-content-between mt-3 mb-2'>
          <Grid item sm={6} md={6}>
            <p className='fw-bolder'>Contacts</p>
          </Grid>
          <Grid item sm={6} md={6}>
            {tempId !== 'new' && (
              <Button
                variant='outlined'
                className='text-transform-none text-dark me-2'
                style={{ border: '1px solid #e4e4e4', padding: '5px 10px' }}
                component='label'
              >
                <img src={UploadIcon} alt='' className='me-2' />
                Upload
                <input hidden accept='.xlsx,.xls,.csv' multiple={false} type='file' onClick={onInputClick} onChange={handleChange} />
              </Button>
            )}
            <Button
              variant='outlined'
              className='text-transform-none text-dark'
              style={{ border: '1px solid #e4e4e4', padding: '5px 10px' }}
              onClick={(): void => { setAddContact(true); }}
            >
              <img src={AddContactIcon} alt='' className='me-2' />
              Add Contact
            </Button>
          </Grid>
        </Grid>
        {!addContact && contactList.length === 0 && (
          <Grid item md={12} className='mb-3'>
            <p style={{ fontSize: '14px' }}>There are no contacts</p>
          </Grid>
        )}

        {(addContact || contactList.length > 0) && (
          <AddContact setAddContact={setAddContact} addContact={addContact} contactList={contactList} setContactList={setContactList} />
        )}

        <Grid item sm={6} className='text-end mt-3'>
          <Button
            variant='outlined'
            className='text-transform-none text-dark'
            style={{ border: '1px solid #e4e4e4' }}
            onClick={(): void => { window.history.back(); }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={getVendorDisabledCheck()}
            className='ms-2 text-transform-none text-white'
          >
            Save
          </Button>
        </Grid>
      </form>

      <Dialog
        open={celeryModalOpen}
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle>
          <p className='gl-diloag-title'>
            Uploading in progress
          </p>
        </DialogTitle>
        <DialogContent style={{ color: 'rgba(33, 33, 33, 0.6)' }}>
          This should take a few minutes. If you’d like, you can close this dialog and continue working.
        </DialogContent>
        <DialogActions>
          <Button variant='text' className='text-transform-none me-3 primary-color' onClick={onCeleryClose}>
            Close
          </Button>
          <div className='upload-button'>
            <StradaSpinner open message='Uploading' />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
