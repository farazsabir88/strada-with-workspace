/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import './_accountSetting.scss';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import HookTextField from 'shared-components/hooks/HookTextField';
import PrimayButton from 'shared-components/components/PrimayButton';
import { setLogin } from 'client/login/store';
import type { Iuser } from 'types';
import type { IFormValues } from 'formsTypes';
import type { IUpdateNameForm } from '../AdminFormTypes';

interface Iprops {
  user: Iuser;
}
function UpdateName(props: Iprops): JSX.Element {
  const dispatch = useDispatch();
  const { user } = props;

  const profileDefaultValues: IUpdateNameForm = {
    first_name: '',
    last_name: '',
    title: '',
  };

  const schema = yup.object().shape({
    first_name: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
    last_name: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
    title: yup.string().matches(/^(?!\s+$)/, '* This field cannot contain only blankspaces'),
  });
  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: profileDefaultValues,
    resolver: yupResolver(schema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const { errors } = formState;

  const { mutate } = useMutation(async (data: IUpdateNameForm) => axios({
    url: `api/users/${user.id}/`,
    method: 'patch',
    data,
  }), {
    onSuccess: (data) => {
      reset(profileDefaultValues);
      enqueueSnackbar('Updated Succsessfully!');
      dispatch(setLogin({ ...user, ...data.data }));
    },
    onError: () => {
      // enqueueSnackbar(results.error?.detail[0] ?? 'Name Update Failed!', { variant: 'error' });
    },
  });

  const onSubmit: SubmitHandler<IUpdateNameForm> = (data: IUpdateNameForm): void => {
    mutate(data);
  };

  useEffect(() => {
    setValue('first_name', user.first_name, { shouldDirty: true, shouldValidate: true });
    setValue('last_name', user.last_name, { shouldDirty: true, shouldValidate: true });
    setValue('title', user.title, { shouldDirty: true, shouldValidate: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Box mb={5}>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container mt={5} className='update-name'>
          {' '}
          <Grid item className='hook-field-1'>
            {' '}
            <HookTextField
              name='first_name'
              label='First Name'
              control={control}
              errors={errors}
            />
            {' '}

          </Grid>
          <Grid item className='hook-field-2'>
            <HookTextField
              name='last_name'
              label='Last Name'
              control={control}
              errors={errors}
            />
          </Grid>

        </Grid>
        <Grid item className='hook-field-2'>
          <HookTextField
            name='title'
            label='Title'
            control={control}
            errors={errors}
          />

        </Grid>

        <Box sx={{ width: '90px', height: '30px' }}><PrimayButton type='submit'> Update </PrimayButton></Box>

      </form>

    </Box>
  );
}

export default UpdateName;
