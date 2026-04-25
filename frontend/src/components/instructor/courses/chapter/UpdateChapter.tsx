"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
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
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { fetchCourseById } from "@/store/slice/course/coursesSlice";
import { z } from "zod";
import { updateChapter } from "@/store/slice/course/chapterSlice";

// Schema validation
const chapterSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  orderIndex: z.number().min(0, "Thứ tự không hợp lệ"),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

interface UpdateChapterProps {
  courseId: number;
  chapter: any;
}

const UpdateChapter = ({ courseId, chapter }: UpdateChapterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: chapter.title,
      description: chapter.description || "",
      orderIndex: chapter.orderIndex || 0,
    },
  });

  // Reset form when chapter changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        title: chapter.title,
        description: chapter.description || "",
        orderIndex: chapter.orderIndex || 0,
      });
    }
  }, [chapter, open, reset]);

  const onSubmit = async (data: ChapterFormData) => {
    try {
      await dispatch(
        updateChapter({ courseId, id: chapter.id, payload: data })
      ).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();

      toast.success("Cập nhật chương thành công!");
      setOpen(false);
    } catch (err) {
      toast.error("Không thể cập nhật chương, vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 font-bold text-xl">
            Cập nhật chương
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Tiêu đề */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Tiêu đề chương</Label>
            <Input
              placeholder="Nhập tiêu đề chương..."
              {...register("title")}
              className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Mô tả</Label>
            <Input 
              placeholder="Mô tả ngắn..." 
              {...register("description")} 
              className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Thứ tự */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Thứ tự</Label>
            <Input
              type="number"
              min="0"
              {...register("orderIndex", { valueAsNumber: true })}
              className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.orderIndex && (
              <p className="text-red-500 text-xs font-medium">
                {errors.orderIndex.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl font-bold"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
            >
              {isSubmitting ? "Đang lưu..." : "Cập nhật chương"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChapter;
