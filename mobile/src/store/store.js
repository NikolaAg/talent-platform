import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import communitiesSlice from './slices/communitiesSlice';
import projectsSlice from './slices/projectsSlice';
import eventsSlice from './slices/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    communities: communitiesSlice,
    projects: projectsSlice,
    events: eventsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
