import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import designReducer from './slices/designSlice';
import canvasReducer from './slices/canvasSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    design: designReducer,
    canvas: canvasReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
