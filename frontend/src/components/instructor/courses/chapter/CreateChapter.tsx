"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { fetchCourseById } from "@/store/slice/coursesSlice";
import { z } from "zod";
import { createChapter } from "@/store/slice/chapterSlice";

// Schema validation
const chapterSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  orderIndex: z.number().min(0, "Thứ tự không hợp lệ"),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

const CreateChapter = ({ courseId }: { courseId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: { title: "", description: "", orderIndex: 0 },
  });

  const onSubmit = async (data: ChapterFormData) => {
    try {
      const chapterData = { ...data };
      await dispatch(
        createChapter({ courseId, payload: chapterData })
      ).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();

      toast.success("Thêm chương mới thành công!");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error("Không thể tạo chương, vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Thêm chương
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-blue-600 font-semibold">
            Thêm chương mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Tiêu đề */}
          <div>
            <Label>Tiêu đề chương</Label>
            <Input
              placeholder="Nhập tiêu đề chương..."
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <Label>Mô tả</Label>
            <Input placeholder="Mô tả ngắn..." {...register("description")} />
          </div>

          {/* Thứ tự */}
          <div>
            <Label>Thứ tự</Label>
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

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu chương"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChapter;
