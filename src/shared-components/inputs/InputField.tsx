/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import type { OutlinedInputProps } from '@mui/material/OutlinedInput';
import type { TextFieldTypes } from 'types';
import NumberFormat from 'react-number-format';
import makeStyles from '@mui/styles/makeStyles';

const red = '#d32f2f';

const useStyles = makeStyles(() => ({
  ttttttttt: {
    '& .label': {
      transform: 'translate(12px, 10px) scale(0.75) !important',
    },
  },
}));

export const RedditTextField = styled(
  (props: TextFieldTypes) => {
    const { endAdornment, startAdornment } = props;
    return (
      <TextField
        InputProps={
          {
            disableUnderline: true,
            endAdornment,
            startAdornment,
          } as Partial<OutlinedInputProps>
        }
        {...props}
      />
    );
  },
  {
    shouldForwardProp: (prop: string) => prop !== 'error',
  },
)(({ theme, error }) => ({
  marginBottom: 20,
  '& .MuiFilledInput-root': {
    border: `1px solid ${error ? red : '#e2e2e1'}`,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      // borderColor: theme.palette.primary.main,
      color: error ? red : theme.palette.primary.main,
      borderColor: error ? red : theme.palette.primary.main,
    },
  },
  '& .MuiFormHelperText-root': {
    color: error ? red : theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    color: error ? red : 'rgba(33, 33, 33, 0.6)',
  },

  '& .MuiInputLabel-root': {
    color: error ? red : '',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: error ? red : theme.palette.primary.main,
  },
}));

interface NumberFormatCustomProps {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string; id: string } }) => void;
  name: string;
  id: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps): JSX.Element {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={(values): void => {
        onChange({
          target: {
            value: values.value,
            name: props.name,
            id: props.id,
          },
        });
      }}
      thousandSeparator
      // prefix='$'
    />
  );
}

const RedditNumberField = styled(
  (props: TextFieldTypes) => {
    const { endAdornment, startAdornment } = props;
    const classes = useStyles();
    return (
      <TextField
        InputProps={
          {
            disableUnderline: true,
            className: classes.ttttttttt,
            endAdornment,
            startAdornment,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            inputComponent: NumberFormatCustom as any,
          } as Partial<OutlinedInputProps>
        }
        InputLabelProps={{ shrink: true }}
        {...props}
      />
    );
  },
  {
    shouldForwardProp: (prop: string) => prop !== 'error',
  },
)(({ theme, error }) => ({
  marginBottom: 20,
  '& .MuiFilledInput-root': {
    border: `1px solid ${error ? red : '#e2e2e1'}`,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      // borderColor: theme.palette.primary.main,
      color: error ? red : theme.palette.primary.main,
      borderColor: error ? red : theme.palette.primary.main,
    },
  },
  '& .MuiFormHelperText-root': {
    color: error ? red : theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    color: error ? red : 'rgba(33, 33, 33, 0.6)',
  },

  '& .MuiInputLabel-root': {
    color: error ? red : '',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: error ? red : theme.palette.primary.main,
  },
}));

export default function InputField(props: TextFieldTypes): JSX.Element {
  const { type, ...rest } = props;
  return (
    <>
      { type === 'number' && <RedditNumberField variant='filled' fullWidth {...rest} />}
      { type !== 'number' && <RedditTextField variant='filled' fullWidth {...rest} type={type} />}
    </>
  );
}
