/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Divider, Grid } from '@mui/material';
import './_accountSetting.scss';
import { useDispatch } from 'react-redux';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import axios from 'axios';
import HookTextField from 'shared-components/hooks/HookTextField';
import PrimayButton from 'shared-components/components/PrimayButton';
import { setLogin } from 'client/login/store';
import type { Iuser } from 'types';
import type { IFormValues } from 'formsTypes';
import type { IUpdateEmailForm } from '../AdminFormTypes';

interface Iprops {
  user: Iuser;

}
export default function EmailUpdate(props: Iprops): JSX.Element {
  const dispatch = useDispatch();
  const { user } = props;
  const [editEmail, showEditEmail] = useState(false);

  const emailDefaultValues: IUpdateEmailForm = {
    email: '',
    confirm_email: '',
  };

  const { enqueueSnackbar } = useSnackbar();

  const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Please enter valid email'),
    confirm_email: yup.string()
      .oneOf([yup.ref('email'), null], 'Confirm Email is not the same!'),
  });

  const {
    control, formState, handleSubmit, reset,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: emailDefaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const {
    mutate,
  } = useMutation(async (data: IUpdateEmailForm) => axios({
    url: `api/users/${user.id}/`,
    method: 'patch',
    data,
  }), {
    onSuccess: (data) => {
      reset(emailDefaultValues);
      enqueueSnackbar('Email Updated Successfully!');
      dispatch(setLogin({ ...user, ...data.data }));
    },
    onError: () => {
      enqueueSnackbar('Email Update Failed!', { variant: 'error' });
    },
  });

  const onSubmit: SubmitHandler<IUpdateEmailForm> = (data: IUpdateEmailForm) => {
    mutate(data);
  };

  return (
    <Box mt={3} className='accordian-container'>

      <Typography className='accordian-desc'>
        Email Address
      </Typography>
      <Grid className='accordian-header'>
        <Grid item lg={6} className='header-1'>
          {' '}
          <Typography className='accordian-desc-1'>
            Your email address is
            {' '}
            {user.email}
          </Typography>
        </Grid>
        <Grid item lg={6} className='header-2'>
          <Typography className='accordian-desc-2' onClick={(): void => { showEditEmail((pre) => !pre); }}>
            {editEmail ? 'Hide' : 'Change'}
            {' '}
          </Typography>
        </Grid>
      </Grid>

      {editEmail && (
        <Box mb={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid mt={1} className='update-name'>
              {' '}
              <Grid item className='hook-field-1'>
                {' '}
                <HookTextField
                  name='email'
                  label='New Email Address'
                  control={control}
                  errors={errors}
                />

              </Grid>
              <Grid item className='hook-field-2'>
                <HookTextField
                  name='confirm_email'
                  label='Confirm Email Address'
                  control={control}
                  errors={errors}
                />

              </Grid>
            </Grid>

            <Box sx={{ width: '126px', height: '33px' }}><PrimayButton type='submit'> Update Email</PrimayButton></Box>

          </form>

        </Box>
      )}
      <Divider sx={{ marginTop: '2.5rem' }} />
    </Box>

  );
}
