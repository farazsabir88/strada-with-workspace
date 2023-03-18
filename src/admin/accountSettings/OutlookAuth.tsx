/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import React from 'react';
import type { AuthenticationResult } from '@azure/msal-browser';
import {
  PublicClientApplication,
} from '@azure/msal-browser';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import PrimayButton from 'shared-components/components/PrimayButton';
import StandardButton from 'shared-components/components/StandardButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { RootState } from 'mainStore';
import { connectOutlook, disconnectOutlook } from './store/index';
import { config } from './outlookConfig';
import { SwitchIcon } from './integrationIcons';

interface IAccountInfo {
  name: string | undefined;
  accountIdentifier: string;
  environment: string;
  homeAccountIdentifier: string;
  userId: number;
  expiresOn: Date;
  oauth_token: boolean | string;
}

export default function OutlookAuth(): JSX.Element {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state: RootState) => state.auth.user);
  const integrations = useSelector((state: RootState) => state.integrations);

  const { mutate: registerOutlook, isLoading: registering } = useMutation(async (accountData: IAccountInfo) => axios({
    url: 'api/register-outlook-mail/',
    method: 'POST',
    data: accountData,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/outlook').catch()
        .then();
      await queryClient.invalidateQueries('get/default-integration-plateform').then();
      enqueueSnackbar('Successfully saved configuration');
    },
    onError: (): void => {
      enqueueSnackbar('Failed to connect to Outlook');
    },
  });
  useQuery('get/outlook', async () => axios({
    url: 'api/register-outlook-mail/',
    method: 'GET',
  }), {
    onSuccess: (res) => {
      if (Boolean(res.data) && res.data.length !== 0) {
        const payload = {
          ...res.data[0],
          isConnected: true,
        };
        dispatch(connectOutlook(payload));
      } else {
        dispatch(disconnectOutlook());
      }
    },
  });

  const { mutate: deleteOutlookMethod, isLoading: deleting } = useMutation(async (id: number) => axios({
    url: `api/register-outlook-mail/${id}`,
    method: 'DELETE',
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/outlook').catch()
        .then();
      enqueueSnackbar('Disconnected successfully');
    },
  });

  const publicClientApp = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true,
    },
  });

  // const isInteractionRequired = (error: Error): boolean => {
  //   console.log('errororororroor', error);
  //   if (!error.message || error.message.length <= 0) {
  //     return false;
  //   }

  //   return (
  //     error.message.includes('consent_required')
  //       || error.message.includes('interaction_required')
  //       || error.message.includes('login_required')
  //       || error.message.includes('no_account_in_silent_request')
  //   );
  // };

  const getAccessToken = async (scopes: string[]): Promise<boolean | string> => {
    try {
      const accounts = publicClientApp.getAllAccounts();

      if (accounts.length <= 0) throw new Error('login_required');
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
      const silentResult = await publicClientApp.acquireTokenSilent({
        scopes,
        account: accounts[0],
      });
      enqueueSnackbar('Successfully connected with Outlook');
      return silentResult.accessToken;
    } catch (err) {
      console.log({ err });
      enqueueSnackbar('Failed to connect to Outlook');
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getUserProfile = async (loginResponse: AuthenticationResult) => {
    const { account } = loginResponse;
    console.log('account', account);
    try {
      const accessToken = await getAccessToken(config.scopes);
      if (accessToken && account) {
        const accountInfo = {
          email: account.username,
          name: account.name,
          accountIdentifier: account.tenantId,
          environment: account.environment,
          homeAccountIdentifier: account.homeAccountId,
          userId: user.id,
          expiresOn: moment(new Date()).add(1, 'hours').toDate(),
          isConnected: true,
          oauth_token: accessToken,
        };
        registerOutlook(accountInfo);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const login = async () => {
    try {
      const loginResponse = await publicClientApp.loginPopup({
        scopes: config.scopes,
        prompt: 'select_account',
      });
      await getUserProfile(loginResponse);
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <div>
      <StradaLoader open={registering || deleting} />

      {integrations.outlook.isConnected ? (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        <StandardButton onClick={(): void => { deleteOutlookMethod(integrations.outlook.id); }} startIcon={<SwitchIcon />}>
          Disconnect
        </StandardButton>
      ) : (
        <div className='btn-wrapper'>

          <PrimayButton onClick={login}>
            Connect
          </PrimayButton>

        </div>
      )}

    </div>
  );
}
