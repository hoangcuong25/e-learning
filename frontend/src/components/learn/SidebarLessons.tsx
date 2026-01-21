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
  return (
    <aside className="w-72 bg-white border-r shadow-sm p-4 space-y-2 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3">Danh sách bài học</h2>

      {lessons.map((lesson, i) => (
        <button
          key={lesson.id}
          onClick={() => onSelectLesson(lesson)}
          className={cn(
            "w-full text-left p-2 rounded-lg text-sm hover:bg-blue-50 transition",
            currentLessonId === lesson.id
              ? "bg-blue-100 font-medium text-blue-700"
              : "text-gray-700"
          )}
        >
          {i + 1}. {lesson.title}
        </button>
      ))}

      {!lessons.length && (
        <p className="text-gray-500 text-sm italic">Chưa có bài học nào.</p>
      )}
    </aside>
  );
}
