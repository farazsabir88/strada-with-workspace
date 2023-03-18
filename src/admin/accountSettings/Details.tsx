/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Divider } from '@mui/material';
import type { RootState } from 'mainStore';
import { logout } from 'client/login/store';
import UpdatePicture from './PictureUpdate';
import UpdateName from './NameUpdate';
import EmailUpdate from './EmailUpdate';
import PasswordUpdate from './PasswordUpdate';
import DeleteProfile from './DeleteProfile';
import Integration from './Integration';
import SettingTogglers from './SettingTogglers';
import './_accountSetting.scss';

interface Itab {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: Itab): JSX.Element {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function indexHandler(index: number): { id: string;
  'aria-controls': string; } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AccountSettings(): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const handleChange: (event: React.SyntheticEvent, newValue: number) => void = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid ml={{ xm: 0, sm: 4.5, lg: 17.5 }} mr={{ xm: 0, sm: 10, lg: 26 }} style={{ marginTop: '92px' }}>
      <Grid mt={3} className='account--settings-header'>
        <Grid item lg={6} className='header-1'>Account Settings </Grid>
        <Grid item lg={6} className='header-2'>
          <div onClick={(): { type: string; payload: undefined } => dispatch(logout())} aria-hidden='true'>Log out</div>
        </Grid>
      </Grid>

      <Box className='tabs-wrapper'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
            <Tab label='Details' className='setting-tabs' {...indexHandler(0)} />
            <Tab label='Integrations' className='setting-tabs' {...indexHandler(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <UpdatePicture user={user} />
          <UpdateName user={user} />
          <Divider />
          <EmailUpdate user={user} />
          <PasswordUpdate user={user} />
          <SettingTogglers user={user} />
          <DeleteProfile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Integration />
        </TabPanel>

      </Box>
    </Grid>

  );
}
