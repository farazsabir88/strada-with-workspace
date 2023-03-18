/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import './_login.scss';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { InputAdornment, Grid } from '@mui/material';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import PrimayButton from 'shared-components/components/PrimayButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IFormValues } from 'formsTypes';
import { setLogin } from './store';
import Footer from '../footer/Footer';
import type { ILogin } from '../ClientFormTypes';

function EndAdornment(): JSX.Element {
  return (
    <InputAdornment position='end'>
      {' '}
      <Link to='/forgot-password' className='forget-button'> Forgot? </Link>
      {' '}
    </InputAdornment>
  );
}

const defaultValues: ILogin = {
  username: '',
  password: '',
};

const schema = yup.object().shape({
  username: yup.string().required('Please enter your email').email('Your email is not valid'),
  password: yup.string().required('Please enter your password').min(8, 'The password has to be longer than 8 characters!'),
});

export default function Login(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const {
    control, formState, handleSubmit, reset,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const { mutate, isLoading } = useMutation(async (data: ILogin) => axios({
    url: 'api/auth-users/login/',
    method: 'post',
    data,
  }), {
    onSuccess: (data) => {
      enqueueSnackbar('Login Successful');
      dispatch(setLogin(data.data));
      reset(defaultValues);
    },
    onError: () => {
      enqueueSnackbar('Invalid email or password', { variant: 'error' });
    },
  });

  const onSubmit = (data: ILogin): void => {
    mutate(data);
  };

  return (
    <div className='full-width login-container '>
      <div className='login-content full-height flex-col-center'>
        <StradaLoader open={isLoading} />

        <h1> Hi, Welcome Back!</h1>

        <Grid container justifyContent='center'>

          <Grid item md={3} sm={8} xs={11}>

            <form onSubmit={handleSubmit(onSubmit)}>

              <HookTextField
                name='username'
                label='Email*'
                control={control}
                errors={errors}
                type='text'
              />
              <HookTextField
                name='password'
                label='Password*'
                control={control}
                errors={errors}
                type='password'
                endAdornment={<EndAdornment />}
              />

              <PrimayButton className='primary-big-btn' type='submit'> Sign In </PrimayButton>

              {/* <div className='flex-row-center login-link-area'>
                <p className='p-2'> New to Strada? </p>
                <Link to='/signup' className='link-button'> Get Started </Link>
              </div> */}

            </form>
          </Grid>

        </Grid>

      </div>
      <Footer />

    </div>
  );
}
