/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import CustomRadioButton from 'shared-components/inputs/CustomRadioButton';
// import Switch from 'shared-components/inputs/Switch';
import {
  FormControlLabel, Radio, RadioGroup,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import {
  OutlookIcon,
  GmailIcon,
} from './integrationIcons';
import type { DefaultIntegrationResponse } from './types';
// import EmailForwardingDialog from './EmailForwardingDialog';
import GoogleAuth from './GoogleAuth';
import OutlookAuth from './OutlookAuth';

export default function Integration(): JSX.Element {
  const [val, setVal] = useState<string>('');

  const queryClient = useQueryClient();
  const integrations = useSelector((state: RootState) => state.integrations);
  // const [open, setOpen] = useState(false);
  // const [isForwardingEnabled, setIsForwardingEnabled] = useState<boolean>(false);

  const onChange: (e: ChangeEvent, value: string) => void = (e: ChangeEvent, value: string) => {
    setVal(value);
  };
  const { data: defaultIntegrationPlateform } = useQuery(
    ['get/default-integration-plateform'],
    async () => axios({
      url: 'api/default-integration-plateform/',
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<DefaultIntegrationResponse>) => res.data.results,
    },
  );

  const { mutate: setDefaultIntegration } = useMutation(async (data: string) => axios({
    url: '/api/default-integration-plateform/',
    method: 'post',
    data: { type: data },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/default-integration-plateform').catch()
        .then();
    },
  });

  useEffect(() => {
    if (defaultIntegrationPlateform === '') {
      if (integrations.google.isConnected) {
        setDefaultIntegration('gmail');
      } else if (integrations.outlook.isConnected) {
        setDefaultIntegration('outlook');
      }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (defaultIntegrationPlateform === 'gmail' && integrations.outlook.isConnected && !integrations.google.isConnected) {
      setDefaultIntegration('outlook');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (defaultIntegrationPlateform === 'outlook' && integrations.google.isConnected && !integrations.outlook.isConnected) {
      setDefaultIntegration('gmail');
    }
  }, [integrations, setDefaultIntegration, defaultIntegrationPlateform]);

  // const onClincSwitch: () => void = () => {
  //   if (isForwardingEnabled) {
  //     setIsForwardingEnabled(false);
  //     return;
  //   }
  //   setOpen(true);
  // };
  return (
    <div className='integration-wrapper'>
      {defaultIntegrationPlateform !== undefined
      && (
        <RadioGroup aria-label='gender' name='gender1' value={defaultIntegrationPlateform} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => { setDefaultIntegration(event.target.value); }}>

          {/* Integration methods */}
          <div className='integration-methods-wrapper'>

            {/* OUT LOOK INTEGRATION */}

            <div className='single-integration'>
              <div className='left-side'>
                <div className='icon-wrapper'>
                  <OutlookIcon />
                </div>
                <div className='text-side'>
                  <h6>Outlook Plug-In</h6>
                  <p>Outlook 2007, 2010, 2013, or 2016 with Windows XP,</p>

                  {/* <div className='radio-button-area'>
                  <CustomRadioButton
                    name={val}
                    value={val}
                    label='Make the main mail for letters'
                    onChange={onChange}
                  />
                </div> */}
                  {integrations.outlook.isConnected && <FormControlLabel value='outlook' control={<Radio color='primary' />} label='Set Default' /> }
                </div>
              </div>

              <div className='right-side'>

                <OutlookAuth />
              </div>
            </div>

            {/* GMAIL INTEGRATION */}

            <div className='single-integration'>
              <div className='left-side'>
                <div className='icon-wrapper'>
                  <GmailIcon />
                </div>
                <div className='text-side'>
                  <h6>Google Account</h6>
                  <p>Google calendar, Gmail</p>
                  {Boolean(false) && (
                    <div className='radio-button-area'>
                      <CustomRadioButton
                        name={val}
                        value={val}
                        label='Make the main mail for letters'
                        onChange={onChange}
                      />
                    </div>
                  )}
                  {integrations.google.isConnected && <FormControlLabel value='gmail' control={<Radio color='primary' />} label='Set Default' />}
                </div>
              </div>

              <div className='right-side'>
                <GoogleAuth />
              </div>
            </div>
          </div>
        </RadioGroup>
      )}
    </div>
  );
}
