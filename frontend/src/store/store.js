import { userApi } from "../services/api/user";
import authReducer from "../features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { timeTrackerApi } from "../services/api/timeTracking";
import { trackingLogApi } from "../services/api/trackingLog";

const store = configureStore({
  reducer: {
    auth: authReducer, // Associating the 'authReducer' with the 'auth' slice of the state.
    [userApi.reducerPath]: userApi.reducer, // Associating the 'userApi' reducer with a slice defined by 'userApi.reducerPath'.
    [timeTrackerApi.reducerPath]: timeTrackerApi.reducer,
    [trackingLogApi.reducerPath]: trackingLogApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userApi.middleware,
      timeTrackerApi.middleware,
      trackingLogApi.middleware,
    ]), // Adding the 'userApi' middleware to the default middleware stack.
});

export default store;
