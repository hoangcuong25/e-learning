"use client";

import React, { useEffect, useState } from "react";
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
import { Plus, ImageIcon, X, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  createCourse,
  fetchCoursesByInstructor,
} from "@/store/slice/coursesSlice";
import { CourseFormData, courseSchema } from "@/hook/zod-schema/CourseSchema";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchSpecializationsByInstructorId } from "@/store/slice/specializationSlice";
import RichTextEditor from "@/components/RichTextEditor";

export default function CourseCreate() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.user
  );
  const { instructorSpecializaions, loading: specializationLoading } =
    useSelector((state: RootState) => state.specialization);

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>([]);
  const [courseType, setCourseType] = useState<"FREE" | "PAID">("FREE");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: {
      type: "FREE",
    },
  });

  // 🧩 Toggle chuyên ngành
  const toggleSelect = (id: number) => {
    const updated = selectedSpecs.includes(id)
      ? selectedSpecs.filter((item) => item !== id)
      : [...selectedSpecs, id];
    setSelectedSpecs(updated);
    setValue("specializationIds", updated);
  };

  const removeSpec = (id: number) => {
    const updated = selectedSpecs.filter((item) => item !== id);
    setSelectedSpecs(updated);
    setValue("specializationIds", updated);
  };

  // 🖼️ Chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setValue("thumbnail", selectedFile);
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreview(null);
    setValue("thumbnail", undefined);
  };

  // 🚀 Submit
  const onSubmit = async (data: CourseFormData) => {
    if (!selectedSpecs.length) {
      toast.error("Vui lòng chọn ít nhất một chuyên ngành!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", courseType);
      formData.append("instructorId", user?.id.toString() ?? "");

      if (courseType === "PAID" && data.price)
        formData.append("price", data.price.toString());
      else formData.append("price", "0");

      selectedSpecs.forEach((id) =>
        formData.append("specializationIds", id.toString())
      );

      if (file) formData.append("thumbnail", file);

      await dispatch(createCourse(formData)).unwrap();
      await dispatch(fetchCoursesByInstructor()).unwrap();

      toast.success("Tạo khóa học thành công!");
      reset();
      removePreview();
      setSelectedSpecs([]);
      setCourseType("FREE");
      setOpen(false);
    } catch {
      toast.error("Không thể tạo khóa học!");
    }
  };

  if (userLoading || specializationLoading) return <LoadingScreen />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          Tạo khóa học mới
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[800px]">
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

          {/* ─── Loại khóa học (FREE / PAID) ───────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Loại khóa học
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="FREE"
                  checked={courseType === "FREE"}
                  onChange={(e) => {
                    setCourseType("FREE");
                    setValue("type", "FREE");
                    setValue("price", 0);
                  }}
                />
                <span>Miễn phí</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="PAID"
                  checked={courseType === "PAID"}
                  onChange={(e) => {
                    setCourseType("PAID");
                    setValue("type", "PAID");
                  }}
                />
                <span>Trả phí</span>
              </label>
            </div>
          </div>

          {/* ─── Giá ───────────────────────────── */}
          {courseType === "PAID" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Giá (VNĐ)
              </label>
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
          )}

          {/* ─── Chuyên ngành ───────────────────────────── */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Chuyên ngành
            </label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex justify-between items-center border rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none"
            >
              {selectedSpecs.length > 0
                ? `${selectedSpecs.length} chuyên ngành đã chọn`
                : "Chọn chuyên ngành"}
              <ChevronDown className="w-4 h-4 opacity-60" />
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg max-h-52 overflow-auto">
                {instructorSpecializaions.length === 0 ? (
                  <p className="text-sm text-gray-500 p-3 text-center">
                    Không có chuyên ngành
                  </p>
                ) : (
                  instructorSpecializaions.map((spec) => (
                    <div
                      key={spec.id}
                      onClick={() => toggleSelect(spec.id)}
                      className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <span>{spec.name}</span>
                      {selectedSpecs.includes(spec.id) && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedSpecs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSpecs.map((id) => {
                  const spec = instructorSpecializaions.find(
                    (s) => s.id === id
                  );
                  return (
                    <span
                      key={id}
                      className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {spec?.name}
                      <button
                        type="button"
                        onClick={() => removeSpec(id)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── Nội dung khóa học ───────────────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mô tả khóa học
            </label>
            <RichTextEditor
              value={watch("description") || ""}
              onChange={(val) => setValue("description", val)}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
