"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createCourse } from "@/store/coursesSlice";
import { CourseFormData, courseSchema } from "@/hook/zod-schema/CourseSchema";
import LoadingScreen from "@/components/LoadingScreen";

export default function CourseCreate() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading } = useSelector((state: RootState) => state.user);

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    mode: "onChange", // ⚡ validate realtime
  });

  // 🖼️ Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setValue("thumbnail", selectedFile); // đồng bộ với react-hook-form
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreview(null);
    setValue("thumbnail", undefined);
  };

  // 🚀 Gửi form
  const onSubmit = async (data: CourseFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      if (file) formData.append("thumbnail", file);
      if (user?.id === undefined) {
        return toast.error("Người dùng không hợp lệ");
      }
      formData.append("instructorId", user.id.toString());

      await dispatch(createCourse(formData)).unwrap();
      toast.success("Tạo khóa học thành công!");

      reset();
      removePreview();
      setOpen(false);
    } catch (error: any) {
      toast.error("Không thể tạo khóa học!");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tạo khóa học mới
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Tạo khóa học mới</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
          encType="multipart/form-data"
        >
          {/* ─── Tên khóa học ───────────────────── */}
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

          {/* ─── Mô tả ───────────────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả khóa học"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ─── Giá ───────────────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
            <Input
              type="number"
              placeholder="Nhập giá"
              {...register("price", { valueAsNumber: true })}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* ─── Ảnh khóa học ───────────────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh khóa học
            </label>

            {!preview ? (
              <label
                htmlFor="thumbnail"
                className={`flex flex-col items-center justify-center border border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 ${
                  errors.thumbnail ? "border-red-500" : ""
                }`}
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

            {errors.thumbnail && (
              <p className="text-sm text-red-500 mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          {/* ─── Footer ───────────────────────────── */}
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
