/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import { Box } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { decrypt } from 'shared-components/hooks/useEncryption';
import './_drag.scss';
import StradaLoader from 'shared-components/components/StradaLoader';

interface NewFile extends File {
  preview: string;
}
export default function DragDrop(): JSX.Element {
  const [files, setFiles] = useState<NewFile[]>([]);
  const { buildingId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/xls': ['.xls'],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file),
      })));
    },
  });

  useEffect(
    () => () => { files.forEach((file) => { URL.revokeObjectURL(file.preview); }); },
    [],
  );

  const { mutate, isLoading } = useMutation(async (data: FormData) => axios({
    url: '/api/budget-calendar-file/',
    method: 'post',
    data,
  }), {
    onSuccess: () => {
      enqueueSnackbar('Upload Successfull');
    },
    onError: () => {
      enqueueSnackbar('Upload Failed!', { variant: 'error' });
    },
  });

  useEffect(() => {
    if (files.length !== 0) {
      const decryptedId = decrypt(buildingId);
      const data = new FormData();
      data.append('files', files[0]);
      data.append('date', moment(new Date()).format('YYYY-MM-DD'));
      data.append('offset', '0');
      data.append('limit', '100');
      data.append('property', String(decryptedId));
      mutate(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <>
      <StradaLoader open={isLoading} />
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box className='preview-container-budget '>
            Drag and drop a document here
            {' '}
            <span className='text-decor'> or Click</span>
          </Box>
        </div>
      </section>
    </>
  );
}
