import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import './_accountSetting.scss';
import type { Iuser } from 'types';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import Switch from 'shared-components/inputs/Switch';

interface Iprops {
  user: Iuser;
}

function Togglers(props: Iprops): JSX.Element {
  const queryClient = useQueryClient();
  const { user } = props;
  const [notificationValue, setNotificationValue] = useState(false);
  useQuery(
    'get/notification-value',
    async () => axios({
      url: '/api/users/',
      method: 'GET',
    }),
    {
      onSuccess: (res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setNotificationValue(res.data[0].is_mentioned_notification);
      },
    },
  );
  const { mutate: handleNotificationValue } = useMutation(async () => axios({
    url: `api/users/${user.id}/`,
    method: 'patch',
    data: { is_mentioned_notification: !notificationValue },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/notification-value');
    },
    // onError: () => {
    //   enqueueSnackbar('Password Update Failed', { variant: 'error' });
    // },
  });

  // const { mutate: handleNotificationValue } = useMutation(async () => axios({
  //   url: `api/users/${user.id}/`,
  //   method: 'patch',
  //   {is_mentioned_notification: !notificationValue},
  // }), {
  //   onSuccess: () => {
  //   },
  //   onError: () => {
  //     // enqueueSnackbar(results.error?.detail[0] ?? 'Name Update Failed!', { variant: 'error' });
  //   },
  // });
  return (
    <div className='toggler-container'>
      <Typography className='notification-header'>
        Notifications
      </Typography>
      <Grid className='toggler-header'>
        <Grid item lg={6} className='header-1'>
          {' '}

          <Typography className='toggler-desc-1'>
            Email me when I have been mentioned!
          </Typography>

        </Grid>
        <Grid item lg={6} className='header-2'>
          <Switch
            name='notification'
            label=''
            checked={notificationValue}
            onChange={(): void => {
              handleNotificationValue();
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default Togglers;
