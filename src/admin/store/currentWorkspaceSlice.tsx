import { createSlice } from '@reduxjs/toolkit';// , createAsyncThunk
// import axios from 'axios';
import type { Iworkspace } from 'types';

const currentWorkspace: Iworkspace = {
  created_at: '',
  id: 0,
  logo_url: null,
  members: [],
  members_count: 0,
  name: '',
  recently_accessed: '',
  updated_at: '',
  user: 0,
};

const workspaceSlice = createSlice({
  name: 'buildings/data',
  initialState: {
    currentWorkspace,
  },
  reducers: {
    setWorkspace: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.currentWorkspace = payload;
    },
  },
});

export const { setWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;

// export const getCurrentWorkspace = createAsyncThunk(
//   'get/workspace',
//   async (id: string | undefined) => {
//     const res = await axios({
//       url: `api/workspace/${id}`,
//       method: 'get',
//     });
//     const data = await res.data;
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     if (Boolean(data) && res.status === 200) { return data; }
//     return initialState;
//   },
// );

// const workspaceSlice = createSlice({
//   name: 'workspace/menus',
//   initialState,
//   reducers: {
//     resetCurrentWorkspace: (state: Iworkspace) => {
//       // eslint-disable-next-line no-param-reassign
//       state = initialState;
//       return state;
//     },
//   },
//   extraReducers: {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     [getCurrentWorkspace.fulfilled.type]: (state: Iworkspace, action) => action.payload,
//   },
// });

// export const { resetCurrentWorkspace } = workspaceSlice.actions;

// export default workspaceSlice.reducer;
