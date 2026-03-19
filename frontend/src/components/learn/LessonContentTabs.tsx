"use client";

import React from "react";
import { MessageCircle, Bot } from "lucide-react";
import LessonDiscussion from "./LessonDiscussion";
import CourseRatingTab from "./CourseRatingTab";
import LessonAiChat from "./LessonAiChat";

interface LessonContentTabsProps {
  currentLesson: any;
  activeTab: any;
  setActiveTab: any;
  totalRating: any;
  averageRating: any;
}

const tabClasses = {
  base: "px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors duration-200",
  active: "border-blue-600 text-blue-600",
  inactive:
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
};

const LessonContentTabs: React.FC<LessonContentTabsProps> = ({
  currentLesson,
  activeTab,
  setActiveTab,
  totalRating,
  averageRating,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-2 md:px-6">
        <nav className="flex space-x-2 md:space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`${tabClasses.base} ${
              activeTab === "overview" ? tabClasses.active : tabClasses.inactive
            }`}
          >
            Tổng quan
          </button>

          <button
            onClick={() => setActiveTab("qna")}
            className={`${tabClasses.base} ${
              activeTab === "qna" ? tabClasses.active : tabClasses.inactive
            }`}
          >
            Hỏi đáp
          </button>

          {/* TAB ĐÁNH GIÁ  */}
          <button
            onClick={() => setActiveTab("review")}
            className={`${tabClasses.base} ${
              activeTab === "review" ? tabClasses.active : tabClasses.inactive
            }`}
          >
            Đánh giá
          </button>

          {/* TAB TRỢ LÝ AI */}
          <button
            onClick={() => setActiveTab("ai")}
            className={`${tabClasses.base} flex items-center gap-1.5 ${
              activeTab === "ai"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300"
            }`}
          >
            <Bot size={14} />
            Trợ lý AI
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div id="overview-tab">
            {currentLesson.chapter && (
              <div className="mb-4 text-sm text-gray-500">
                <span className="font-medium text-gray-700">Thuộc chương:</span>{" "}
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
              <p className="text-gray-500">Chưa có mô tả cho bài học này.</p>
            )}
          </div>
        )}

        {/* Q&A */}
        {activeTab === "qna" && (
          <div id="qna-tab">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
              <MessageCircle size={20} className="text-orange-500" />
              Hỏi đáp (Q&A)
            </div>

            <p className="text-gray-600 mb-6">
              Bạn có thắc mắc gì về bài học này không? Hãy đăng câu hỏi của bạn!
            </p>

            <LessonDiscussion lessonId={currentLesson.id} />
          </div>
        )}

        {/* TAB ĐÁNH GIÁ (REVIEW) */}
        {activeTab === "review" && (
          <CourseRatingTab
            totalRating={totalRating}
            averageRating={averageRating}
          />
        )}

        {/* TAB TRỢ LÝ AI */}
        {activeTab === "ai" && (
          <div id="ai-tab">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
              <Bot size={20} className="text-blue-500" />
              Trợ lý AI — Hỏi về nội dung bài học
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Đặt câu hỏi về kiến thức trong video bài giảng. AI sẽ truy xuất nội dung từ bài học và giải thích cho bạn.
            </p>
            <LessonAiChat lessonId={currentLesson.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContentTabs;
