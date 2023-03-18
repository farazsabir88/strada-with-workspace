/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { createSlice } from '@reduxjs/toolkit';
import type { ICurrentUserRole } from 'admin/workSpaces/types';

interface IInitialState {
  currentUserRole: ICurrentUserRole | null;
}

const initialState: IInitialState = {
  currentUserRole: null,
};

const userPermissionSlice = createSlice({
  name: 'buildings/data',
  initialState,
  reducers: {
    setCurrentUserRole: (state, { payload }) => {
      state.currentUserRole = payload;
      return state;
    },
  },

});

export const { setCurrentUserRole } = userPermissionSlice.actions;

export default userPermissionSlice.reducer;
