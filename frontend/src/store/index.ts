import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import instructorReducer from "./instructorSlice";
import specializationReducer from "./specializationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    instructor: instructorReducer,
    specialization: specializationReducer,
  },
});

// 🧠 Types cho toàn bộ app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
