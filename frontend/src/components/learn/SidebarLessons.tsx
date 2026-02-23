import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface SidebarLessonsProps {
  lessons: LessonType[];
  currentLessonId: number | null;
  onSelectLesson: (lesson: LessonType) => void;
  completedLessonIds?: number[];
}

export default function SidebarLessons({
  lessons,
  currentLessonId,
  onSelectLesson,
  completedLessonIds,
}: SidebarLessonsProps) {
  const completedSet = new Set(completedLessonIds || []);

  const groupedByChapter = lessons.reduce((acc, lesson) => {
    const chapterTitle = lesson.chapter?.title || "Chưa có chương";
    if (!acc[chapterTitle]) acc[chapterTitle] = [];
    acc[chapterTitle].push(lesson);
    return acc;
  }, {} as Record<string, LessonType[]>);

  return (
    <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r shadow-sm p-4 space-y-3 overflow-y-auto max-h-[400px] lg:max-h-screen">
      <h2 className="text-lg font-semibold mb-4">Danh sách bài học</h2>

      {Object.entries(groupedByChapter).map(
        ([chapterTitle, lessonsInChapter]) => (
          <div key={chapterTitle}>
            <h3 className="text-sm font-semibold text-gray-800 mb-2 mt-3 tracking-wide">
              {chapterTitle}
            </h3>

            <div className="space-y-1">
              {lessonsInChapter.map((lesson, i) => {
                const isCompleted = completedSet.has(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between",
                      currentLessonId === lesson.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-blue-50 text-gray-700",
                      isCompleted &&
                        currentLessonId !== lesson.id &&
                        "text-green-700 hover:bg-green-50/50"
                    )}
                  >
                    <span className="truncate pr-2">
                      {i + 1}. {lesson.title}
                    </span>

                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}

      {!lessons.length && (
        <p className="text-gray-500 text-sm italic">Chưa có bài học nào.</p>
      )}
    </aside>
  );
}
