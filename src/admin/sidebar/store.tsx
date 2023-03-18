/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  template: false,
};

const sideBarCollpseState = createSlice({
  initialState,
  name: 'Sidebar-Collapse-State',
  reducers: {
    setCollapseState: (state, { payload }) => ({ ...state, ...payload }),
  },
});

export const { setCollapseState } = sideBarCollpseState.actions;

export default sideBarCollpseState.reducer;
