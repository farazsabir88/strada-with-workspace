/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const user = {
  avatar: '',
  default_integration: '',
  email: '',
  first_name: '',
  forwarding_mail: '',
  id: 0,
  is_assigned_notification: false,
  is_collaborator_notification: false,
  is_mentioned_notification: false,
  last_name: '',
  manager_approval_settings: '',
  role: '',
  sender_email: '',
  title: '',
  token: '',
};

const loginSlice = createSlice({
  name: 'user/login',
  initialState: {
    user,
    isLogin: false,
    token: null,
  },

  reducers: {
    setLogin: (state, { payload }) => {
      state.user = payload;
      state.isLogin = true;
      state.token = payload.token;
      window.localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = user;
      state.isLogin = false;
      state.token = null;
      window.localStorage.removeItem('auth');
    },
  },
});

export const { setLogin, logout } = loginSlice.actions;

export default loginSlice.reducer;
