/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { ICustomCheckbox } from 'types';

export default function CustomCheckbox(props: ICustomCheckbox): JSX.Element {
  const {
    name, label, checked, onChange, value,
  } = props;
  return (
    <FormControlLabel
      className='p-2'
      control={
        <Checkbox color='primary' name={name} checked={checked} value={value} onChange={onChange} />
      }
      label={label}
    />
  );
}
