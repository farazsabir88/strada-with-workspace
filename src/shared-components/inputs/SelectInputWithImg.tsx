/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Avatar, FormHelperText, Stack } from '@mui/material';
import type { SelectOption, ISelectInput } from 'types';

export default function SelectInputWithImg(props: ISelectInput): JSX.Element {
  const {
    label, options, helperText, value, onChange, name, ...rest
  } = props;

  return (

    <FormControl style={{ marginBottom: 20 }} error={rest.error} fullWidth className='select-with-avatar-wrapper'>
      <InputLabel id={`select-${label}`}>
        {label}
      </InputLabel>
      <Select
        label={label}
        value={value}
        placeholder='select...'
        name={name}
        onChange={onChange}
        className='selected-avatar-style'
        sx={{ maxHeight: '400px' }}
      >
        <MenuItem key='select-option-first-option' value={0}>
          <Stack direction='row' spacing={1} className='d-flex align-items-center'>
            <Avatar
              src='/broken-image.jpg'
            />
            <span className='default-position-select'>No assignee</span>
          </Stack>

        </MenuItem>
        {options.map((option: SelectOption) => (
          <MenuItem key={`select-option-${option.value}`} value={option.value}>
            <Stack direction='row' spacing={2} className='d-flex align-items-center'>
              <Avatar
                alt={option.name}
                src={`${process.env.REACT_APP_IMAGE_URL}/media/${option.avatar}`}
                className='options-avatar-style'
              />
              <span>{option.name}</span>
            </Stack>
          </MenuItem>
        ))}

      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>

  );
}
