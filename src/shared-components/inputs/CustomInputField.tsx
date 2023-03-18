/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { TextFieldTypes } from 'types';
import { RedditTextField } from './InputField';

export default function CustomInputField(props: TextFieldTypes): JSX.Element {
  const { ...rest } = props;
  return (
    <RedditTextField variant='filled' fullWidth {...rest} />
  );
}
