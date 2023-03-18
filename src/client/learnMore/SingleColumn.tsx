import React from 'react';
import { Grid } from '@mui/material';
import SatisfactionImg from 'assests/images/level_up.png';
import './_learnMore.scss';

function SingleColumn(): JSX.Element {
  return (
    <div className=' col-img'>
      <Grid>
        <img src={SatisfactionImg} alt='' />
      </Grid>
      <Grid>
        <p className='intro-slogan text-center-md'>
          Level Up On Tenant Satisfaction

        </p>
        <p className='intro-desc text-center-md'>
          Strada works like a personal assistant for you and your team. Reduce time wasted frustrations and allow yourself to provide better attention to your tenants.
        </p>
      </Grid>
    </div>
  );
}

export default SingleColumn;
