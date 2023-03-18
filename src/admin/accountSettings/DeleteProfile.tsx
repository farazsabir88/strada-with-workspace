import React from 'react';
import { Typography } from '@mui/material';
import './_accountSetting.scss';
import { Link } from 'react-router-dom';

function DeleteProfile(): JSX.Element {
  return (
    <div className='delete-container'>
      <Typography className='delete-profile'><Link to='./'>   Delete my Profile</Link></Typography>
      <Typography className='confirm-email'>
        {' '}
        You will receive an email to confirm your decision

        {' '}
      </Typography>
    </div>
  );
}

export default DeleteProfile;
