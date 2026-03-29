"use client";

import React from "react";
import { MessageCircle, Bot, Info, Star, Sparkles, Layout } from "lucide-react";
import LessonDiscussion from "./LessonDiscussion";
import CourseRatingTab from "./CourseRatingTab";
import LessonAiChat from "./LessonAiChat";
import { motion, AnimatePresence } from "framer-motion";

interface LessonContentTabsProps {
  currentLesson: any;
  activeTab: any;
  setActiveTab: any;
  totalRating: any;
  averageRating: any;
}

const LessonContentTabs: React.FC<LessonContentTabsProps> = ({
  currentLesson,
  activeTab,
  setActiveTab,
  totalRating,
  averageRating,
}) => {
  const tabs = [
    { id: "overview", label: "Tổng quan", icon: <Info size={14} /> },
    { id: "qna", label: "Hỏi đáp", icon: <MessageCircle size={14} /> },
    { id: "review", label: "Đánh giá", icon: <Star size={14} /> },
    { id: "ai", label: "Trợ lý AI", icon: <Bot size={14} />, special: true },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="px-8 pt-8 border-b border-slate-50">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-6 py-4 rounded-t-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 overflow-hidden group ${
                activeTab === tab.id
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
                {tab.special && (
                  <Sparkles
                    size={12}
                    className="text-indigo-400 animate-pulse"
                  />
                )}
              </span>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-indigo-50 border-t-2 border-indigo-600 z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {activeTab !== tab.id && (
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-slate-100 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-8 md:p-12 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {currentLesson.title}
                    </h2>
                    {currentLesson.chapter && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <Layout size={12} className="text-indigo-600" />
                        Bài học thuộc:{" "}
                        <span className="text-slate-600">
                          {currentLesson.chapter.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Info size={14} className="text-indigo-600" />
                    Lesson Details
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  {currentLesson.content ? (
                    <div
                      className="text-slate-600 leading-relaxed text-lg tracking-tight font-medium"
                      dangerouslySetInnerHTML={{
                        __html: currentLesson.content,
                      }}
                    />
                  ) : (
                    <div className="py-12 text-center bg-slate-50/50 border border-slate-50 rounded-3xl border-dashed">
                      <p className="text-slate-400 italic">
                        Chưa có mô tả chi tiết cho bài học này.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Q&A */}
            {activeTab === "qna" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                      Hỏi & Đáp
                    </h2>
                    <p className="text-slate-400 font-medium tracking-tight">
                      Cộng đồng học tập đang thảo luận về bài học này.
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                    <MessageCircle size={24} />
                  </div>
                </div>
                <LessonDiscussion lessonId={currentLesson.id} />
              </div>
            )}

            {/* TAB ĐÁNH GIÁ (REVIEW) */}
            {activeTab === "review" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                      Phản hồi học viên
                    </h2>
                    <p className="text-slate-400 font-medium tracking-tight">
                      Review thực tế từ những học viên đã tham gia.
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Star size={24} fill="currentColor" />
                  </div>
                </div>
                <CourseRatingTab
                  totalRating={totalRating}
                  averageRating={averageRating}
                />
              </div>
            )}

            {/* TAB TRỢ LÝ AI */}
            {activeTab === "ai" && (
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 opacity-10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 mt-10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                          <Bot size={28} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter ">
                          Trợ lý AI
                        </h2>
                      </div>
                      <p className="text-indigo-200/60 font-medium max-w-md tracking-tight leading-relaxed">
                        Đặt câu hỏi bất kỳ về kiến thức trong video bài giảng.
                        Tôi sẽ giúp bạn giải đáp mọi thắc mắc.
                      </p>
                    </div>
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles
                        size={14}
                        className="text-indigo-400 animate-pulse"
                      />
                      AI Powered Core
                    </div>
                  </div>

                  <div className="relative z-10 bg-white rounded-[2rem] p-2 text-slate-900 shadow-2xl">
                    <LessonAiChat lessonId={currentLesson.id} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonContentTabs;
