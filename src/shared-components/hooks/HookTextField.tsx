/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import type { TextFieldTypes } from 'types';
import makeStyles from '@mui/styles/makeStyles';
import InputField from '../inputs/InputField';

const useStyles = makeStyles(() => ({
  shrink: {
    '& label': {
      transform: 'translate(12px, 10px) scale(0.75) !important',
    },
  },
}));

export default function HookTextField(props: TextFieldTypes): JSX.Element {
  const {
    disabled, control, label, name, errors, type, rows, multiline, endAdornment, startAdornment, className, autoFocus,
  } = props;

  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <InputField
          className={`${className} ${type === 'number' && classes.shrink} mb-24`}
          label={label}
          name={name}
          type={type}
          rows={rows}
          error={Boolean(get(errors, name))}
          helperText={get(errors, name)?.message}
          onChange={field.onChange}
          value={field.value ?? ''}
          InputLabelProps={{ shrink: type === 'date' ? true : undefined }}
          multiline={multiline}
          endAdornment={endAdornment}
          disabled={disabled}
          startAdornment={startAdornment}
          autoFocus={autoFocus}
        />
      )}
    />
  );
}
