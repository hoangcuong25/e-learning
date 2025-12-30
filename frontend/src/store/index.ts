import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import instructorReducer from "./instructorSlice";
import specializationReducer from "./specializationSlice";
import coursesReducer from "./coursesSlice";
import lessonsReducer from "./lessonsSlice";
import quizReducer from "./quizSlice";
import couponReducer from "./couponSlice";
import discountReducer from "./discount.slice";
import enrollmentReducer from "./enrollmentsSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    instructor: instructorReducer,
    specialization: specializationReducer,
    courses: coursesReducer,
    lesson: lessonsReducer,
    quiz: quizReducer,
    coupon: couponReducer,
    discount: discountReducer,
    enrollment: enrollmentReducer,
    cart: cartReducer,
  },
});

// 🧠 Types cho toàn bộ app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
