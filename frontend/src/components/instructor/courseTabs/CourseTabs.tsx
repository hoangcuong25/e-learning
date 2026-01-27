"use client";

import { useState } from "react";
import { BookOpen, MessageCircle, Star } from "lucide-react";
import LessonTabs from "./LessonTabs";
import RatingTabs from "./RatingTabs";
import QAndATabs from "./QAndATabs";

interface CourseTabsProps {
  currentCourse: any;
}

const CourseTabs = ({ currentCourse }: CourseTabsProps) => {
  const [activeTab, setActiveTab] = useState("lessons");

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("lessons")}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "lessons"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <BookOpen size={18} />
          Bài học
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "questions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <MessageCircle size={18} />
          Câu hỏi
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "reviews"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Star size={18} />
          Đánh giá
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "lessons" && (
          <LessonTabs currentCourse={currentCourse} />
        )}

        {activeTab === "qna" && <QAndATabs />}

        {activeTab === "reviews" && (
          <RatingTabs
            courseId={currentCourse.id}
            averageRating={currentCourse.averageRating}
            totalRating={currentCourse.totalRating}
          />
        )}
      </div>
    </div>
  );
};

export default CourseTabs;
