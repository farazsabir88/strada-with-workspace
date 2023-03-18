/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { createSlice } from '@reduxjs/toolkit';
import type { IEvent, IEventTask, ISideSheetData } from 'admin/buildingSection/budget-calendar/types';

interface IInitialState {
  singleSideSheetData: ISideSheetData | null;
  sideSheetData: IEvent | null;
  taskInFocus: boolean;
  monthChange: boolean;
  refreshFlag: boolean;
  sideSheetLoader: boolean;
  currentTask: IEventTask | null;
}

const initialState: IInitialState = {
  singleSideSheetData: null,
  sideSheetData: null,
  taskInFocus: false,
  monthChange: false,
  refreshFlag: false,
  sideSheetLoader: false,
  currentTask: null,
};

const sideSheetDataSlice = createSlice({
  name: 'buildings/data',
  initialState,
  reducers: {
    setSideSheetData: (state, { payload }) => {
      state.sideSheetData = payload;
      return state;
    },
    setCurrentTask: (state, { payload }) => {
      state.currentTask = payload;
      return state;
    },
    setSingleSideSheetData: (state, { payload }) => {
      state.singleSideSheetData = payload;
      return state;
    },
    setTaskIntoFocus: (state, { payload }) => {
      state.taskInFocus = payload;
      return state;
    },
    setMonthChange: (state, { payload }) => {
      state.monthChange = payload;
      return state;
    },
    setSideSheetLoader: (state, { payload }) => {
      state.sideSheetLoader = payload;
      return state;
    },
  },

});

export const {
  setSideSheetData, setSingleSideSheetData, setCurrentTask, setTaskIntoFocus, setMonthChange, setSideSheetLoader,
} = sideSheetDataSlice.actions;

export default sideSheetDataSlice.reducer;
