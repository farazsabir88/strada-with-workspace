/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import './_COIs.scss';
import type { IvendorChange } from './types';

interface Iprops {
  vendorList: IvendorChange[];
  defaultValue: number | string | null;
  id: number | string;
}
export default function ComboBox(props: Iprops): JSX.Element {
  const { vendorList, defaultValue, id } = props;
  const { enqueueSnackbar } = useSnackbar();
  const setDefaultValue = vendorList.filter((item) => item.value === defaultValue);

  const [vendorState, setVendorValue] = React.useState(setDefaultValue[0]);

  const queryClient = useQueryClient();

  const { mutate: setVendorCategory } = useMutation(async (payload: number | null | undefined) => axios({
    url: `/api/coi/${id}/`,
    method: 'patch',
    data: {
      vendor_category: payload,
    },
  }), {
    onSuccess: async () => {
      enqueueSnackbar('Vendor Category Selected Successfully!');
      await queryClient.invalidateQueries('get/cois').catch()
        .then();
      await queryClient.invalidateQueries('get/cois-errors').catch()
        .then();
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });

  const changeHandler: (event: React.SyntheticEvent, value: IvendorChange | null,) => void = (e, value) => {
    if (value !== null) setVendorValue(value);
    if (value?.value === -1) {
      setVendorCategory(null);
    } else {
      setVendorCategory(value?.value);
    }
  };

  React.useEffect(() => {
    const value = vendorList.filter((item) => item.value === defaultValue);
    setVendorValue(value[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);
  return (
    <Autocomplete
      disablePortal
      className='vendor-select'
      id='combo-box-demo'
      onChange={changeHandler}
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      value={vendorState || { label: 'vendor category', value: -1 }}
      options={vendorList}
      renderInput={(params): React.ReactNode => <TextField {...params} hiddenLabel className='vendor-select' />}
    />
  );
}
