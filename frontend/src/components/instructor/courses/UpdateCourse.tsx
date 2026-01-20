"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, X, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { updateCourse, fetchCoursesByInstructor } from "@/store/coursesSlice";
import { CourseFormData, courseSchema } from "@/hook/zod-schema/CourseSchema";

interface UpdateCourseProps {
  course: CourseType;
}

export default function UpdateCourse({ course }: UpdateCourseProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    course.thumbnail || null
  );
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: {
      title: course.title,
      description: course.description,
      price: course.price,
    },
  });

  useEffect(() => {
    reset({
      title: course.title,
      description: course.description,
      price: course.price,
    });
  }, [course, reset]);

  // 🖼️ Preview ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setValue("thumbnail", selected);
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreview(null);
    setValue("thumbnail", undefined);
  };

  // 🚀 Submit
  const onSubmit = async (data: CourseFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      if (file) formData.append("thumbnail", file);

      await dispatch(
        updateCourse({ id: course.id, payload: formData })
      ).unwrap();
      await dispatch(fetchCoursesByInstructor()).unwrap();

      toast.success("Cập nhật khóa học thành công!");
      setOpen(false);
    } catch {
      toast.error("Không thể cập nhật khóa học!");
    }
  };

  console.log(file);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" /> Sửa
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
          encType="multipart/form-data"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên khóa học
            </label>
            <Input
              placeholder="Nhập tên khóa học"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh khóa học
            </label>
            {!preview ? (
              <label
                htmlFor="thumbnail"
                className="flex flex-col items-center justify-center border border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50"
              >
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Chọn ảnh từ thiết bị
                </span>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removePreview}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
