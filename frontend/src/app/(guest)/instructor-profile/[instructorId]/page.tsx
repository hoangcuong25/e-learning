"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchInstructorProfile } from "@/store/slice/instructor/instructorProfileSlice";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  User,
  Briefcase,
  Award,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { fetchAllCourses } from "@/store/slice/course/coursesSlice";
import {
  findOrCreateConversation,
  setMiniChatOpen,
} from "@/store/slice/community/chatSlice";
import CourseCard from "@/components/course/CourseCard";

import { motion } from "framer-motion";

const InstructorProfilePublicPage = () => {
  const params = useParams();
  const instructorId = Number(params.instructorId);
  const dispatch = useDispatch<AppDispatch>();

  const { publicProfile, loading, error } = useSelector(
    (state: RootState) => state.instructorProfile,
  );

  const { courses, loading: coursesLoading } = useSelector(
    (state: RootState) => state.courses,
  );

  const handleMessageClick = () => {
    if (publicProfile?.userId) {
      dispatch(findOrCreateConversation(publicProfile.userId))
        .unwrap()
        .then(() => {
          dispatch(setMiniChatOpen(true));
        })
        .catch((err) => {
          console.error("Lỗi khi tạo/tìm hội thoại:", err);
        });
    }
  };

  useEffect(() => {
    if (instructorId) {
      dispatch(fetchInstructorProfile(instructorId));
      dispatch(fetchAllCourses({ instructorId, page: 1, limit: 100 } as any));
    }
  }, [dispatch, instructorId]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-10">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center">
            <AlertTriangle size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Lỗi tải hồ sơ
          </h3>
          <p className="text-slate-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!publicProfile) {
    return (
      <div className="flex h-screen items-center justify-center p-10">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center">
            <User size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Hồ sơ không tồn tại
          </h3>
          <p className="text-slate-400 font-medium tracking-tight">
            Thanh niên này có lẽ chưa cập nhật hồ sơ cá nhân.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-7xl mx-auto bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
      >
        <div className="p-10 lg:p-20 space-y-20">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <Avatar className="w-48 h-48 lg:w-64 lg:h-64 border-8 border-white shadow-2xl shadow-indigo-500/20">
                <AvatarImage
                  src={
                    publicProfile?.user?.avatar ||
                    "https://github.com/shadcn.png"
                  }
                  className="object-cover"
                />
                <AvatarFallback className="text-6xl font-black bg-indigo-50 text-indigo-600">
                  {(
                    publicProfile?.user?.fullname?.charAt(0) || "I"
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-indigo-600">
                <Award size={24} />
              </div>
            </motion.div>

            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Master Instructor
                  </span>
                </motion.div>
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                  {publicProfile?.user?.fullname || "Instructor Name"}
                </h1>
                <p className="text-xl text-slate-400 font-bold uppercase tracking-widest">
                  Giảng viên
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button
                  size="lg"
                  className="h-16 px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[11px] gap-3"
                  onClick={handleMessageClick}
                >
                  <MessageSquare size={18} />
                  Nhắn tin tư vấn
                </Button>
                <div className="flex items-center gap-6 px-8 h-16 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-black text-slate-900 tracking-tighter">
                      {courses?.length || 0}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Khóa học
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-20 pt-20 border-t border-slate-50">
            {/* Bio Section */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                  Giới thiệu
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed whitespace-pre-line">
                  {publicProfile.bio || "Chưa có thông tin giới thiệu cá nhân."}
                </p>
              </div>

              {publicProfile.experience && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                    Kinh nghiệm
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed whitespace-pre-line">
                    {publicProfile.experience}
                  </p>
                </div>
              )}
            </div>

            {/* Courses Section */}
            <div className="space-y-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                Danh mục khóa học
              </h3>

              {coursesLoading ? (
                <div className="grid sm:grid-cols-2 gap-8 opacity-50">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-slate-50 rounded-[2.5rem] animate-pulse"
                    />
                  ))}
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-8">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Chưa có khóa học nào được phát hành
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructorProfilePublicPage;
