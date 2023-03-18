/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';
import type { SelectOption, ISelectInput } from 'types';

export default function SelectInput(props: ISelectInput): JSX.Element {
  const {
    label, options, helperText, value, defaultValue, onChange, className, showPleaseSelect = true, haveMarginBottom = true, name, showPlaceholder = false, disabled = false, ...rest
  } = props;
  return (

    <FormControl style={{ marginBottom: haveMarginBottom ? 20 : 0 }} error={rest.error} fullWidth>
      {showPlaceholder && (
        <InputLabel id={`select-${label}`} shrink={!showPlaceholder} focused={!showPlaceholder}>
          {label}
        </InputLabel>
      )}

      {!showPlaceholder && (
        <InputLabel id={`select-${label}`}>
          {label}
        </InputLabel>
      )}
      <Select
        label={label}
        value={value}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        className={className}
        disabled={disabled}
        sx={{ maxHeight: '400px' }}
        {...rest}
      >
        { !showPleaseSelect ? null : <MenuItem key='select-option-first-option' value=''>Please Select</MenuItem>}
        {options.map((option: SelectOption) => (
          <MenuItem key={`select-option-${option.value}`} value={option.value} className={className}>
            {' '}
            {option.name}
            {' '}
          </MenuItem>
        ))}

      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>

  );
}
