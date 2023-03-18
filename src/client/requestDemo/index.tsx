/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import './_requestDemo.scss';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import PrimayButton from 'shared-components/components/PrimayButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import type { IFormValues } from 'formsTypes';
import { useMutation } from 'react-query';
import axios from 'axios';
import StradaLoader from 'shared-components/components/StradaLoader';
import Footer from 'client/footer/Footer';

interface IdefaultValues {
  [key: number | string]: number | string | null | undefined;
  fullname: string;
  email: string;
}

const defaultValues: IdefaultValues = {
  fullname: '',
  email: '',
};

const schema = yup.object().shape({
  fullname: yup.string().required('Please enter your full name').matches(/[^\s*].*[^\s*]/g, '* This field cannot contain only blankspaces'),
  email: yup
    .string()
    .required('Please enter your email')
    .email('Your Email is not valid')
    .min(6, 'Email length can not be less then 6 charecters'),
});

export default function RequestDemo(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const [isSent, setIsSent] = useState(false);
  const {
    control, formState, handleSubmit, reset,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { mutate: handleRequestDemo, isLoading } = useMutation(async (data: IdefaultValues) => axios({
    url: '/api/request_demo/',
    method: 'POST',
    data,
  }), {
    onSuccess: () => {
      enqueueSnackbar('Request is sent for demo');
      setIsSent(true);
    },
  });

  const { errors } = formState;

  const onSubmit = (payload: IdefaultValues): void => {
    handleRequestDemo(payload);
    reset(defaultValues);
  };

  return (
    <div className='full-width demo-container'>
      <StradaLoader open={isLoading} message='Action in progress' />
      <div className='demo-content full-height flex-col-center'>
        <h1> Request Demo </h1>
        <p className='p-1 text-center-md mb-3'>
          {' '}
          Thanks for your interest! Please enter your e-mail and we&apos;ll be
          in contact shortly.
          {' '}
        </p>
        {/* <Grid container justifyContent='center'>
          <Grid item md={3} sm={8} xs={11}> */}
        <form onSubmit={handleSubmit(onSubmit)} className='fields-wrapper'>
          <HookTextField
            name='fullname'
            label='Full Name*'
            control={control}
            errors={errors}
            type='text'
          />
          <HookTextField
            name='email'
            label='Email*'
            control={control}
            errors={errors}
            type='text'
          />

          <PrimayButton className='primary-big-btn' type='submit'>
            {' '}
            Request a Demo
            {' '}
          </PrimayButton>
        </form>
        {/* </Grid>

        </Grid> */}
        <Grid item md={3} sm={8} xs={11}>
          {isSent && (
            <div className='thank-you-message'>
              Thanks! We'll be in contact shortly
            </div>
          )}

        </Grid>
      </div>
      <Footer />
    </div>
  );
}
