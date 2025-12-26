"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchLessonsByCourse } from "@/store/lessonsSlice";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  BookOpenCheck,
  ArrowDownCircle,
} from "lucide-react";
import SidebarLessons from "@/components/learn/SidebarLessons";

const LessonDetail = () => {
  const router = useRouter();
  const { id, lessonId } = useParams(); // id = courseId, lessonId = lessonId

  const dispatch = useDispatch<AppDispatch>();
  const { lessons, loading } = useSelector((state: RootState) => state.lesson);

  const [currentLesson, setCurrentLesson] = useState<LessonType | null>(null);

  // Fetch toàn bộ bài học trong khóa
  useEffect(() => {
    if (id) dispatch(fetchLessonsByCourse(Number(id)));
  }, [id, dispatch]);

  // Khi có dữ liệu => xác định bài học hiện tại
  useEffect(() => {
    if (lessons.length && lessonId) {
      const lesson = lessons.find((l) => l.id === Number(lessonId));
      setCurrentLesson(lesson || lessons[0]);
    }
  }, [lessons, lessonId]);

  if (loading || !lessons.length) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải bài học...
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Không tìm thấy bài học.
      </div>
    );
  }

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setCurrentLesson(nextLesson);
      router.push(`/instructor/courses/${id}/lesson/${nextLesson.id}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      setCurrentLesson(prevLesson);
      router.push(`/instructor/courses/${id}/lesson/${prevLesson.id}`);
    }
  };

  const handleJumpToQuiz = () => {
    const quizSection = document.getElementById("quiz-section");
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Sidebar Lessons */}
      <SidebarLessons
        lessons={lessons}
        currentLessonId={currentLesson?.id ?? null}
        onSelectLesson={(lesson) => {
          setCurrentLesson(lesson);
          router.push(`/instructor/courses/${id}/lesson/${lesson.id}`);
        }}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/instructor/courses/${id}`)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              <span>Quay lại khóa học</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">
              Bài học trong khóa #{id}
            </h1>
          </div>
        </div>

        {/* Video + Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
              {currentLesson.videoUrl ? (
                <video
                  src={currentLesson.videoUrl}
                  controls
                  preload="metadata"
                  className="w-full h-full object-contain"
                  poster={
                    currentLesson.videoUrl
                      ?.replace("/upload/", "/upload/so_auto,q_auto,w_600/")
                      .replace(".mp4", ".jpg") || undefined
                  }
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <PlayCircle className="w-14 h-14" />
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <ChevronLeft size={16} />
                <span>Bài trước</span>
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={handleJumpToQuiz}
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <ArrowDownCircle size={18} />
                  <span>Jump to Quizzes</span>
                </Button>

                <Button
                  variant="default"
                  onClick={handleNext}
                  disabled={currentIndex === lessons.length - 1}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <span>Bài tiếp theo</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              {currentLesson.chapter && (
                <div className="mb-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    Thuộc chương:
                  </span>{" "}
                  <span className="text-gray-600">
                    {currentLesson.chapter.title}
                  </span>
                </div>
              )}
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {currentLesson.title}
              </h2>
              {currentLesson.content ? (
                <div
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: currentLesson.content,
                  }}
                />
              ) : (
                <p className="text-gray-500">Chưa có mô tả cho khóa học này.</p>
              )}
            </div>

            {/* Quiz Section */}
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

              {loading ? (
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              ) : currentLesson?.quizzes?.length ? (
                <div className="space-y-4">
                  {currentLesson.quizzes.map((quiz, index) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetail;
