/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import type { TextFieldTypes } from 'types';
import StandardInput from '../inputs/StandardInput';

export default function HookTextField(props: TextFieldTypes): JSX.Element {
  const {
    control, label, name, errors, type, ...rest
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <StandardInput
          className='mb-24'
          label={label}
          type={type}
          error={Boolean(get(errors, name))}
          helperText={get(errors, name)?.message}
          variant='standard'
          {...field}
          {...rest}
        />
      )}
    />
  );
}
