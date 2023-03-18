/* eslint-disable react/require-default-props */
import React from 'react';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({

  root: {

    '& .MuiOutlinedInput-root': {
      '& legend': {
        display: 'none',
      },
      '& fieldset': {
        marginTop: '5px',
        margin: '0',
        height: '3.3rem',
      },
    },
  },

});
interface INumberTextfield {
  // eslint-disable-next-line react/no-unused-prop-types
  name?: string;
  type: string;
  // eslint-disable-next-line react/require-default-props
  value?: number | string;
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/no-unused-prop-types
  label?: string | undefined;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}
export default function NumberTextfield(props: INumberTextfield): JSX.Element {
  const classes = useStyles();
  const {
    value, type, onChange, onBlur, disabled,
  } = props;
  return (
    <div>
      <TextField
        fullWidth
        type={type}
        className={classes.root}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        variant='outlined'
      />
    </div>
  );
}
