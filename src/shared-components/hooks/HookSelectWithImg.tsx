/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { get } from 'lodash';
import { Controller } from 'react-hook-form';
import type { IHookSelectField } from 'types';
import SelectInputWithImg from '../inputs/SelectInputWithImg';

export default function HookSelectWithImg(props: IHookSelectField): JSX.Element {
  const {
    control, label, name, errors, options,
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <SelectInputWithImg
          name={name}
          className='mb-24'
          label={label}
          id={`${name}-${label}`}
          options={options}
          error={Boolean(get(errors, name))}
          helperText={get(errors, name)?.message}
          onChange={field.onChange}
          value={String(field.value)}
        />
      )}
    />
  );
}
