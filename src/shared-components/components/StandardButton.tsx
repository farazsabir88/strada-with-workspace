/* eslint-disable react/destructuring-assignment */
import React from 'react';
import type { ButtonProps } from '@mui/material';
import Button from '@mui/material/Button';

export default function StandardButton(props: ButtonProps): JSX.Element {
  return (
    <Button
      className='standard-btn'
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {' '}
      {props.children}
      {' '}
    </Button>
  );
}
