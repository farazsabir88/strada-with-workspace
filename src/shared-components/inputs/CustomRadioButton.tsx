/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import type { ICustomRadioButton } from 'types';

export default function ControlledRadioButtonsGroup(props: ICustomRadioButton): JSX.Element {
  const {
    label, value, name, ...rest
  } = props;
  return (
    <FormControl>

      <RadioGroup
        aria-labelledby='demo-controlled-radio-buttons-group'
        name='controlled-radio-buttons-group'
        value={value}
        {...rest}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: 24,
          },
        }}
      >
        <FormControlLabel
          classes={{
            label: 'custome-radio-btn-lable',
          }}
          value={value}
          control={<Radio />}
          label={label}
        />
      </RadioGroup>
    </FormControl>
  );
}
