/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Divider, Stack,
} from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import './_dragDrop.scss';
import StradaLoader from 'shared-components/components/StradaLoader';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { RootState } from 'mainStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Img from 'assests/images/uploadFile.svg';

// commented code is for later use

// import type { SelectChangeEvent } from '@mui/material';
// import SelectInput from 'shared-components/inputs/SelectInput';
// import type { BuildingsResponse } from 'admin/buildingSection/building-dashboard/types';
import type {
  IresponseCelery, Iresponse, Iresult, Ipayload, IcreatCois,
} from './types';

export default function DragDrop(): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [coisFiles, setCOIsFiles] = useState<Iresult[]>([]);

  const intervals = useRef<NodeJS.Timer | null>(null);
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  // const { data: properties = [] } = useQuery(
  //   ['get/buildings'],
  //   async () => axios({
  //     url: `api/filter/property/?workspace=${currentWorkspace.id}`,
  //     method: 'get',
  //   }),
  //   {
  //     select: (res: AxiosResponse<BuildingsResponse>) => {
  //       const options = res.data.detail.map((obj) => ({
  //         name: obj.address,
  //         value: obj.id,
  //       }));

  //       return options;
  //     },
  //   },
  // );
  const checkProgress = (cois: Iresult[]): void => {
    if (intervals.current === null) {
      try {
        const newInterval = setInterval(async () => {
          await axios.post('api/celery-progress/', cois, {
          }).then((res: AxiosResponse<IresponseCelery>) => {
            const { result } = res.data;
            let data = [...coisFiles];
            if (result.length > 0) {
              data = data.map((coi) => {
                const item2 = result.find((file) => file.taskId === coi.taskId);
                return item2 ?? coi;
              });
            }
            setCOIsFiles([...data]);
            let runn = false;
            const unprogressedFiles: Iresult[] = data.filter((file) => !file.uploaded);
            runn = unprogressedFiles.length > 0;
            if (!runn) {
              clearInterval(newInterval);
              intervals.current = null;
            }
          }).catch(() => {
            clearInterval(newInterval);
            intervals.current = null;
            enqueueSnackbar('Upload Failed!', { variant: 'error' });
          });
        }, 1000);
        intervals.current = newInterval;
      } catch (e) {
        enqueueSnackbar('Upload Failed!', { variant: 'error' });
      }
    }
  };

  const { mutate, isLoading } = useMutation(async (data: FormData) => axios({
    url: '/api/coi/upload_multiple_files/',
    method: 'post',
    data,
  }), {
    onSuccess: (res: AxiosResponse<Iresponse>) => {
      coisFiles.push(...res.data.details);
      setCOIsFiles([...coisFiles]);
      checkProgress(res.data.details);
    },
    onError: () => {
      enqueueSnackbar('Upload Failed!', { variant: 'error' });
    },
  });

  const toArray = (data: File[]): File[] => Array.prototype.slice.call(data);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/pdf': ['.pdf'],
    },
    onDrop: (accepted: File[]) => {
      const fileLists = toArray(accepted);
      const data = new FormData();
      fileLists.forEach((file) => {
        data.append('files', file);
      });
      mutate(data);
    },
  });

  const handleFileDelete: (index: number) => void = (index) => {
    const newFiles = [...coisFiles];
    newFiles.splice(index, 1);
    setCOIsFiles(newFiles);
  };

  const { mutate: uploadFiles, isLoading: uploading } = useMutation(async (data: Ipayload) => axios({
    url: '/api/coi/create_coi/',
    method: 'post',
    data,
  }), {
    onSuccess: async () => {
      navigate('/workspace/cois');
      await queryClient.invalidateQueries('get/cois').catch()
        .then();
      await queryClient.invalidateQueries('get/vendor').catch()
        .then();

      await queryClient.invalidateQueries('get/cois-errors').catch()
        .then();
      enqueueSnackbar('COIs Uploaded Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Upload Failed!', { variant: 'error' });
    },
  });

  const onAddFiles: () => void = () => {
    coisFiles.forEach((item) => {
      if (!item.uploaded) {
        enqueueSnackbar('COI is Loading, Please wait', { variant: 'error' });
      }
    });

    const resultArr: IcreatCois[] | null[] = coisFiles.map((item) => item.result);

    const payload: Ipayload = {
      workspace: Number(currentWorkspace.id),
      user: user.id,
      data: resultArr,
    };

    if (payload.data.length > 0) {
      uploadFiles(payload);
    } else {
      enqueueSnackbar('Please add COI');
    }
  };

  return (
    <Stack className='coi-file-uplaod new-coi'>
      <div className='main-area'>
        <StradaLoader open={isLoading || uploading} />
        <section className='drap-section-cois'>
          <div className='header'>
            <ArrowBackIcon className='back-icon' onClick={(): void => { window.history.back(); }} />
            <p>Add COI</p>

          </div>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <Box className='preview-container-cois'>
              Drag and drop a document here or click
              <br />
              <img src={Img} alt='img_' />

            </Box>
          </div>
        </section>

        {coisFiles.length > 0 && coisFiles.map((file, index) => (
          <div key={file.taskId} className='input-wrap'>
            <div className='rows'>
              <InsertDriveFileIcon fontSize='large' />
              <div className='attachment'>
                <div className='attachment-name'>{file.name}</div>
                {file.uploaded && (
                  <div className='attachment-label'>
                    <div className='logo'><i className='fas fa-check-circle' /></div>
                    <div className='label'>Success</div>
                  </div>
                )}
                {!file.uploaded && (
                  <div className='attachment-coi'>
                    <div className='logo'>Loading... </div>
                    <div className='label'>
                      {file.progress}
                      %
                    </div>
                  </div>
                )}

              </div>
              {/* <div className='select-field'>
                <SelectInput
                  value='0'
                  name='name'
                  label='Property'
                  onChange={(obj: SelectChangeEvent): void => { console.log(obj.target.value); }}
                  options={properties}
                  showPleaseSelect={false}
                />
              </div> */}
              <div className='control-area cursor-pointer'>
                <DeleteIcon className='delete-icon' onClick={(): void => { handleFileDelete(index); }} />

              </div>
            </div>
            <Divider className='attachment-divider' />
          </div>
        ))}

        <div className='add-cois'>
          <PrimayButton onClick={onAddFiles}> Add COIs</PrimayButton>
        </div>
      </div>

    </Stack>
  );
}
