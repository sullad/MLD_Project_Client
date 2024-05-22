import { configureStore } from "@reduxjs/toolkit";
// import headerReducer from "../features/header/headerSlice.ts";
import authReducer from "../features/user/userSlice";

const store = configureStore({
  reducer: {
    // headerPopup: headerReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
