/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Controller } from 'react-hook-form';
import type { IHookSelectField } from 'types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function HookSelectWithSearchField(props: IHookSelectField): JSX.Element {
  const {
    control, label, name, options, className, // errors
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <Autocomplete
          disablePortal
          className={`mb-24 ${className}`}
          options={options}
          style={{ marginBottom: '20px' }}
          onChange={field.onChange}
          renderInput={(params): JSX.Element => <TextField placeholder='Search by name' name={name} {...params} label={label} value={String(field.value)} />}
        />
      )}
    />
  );
}
