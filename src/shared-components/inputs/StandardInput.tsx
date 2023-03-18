/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import type { TextFieldTypes } from 'types';

export default function StandardInput(props: TextFieldTypes): JSX.Element {
  const {
    label, className, type, error, variant, helperText, onChange, value, onKeyPress,
  } = props;
  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1, width: '90%' },
      }}
      noValidate
      autoComplete='off'
    >

      <TextField
        fullWidth
        id='standard-basic'
        {...{
          label, className, type, error, variant, helperText, onChange, value, onKeyPress,
        }}
        variant='standard'
      />
    </Box>
  );
}
