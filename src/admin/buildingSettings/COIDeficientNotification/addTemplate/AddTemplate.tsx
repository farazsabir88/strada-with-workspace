/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Grid, Typography, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import './_addTemplate.scss';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { Editor } from '@tinymce/tinymce-react';
import { useParams } from 'react-router-dom';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import HookTextField from 'shared-components/hooks/HookTextField';
import { decrypt } from 'shared-components/hooks/useEncryption';
import type { IFormValues } from 'formsTypes';
import type {
  Iinputs, Ipayload, IfilteredProps, IDetail,
} from './types';

export default function AddTemplate(): JSX.Element {
  const { tempId } = useParams();
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const [editorError, setEditorError] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<string>('');
  const [editId, setEditId] = useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ['edit/coi-deficient-template', currentWorkspace.id, tempId],
    async () => axios({
      url: `/api/coi-deficient-template/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: tempId !== 'new',
      select: (res: AxiosResponse<IfilteredProps>) => res.data.detail,
    },
  );
  const defaultInput: Iinputs = {
    name: '',
    description: '',
  };
  const schema = yup.object().shape({
    name: yup.string().trim().required('Name is required'),

  });
  const {
    control, formState, handleSubmit, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: defaultInput,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (tempId !== 'new' && data !== undefined) {
      const decryptedId = Number(decrypt(tempId));
      const filteredItem = data.filter((item: IDetail) => item.id === decryptedId);
      setEditorState(filteredItem[0].content);
      setEditId(filteredItem[0].id);
      setValue('name', filteredItem[0].template_name, { shouldDirty: true });
      setValue('description', filteredItem[0].description, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempId, currentWorkspace.id, data]);

  const { mutate: addTemplate, isLoading: addTemplateLoader } = useMutation(async (addData: Ipayload) => axios({
    url: `/api/coi-deficient-template/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data: addData,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/coi-deficient-template').catch()
        .then();
      window.history.back();
      enqueueSnackbar('Saved Successfully');
    },
    onError: (): void => {
      enqueueSnackbar('The Template name must be unique.', { variant: 'error' });
    },
  });
  const { mutate: editTemplate, isLoading: editTemplateLoader } = useMutation(async (dataArg: Ipayload) => axios({
    url: `/api/coi-deficient-template/${editId}/`,
    method: 'patch',
    data: dataArg,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/coi-deficient-template').catch()
        .then();
      window.history.back();
      enqueueSnackbar('Template Updated Successfully');
    },
    onError: (): void => {
      enqueueSnackbar('Request failed!', { variant: 'error' });
    },
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<IFormValues> = (paylaodData: IFormValues) => {
    if (editorState === '') {
      setEditorError(true);
      return;
    }
    const payload: Ipayload = {
      template_name: paylaodData.name,
      description: paylaodData.description,
      content: editorState,
      template_type: 1,
      workspace: currentWorkspace.id,
    };
    if (tempId === 'new') {
      addTemplate(payload);
    } else {
      editTemplate(payload);
    }
  };
  const handleChange: (e: string) => void = (e) => {
    setEditorError(false);
    setEditorState(e);
  };
  /* eslint-disable @typescript-eslint/no-misused-promises */
  return (
    <div className='add-template-container'>
      <StradaLoader open={addTemplateLoader} />
      <StradaLoader open={editTemplateLoader} />
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
        {tempId === 'new' ? <Typography className='template-heading'>Add Template</Typography> : <Typography className='template-heading'>Edit Template</Typography>}

      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container columnSpacing={3}>
          <Grid item sm={12} md={12}>
            <HookTextField
              name='name'
              label='Name'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item sm={12} md={12}>
            <HookTextField
              name='description'
              label='Description(Optional)'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item sm={12} md={12}>
            <Editor
              initialValue=''
              value={editorState}
              apiKey='sz5hlecn4riymsi5fyww92dmgw0kjmugqw8iyjvia8j73i3a'
              init={{
                height: 490,
                branding: false,
                menubar: false,
                skin: 'material-outline',
                content_css: 'material-outline',
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help ',
                ],
                toolbar: 'removeformat | bold italic backcolor '
              + ' bullist numlist  | '
              + ' help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;  }',
              }}
              onEditorChange={handleChange}
            />
            {editorError && <Typography className='error-message-editor'>This field may not blank!</Typography>}
          </Grid>
        </Grid>
        <Grid className='d-flex justify-content-end' my={3}>
          <div>
            <PrimayButton type='submit'>
              Save Template
            </PrimayButton>
          </div>
        </Grid>
      </form>

    </div>

  );
}
