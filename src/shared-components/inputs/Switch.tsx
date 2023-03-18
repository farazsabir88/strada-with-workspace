/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Switch from '@mui/material/Switch';
import { makeStyles } from '@mui/styles';
import type { ISwitch } from 'types';

const useStyles = makeStyles(() => ({
  root: {

  },
  track: {
    minWidth: '34px',
    height: '14px',
  },
}));

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function CustomSwitch(props: ISwitch): JSX.Element {
  const classes = useStyles();
  return (
    <Switch
      classes={{
        root: classes.root,
        track: classes.track,
      }}
      color='primary'
      {...label}
      {...props}
      defaultChecked
    />
  );
}
