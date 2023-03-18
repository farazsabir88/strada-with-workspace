/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const outlookAuth = {
  accountIdentifier: '',
  email: '',
  environment: '',
  expiresOn: '',
  homeAccountIdentifier: '',
  id: 0,
  name: '',
  oauth_token: '',
  isConnected: false,
};
const googleAuth = {
  accountIdentifier: '',
  email: '',
  environment: '',
  expiresOn: '',
  homeAccountIdentifier: '',
  id: 0,
  name: '',
  oauth_token: '',
  isConnected: false,
};

const integrationSlice = createSlice({
  name: 'integration/outlook/google',
  initialState: {
    google: googleAuth,
    outlook: outlookAuth,
  },

  reducers: {
    connectGoogle: (state, { payload }) => {
      state.google = payload;
    },
    disconnectGoogle: (state) => {
      state.google = googleAuth;
    },
    connectOutlook: (state, { payload }) => {
      state.outlook = payload;
    },
    disconnectOutlook: (state) => {
      state.outlook = outlookAuth;
    },
  },
});

export const {
  connectGoogle, disconnectGoogle, connectOutlook, disconnectOutlook,
} = integrationSlice.actions;

export default integrationSlice.reducer;
