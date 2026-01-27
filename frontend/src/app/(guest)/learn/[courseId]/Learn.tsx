"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseDetailWithAuth } from "@/store/slice/coursesSlice";
import { fetchCourseRatings } from "@/store/slice/courseRatingSlice";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  BookOpenCheck,
} from "lucide-react";
import SidebarLessons from "@/components/learn/SidebarLessons";
import LoadingScreen from "@/components/LoadingScreen";
import { increaseCourseViewApi } from "@/store/api/courses.api";
import { markLessonCompletedApi } from "@/store/api/lesson.api";
import LessonContentTabs from "@/components/learn/LessonContentTabs";

const Learn = () => {
  const router = useRouter();
  const { courseId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  const [activeTab, setActiveTab] = useState<"overview" | "qna" | "review">(
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

  if (loading) return <LoadingScreen />;

  if (!lessons.length)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Khóa học này chưa có bài học nào được xuất bản.
      </div>
    );

  if (!currentLesson)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Không tìm thấy bài học.
      </div>
    );

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setCurrentLesson(nextLesson);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      setCurrentLesson(prevLesson);
    }
  };

  const handleJumpToQuiz = () => {
    const quizSection = document.getElementById("quiz-section");
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 mt-4">
      {/* Sidebar Lessons */}
      <SidebarLessons
        lessons={lessons}
        currentLessonId={currentLesson?.id ?? null}
        onSelectLesson={(lesson) => setCurrentLesson(lesson)}
        completedLessonIds={completedLessonIds}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/courses/${courseId}`)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              <span>Quay lại khóa học</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">
              {currentCourse?.title || `Khóa học #${courseId}`}
            </h1>
          </div>
        </div>

        {/* Video + Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Video */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
              {currentLesson.videoUrl ? (
                <video
                  key={currentLesson.videoUrl}
                  ref={videoRef}
                  src={currentLesson.videoUrl}
                  controls
                  preload="metadata"
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-contain"
                  poster={
                    currentLesson.videoUrl
                      ?.replace("/upload/", "/upload/so_auto,q_auto,w_600/")
                      .replace(".mp4", ".jpg") || undefined
                  }
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <PlayCircle className="w-14 h-14" />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={16} /> Bài trước
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={handleJumpToQuiz}
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <BookOpenCheck size={18} />
                  Chuyển đến Bài kiểm tra
                </Button>

                <Button
                  variant="default"
                  onClick={handleNext}
                  disabled={currentIndex === lessons.length - 1}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Bài tiếp theo <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {/* Quiz */}
            <div
              id="quiz-section"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <BookOpenCheck className="text-blue-600" size={22} />
                <h3 className="text-xl font-semibold text-gray-800">
                  Bài kiểm tra - Quizzes
                </h3>
              </div>

              {currentLesson?.quizzes?.length ? (
                <div className="space-y-4">
                  {currentLesson?.quizzes?.map((quiz: any, index: number) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-blue-200 transition cursor-pointer"
                      onClick={() =>
                        router.push(`/learn/${courseId}/quiz/${quiz.id}`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-800 font-medium">
                          {quiz.title}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                        {quiz._count?.questions ?? quiz.questions?.length ?? 0}{" "}
                        câu hỏi
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Chưa có bài kiểm tra trắc nghiệm nào.
                </p>
              )}
            </div>

            {/* Tabs */}
            <LessonContentTabs
              currentLesson={currentLesson}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              totalRating={currentCourse?.totalRating}
              averageRating={currentCourse?.averageRating}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
