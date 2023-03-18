/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material';

export default function SecondaryButton(props: ButtonProps): JSX.Element {
  return (
    <Button
      className='secondary-btn'
      color='secondary'
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {props.children}
    </Button>
  );
}
