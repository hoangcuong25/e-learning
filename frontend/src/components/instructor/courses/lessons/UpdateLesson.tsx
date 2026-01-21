"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { updateLesson } from "@/store/lessonsSlice";

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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { lessonSchema, LessonFormData } from "@/hook/zod-schema/LessonSchema";
import { fetchCourseById } from "@/store/coursesSlice";
import RichTextEditor from "@/components/RichTextEditor";

const UpdateLesson = ({
  lesson,
  courseId,
}: {
  lesson: any;
  courseId: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue, // ✅ cần để set content khi onChange editor
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title || "",
      content: lesson.content || "",
      orderIndex: lesson.orderIndex ?? 0,
      video: undefined,
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content); // ✅ HTML từ TipTap
    formData.append("orderIndex", String(data.orderIndex ?? "0"));

    if (data.video instanceof FileList && data.video.length > 0) {
      formData.append("video", data.video[0]);
    } else if (data.video instanceof File) {
      formData.append("video", data.video);
    } else {
      formData.append("videoUrl", lesson.videoUrl || "");
    }

    try {
      await dispatch(
        updateLesson({ id: lesson.id, payload: formData })
      ).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();
      reset();
      setOpen(false);
      toast.success("Cập nhật bài học thành công!");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại.";
      toast.error(errorMessage);
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
        <Button
          variant="outline"
          className="text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white flex items-center gap-2"
        >
          <Pencil size={16} /> Sửa
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Cập nhật bài học</DialogTitle>
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
            <RichTextEditor
              value={watch("content")}
              onChange={(html: any) => setValue("content", html)}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
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
            <Label>Video (tùy chọn)</Label>
            <Input type="file" accept="video/*" {...register("video")} />
            {selectedFileName ? (
              <p className="text-sm text-gray-500 mt-1">
                Đã chọn: {selectedFileName}
              </p>
            ) : lesson.videoUrl ? (
              <p className="text-sm text-gray-500 mt-1">
                Video hiện tại:{" "}
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Xem video
                </a>
              </p>
            ) : null}
          </div>

          {/* Nút lưu */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLesson;
