"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createLesson } from "@/store/lessonsSlice";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

import { lessonSchema, LessonFormData } from "@/hook/zod-schema/LessonSchema";
import { toast } from "sonner";
import { fetchCourseById } from "@/store/coursesSlice";

const CreateLesson = ({ courseId }: { courseId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      orderIndex: 0,
      video: undefined,
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("orderIndex", String(data.orderIndex ?? "0"));

      // ✅ lấy file từ FileList
      if (data.video instanceof FileList && data.video.length > 0) {
        formData.append("video", data.video[0]);
      } else if (data.video instanceof File) {
        formData.append("video", data.video);
      } else {
        toast.error("Vui lòng chọn file video.");
        return;
      }

      formData.append("courseId", String(courseId));

      await dispatch(createLesson(formData)).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap;

      reset();
      setOpen(false);

      toast.success("Tạo bài học thành công!");
    } catch (err) {
      toast.error("Tạo bài học thất bại, vui lòng thử lại.");
    }
  };

  const selectedVideo = watch("video");
  const selectedFileName =
    selectedVideo instanceof FileList && selectedVideo.length > 0
      ? selectedVideo[0].name
      : selectedVideo instanceof File
      ? selectedVideo.name
      : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus size={18} /> Thêm bài học
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm bài học mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <Label>Tiêu đề</Label>
            <Input placeholder="Nhập tiêu đề..." {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Nội dung */}
          <div>
            <Label>Nội dung</Label>
            <Textarea
              placeholder="Nhập mô tả bài học..."
              {...register("content")}
            />
          </div>

          {/* Thứ tự bài học */}
          <div>
            <Label>Thứ tự bài học</Label>
            <Input
              type="number"
              min="0"
              {...register("orderIndex", { valueAsNumber: true })}
            />
            {errors.orderIndex && (
              <p className="text-red-500 text-sm mt-1">
                {errors.orderIndex.message}
              </p>
            )}
          </div>

          {/* Upload Video */}
          <div>
            <Label>Video</Label>
            <Input type="file" accept="video/*" {...register("video")} />
            {selectedFileName && (
              <p className="text-sm text-gray-500 mt-1">
                Đã chọn: {selectedFileName}
              </p>
            )}
          </div>

          {/* Nút lưu */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLesson;
