/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import './_COIs.scss';
import type { IpropertySelect } from './types';

interface Iprops {
  propertyList: IpropertySelect[];
  defaultValue: number | string | null;
  id: number | string;
}
export default function ComboBox(props: Iprops): JSX.Element {
  const { propertyList, defaultValue, id } = props;
  const { enqueueSnackbar } = useSnackbar();
  const setDefaultValue = propertyList.filter((item) => item.value === defaultValue);
  const [propertyState, setPropertyState] = React.useState(setDefaultValue[0]);

  const queryClient = useQueryClient();
  const { mutate: setVendorCategory } = useMutation(async (payload: number | null | undefined) => axios({
    url: `/api/coi/${id}/`,
    method: 'patch',
    data: {
      property: payload,
    },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/cois').catch()
        .then();
      enqueueSnackbar('Property Updated Successfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const changeHandler: (event: React.SyntheticEvent, value: IpropertySelect | null,) => void = (e, value) => {
    if (value !== null) setPropertyState(value);
    if (value?.value === -1) {
      setVendorCategory(null);
    } else {
      setVendorCategory(value?.value);
    }
  };

  React.useEffect(() => {
    const value = propertyList.filter((item) => item.value === defaultValue);
    setPropertyState(value[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <Autocomplete
      disablePortal
      className='vendor-select'
      id='combo-box-demo'
      onChange={changeHandler}
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      value={propertyState || { label: 'property', value: 0 }}
      options={propertyList}
      renderInput={(params): React.ReactNode => <TextField {...params} hiddenLabel className='vendor-select' />}
    />
  );
}
