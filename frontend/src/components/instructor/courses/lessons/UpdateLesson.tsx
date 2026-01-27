"use client";

import { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { updateLesson } from "@/store/slice/lessonsSlice";

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
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { lessonSchema, LessonFormData } from "@/hook/zod-schema/LessonSchema";
import { fetchCourseById } from "@/store/slice/coursesSlice";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadVideo } from "@/store/api/cloudinary.api";

type ProcessState = "idle" | "uploading_video" | "updating_lesson";

const UpdateLesson = ({
  lesson,
  courseId,
}: {
  lesson: any;
  courseId: number;
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
      title: lesson.title || "",
      content: lesson.content || "",
      orderIndex: lesson.orderIndex ?? 0,
      video: undefined,
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    if (isSubmitting || processState !== "idle") return;

    let toastId: any = null;
    try {
      let videoUrl = lesson.videoUrl || "";
      let isNewVideo = false;

      // 1. Upload video mới lên Cloudinary nếu có file mới được chọn
      if (data.video instanceof FileList && data.video.length > 0) {
        setProcessState("uploading_video");
        isNewVideo = true;
        toastId = toast.loading("Đang tải lên video mới... (Bước 1/2)", {
          duration: Infinity,
        });

        const file = data.video[0];
        const uploaded = await uploadVideo(file);
        videoUrl = uploaded.secure_url; // Cập nhật videoUrl mới
      } else if (data.video instanceof File) {
        setProcessState("uploading_video");
        isNewVideo = true;
        toastId = toast.loading("Đang tải lên video mới... (Bước 1/2)", {
          duration: Infinity,
        });

        const uploaded = await uploadVideo(data.video);
        videoUrl = uploaded.secure_url;
      }

      // Chuyển sang bước cập nhật bài học sau khi upload (nếu có upload)
      if (isNewVideo) {
        toast.dismiss(toastId);
      }
      setProcessState("updating_lesson");
      toastId = toast.loading("Đang lưu dữ liệu bài học... (Bước 2/2)", {
        duration: Infinity,
      });

      // 2. Gửi payload lên NestJS
      const payload = {
        title: data.title,
        content: data.content,
        orderIndex: data.orderIndex ?? 0,
        videoUrl: videoUrl,
      };

      await dispatch(
        updateLesson({ id: lesson.id, payload: payload })
      ).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();

      toast.dismiss(toastId);
      toast.success("Cập nhật bài học thành công!");

      // Reset form sau khi cập nhật thành công, giữ lại các giá trị đã cập nhật
      reset({
        title: data.title,
        content: data.content,
        orderIndex: data.orderIndex,
        video: undefined,
      });
      setOpen(false);
    } catch (err: any) {
      toast.dismiss(toastId);
      const errorMessage =
        err?.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại.";
      toast.error(errorMessage);
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

  const isLoading = isSubmitting || processState !== "idle";

  const getButtonText = () => {
    switch (processState) {
      case "uploading_video":
        return "Đang tải lên video...";
      case "updating_lesson":
        return "Đang lưu dữ liệu...";
      default:
        return "Cập nhật";
    }
  };

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
                {(errors.title as FieldError).message}
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
            <Label>Video (tùy chọn)</Label>
            <Input type="file" accept="video/*" {...register("video")} />
            {selectedFileName ? (
              <p className="text-sm text-gray-500 mt-1">
                Đã chọn video mới: **{selectedFileName}** (Video cũ sẽ bị thay
                thế)
              </p>
            ) : lesson.videoUrl ? (
              <p className="text-sm text-gray-500 mt-1">
                Video hiện tại:{" "}
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                  rel="noopener noreferrer"
                >
                  Xem video
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Chưa có video.</p>
            )}
            {errors.video && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.video as FieldError).message}
              </p>
            )}
          </div>

          {/* Nút lưu */}
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

export default UpdateLesson;
