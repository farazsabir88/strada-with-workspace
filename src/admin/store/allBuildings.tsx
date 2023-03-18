import { createSlice } from '@reduxjs/toolkit';

const buildingsSlice = createSlice({
  name: 'buildings/data',
  initialState: {
    data: [],
  },
  reducers: {
    setAllBuildings: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.data = payload;
    },
  },
});

export const { setAllBuildings } = buildingsSlice.actions;

export default buildingsSlice.reducer;
