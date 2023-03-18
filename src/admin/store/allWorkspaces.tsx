import { createSlice } from '@reduxjs/toolkit';

const workspacesSlice = createSlice({
  name: 'buildings/data',
  initialState: {
    data: [],
  },
  reducers: {
    setAllWorkspaces: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.data = payload;
    },
  },
});

export const { setAllWorkspaces } = workspacesSlice.actions;

export default workspacesSlice.reducer;
