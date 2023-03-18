import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { IYardiCredentials } from '../AdminFormTypes';
import type { IYardiConnectionTypeResponse } from '../buildingSettings/integrations/types';

const initialState = {
  property_id: 0,
  status: '',
  version: null,
  yardi_code: '',
  yardi_database: '',
  yardi_password: '',
  yardi_platform: '',
  yardi_servername: '',
  yardi_url: '',
  yardi_username: '',
};

export const getBuildingIntegrations = createAsyncThunk(
  'get/current-building-integration',
  async (buildingId: string | undefined) => {
    const res: AxiosResponse<IYardiConnectionTypeResponse> = await axios({
      url: '/api/integrations/get_yardi_credentials/',
      method: 'post',
      data: {
        id: Number(buildingId),
      },
    });
    const data = res.data.results;
    if (Boolean(data) && res.status === 200) { return data; }
    return initialState;
  },
);

const buildingIntegrationSlice = createSlice({
  name: 'get/building/integrations',
  initialState,
  reducers: {},
  extraReducers: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    [getBuildingIntegrations.fulfilled.type]: (state: IYardiCredentials, action) => action.payload,
  },
});

export default buildingIntegrationSlice.reducer;
