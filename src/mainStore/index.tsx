/* eslint-disable @typescript-eslint/no-unsafe-call */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import loginSlice from 'client/login/store';
import integrationSlice from 'admin/accountSettings/store';
import workspaceSection from 'admin/store';
import sidebarState from 'admin/sidebar/store';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: loginSlice,
    integrations: integrationSlice,
    workspaces: workspaceSection,
    sidebar: sidebarState,
  }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type RootState = ReturnType<typeof store.getState>;
