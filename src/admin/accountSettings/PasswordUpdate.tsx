/* eslint-disable @typescript-eslint/no-misused-promises */
import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import {
  Box, Divider, Grid, InputAdornment,
} from '@mui/material';
import './_accountSetting.scss';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HookTextField from 'shared-components/hooks/HookTextField';
import PrimayButton from 'shared-components/components/PrimayButton';
import { logout } from 'client/login/store';
import type { Iuser } from 'types';
import type { IFormValues } from 'formsTypes';
import type { IPasswordPayloadProps } from './types';
import type { IUpdatePasswordForm } from '../AdminFormTypes';

interface Iprops {
  user: Iuser;
}

interface Iendorment {
  show: boolean;
  setShow: (value: boolean) => void;
}
function EndAdornment(props: Iendorment): JSX.Element {
  const { show, setShow } = props;
  return (
    <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
      { show ? <VisibilityIcon onClick={(): void => { setShow(false); }} /> : <VisibilityOffIcon onClick={(): void => { setShow(true); }} />}

    </InputAdornment>
  );
}
export default function PasswordUpdate(props: Iprops): JSX.Element {
  const { user } = props;
  const [editEmail, showEditEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const passwordDefaultValues: IUpdatePasswordForm = {
    user_id: 0,
    password: '',
    repeat_password: '',
    old_password: '',

  };

  const schema = yup.object().shape({
    password: yup.string().required('Please enter your password').min(8, 'Password length can not be less then 8 charecters').matches(/^\s*\S[^]*$/, '* This field cannot contain only blankspaces'),
    repeat_password: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    control, formState, handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: passwordDefaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const { mutate } = useMutation(async (data: IPasswordPayloadProps) => axios({
    url: '/api/auth-users/change-password/',
    method: 'POST',
    data,
  }), {
    onSuccess: () => {
      // reset(passwordDefaultValues);
      enqueueSnackbar('Password Updated Successfully!');
      logout();
    },
    onError: () => {
      enqueueSnackbar('Password Update Failed', { variant: 'error' });
    },
  });

  const onSubmit: SubmitHandler<IUpdatePasswordForm> = (data: IUpdatePasswordForm) => {
    const payLoad: IPasswordPayloadProps = {
      user_id: user.id,
      password: data.password,
      repeat_password: data.repeat_password,
      old_password: 'tester123',

    };
    mutate(payLoad);
  };

  return (
    <Box mt={3} className='accordian-container'>

      <Grid className='accordian-header'>
        <Grid item lg={6} className='header-1'>
          {' '}
          <Typography className='accordian-desc'>
            Password
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
          {' '}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid mt={1} className='update-name'>
              {' '}
              <Grid item className='hook-field-1'>
                {' '}
                <HookTextField
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  label='New Password'
                  control={control}
                  errors={errors}
                  endAdornment={<EndAdornment show={showPassword} setShow={setShowPassword} />}

                />
                {' '}

              </Grid>
              <Grid item className='hook-field-2'>
                <HookTextField
                  type={showConfirmPass ? 'text' : 'password'}
                  name='repeat_password'
                  label='Confirm Password'
                  control={control}
                  errors={errors}
                  endAdornment={<EndAdornment show={showConfirmPass} setShow={setShowConfirmPass} />}

                />

              </Grid>

            </Grid>
            {' '}
            <Box sx={{ width: '152px', height: '33px' }}><PrimayButton type='submit'> Update Password</PrimayButton></Box>

          </form>

        </Box>
      )}
      <Divider sx={{ marginTop: '2.5rem' }} />
    </Box>

  );
}
