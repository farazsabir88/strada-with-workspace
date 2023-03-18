import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Ibuilding } from 'types';
import { decrypt } from 'shared-components/hooks/useEncryption';

const initialState: Ibuilding = {
  address: '',
  city: '',
  company: '',
  contact_email: '',
  contact_first_name: '',
  contact_last_name: '',
  country: '',
  id: 0,
  no_approval: 0,
  role: 0,
  state: 0,
  tenants: [],
  users: [],
  yardi_code: '',
  yardi_connected: false,
  zip: '',
  property_manager: [],
};

export const getCurrentBuilding = createAsyncThunk(
  'get/current-building',
  async (id: string | undefined) => {
    const res = await axios({
      url: `api/building/${decrypt(id)}/`,
      method: 'get',
    });
    const data = await res.data.detail;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (Boolean(data) && res.status === 200) { return data; }
    return initialState;
  },
);

const buildingSlice = createSlice({
  name: 'building/menus',
  initialState,
  reducers: {
    resetCurrentBuilding: (state: Ibuilding) => {
      // eslint-disable-next-line no-param-reassign
      state = initialState;
      return state;
    },
    setCurrentBuilding: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state = payload;
      return state;
    },
  },
  extraReducers: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    [getCurrentBuilding.fulfilled.type]: (state: Ibuilding, action) => action.payload,
  },
});

export const { resetCurrentBuilding, setCurrentBuilding } = buildingSlice.actions;

export default buildingSlice.reducer;
