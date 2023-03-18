/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable  @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Button, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './_accountInvite.scss';
import HookTextField from 'shared-components/hooks/HookTextField';
import type { IFormValues } from 'formsTypes';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IInvitee, IPayload, IResponse } from './types';

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

export default function AccountInvite(): JSX.Element {
  const { token, inviteId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState<IInvitee>();
  const [step, setStep] = useState('invite');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: getInviteInformation } = useMutation(async () => axios({
    url: 'api/auth-users/check-account/',
    method: 'POST',
    data: { token, inviteId },
  }), {
    onSuccess: (res: AxiosResponse<IResponse>) => {
      if (res.data.result.is_active) {
        enqueueSnackbar('You’ve already accepted this invitation.');
        navigate('/signin');
      }
      setStep('invite');
      setInviteData(res.data.result);
    },
    onError: () => {
      enqueueSnackbar('Invalid or expired invite token.');
      navigate('/signin');
    },
  });

  const { mutate: acceptInvite, isLoading } = useMutation(async (payload: IPayload) => axios({
    url: 'api/auth-users/confirm-account/',
    method: 'POST',
    data: payload,
  }), {
    onSuccess: () => {
      enqueueSnackbar('You have successfully confirmed your invitation. Please signin using your credentials.');
      navigate('/signin');
    },
    onError: () => {
      enqueueSnackbar('Error occured. Please try again.');
    },
  });

  useEffect(() => {
    if ((token != null) && (inviteId != null)) {
      getInviteInformation();
    }
  }, [getInviteInformation, inviteId, token]);

  const defaultValues: IPayload = {
    first_name: '',
    last_name: '',
    password: '',
    token: '',
  };

  const schema = yup.object().shape({
    first_name: yup.string().required('Enter first name'),
    last_name: yup.string().required('Enter last name'),
    password: yup.string().required('Enter password'),
  });

  const {
    control, formState, handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = (data: IPayload): void => {
    const payload = data;
    payload.token = token;
    acceptInvite(payload);
  };

  return (
    <div>
      <StradaLoader open={isLoading} />
      <main className='invite-pages'>
        <div className='container'>
          {(step === 'invite')
            && (
              <section className='invite-content'>
                <h4 className='invite-subtitle'>
                  You’re accepting
                  {' '}
                  {inviteData?.invite_firstname}
                  {' '}
                  {inviteData?.invite_lastname}
                  &#39;s invite to
                  Strada

                </h4>
                <p className='invite-description'>
                  <span>By continuing, you agree to the </span>
                  <Link to='/terms-and-conditions'>Terms of Service</Link>
                  <span> and </span>
                  <Link to='/privacy-policy'>Privacy Policy</Link>
                  .
                </p>
                <Button
                  className='button text-transform-none'
                  variant='contained'
                  color='secondary'
                  onClick={(): void => { setStep('confirm'); }}
                >
                  Continue signing up

                </Button>
              </section>
            )}

          {(step === 'confirm')
            && (
              <section className='invite-content'>
                <h3 className='invite-title'>Let&#39;s setup your profile</h3>
                <form onSubmit={handleSubmit(onSubmit)} className='fields-wrapper'>
                  <HookTextField
                    name='first_name'
                    label='First Name*'
                    control={control}
                    errors={errors}
                  />
                  <HookTextField
                    name='last_name'
                    label='Last Name*'
                    control={control}
                    errors={errors}
                  />
                  <HookTextField
                    name='password'
                    label='Password*'
                    control={control}
                    errors={errors}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={<EndAdornment show={showPassword} setShow={setShowPassword} />}
                  />
                  <Button type='submit' variant='contained' className='w-100 text-white fw-bold p-2 text-transform-none'> Get Started </Button>
                  <p className='invite-description'>
                    You’re signing as
                    {' '}
                    {inviteData?.email}
                    <br />
                    Wrong account?
                    {' '}
                    <Link to='/signin'> Login </Link>
                  </p>
                </form>
              </section>
            )}
        </div>
      </main>
    </div>
  );
}
