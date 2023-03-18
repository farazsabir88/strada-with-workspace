/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Grid, Typography, Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import './_addTemplate.scss';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import DeleteIcon from '@mui/icons-material/Delete';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import HookTextField from 'shared-components/hooks/HookTextField';
import HookSelectWithImg from 'shared-components/hooks/HookSelectWithImg';
import { decrypt } from 'shared-components/hooks/useEncryption';
import type { IFormValues } from 'formsTypes';
import type { ITasksInputs } from 'admin/AdminFormTypes';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import type { Ipayload } from './types';
import type { Iresponse, IErrorResponse, IDetail } from '../types';

export default function AddTemplate(): JSX.Element {
  const { tempId } = useParams();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { data: AssigneesList = [] } = useQuery('get/people', async () => axios({
    url: '/api/filter/assignee/',
    params: {
      workspace: currentWorkspace.id,
    },
    method: 'get',

  }), {
    select: (res: AxiosResponse<IPeopleResponse>) => {
      const options = res.data.detail.map((user) => ({
        name: user.name,
        value: user.id,
        avatar: user.avatar,
      }));

      return options;
    },
  });

  const { data } = useQuery(
    ['edit/tasks-template', currentWorkspace.id, tempId],
    async () => axios({
      url: `/api/tasks-template/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: tempId !== 'new',
      select: (res: AxiosResponse<Iresponse>) => res.data.detail,
    },
  );
  const defaultInput: ITasksInputs = {
    template_name: '',
    description: '',
    tasks: [

    ],
  };
  const schema = yup.object().shape({
    template_name: yup.string().trim().required('Please enter your name'),
    tasks: yup.array().of(yup.object().shape({
      name: yup.string().trim().required('Task name cannot be empty'),
      assignee: yup.number().required('Task Assignee cannot be empty'),
    })),

  });
  const {
    control, formState, handleSubmit, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: defaultInput,
    resolver: yupResolver(schema),
  });

  const { append, remove, fields } = useFieldArray({
    name: 'tasks',
    control,
  });

  useEffect(() => {
    if (tempId !== 'new' && data !== undefined) {
      const decryptedId = Number(decrypt(tempId));
      const filteredItem = data.filter((item: IDetail) => item.id === decryptedId);
      setValue('template_name', filteredItem[0].template_name, { shouldDirty: true });
      setValue('description', filteredItem[0].description, { shouldDirty: true });
      setValue('tasks', filteredItem[0].tasks, { shouldDirty: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempId, currentWorkspace.id, data]);

  const { mutate: addTemplate, isLoading: addTemplateLoader } = useMutation(async (addData: Ipayload) => axios({
    url: `/api/tasks-template/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data: addData,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/tasks-template').catch()
        .then();
      window.history.back();
      enqueueSnackbar('Saved Successfully');
    },
    onError: (res: IErrorResponse) => {
      if (res.data.response.code === 'unique') {
        enqueueSnackbar('Template Name Already Exist');
      }
    },
  });
  const { mutate: editTemplate, isLoading: editTemplateLoader } = useMutation(async (dataArg: Ipayload) => axios({
    url: `/api/tasks-template/${decrypt(tempId)}/`,
    method: 'patch',
    data: dataArg,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/tasks-template').catch()
        .then();
      window.history.back();
      enqueueSnackbar('Template Updated Successfully');
    },
    onError: (res: IErrorResponse) => {
      if (res.data.response.code === 'unique') {
        enqueueSnackbar('Template Name Already Exist');
      }
    },
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<IFormValues> = (paylaodData: IFormValues) => {
    const tasksFilter = paylaodData.tasks.map((item) => ({
      ...item,
      assignee: item.assignee === 0 ? null : item.assignee,
    }));
    const payload: Ipayload = {
      workspace: currentWorkspace.id,
      template_name: paylaodData.template_name,
      description: paylaodData.description,
      tasks: tasksFilter,
    };
    if (tempId === 'new') {
      addTemplate(payload);
    } else {
      editTemplate(payload);
    }
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
          <ArrowBackIcon
            className='back-icon'
            onClick={(): void => {
              navigate('/workspace/settings/tasks-templates');
            }}
          />
        </div>
        {tempId === 'new' ? <Typography className='template-heading'>Add Template</Typography> : <Typography className='template-heading'>Edit Template</Typography>}

      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container columnSpacing={3}>
          <Grid item sm={12} md={12}>
            <HookTextField
              name='template_name'
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
          <Grid item sm={12} md={12} className='d-flex justify-content-between sub-header'>
            <Typography className='sub-heading'>Tasks</Typography>
            <div onClick={(): void => { append({ name: '', description: '', assignee: 0 }); }} aria-hidden='true'>
              <AddIcon className='add-icon' />
              <span className='add-text'>Add</span>
            </div>
          </Grid>

          <Grid item md={12}>
            {fields.map((val, index) => (
              <Grid container columnSpacing={2} key={val.id}>

                <Grid item sm={12} md={6}>

                  <HookTextField
                    name={`tasks.${index}.name`}
                    label='Name'
                    control={control}
                    errors={errors}
                  />
                </Grid>
                <Grid item sm={12} md={6} className='assignee-wrapper'>
                  <Grid container>
                    <Grid item sm={11} md={11}>
                      <HookSelectWithImg
                        name={`tasks.${index}.assignee`}
                        label='Assignee'
                        options={AssigneesList}
                        control={control}
                        errors={errors}
                      />

                    </Grid>
                    <Grid item sm={1} md={1} className='icon-wrapper'>
                      <span><DeleteIcon className='dynamic-delete-icon' onClick={(): void => { remove(index); }} /></span>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={12} md={6}>

                  <HookTextField
                    name={`tasks.${index}.description`}
                    label='Description'
                    control={control}
                    errors={errors}
                  />
                </Grid>

              </Grid>

            ))}

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
