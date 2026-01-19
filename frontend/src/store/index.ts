import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import instructorReducer from "./instructorSlice";
import specializationReducer from "./specializationSlice";
import coursesReducer from "./coursesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    instructor: instructorReducer,
    specialization: specializationReducer,
    courses: coursesReducer,
  },
});

// 🧠 Types cho toàn bộ app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
