import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import instructorReducer from "./slice/instructorSlice";
import specializationReducer from "./slice/specializationSlice";
import coursesReducer from "./slice/coursesSlice";
import lessonsReducer from "./slice/lessonsSlice";
import quizReducer from "./slice/quizSlice";
import couponReducer from "./slice/couponSlice";
import discountCampaignReducer from "./slice/discountCampaign.slice";
import enrollmentReducer from "./slice/enrollmentsSlice";
import cartReducer from "./slice/cartSlice";
import notificationReducer from "./slice/notificationsSlice";
import lessonDiscussionReducer from "./slice/lessonDiscussionSlice";
import courseRatingReducer from "./slice/courseRatingSlice";
import instructorAnalyticsReducer from "./slice/instructorAnalyticsSlice";
import reportReducer from "./slice/reportSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    instructor: instructorReducer,
    specialization: specializationReducer,
    courses: coursesReducer,
    lesson: lessonsReducer,
    quiz: quizReducer,
    coupon: couponReducer,
    discountCampaign: discountCampaignReducer,
    enrollment: enrollmentReducer,
    cart: cartReducer,
    notification: notificationReducer,
    lessonDiscussion: lessonDiscussionReducer,
    courseRating: courseRatingReducer,
    instructorAnalytics: instructorAnalyticsReducer,
    report: reportReducer,
  },
});

// 🧠 Types cho toàn bộ app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
