import React from 'react';
import { Grid } from '@mui/material';
import './_learnMore.scss';

function Hero(): JSX.Element {
  return (
    <Grid className='container'>
      <div className='hero-section'>
        <p className='intro-slogan'>Tools that fit your workflow.</p>
        <p className='intro-desc'>To compliment the accounting software you use today</p>
      </div>
    </Grid>
  );
}

export default Hero;
