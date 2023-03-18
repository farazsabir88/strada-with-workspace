/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import type { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import PrimayButton from 'shared-components/components/PrimayButton';
import StandardButton from 'shared-components/components/StandardButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { RootState } from 'mainStore';
import { SwitchIcon } from './integrationIcons';
import { connectGoogle, disconnectGoogle } from './store';
import type { IGooglePayloadProps } from './types';

interface IError {
  error: string;
}

export default function GoogleAuth(): JSX.Element {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state: RootState) => state.auth.user);
  const integrations = useSelector((state: RootState) => state.integrations);

  useQuery(
    'get/gmail-registeration',
    async () => axios({
      url: '/api/register-gmail-mail/',
      method: 'GET',
    }),
    {
      onSuccess: (res) => {
        if (res.data !== undefined && res.data.length !== 0) {
          const payload = {
            ...res.data[0],
            isConnected: true,
          };
          dispatch(connectGoogle(payload));
          return;
        }
        dispatch(disconnectGoogle());
      },
    },
  );

  const { mutate, isLoading: registering } = useMutation(async (dataToSend: IGooglePayloadProps) => axios({
    url: '/api/register-gmail-mail/',
    method: 'POST',
    data: dataToSend,
  }), {
    onSuccess: async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await queryClient.invalidateQueries('get/gmail-registeration').catch()
        .then();
      await queryClient.invalidateQueries('get/default-integration-plateform').then();
      enqueueSnackbar('Config Saved');
    },

  });
  const { mutate: deleteIntegration, isLoading: deleting } = useMutation(async () => axios({
    url: `/api/register-gmail-mail/${user.id}`,
    method: 'delete',
  }), {
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries('get/gmail-registeration');
      // enqueueSnackbar('Google config saved');
    },
    onError: (): void => {
      enqueueSnackbar('Google config saving failed');
    },
  });

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('profileObj' in response) {
      const accountInfo = {
        email: response.profileObj.email,
        name: response.profileObj.givenName,
        accountIdentifier: response.profileObj.googleId,
        environment: response.profileObj.googleId,
        homeAccountIdentifier: response.profileObj.googleId,
        userId: user.id,
        expiresOn: moment(new Date()).add(1, 'hours').toDate(),
        oauth_token: response.accessToken,
        isConnected: true,
      };
      // dispatch(connectGoogle(accountInfo));
      enqueueSnackbar('Google account connected');
      mutate(accountInfo);
    }
  };

  // This can't be fix, because library is using any itself
  const responseFailure: (err: IError) => void = (err) => {
    enqueueSnackbar('Google account connection failed');
    console.log({ err });
  };

  return (
    <div>
      <StradaLoader open={deleting || registering} />
      <GoogleLogin
        clientId='239962445108-iig9ai397cp6sse8pchtll61t4nshe95.apps.googleusercontent.com'
        scope='https://www.googleapis.com/auth/calendar.events'
        render={(renderProps): JSX.Element => (

          integrations.google.isConnected ? (
            <StandardButton onClick={(): void => { deleteIntegration(); }} startIcon={<SwitchIcon />}>
              Disconnect
            </StandardButton>
          ) : (
            <div className='btn-wrapper'>

              <PrimayButton onClick={renderProps.onClick}>
                Connect
              </PrimayButton>

            </div>
          )

        )}
        buttonText='Login'
        onSuccess={responseGoogle}
        onFailure={responseFailure}
      />
    </div>
  );
}
