"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseDetailWithAuth } from "@/store/slice/course/coursesSlice";
import { fetchCourseRatings } from "@/store/slice/course/courseRatingSlice";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  BookOpenCheck, 
  List,
  Compass,
  Zap,
  CheckCircle2,
  Clock
} from "lucide-react";
import SidebarLessons from "@/components/learn/SidebarLessons";
import LoadingScreen from "@/components/LoadingScreen";
import { increaseCourseViewApi } from "@/store/api/course/courses.api";
import { markLessonCompletedApi } from "@/store/api/course/lesson.api";
import LessonContentTabs from "@/components/learn/LessonContentTabs";
import { motion, AnimatePresence } from "framer-motion";

const Learn = () => {
  const router = useRouter();
  const { courseId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  const [activeTab, setActiveTab] = useState<"overview" | "qna" | "review" | "ai">(
    "overview"
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = async () => {
    if (!currentLesson?.id) return;
    await markLessonCompletedApi(currentLesson.id);
    dispatch(fetchCourseDetailWithAuth(Number(courseId)));
  };

  useEffect(() => {
    if (!courseId) return;
    const viewedKey = `viewed_course_${courseId}`;
    let timer: NodeJS.Timeout | null = null;
    if (sessionStorage.getItem(viewedKey)) return;
    timer = setTimeout(() => {
      increaseCourseViewApi(Number(courseId));
      sessionStorage.setItem(viewedKey, "true");
    }, 60000);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetailWithAuth(Number(courseId)));
      if (activeTab === "review") {
        dispatch(
          fetchCourseRatings({
            courseId: Number(courseId),
            params: { page: 1, limit: 10 },
          })
        );
      }
    }
  }, [courseId, activeTab]);

  const lessons =
    currentCourse?.chapter?.flatMap((ch) =>
      (ch?.lessons ?? [])?.map((l) => ({
        ...l,
        chapter: ch,
      }))
    ) || [];

  const [currentLesson, setCurrentLesson] = useState<any>(lessons[0]);
  const currentIndex = lessons.findIndex((l) => l?.id === currentLesson?.id);

  const completedLessonIds =
    currentCourse?.lessonProgresses?.map((cl) => cl.lessonId) || [];

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons]);

  if (loading && !currentCourse) return <LoadingScreen />;

  if (!lessons.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
           <BookOpenCheck size={48} />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Khóa học đang được chuẩn bị</h2>
           <p className="text-slate-400 font-medium max-w-sm mx-auto">Giảng viên đang nỗ lực hoàn thiện nội dung. Vui lòng quay lại sau!</p>
        </div>
        <Button 
          onClick={() => router.push("/my-learning")}
          className="h-14 px-8 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px]"
        >
          Quay lại phòng máy
        </Button>
      </div>
    );

  if (!currentLesson) return <LoadingScreen />;

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setCurrentLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      setCurrentLesson(prevLesson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sidebar Lessons */}
      <SidebarLessons
        lessons={lessons}
        currentLessonId={currentLesson?.id ?? null}
        onSelectLesson={(lesson) => setCurrentLesson(lesson)}
        completedLessonIds={completedLessonIds}
      />

      {/* Main Content Stage */}
      <main className="flex-1 lg:h-screen overflow-y-auto custom-scrollbar bg-slate-50/30">
        {/* Immersive Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-6 overflow-hidden">
              <button
                onClick={() => router.push("/my-learning")}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Đang học</p>
                 <h1 className="text-sm md:text-lg font-black text-slate-900 truncate tracking-tight">
                   {currentCourse?.title}
                 </h1>
              </div>
           </div>
           
           <div className="hidden md:flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                 Secure Learning
              </div>
           </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 lg:p-16"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Cinematic Stage */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-indigo-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
              <div className="relative aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white shadow-indigo-600/5">
                {currentLesson.videoUrl ? (
                  <video
                    key={currentLesson.videoUrl}
                    ref={videoRef}
                    src={currentLesson.videoUrl}
                    controls
                    preload="metadata"
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                    <PlayCircle className="w-20 h-20 opacity-20" />
                    <p className="font-black text-[10px] uppercase tracking-widest">Nội dung không có video</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation & Lesson Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Chương {currentLesson?.chapter?.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} /> {currentIndex + 1} / {lessons.length} Bài học
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                    {currentLesson.title}
                  </h2>
               </div>

               <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                 <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex-1 md:flex-none h-14 px-6 bg-white border border-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                 >
                    <ChevronLeft size={16} /> Bài trước
                 </button>
                 <button
                    onClick={handleNext}
                    disabled={currentIndex === lessons.length - 1}
                    className="flex-1 md:flex-none h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 disabled:opacity-30 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group"
                 >
                    Bài tiếp theo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
            </div>

            {/* Content Tabs & Challenges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
               <div className="lg:col-span-2">
                  <LessonContentTabs
                    currentLesson={currentLesson}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    totalRating={currentCourse?.totalRating}
                    averageRating={currentCourse?.averageRating}
                  />
               </div>

               <div className="lg:col-span-1 space-y-8">
                  {/* Challenge/Quiz Block */}
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
                     
                     <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                              <Zap size={24} fill="currentColor" />
                           </div>
                           <p className="text-[10px] font-black bg-indigo-600/30 px-3 py-1 rounded-full uppercase tracking-widest">Challenges</p>
                        </div>
                        
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black tracking-tight leading-tight">Thử thách kiến thức</h3>
                           <p className="text-slate-400 text-sm font-medium leading-relaxed">Hoàn thành bài kiểm tra để củng cố kiến thứcvừa học.</p>
                        </div>

                        <div className="space-y-3">
                           {currentLesson?.quizzes?.length ? (
                              currentLesson?.quizzes?.map((quiz: any, idx: number) => (
                                <button
                                  key={quiz.id}
                                  onClick={() => router.push(`/learn/${courseId}/quiz/${quiz.id}`)}
                                  className="w-full p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between transition-all group/quiz"
                                >
                                   <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                                         {idx + 1}
                                      </div>
                                      <span className="text-sm font-bold tracking-tight group-hover/quiz:text-indigo-400 transition-colors">{quiz.title}</span>
                                   </div>
                                   <ChevronRight size={16} className="text-slate-600 group-hover/quiz:translate-x-1 transition-transform" />
                                </button>
                              ))
                           ) : (
                              <div className="p-6 bg-white/5 border border-white/10 border-dashed rounded-2xl text-center">
                                 <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Không có bài tập</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Quick Support / Feedback */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Công cụ hỗ trợ</h4>
                     <div className="space-y-3">
                        <button className="w-full p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl flex items-center gap-4 transition-all group">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Compass size={18} />
                           </div>
                           <span className="text-sm font-bold tracking-tight">Tài liệu tham khảo</span>
                        </button>
                        <button className="w-full p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl flex items-center gap-4 transition-all group">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={18} className="text-emerald-500" />
                           </div>
                           <span className="text-sm font-bold tracking-tight">Chứng chỉ hoàn thành</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};


export default Learn;
