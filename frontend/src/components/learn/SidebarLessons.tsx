import { cn } from "@/lib/utils";

interface SidebarLessonsProps {
  lessons: LessonType[];
  currentLessonId: number | null;
  onSelectLesson: (lesson: LessonType) => void;
}

export default function SidebarLessons({
  lessons,
  currentLessonId,
  onSelectLesson,
}: SidebarLessonsProps) {
  // ── Nhóm bài học theo chapter
  const groupedByChapter = lessons.reduce((acc, lesson) => {
    const chapterTitle = lesson.chapter?.title || "Chưa có chương"; // fallback nếu null
    if (!acc[chapterTitle]) acc[chapterTitle] = [];
    acc[chapterTitle].push(lesson);
    return acc;
  }, {} as Record<string, LessonType[]>);

  return (
    <aside className="w-72 bg-white border-r shadow-sm p-4 space-y-3 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Danh sách bài học</h2>

      {Object.entries(groupedByChapter).map(([chapterTitle, lessons]) => (
        <div key={chapterTitle}>
          {/* Tiêu đề chương */}
          <h3 className="text-sm font-semibold text-gray-800 mb-2 mt-3 tracking-wide">
            {chapterTitle}
          </h3>

          {/* Danh sách bài học trong chương */}
          <div className="space-y-1">
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition",
                  currentLessonId === lesson.id
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-blue-50 text-gray-700"
                )}
              >
                {i + 1}. {lesson.title}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!lessons.length && (
        <p className="text-gray-500 text-sm italic">Chưa có bài học nào.</p>
      )}
    </aside>
  );  
}
