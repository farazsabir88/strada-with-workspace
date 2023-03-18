import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Box, Paper } from '@mui/material';
import HomePageImg from 'assests/images/homepage-2@2x.png';
import BugdetCalendar from 'assests/videos/Budget_Calendar.mp4';
import './_hero.scss';
import SecondaryButton from 'shared-components/components/SecondaryButton';

export default function RowAndColumnSpacing(): JSX.Element {
  const navigate = useNavigate();
  return (
    <>
      <Grid px={{ sm: 0, md: 6, lg: 19.7 }} className='bg-green homepage-header'>
        <Grid container>
          <Grid item lg={6} sm={12} xl={6} className='intro-content'>
            <Box pt={5}>
              <p className='intro-slogan'>A property manager’s best friend.</p>
              <p className='intro-desc'>
                Task management and automation tools for commercial property
                managers. Manage your assets more effectively than ever.
              </p>

              <SecondaryButton style={{ width: '145px', height: '40px', fontSize: '16px' }} onClick={(): void => { navigate('/requestdemo'); }}> Request Demo</SecondaryButton>
            </Box>
          </Grid>
          <Grid item lg={6} sm={12} xl={6} className='home-banner-img'>
            <img src={HomePageImg} alt='' />
          </Grid>
        </Grid>
      </Grid>
      <div className='container col-video-home'>

        <Grid mb={5}>
          <p className='intro-brief'>Powerful user friendly tools</p>
          <p className='intro-slogan text-center-md'>
            Hyper Efficient. Hyper Accurate.

          </p>
          <p className='intro-slogan-2 text-center-md'>
            Budget Calendar

          </p>
          <p className='intro-desc text-center-md' style={{ width: '499px' }}>
            Track and manage all events and tasks. View real-time status information on all building activity.
          </p>

        </Grid>
        <Paper>
          <video autoPlay loop muted playsInline>
            <source
              src={BugdetCalendar}
              type='video/mp4'
            />
          </video>
        </Paper>
      </div>

    </>
  );
}
