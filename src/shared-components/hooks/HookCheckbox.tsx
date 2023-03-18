/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Controller } from 'react-hook-form';
import type { IHookCheckbox } from 'types';
import CustomCheckbox from '../inputs/CustomCheckbox';

export default function HookCheckbox(props: IHookCheckbox): JSX.Element {
  const {
    control, label, name,
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <CustomCheckbox
          label={label}
          name={name}
          checked={Boolean(field.value)}
          value={Boolean(field.value)}
          onChange={field.onChange}
        />
      )}
    />
  );
}
