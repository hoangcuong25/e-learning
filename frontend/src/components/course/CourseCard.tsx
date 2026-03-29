"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, Tag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Props {
  course: CourseType;
}

const CourseCard = ({ course }: Props) => {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="group bg-white rounded-[2rem] p-5 flex flex-col border border-slate-100 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.03)] hover:shadow-[0_48px_64px_-24px_rgba(79,70,229,0.12)] hover:border-indigo-100 transition-all duration-500 h-full"
    >
      {/* 🖼️ Thumbnail Section */}
      <div className="relative w-full h-48 mb-6 overflow-hidden rounded-[1.5rem] bg-slate-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-full"
        >
          <Image
            src={course.thumbnail || "/images/default-course.jpg"}
            alt={course.title}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Badge: Enrolled */}
        {course.isEnrolled && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Đã sở hữu
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
          <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <BookOpen className="text-indigo-600 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 🏷️ Info Section */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Specializations Badges */}
        {course.specializations && course.specializations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.specializations.map((sp, index) => (
              <span
                key={index}
                className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-lg uppercase tracking-wider"
              >
                {sp.specialization?.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        {course.instructor?.fullname && (
          <div className="flex items-center gap-2.5 py-1">
            {course.instructor.avatar ? (
              <div className="relative w-7 h-7 rounded-xl overflow-hidden shadow-sm border border-slate-100 shrink-0">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.fullname}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-7 h-7 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <User size={14} />
              </div>
            )}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {course.instructor.fullname}
            </span>
          </div>
        )}

        {/* Short Description */}
        <div className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">
          {course.description ? (
            <div
              className="prose prose-sm max-w-none prose-p:m-0"
              dangerouslySetInnerHTML={{
                __html:
                  course.description.length > 100
                    ? course.description.slice(0, 100) + "..."
                    : course.description,
              }}
            />
          ) : (
            "Chưa có mô tả chi tiết."
          )}
        </div>
      </div>

      {/* 💰 Footer Section */}
      <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Học phí
          </p>
          <p className="text-lg font-black text-indigo-600 tracking-tighter">
            {course.price === 0
              ? "MIỄN PHÍ"
              : new Intl.NumberFormat("vi-VN").format(course.price) + " LC"}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleViewDetail}
          className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl shadow-indigo-600/20 transition-all duration-300"
        >
          <BookOpen className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
