/* eslint-disable react/destructuring-assignment */
import React from 'react';
import type { ButtonProps } from '@mui/material';
import Button from '@mui/material/Button';

export default function PrimayButton(props: ButtonProps): JSX.Element {
  return (
    <Button
      variant='contained'
      color='primary'
      style={{ textTransform: 'capitalize' }}
      fullWidth
      className='primary-btn'
      disableElevation
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {props.children}
    </Button>
  );
}
