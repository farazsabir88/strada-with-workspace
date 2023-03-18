/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import type { IHookSelectField } from 'types';
import SelectInput from '../inputs/SelectInput';

export default function HookSelectField(props: IHookSelectField): JSX.Element {
  const {
    control, label, name, errors, options, className,
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <SelectInput
          name={name}
          className={`mb-24 ${className}`}
          label={label}
          id={`${name}-${label}`}
          options={options}
          error={Boolean(get(errors, name))}
          helperText={get(errors, name)?.message}
          onChange={field.onChange}
          value={String(field.value)}
          // {...field}
          // {...rest}
        />
      )}
    />
  );
}
