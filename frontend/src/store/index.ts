import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/common/userSlice";
import instructorReducer from "./slice/instructor/instructorSlice";
import specializationReducer from "./slice/common/specializationSlice";
import coursesReducer from "./slice/course/coursesSlice";
import lessonsReducer from "./slice/course/lessonsSlice";
import quizReducer from "./slice/course/quizSlice";
import couponReducer from "./slice/common/couponSlice";
import discountCampaignReducer from "./slice/common/discountCampaign.slice";
import enrollmentReducer from "./slice/course/enrollmentsSlice";
import cartReducer from "./slice/common/cartSlice";
import notificationReducer from "./slice/common/notificationsSlice";
import lessonDiscussionReducer from "./slice/course/lessonDiscussionSlice";
import courseRatingReducer from "./slice/course/courseRatingSlice";
import instructorAnalyticsReducer from "./slice/instructor/instructorAnalyticsSlice";
import reportReducer from "./slice/common/reportSlice";
import instructorProfileReducer from "./slice/instructor/instructorProfileSlice";
import adminAnalyticsReducer from "./slice/common/adminAnalyticsSlice";
import postReducer from "./slice/community/postSlice";
import commentReducer from "./slice/community/commentSlice";
import followReducer from "./slice/community/followSlice";
import chatReducer from "./slice/community/chatSlice";
import algorithmReducer from "./slice/common/algorithmSlice";

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
    instructorProfile: instructorProfileReducer,
    adminAnalytics: adminAnalyticsReducer,
    post: postReducer,
    comment: commentReducer,
    follow: followReducer,
    chat: chatReducer,
    algorithm: algorithmReducer,
  },
});

// 🧠 Types cho toàn bộ app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
