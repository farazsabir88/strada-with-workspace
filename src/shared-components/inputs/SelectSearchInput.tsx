/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import type { Imember, ISelectSearchInput } from 'types';
import { Avatar } from '@mui/material';

export default function SelectSearchInput(props: ISelectSearchInput): JSX.Element {
  const {
    label, options, value, onChange, name, ...rest
  } = props;
  return (
    <Autocomplete
      id='country-select-demo'
      options={options}
      autoHighlight
      getOptionLabel={(option: Imember): string => `${option.name}`}
      value={value}
      onChange={onChange}
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      renderOption={(propss, option) => (
        <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...propss} key={option.id}>
          <Avatar src={`${process.env.REACT_APP_IMAGE_URL}${option.avatar}`} style={{ width: '24px', height: '24px', marginRight: '12px' }}>{option.name}</Avatar>
          {option.name}
        </Box>
      )}
      renderInput={(params): JSX.Element => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
      {...rest}
    />
  );
}
