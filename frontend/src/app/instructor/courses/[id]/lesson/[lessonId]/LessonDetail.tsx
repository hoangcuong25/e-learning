"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchLessonsByCourse } from "@/store/lessonsSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import SidebarLessons from "@/components/learn/SidebarLessons";

const LessonDetail = () => {
  const router = useRouter();
  const { id, lessonId } = useParams(); // id = courseId, lessonId = lessonId

  const dispatch = useDispatch<AppDispatch>();
  const { lessons, loading } = useSelector((state: RootState) => state.lesson);

  const [currentLesson, setCurrentLesson] = useState<LessonType | null>(null);

  // 🔹 Fetch toàn bộ bài học trong khóa
  useEffect(() => {
    if (id) dispatch(fetchLessonsByCourse(Number(id)));
  }, [id, dispatch]);

  // 🔹 Khi có dữ liệu => xác định bài học hiện tại
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
      {/* 🔹 Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/instructor/courses/${id}`)}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={18} />
              <span>Quay lại khóa học</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">
              Bài học trong khóa học #{id}
            </h1>
          </div>
        </div>

        {/* Video player */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md">
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
                  <PlayCircle className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                <span>Bài trước</span>
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

            {/* Lesson Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentLesson.title}
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {currentLesson.content ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: currentLesson.content,
                    }}
                  />
                ) : (
                  "Chưa có mô tả cho khóa học này."
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetail;
