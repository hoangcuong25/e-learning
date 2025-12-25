"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  course: CourseType;
}

const CourseCard = ({ course }: Props) => {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col border border-transparent hover:border-blue-400">
      {/* Ảnh khóa học */}
      <div className="relative w-full h-44 mb-4">
        <Image
          src={course.thumbnail || "/images/default-course.jpg"}
          alt={course.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Tiêu đề khóa học */}
      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-1">
        {course.title}
      </h3>

      {/* Giảng viên */}
      {course.instructor?.fullname && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <User className="w-4 h-4 mr-1 text-blue-500" />
          <span className="line-clamp-1">{course.instructor.fullname}</span>
        </div>
      )}

      {/* Mô tả ngắn */}
      <p className="text-gray-600 text-sm flex-1 leading-relaxed mb-3">
        {course.description ? (
          <div
            className="prose max-w-none text-gray-600 text-sm"
            dangerouslySetInnerHTML={{
              __html:
                course.description.length > 120
                  ? course.description.slice(0, 120) + "..."
                  : course.description,
            }}
          />
        ) : (
          "Chưa có mô tả cho khóa học này."
        )}
      </p>

      {/* Giá & Nút hành động */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-blue-600 font-bold">
          {course.price?.toLocaleString()}₫
        </p>
        <Button
          size="sm"
          onClick={handleViewDetail}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center"
        >
          <BookOpen className="w-4 h-4 mr-1" /> Xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
