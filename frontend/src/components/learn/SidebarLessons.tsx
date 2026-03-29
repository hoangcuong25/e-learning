import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, Play, Layout, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const progressPercent = Math.round((completedSet.size / lessons.length) * 100) || 0;

  const groupedByChapter = lessons.reduce((acc, lesson) => {
    const chapterId = lesson.chapter?.id || 0;
    const chapterTitle = lesson.chapter?.title || "Chưa có chương";
    if (!acc[chapterId]) acc[chapterId] = { title: chapterTitle, lessons: [] };
    acc[chapterId].lessons.push(lesson);
    return acc;
  }, {} as Record<number, { title: string; lessons: LessonType[] }>);

  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>(() => {
     // Expand the chapter containing the current lesson by default
     const currentChapterId = lessons.find(l => l.id === currentLessonId)?.chapter?.id || 0;
     return { [currentChapterId]: true };
  });

  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-full lg:w-96 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col h-full lg:h-screen sticky top-0">
      {/* Sidebar Header & Progress */}
      <div className="p-8 space-y-6 border-b border-slate-50">
         <div className="space-y-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nội dung khóa học</h2>
            <div className="flex items-center justify-between">
               <p className="text-xl font-black text-slate-900 tracking-tighter">Bài học của bạn</p>
               <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{progressPercent}%</span>
            </div>
         </div>
         <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progressPercent}%` }}
               className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
            />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 pb-24">
        {Object.entries(groupedByChapter).map(([idStr, chapter]) => {
          const id = Number(idStr);
          const isExpanded = expandedChapters[id];
          const chapterCompletedCount = chapter.lessons.filter(l => completedSet.has(l.id)).length;

          return (
            <div key={id} className="space-y-2">
              <button
                onClick={() => toggleChapter(id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                  isExpanded ? "bg-slate-50" : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isExpanded ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-600"
                  )}>
                    <Layout size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                      {chapter.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {chapterCompletedCount}/{chapter.lessons.length} Bài học
                    </p>
                  </div>
                </div>
                <ChevronDown size={18} className={cn("text-slate-300 transition-transform duration-500", isExpanded && "rotate-180 text-indigo-600")} />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="overflow-hidden space-y-1 pl-4 border-l-2 border-slate-50 ml-5"
                  >
                    {chapter.lessons.map((lesson, index) => {
                      const isActive = currentLessonId === lesson.id;
                      const isCompleted = completedSet.has(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onSelectLesson(lesson)}
                          className={cn(
                            "w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                            isActive 
                              ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1" 
                              : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1"
                          )}
                        >
                          <div className="flex items-center gap-4 relative z-10 overflow-hidden">
                             <div className={cn(
                               "w-2 h-2 rounded-full shrink-0",
                               isActive ? "bg-white animate-pulse" : isCompleted ? "bg-emerald-500" : "bg-slate-200"
                             )} />
                             <div className="min-w-0">
                                <span className="block text-[13px] font-bold tracking-tight truncate">
                                  {index + 1}. {lesson.title}
                                </span>
                             </div>
                          </div>

                          <div className="flex items-center gap-3 relative z-10 shrink-0 ml-2">
                             {isActive ? (
                               <div className="flex gap-0.5 items-end h-3">
                                  {[1,2,3].map(i => (
                                    <motion.div 
                                      key={i}
                                      animate={{ height: [4, 12, 4] }}
                                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                      className="w-1 bg-white rounded-full"
                                    />
                                  ))}
                               </div>
                             ) : isCompleted ? (
                               <CheckCircle2 size={16} className="text-emerald-500" />
                             ) : (
                               <Play size={14} className="text-slate-300 group-hover:text-indigo-600" />
                             )}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {!lessons.length && (
          <div className="py-12 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
                <BookOpen size={32} />
             </div>
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chưa có bài học nào</p>
          </div>
        )}
      </div>
    </aside>
  );
}
