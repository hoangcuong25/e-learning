"use client";

import { useState } from "react";
import { BookOpen, MessageCircle, Star, Users, Settings } from "lucide-react";
import LessonTabs from "./LessonTabs";
import RatingTabs from "./RatingTabs";

interface CourseTabsProps {
  currentCourse: any;
}

const CourseTabs = ({ currentCourse }: CourseTabsProps) => {
  const [activeTab, setActiveTab] = useState("lessons");

  interface TabItem {
    id: string;
    label: string;
    icon: any;
    disabled?: boolean;
  }

  const tabs: TabItem[] = [
    { id: "lessons", label: "Cấu trúc & Bài học", icon: BookOpen },
    { id: "reviews", label: "Đánh giá & Phản hồi", icon: Star },
  ];

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-[1.5rem] w-fit border border-slate-200/50 shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-300"}`}
              />
              {tab.label}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-500 ease-in-out">
        {activeTab === "lessons" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <LessonTabs currentCourse={currentCourse} />
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <RatingTabs
              courseId={currentCourse.id}
              averageRating={currentCourse.averageRating}
              totalRating={currentCourse.totalRating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseTabs;
