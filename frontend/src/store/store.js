import { userApi } from "../services/api/user";
import authReducer from "../features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: authReducer, // Associating the 'authReducer' with the 'auth' slice of the state.
    [userApi.reducerPath]: userApi.reducer, // Associating the 'userApi' reducer with a slice defined by 'userApi.reducerPath'.
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([userApi.middleware]), // Adding the 'userApi' middleware to the default middleware stack.
});

export default store;
