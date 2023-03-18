/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Grid, Typography, Divider,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import './_emailTemplate.scss';
import type { ReactElement, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import PrimayButton from 'shared-components/components/PrimayButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import type { IFormValues } from 'formsTypes';
import StradaLoader from 'shared-components/components/StradaLoader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import type { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import type { Ierror } from '../types';
import type { Iinput } from './types';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

interface Iprops {
  emailData: Ierror;
  setEmailData: () => void;
}

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  // eslint-disable-next-line react/jsx-props-no-spreading
  ) => <Slide direction='right' ref={ref} {...props} />,
);

export default function AddTemplate(props: Iprops): JSX.Element {
  const { emailData, setEmailData } = props;

  const [files, setFiles] = useState<File[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const zoomPluginInstance = zoomPlugin();
  const { ZoomIn, ZoomOut } = zoomPluginInstance;

  const defaultInput: Iinput = {
    email: '',
    subject: '',
  };
  const schema = yup.object().shape({
    email: yup.string().trim().required('Email is required').email('Enter valid email'),
    subject: yup.string().trim().required('Field is required'),

  });
  const {
    control, formState, handleSubmit, setValue, watch,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: defaultInput,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('context', emailData.insured_email, { shouldDirty: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailData]);
  const { mutate: sendEmail, isLoading } = useMutation(async (payload: FormData) => axios({
    url: '/api/send-cois-email/',
    method: 'post',
    data: payload,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/cois-error').catch()
        .then();
      enqueueSnackbar('Email Sent');
      setEmailData();
    },
  });

  const { errors } = formState;

  const onSubmit: SubmitHandler<IFormValues> = (paylaodData: IFormValues) => {
    const data = new FormData();
    data.append('email', paylaodData.email);
    data.append('context', paylaodData.context);
    data.append('subject', paylaodData.subject);
    data.append('cois_id', String(emailData.cois_id));

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      data.append('files', file);
    }
    sendEmail(data);
  };

  const fileHandler: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    if (e.target.files?.length !== undefined && e.target.files.length !== 0) {
      setFiles([...files, e.target.files[0]]);
    }
  };
  const handleChangeTextarea: (event: React.ChangeEvent<HTMLTextAreaElement>) => void = (event) => {
    setValue('context', event.target.value, { shouldDirty: true });
  };

  const deleteFileHandler: (index: number) => void = (index) => {
    const filteredFiles = files.filter((item, i) => i !== index);
    setFiles(filteredFiles);
  };

  /* eslint-disable @typescript-eslint/no-misused-promises */
  return (
    <div className='cois-email-template'>
      <StradaLoader open={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columnSpacing={3}>

          <Grid item sm={12} md={12}>
            <div className='header'>
              <ArrowBackIcon className='back-icon' onClick={setEmailData} />
              <p>Send notice</p>
            </div>
            <Typography className='sub-header'>
              {emailData.insured}
            </Typography>

          </Grid>
          <Grid item sm={12} md={12}>
            <HookTextField
              name='email'
              label='To*'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item sm={12} md={12}>
            <HookTextField
              name='subject'
              label='Subject*'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item sm={12} md={12}>
            <TextareaAutosize
              className='text-area'
              minRows={18}
              aria-label='maximum height'
              value={watch('context')}
              onChange={handleChangeTextarea}
            />
          </Grid>

          <Grid item sm={12} md={12}>
            <div className='attachment-container'>
              <label htmlFor='attachment-button' className='d-flex'>
                <i className='fa-solid fa-paperclip' />
                <p>Attach Document</p>
              </label>

            </div>
            <input type='file' id='attachment-button' style={{ display: 'none' }} onChange={fileHandler} accept='application/pdf' />
            <Divider light />
            <div>
              <div className='file-listing'>
                <p onClick={(): void => { setOpen(true); setDocUrl(emailData.coi_file_name); }}>{emailData.coi_file_name}</p>
              </div>
              <Divider light />
              {files.length > 0
            && files.map((file, index) => (
              <div>
                <div className='file-listing'>
                  <p onClick={(): void => { setOpen(true); setFile(file); }}>{file.name && file.name}</p>
                  <DeleteIcon onClick={(): void => { deleteFileHandler(index); }} className='delete-icon' />
                </div>
                <Divider light />
              </div>
            ))}
            </div>

          </Grid>

        </Grid>
        <Grid className='d-flex justify-content-end' my={3}>
          <div>
            <PrimayButton type='submit'>
              Send Notice
            </PrimayButton>
          </div>
        </Grid>
      </form>
      {open && (
        <Dialog
          fullScreen
          open
          TransitionComponent={Transition}
          className='pdf-dialog-send-notice'
        >
          <div className='pdf-container'>
            <div className='close-btn text-end'>
              <ArrowBackIcon fontSize='medium' sx={{ color: 'white', cursor: 'pointer' }} onClick={(): void => { setOpen(false); setDocUrl(null); }} />
              <p>{docUrl !== null ? docUrl : file?.name}</p>
            </div>
            <div
              className='zoom-container'
            >
              <div style={{ padding: '0px 2px' }}>
                <ZoomOut>
                  {(props: RenderZoomOutProps): ReactNode => (
                    <div
                      className='zoom-btn-out'
                      onClick={props.onClick}
                    >
                      -
                    </div>
                  )}
                </ZoomOut>
              </div>

              <div style={{ padding: '0px 2px' }}>
                <ZoomIn>
                  {(props: RenderZoomInProps): ReactElement => (
                    <div
                      className='zoom-btn-in'
                      onClick={props.onClick}
                    >
                      +
                    </div>
                  )}
                </ZoomIn>
              </div>
            </div>
            <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js'>
              <Viewer plugins={[zoomPluginInstance]} fileUrl={docUrl !== null ? `${process.env.REACT_APP_IMAGE_URL}/api/media/documents/cois/${docUrl}` : window.URL.createObjectURL(file)} />
            </Worker>
          </div>
        </Dialog>
      )}

    </div>

  );
}
