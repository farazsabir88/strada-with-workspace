/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import HookTextField from 'shared-components/hooks/HookTextField';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import axios from 'axios';
import type { IFormValues } from 'formsTypes';
import type { IResetPassword } from 'client/ClientFormTypes';
import Footer from 'client/footer/Footer';

const defaultValues: IResetPassword = {
  password: '',
  repeat_password: '',
  reset_key: '',
};

export default function ResetPassword(): JSX.Element {
  const { resetKey } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [success, setSuccess] = useState(false);

  const schema = yup.object().shape({
    password: yup.string().required('Please enter your password').min(8, 'Password has to be longer than 8 characters!'),
    repeat_password: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const {
    control, formState, handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors, isValid } = formState;

  const { mutate, isLoading } = useMutation(async (data: IResetPassword) => axios({
    url: 'api/auth-users/reset-password/',
    method: 'post',
    data,
  }), {
    onSuccess: () => {
      setSuccess(true);
      enqueueSnackbar('Password reset successfully.');
    },
    onError: () => {
      enqueueSnackbar('Invalid or expired reset token.');
    },
  });

  const onSubmit = (data: IResetPassword): void => {
    const info = data;
    info.reset_key = resetKey;
    mutate(info);
  };

  return (
    <main className='auth-pages'>
      <div className='container'>
        <section className='auth-content'>
          <StradaLoader open={isLoading} />
          { !success ? (
            <div>
              <h2 className='auth-title' style={{ marginBottom: '37px' }}>Please enter your new password</h2>

              <form onSubmit={handleSubmit(onSubmit)} className='fields-wrapper m-auto'>

                <HookTextField
                  name='password'
                  label='Password*'
                  control={control}
                  errors={errors}
                  type='password'
                />
                <HookTextField
                  name='repeat_password'
                  label='Confirm Password*'
                  control={control}
                  errors={errors}
                  type='password'
                />

                <PrimayButton className='primary-big-btn w-100' type='submit' disabled={!isValid}> Set new password </PrimayButton>
                <div style={{ marginTop: 20 }} className='text-center'>
                  <Link to='/signin' className='link-button'> Return to Login </Link>
                </div>

              </form>

            </div>
          )
            : (
              <div>
                <h2 className='auth-title'>Password Reset Successfully!</h2>
                <p className='info-text'><Link to='/signin' className='loginback-text text-decoration-none'>Return to login</Link></p>
              </div>
            )}
        </section>
      </div>
      { !success && <Footer />}
    </main>
  );
}
