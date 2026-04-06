import { configureStore } from '@reduxjs/toolkit';
import dealsReducer from './dealsSlice';
import investorsReducer from './investorsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    deals: dealsReducer,
    investors: investorsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
