import React, { useState } from "react";
import { BookOpenCheck, MessageCircle, Star } from "lucide-react";

interface LessonContentTabsProps {
  currentLesson: any;
}

const tabClasses = {
  base: "px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200",
  active: "border-blue-600 text-blue-600",
  inactive:
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
};

const LessonContentTabs: React.FC<LessonContentTabsProps> = ({
  currentLesson,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "qna" | "review">(
    "overview"
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-6">
        <nav className="flex space-x-4">
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
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
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

        {activeTab === "qna" && (
          <div id="qna-tab">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
              <MessageCircle size={20} className="text-orange-500" />
              Hỏi đáp (Q&A)
            </div>
            <p className="text-gray-600 mb-4">
              Bạn có thắc mắc gì về bài học này không? Hãy đăng câu hỏi của bạn!
            </p>
            <div className="p-4 border rounded-lg bg-gray-50 text-gray-500">
              [Form đăng câu hỏi và danh sách các câu hỏi/trả lời sẽ được hiển
              thị ở đây]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContentTabs;
