/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react';
import './_forgetPassword.scss';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import PrimayButton from 'shared-components/components/PrimayButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IFormValues } from 'formsTypes';
import Footer from 'client/footer/Footer';
import type { IForgetPassword } from '../ClientFormTypes';

const defaultValues: IForgetPassword = {
  email: '',
};

const schema = yup.object().shape({
  email: yup.string().required('Please enter your email').email('Your Email is not valid').min(6, 'Email length can not be less then 6 charecters'),
});

export default function ForgetPassword(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const {
    control, formState, handleSubmit, reset,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const [success, setSuccess] = useState(false);
  const [emailInfo, setEmailInfo] = useState('');
  const { errors, isValid } = formState;

  const { mutate, isLoading } = useMutation(async (data: IForgetPassword) => axios({
    url: 'api/auth-users/forgot-password/',
    method: 'post',
    data,
  }), {
    onSuccess: () => {
      reset(defaultValues);
      setSuccess(true);
      enqueueSnackbar('Reset link sent to your email, check your email');
    },
    onError: () => {
      enqueueSnackbar('Email does not exist.');
    },
  });

  useEffect(() => {
    if (isLoading) {
      enqueueSnackbar('Sending email... Please wait');
    }
  }, [enqueueSnackbar, isLoading]);

  const onSubmit = (data: IForgetPassword): void => {
    setEmailInfo(data.email);
    mutate(data);
  };

  return (
    <main className='auth-pages'>
      <div className='container'>
        <section className='auth-content'>
          <StradaLoader open={isLoading} />
          { !success ? (
            <div>
              <h2 className='auth-title'>Reset Password</h2>
              <div className='auth-description' style={{ marginBottom: '37px' }}>Enter the email address associated with your account and we&apos;ll send you a link to reset your password.</div>

              <form onSubmit={handleSubmit(onSubmit)} className='fields-wrapper m-auto'>

                <HookTextField
                  name='email'
                  label='Email Address*'
                  control={control}
                  errors={errors}
                  type='text'
                />

                <PrimayButton className='primary-big-btn w-100' type='submit' disabled={!isValid}> Send Reset Instructions </PrimayButton>
                <div style={{ marginTop: 20 }} className='text-center'>
                  <Link to='/signin' className='link-button'> Return to Login </Link>
                </div>

              </form>
            </div>
          )
            : (
              <div>
                <h2 className='auth-title'>Instructions sent!</h2>
                <div className='auth-description'>
                  Instructions for resetting your password have been sent to
                  {' '}
                  <span style={{ fontWeight: 'bolder' }}>{emailInfo}</span>
                </div>
                <p className='info-text'><Link to='/signin' className='loginback-text'>Return to login</Link></p>
                {/* <Box mt={16}>
                  <Footer />
                </Box> */}
              </div>
            )}
        </section>
      </div>

      { !success && <Footer />}
    </main>
  );
}
