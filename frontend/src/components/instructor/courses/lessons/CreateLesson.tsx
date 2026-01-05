"use client";

import { useState } from "react";
import { useForm, FieldError } from "react-hook-form"; // ✅ Import FieldError
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createLesson } from "@/store/slice/lessonsSlice";

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
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchCourseById } from "@/store/slice/coursesSlice";

import { lessonSchema, LessonFormData } from "@/hook/zod-schema/LessonSchema";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadVideo } from "@/store/api/cloudinary.api";

type ProcessState = "idle" | "uploading" | "creating_lesson";

const CreateLesson = ({
  courseId,
  chapterId,
}: {
  courseId: number;
  chapterId: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [processState, setProcessState] = useState<ProcessState>("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
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
    if (isSubmitting || processState !== "idle") return;

    let toastId: any = null;
    try {
      let videoUrl = "";

      // 1. Kiểm tra video và Upload lên Cloudinary
      if (data.video instanceof FileList && data.video.length > 0) {
        setProcessState("uploading");
        toastId = toast.loading("Đang tải lên video... (Bước 1/2)", {
          duration: Infinity,
        });

        const file = data.video[0];
        const uploaded = await uploadVideo(file);
        videoUrl = uploaded.secure_url;

        toast.dismiss(toastId);
        setProcessState("creating_lesson");
        toastId = toast.loading("Đang tạo bài học... (Bước 2/2)", {
          duration: Infinity,
        });
      } else {
        toast.error("Vui lòng chọn file video.");
        return;
      }

      // 2. Gửi payload lên NestJS
      const payload = {
        title: data.title,
        content: data.content,
        orderIndex: data.orderIndex ?? 0,
        chapterId,
        videoUrl: videoUrl,
      };

      await dispatch(createLesson(payload)).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();

      toast.dismiss(toastId);
      toast.success("Tạo bài học thành công!");

      reset();
      setOpen(false);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Tạo bài học thất bại, vui lòng thử lại.");
    } finally {
      setProcessState("idle");
    }
  };

  const selectedVideo = watch("video");
  const selectedFileName =
    selectedVideo instanceof FileList && selectedVideo.length > 0
      ? selectedVideo[0].name
      : selectedVideo instanceof File
      ? selectedVideo.name
      : "";

  // Logic hiển thị nút
  const isLoading = isSubmitting || processState !== "idle";

  const getButtonText = () => {
    switch (processState) {
      case "uploading":
        return "Đang tải lên video...";
      case "creating_lesson":
        return "Đang tạo bài học...";
      default:
        return "Lưu";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus size={18} /> Thêm bài học
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Thêm bài học mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Tiêu đề */}
          <div>
            <Label>Tiêu đề</Label>
            <Input placeholder="Nhập tiêu đề..." {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.title as FieldError).message}
              </p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div>
            <Label>Nội dung bài học</Label>
            <RichTextEditor
              value={watch("content")}
              onChange={(val) => setValue("content", val)}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.content as FieldError).message}
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
                {(errors.orderIndex as FieldError).message}
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
            {errors.video && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.video as FieldError).message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getButtonText()}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLesson;
