/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import './_signup.scss';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import PrimayButton from 'shared-components/components/PrimayButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IFormValues } from 'formsTypes';
import Footer from 'client/footer/Footer';
import type { ISignup } from '../ClientFormTypes';

interface Ierros {
  email: string[];
  password: string[];
  repeat_password: string[];
}

const defaultValues: ISignup = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  repeat_password: '',
};

const schema = yup.object().shape({
  first_name: yup.string().trim().required('Please enter your first name')
    .matches(/^[aA-zZ\s]+$/, 'This field cannot contain special characters'),
  last_name: yup.string().trim().required('Please enter your last name')
    .matches(/^[aA-zZ\s]+$/, 'This field cannot contain special characters'),
  email: yup.string().trim().required('Email is required').email('Please enter valid email'),
  password: yup.string().required('Please enter your password').min(8, 'Email length can not be less then 8 charecters'),
  repeat_password: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function Signup(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [phase, setPhase] = useState('signup');

  // const navigate = useNavigate();
  const {
    control, formState, handleSubmit, reset,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const {
    mutate,
  } = useMutation(async (data: ISignup) => axios({
    url: 'api/auth-users/sign-up/',
    method: 'post',
    data,
  }), {
    onSuccess: () => {
      reset(defaultValues);
      setPhase('success');
      enqueueSnackbar('Account Created Successfully.');
    },
    onError: (error: Ierros) => {
      setIsLoading(false);
      enqueueSnackbar('Email Already Exist!', { variant: 'error' });

      if (error.email.length) {
        enqueueSnackbar('Email is Required', { variant: 'error' });
      } else if (error.password.length) {
        enqueueSnackbar('Password is Required', { variant: 'error' });
      } else if (error.repeat_password.length) {
        enqueueSnackbar('Repeat password is Required', { variant: 'error' });
      } else {
        enqueueSnackbar('Signup Failed', { variant: 'error' });
      }
    },
  });

  const onSubmit = (data: ISignup): void => {
    mutate(data);
    setIsLoading(true);
  };

  return (
    <div>
      { phase === 'signup' ? (
        <div className='full-width signup-container h-auto'>
          <div className='signup-content full-height flex-col-center'>

            <StradaLoader open={isLoading} />
            <div>
              <h1 className='text-center'> Create Account</h1>

              <form onSubmit={handleSubmit(onSubmit)}>

                <HookTextField
                  name='first_name'
                  label='First Name'
                  control={control}
                  errors={errors}
                />
                <HookTextField
                  name='last_name'
                  label='Last Name'
                  control={control}
                  errors={errors}
                />

                <HookTextField
                  name='email'
                  label='Email'
                  control={control}
                  errors={errors}
                  type='text'
                />
                <HookTextField
                  name='password'
                  label='Password'
                  control={control}
                  errors={errors}
                  type='password'
                />
                <HookTextField
                  name='repeat_password'
                  label='Confirm Password'
                  control={control}
                  errors={errors}
                  type='password'
                />

                <PrimayButton className='primary-big-btn' type='submit'> Get Started </PrimayButton>

              </form>
            </div>

          </div>

        </div>
      )
        : (
          <main className='auth-pages'>
            <div className='container'>
              <section className='auth-content'>
                <h2 className='auth-title fw-bolder'>You&#39;re all signed up!</h2>
                <h5 className='auth-subtitle'>
                  Please check your inbox to confirm your email address.
                </h5>
              </section>
            </div>
          </main>
        )}
      <div style={{ marginTop: '60px' }}>
        { phase === 'signup' && <Footer />}
      </div>
    </div>
  );
}
